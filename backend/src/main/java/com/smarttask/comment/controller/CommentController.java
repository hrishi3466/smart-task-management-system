package com.smarttask.comment.controller;

import com.smarttask.comment.dto.CommentResponse;
import com.smarttask.comment.dto.CreateCommentRequest;
import com.smarttask.comment.dto.UpdateCommentRequest;
import com.smarttask.comment.service.CommentService;
import com.smarttask.common.response.ApiResponse;
import jakarta.validation.Valid;
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
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CreateCommentRequest request) {

        CommentResponse response =
                commentService.createComment(taskId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<CommentResponse>builder()
                        .success(true)
                        .message("Comment created successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable Long taskId) {

        List<CommentResponse> response =
                commentService.getComments(taskId);

        return ResponseEntity.ok(
                ApiResponse.<List<CommentResponse>>builder()
                        .success(true)
                        .message("Comments retrieved successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request) {

        CommentResponse response =
                commentService.updateComment(commentId, request);

        return ResponseEntity.ok(
                ApiResponse.<CommentResponse>builder()
                        .success(true)
                        .message("Comment updated successfully")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId) {

        commentService.deleteComment(commentId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Comment deleted successfully")
                        .data(null)
                        .build());
    }
}