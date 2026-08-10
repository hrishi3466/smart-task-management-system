package com.smarttask.task;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarttask.project.dto.AddProjectMemberRequest;
import com.smarttask.project.dto.CreateProjectRequest;
import com.smarttask.project.entity.ProjectRole;
import com.smarttask.task.dto.AssignTaskRequest;
import com.smarttask.task.dto.ChangeTaskPriorityRequest;
import com.smarttask.task.dto.ChangeTaskStatusRequest;
import com.smarttask.task.dto.CreateTaskRequest;
import com.smarttask.task.dto.UpdateTaskDueDateRequest;
import com.smarttask.task.dto.UpdateTaskRequest;
import com.smarttask.task.entity.TaskPriority;
import com.smarttask.task.entity.TaskStatus;
import com.smarttask.user.dto.RegisterRequest;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:task-test-db;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=false",
        "logging.level.org.hibernate.SQL=OFF",
        "logging.level.org.hibernate.orm.jdbc.bind=OFF",
        "app.jwt.secret=test-secret-that-is-at-least-thirty-two-bytes-long",
        "app.jwt.expiration-ms=3600000",
        "app.cors.allowed-origins=http://localhost:5173"
})
class TaskIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void ownerCanCreateTaskInsideProject() throws Exception {
        AuthUser owner = register("task-owner-create@example.com");
        Long projectId = createProject(owner, "Task Project");

        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createTask("Initial Task", null))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.projectId").value(projectId))
                .andExpect(jsonPath("$.data.title").value("Initial Task"))
                .andExpect(jsonPath("$.data.status").value("TODO"))
                .andExpect(jsonPath("$.data.priority").value("HIGH"))
                .andExpect(jsonPath("$.data.createdBy.email").value(owner.email()));
    }

    @Test
    void memberCanListAndRetrieveProjectTasks() throws Exception {
        AuthUser owner = register("task-owner-read@example.com");
        AuthUser member = register("task-member-read@example.com");
        Long projectId = createProject(owner, "Readable Task Project");
        addMember(owner, projectId, member.email());
        Long taskId = createTask(owner, projectId, "Readable Task", member.userId());

        mockMvc.perform(get("/api/projects/" + projectId + "/tasks")
                        .header("Authorization", "Bearer " + member.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].assignee.email").value(member.email()));

        mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + member.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Readable Task"));
    }

    @Test
    void outsiderCannotAccessTask() throws Exception {
        AuthUser owner = register("task-owner-outsider@example.com");
        AuthUser outsider = register("task-outsider@example.com");
        Long projectId = createProject(owner, "Restricted Task Project");
        Long taskId = createTask(owner, projectId, "Restricted Task", null);

        mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + outsider.token()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("You do not have access to this project"));
    }

    @Test
    void nonOwnerCannotCreateOrUpdateTask() throws Exception {
        AuthUser owner = register("task-owner-permissions@example.com");
        AuthUser member = register("task-member-permissions@example.com");
        Long projectId = createProject(owner, "Permission Task Project");
        addMember(owner, projectId, member.email());
        Long taskId = createTask(owner, projectId, "Owner Task", null);

        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .header("Authorization", "Bearer " + member.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createTask("Blocked Task", null))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Project owner permission is required"));

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + member.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateTask("Blocked Update", null))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Project owner permission is required"));
    }

    @Test
    void ownerCanUpdateAssignChangeStatusPriorityDueDateAndDeleteTask() throws Exception {
        AuthUser owner = register("task-owner-workflow@example.com");
        AuthUser member = register("task-member-workflow@example.com");
        Long projectId = createProject(owner, "Workflow Task Project");
        addMember(owner, projectId, member.email());
        Long taskId = createTask(owner, projectId, "Workflow Task", null);
        LocalDateTime dueDate = LocalDateTime.of(2026, 9, 1, 10, 30);

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateTask("Updated Task", member.userId()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated Task"))
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.data.assignee.email").value(member.email()));

        mockMvc.perform(patch("/api/tasks/" + taskId + "/status")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ChangeTaskStatusRequest.builder()
                                .status(TaskStatus.COMPLETED)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));

        mockMvc.perform(patch("/api/tasks/" + taskId + "/priority")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ChangeTaskPriorityRequest.builder()
                                .priority(TaskPriority.URGENT)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.priority").value("URGENT"));

        mockMvc.perform(patch("/api/tasks/" + taskId + "/due-date")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(UpdateTaskDueDateRequest.builder()
                                .dueDate(dueDate)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.dueDate").value("2026-09-01T10:30:00"));

        mockMvc.perform(patch("/api/tasks/" + taskId + "/assignee")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AssignTaskRequest.builder()
                                .assigneeId(member.userId())
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.assignee.email").value(member.email()));

        mockMvc.perform(delete("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + owner.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Task deleted successfully"));

        mockMvc.perform(get("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + owner.token()))
                .andExpect(status().isNotFound());
    }

    @Test
    void taskAssigneeMustBelongToProject() throws Exception {
        AuthUser owner = register("task-owner-assignee@example.com");
        AuthUser outsider = register("task-outsider-assignee@example.com");
        Long projectId = createProject(owner, "Assignee Task Project");

        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createTask("Bad Assignee Task", outsider.userId()))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Task assignee must be a project member"));
    }

    @Test
    void validationRejectsBlankTaskTitle() throws Exception {
        AuthUser owner = register("task-owner-validation@example.com");
        Long projectId = createProject(owner, "Validation Task Project");

        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(CreateTaskRequest.builder()
                                .title("")
                                .description("Invalid")
                                .priority(TaskPriority.MEDIUM)
                                .build())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    private AuthUser register(String email) throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("Task Test User")
                .email(email)
                .password("password123")
                .build();

        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode root = objectMapper.readTree(response);
        return new AuthUser(
                root.path("data").path("user").path("id").asLong(),
                email,
                root.path("data").path("token").asText());
    }

    private Long createProject(AuthUser owner, String name) throws Exception {
        CreateProjectRequest request = CreateProjectRequest.builder()
                .name(name)
                .description("Task test project")
                .build();

        String response = mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).path("data").path("id").asLong();
    }

    private void addMember(AuthUser owner, Long projectId, String email) throws Exception {
        AddProjectMemberRequest request = AddProjectMemberRequest.builder()
                .email(email)
                .role(ProjectRole.MEMBER)
                .build();

        mockMvc.perform(post("/api/projects/" + projectId + "/members")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    private Long createTask(AuthUser owner, Long projectId, String title, Long assigneeId) throws Exception {
        String response = mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createTask(title, assigneeId))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).path("data").path("id").asLong();
    }

    private CreateTaskRequest createTask(String title, Long assigneeId) {
        return CreateTaskRequest.builder()
                .title(title)
                .description("Task description")
                .priority(TaskPriority.HIGH)
                .assigneeId(assigneeId)
                .build();
    }

    private UpdateTaskRequest updateTask(String title, Long assigneeId) {
        return UpdateTaskRequest.builder()
                .title(title)
                .description("Updated task description")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.LOW)
                .assigneeId(assigneeId)
                .dueDate(LocalDateTime.of(2026, 8, 30, 9, 0))
                .build();
    }

    record AuthUser(Long userId, String email, String token) {
    }
}
