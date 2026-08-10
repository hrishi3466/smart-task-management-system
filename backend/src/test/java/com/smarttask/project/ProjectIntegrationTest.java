package com.smarttask.project;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarttask.project.dto.AddProjectMemberRequest;
import com.smarttask.project.dto.CreateProjectRequest;
import com.smarttask.project.dto.UpdateProjectRequest;
import com.smarttask.project.entity.ProjectRole;
import com.smarttask.project.entity.ProjectStatus;
import com.smarttask.user.dto.RegisterRequest;
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
        "spring.datasource.url=jdbc:h2:mem:project-test-db;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
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
class ProjectIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createProjectCreatesOwnerMembership() throws Exception {
        AuthUser owner = register("project-owner-create@example.com");

        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createProject("Owner Project"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Owner Project"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.owner.email").value(owner.email()))
                .andExpect(jsonPath("$.data.members[0].role").value("OWNER"))
                .andExpect(jsonPath("$.data.members[0].user.email").value(owner.email()));
    }

    @Test
    void projectEndpointsRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void validationRejectsBlankProjectName() throws Exception {
        AuthUser owner = register("project-owner-validation@example.com");

        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(CreateProjectRequest.builder()
                                .name("")
                                .description("Invalid")
                                .build())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void listProjectsReturnsOnlyAccessibleProjects() throws Exception {
        AuthUser owner = register("project-owner-list@example.com");
        AuthUser member = register("project-member-list@example.com");
        AuthUser outsider = register("project-outsider-list@example.com");

        Long sharedProjectId = createProject(owner, "Shared Project");
        createProject(outsider, "Private Project");
        addMember(owner, sharedProjectId, member.email(), ProjectRole.MEMBER);

        mockMvc.perform(get("/api/projects")
                        .header("Authorization", "Bearer " + member.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].name").value("Shared Project"));
    }

    @Test
    void memberCanRetrieveProjectById() throws Exception {
        AuthUser owner = register("project-owner-get@example.com");
        AuthUser member = register("project-member-get@example.com");
        Long projectId = createProject(owner, "Readable Project");
        addMember(owner, projectId, member.email(), ProjectRole.MEMBER);

        mockMvc.perform(get("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + member.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Readable Project"))
                .andExpect(jsonPath("$.data.members.length()").value(2));
    }

    @Test
    void nonMemberCannotAccessProjectById() throws Exception {
        AuthUser owner = register("project-owner-forbidden@example.com");
        AuthUser outsider = register("project-outsider-forbidden@example.com");
        Long projectId = createProject(owner, "Restricted Project");

        mockMvc.perform(get("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + outsider.token()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("You do not have access to this project"));
    }

    @Test
    void ownerCanUpdateAddAndRemoveProjectMember() throws Exception {
        AuthUser owner = register("project-owner-members@example.com");
        AuthUser member = register("project-member-members@example.com");
        Long projectId = createProject(owner, "Team Project");

        mockMvc.perform(post("/api/projects/" + projectId + "/members")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(AddProjectMemberRequest.builder()
                                .email(member.email())
                                .role(ProjectRole.MEMBER)
                                .build())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.members.length()").value(2))
                .andExpect(jsonPath("$.data.members[1].user.email").value(member.email()));

        mockMvc.perform(put("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(UpdateProjectRequest.builder()
                                .name("Updated Team Project")
                                .description("Updated description")
                                .status(ProjectStatus.ARCHIVED)
                                .build())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Updated Team Project"))
                .andExpect(jsonPath("$.data.description").value("Updated description"))
                .andExpect(jsonPath("$.data.status").value("ARCHIVED"));

        mockMvc.perform(delete("/api/projects/" + projectId + "/members/" + member.userId())
                        .header("Authorization", "Bearer " + owner.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.members.length()").value(1));
    }

    @Test
    void memberCannotPerformOwnerOperations() throws Exception {
        AuthUser owner = register("project-owner-permissions@example.com");
        AuthUser member = register("project-member-permissions@example.com");
        Long projectId = createProject(owner, "Permission Project");
        addMember(owner, projectId, member.email(), ProjectRole.MEMBER);

        mockMvc.perform(put("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + member.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(UpdateProjectRequest.builder()
                                .name("Blocked Update")
                                .description("Blocked")
                                .status(ProjectStatus.ACTIVE)
                                .build())))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Project owner permission is required"));
    }

    @Test
    void ownerCanDeleteProject() throws Exception {
        AuthUser owner = register("project-owner-delete@example.com");
        Long projectId = createProject(owner, "Delete Project");

        mockMvc.perform(delete("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + owner.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Project deleted successfully"));

        mockMvc.perform(get("/api/projects/" + projectId)
                        .header("Authorization", "Bearer " + owner.token()))
                .andExpect(status().isNotFound());
    }

    private AuthUser register(String email) throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("Project Test User")
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
        String response = mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createProject(name))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response).path("data").path("id").asLong();
    }

    private CreateProjectRequest createProject(String name) {
        return CreateProjectRequest.builder()
                .name(name)
                .description("Project description")
                .build();
    }

    private void addMember(AuthUser owner, Long projectId, String email, ProjectRole role) throws Exception {
        AddProjectMemberRequest request = AddProjectMemberRequest.builder()
                .email(email)
                .role(role)
                .build();

        mockMvc.perform(post("/api/projects/" + projectId + "/members")
                        .header("Authorization", "Bearer " + owner.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    record AuthUser(Long userId, String email, String token) {
    }
}
