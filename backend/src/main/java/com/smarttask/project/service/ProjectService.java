package com.smarttask.project.service;

import com.smarttask.common.exception.BadRequestException;
import com.smarttask.common.exception.DuplicateResourceException;
import com.smarttask.common.exception.ForbiddenException;
import com.smarttask.common.exception.ResourceNotFoundException;
import com.smarttask.common.exception.UnauthorizedException;
import com.smarttask.project.dto.AddProjectMemberRequest;
import com.smarttask.project.dto.CreateProjectRequest;
import com.smarttask.project.dto.ProjectMemberResponse;
import com.smarttask.project.dto.ProjectResponse;
import com.smarttask.project.dto.UpdateProjectRequest;
import com.smarttask.project.entity.Project;
import com.smarttask.project.entity.ProjectMember;
import com.smarttask.project.entity.ProjectRole;
import com.smarttask.project.entity.ProjectStatus;
import com.smarttask.project.repository.ProjectMemberRepository;
import com.smarttask.project.repository.ProjectRepository;
import com.smarttask.user.dto.UserResponse;
import com.smarttask.user.entity.User;
import com.smarttask.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User currentUser = getCurrentUser();
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(ProjectStatus.ACTIVE)
                .owner(currentUser)
                .build();

        Project savedProject = projectRepository.save(project);
        ProjectMember ownerMember = ProjectMember.builder()
                .project(savedProject)
                .user(currentUser)
                .role(ProjectRole.OWNER)
                .build();
        projectMemberRepository.save(ownerMember);

        return toResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId) {
        Project project = getProject(projectId);
        requireMembership(project);
        return toResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listAccessibleProjects() {
        User currentUser = getCurrentUser();
        return projectRepository.findAccessibleProjects(currentUser)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProjectResponse updateProject(Long projectId, UpdateProjectRequest request) {
        Project project = getProject(projectId);
        requireOwner(project);

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());

        return toResponse(project);
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = getProject(projectId);
        requireOwner(project);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectResponse addProjectMember(Long projectId, AddProjectMemberRequest request) {
        Project project = getProject(projectId);
        requireOwner(project);

        if (request.getRole() == ProjectRole.OWNER) {
            throw new BadRequestException("A project can only have one owner");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (projectMemberRepository.existsByProjectAndUser(project, user)) {
            throw new DuplicateResourceException("User is already a project member");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(request.getRole())
                .build();
        projectMemberRepository.save(member);

        return toResponse(project);
    }

    @Transactional
    public ProjectResponse removeProjectMember(Long projectId, Long userId) {
        Project project = getProject(projectId);
        requireOwner(project);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ProjectMember member = projectMemberRepository.findByProjectAndUser(project, user)
                .orElseThrow(() -> new ResourceNotFoundException("Project member not found"));

        if (member.getRole() == ProjectRole.OWNER) {
            throw new BadRequestException("Project owner cannot be removed");
        }

        projectMemberRepository.delete(member);
        return toResponse(project);
    }

    private Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
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

    private ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .owner(toUserResponse(project.getOwner()))
                .members(projectMemberRepository.findByProjectOrderByIdAsc(project)
                        .stream()
                        .map(this::toMemberResponse)
                        .toList())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private ProjectMemberResponse toMemberResponse(ProjectMember member) {
        return ProjectMemberResponse.builder()
                .id(member.getId())
                .user(toUserResponse(member.getUser()))
                .role(member.getRole())
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
