package com.smarttask.task.service;

import com.smarttask.common.exception.ForbiddenException;
import com.smarttask.common.exception.ResourceNotFoundException;
import com.smarttask.common.exception.UnauthorizedException;
import com.smarttask.project.entity.Project;
import com.smarttask.project.entity.ProjectRole;
import com.smarttask.project.repository.ProjectMemberRepository;
import com.smarttask.project.repository.ProjectRepository;
import com.smarttask.task.dto.AssignTaskRequest;
import com.smarttask.task.dto.ChangeTaskPriorityRequest;
import com.smarttask.task.dto.ChangeTaskStatusRequest;
import com.smarttask.task.dto.CreateTaskRequest;
import com.smarttask.task.dto.TaskResponse;
import com.smarttask.task.dto.UpdateTaskDueDateRequest;
import com.smarttask.task.dto.UpdateTaskRequest;
import com.smarttask.task.entity.Task;
import com.smarttask.task.entity.TaskStatus;
import com.smarttask.task.repository.TaskRepository;
import com.smarttask.user.dto.UserResponse;
import com.smarttask.user.entity.User;
import com.smarttask.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TaskResponse createTask(Long projectId, CreateTaskRequest request) {
        Project project = getProject(projectId);
        requireOwner(project);

        Task task = Task.builder()
                .project(project)
                .createdBy(getCurrentUser())
                .assignee(resolveAssignee(project, request.getAssigneeId()))
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId) {
        Task task = getTask(taskId);
        requireMembership(task.getProject());
        return toResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasksForProject(Long projectId) {
        Project project = getProject(projectId);
        requireMembership(project);
        return taskRepository.findByProjectOrderByUpdatedAtDescIdDesc(project)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        Task task = getTask(taskId);
        requireOwner(task.getProject());

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setAssignee(resolveAssignee(task.getProject(), request.getAssigneeId()));
        task.setDueDate(request.getDueDate());

        return toResponse(task);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = getTask(taskId);
        requireOwner(task.getProject());
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse assignTask(Long taskId, AssignTaskRequest request) {
        Task task = getTask(taskId);
        requireOwner(task.getProject());
        task.setAssignee(resolveRequiredAssignee(task.getProject(), request.getAssigneeId()));
        return toResponse(task);
    }

    @Transactional
    public TaskResponse changeStatus(Long taskId, ChangeTaskStatusRequest request) {
        Task task = getTask(taskId);
        requireOwner(task.getProject());
        task.setStatus(request.getStatus());
        return toResponse(task);
    }

    @Transactional
    public TaskResponse changePriority(Long taskId, ChangeTaskPriorityRequest request) {
        Task task = getTask(taskId);
        requireOwner(task.getProject());
        task.setPriority(request.getPriority());
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateDueDate(Long taskId, UpdateTaskDueDateRequest request) {
        Task task = getTask(taskId);
        requireOwner(task.getProject());
        task.setDueDate(request.getDueDate());
        return toResponse(task);
    }

    private Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private Task getTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private User resolveAssignee(Project project, Long assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        return resolveRequiredAssignee(project, assigneeId);
    }

    private User resolveRequiredAssignee(Project project, Long assigneeId) {
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        if (!projectMemberRepository.existsByProjectAndUser(project, assignee)) {
            throw new ForbiddenException("Task assignee must be a project member");
        }
        return assignee;
    }

    private void requireMembership(Project project) {
        User currentUser = getCurrentUser();
        if (!projectMemberRepository.existsByProjectAndUser(project, currentUser)) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }

    private void requireOwner(Project project) {
        User currentUser = getCurrentUser();
        if (!projectMemberRepository.existsByProjectAndUserAndRole(project, currentUser, ProjectRole.OWNER)) {
            throw new ForbiddenException("Project owner permission is required");
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .projectId(task.getProject().getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assignee(task.getAssignee() == null ? null : toUserResponse(task.getAssignee()))
                .createdBy(toUserResponse(task.getCreatedBy()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
