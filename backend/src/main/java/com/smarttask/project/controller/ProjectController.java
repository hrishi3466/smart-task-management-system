package com.smarttask.project.controller;

import com.smarttask.common.response.ApiResponse;
import com.smarttask.project.dto.AddProjectMemberRequest;
import com.smarttask.project.dto.CreateProjectRequest;
import com.smarttask.project.dto.ProjectResponse;
import com.smarttask.project.dto.UpdateProjectRequest;
import com.smarttask.project.service.ProjectService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse project = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(success(HttpStatus.CREATED, "Project created successfully", project));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> listProjects() {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Projects retrieved successfully",
                projectService.listAccessibleProjects()));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Project retrieved successfully",
                projectService.getProjectById(projectId)));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Project updated successfully",
                projectService.updateProject(projectId, request)));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok(success(HttpStatus.OK, "Project deleted successfully", null));
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<ProjectResponse>> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(success(
                        HttpStatus.CREATED,
                        "Project member added successfully",
                        projectService.addProjectMember(projectId, request)));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Project member removed successfully",
                projectService.removeProjectMember(projectId, userId)));
    }

    private <T> ApiResponse<T> success(HttpStatus status, String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(status.value())
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
