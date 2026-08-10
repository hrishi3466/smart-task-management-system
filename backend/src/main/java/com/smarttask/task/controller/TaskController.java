package com.smarttask.task.controller;

import com.smarttask.common.response.ApiResponse;
import com.smarttask.task.dto.AssignTaskRequest;
import com.smarttask.task.dto.ChangeTaskPriorityRequest;
import com.smarttask.task.dto.ChangeTaskStatusRequest;
import com.smarttask.task.dto.CreateTaskRequest;
import com.smarttask.task.dto.TaskResponse;
import com.smarttask.task.dto.UpdateTaskDueDateRequest;
import com.smarttask.task.dto.UpdateTaskRequest;
import com.smarttask.task.service.TaskService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(success(
                        HttpStatus.CREATED,
                        "Task created successfully",
                        taskService.createTask(projectId, request)));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> listTasks(@PathVariable Long projectId) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Tasks retrieved successfully",
                taskService.listTasksForProject(projectId)));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Task retrieved successfully",
                taskService.getTaskById(taskId)));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Task updated successfully",
                taskService.updateTask(taskId, request)));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok(success(HttpStatus.OK, "Task deleted successfully", null));
    }

    @PatchMapping("/tasks/{taskId}/assignee")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable Long taskId,
            @Valid @RequestBody AssignTaskRequest request) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Task assigned successfully",
                taskService.assignTask(taskId, request)));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> changeStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody ChangeTaskStatusRequest request) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Task status updated successfully",
                taskService.changeStatus(taskId, request)));
    }

    @PatchMapping("/tasks/{taskId}/priority")
    public ResponseEntity<ApiResponse<TaskResponse>> changePriority(
            @PathVariable Long taskId,
            @Valid @RequestBody ChangeTaskPriorityRequest request) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Task priority updated successfully",
                taskService.changePriority(taskId, request)));
    }

    @PatchMapping("/tasks/{taskId}/due-date")
    public ResponseEntity<ApiResponse<TaskResponse>> updateDueDate(
            @PathVariable Long taskId,
            @RequestBody UpdateTaskDueDateRequest request) {
        return ResponseEntity.ok(success(
                HttpStatus.OK,
                "Task due date updated successfully",
                taskService.updateDueDate(taskId, request)));
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
