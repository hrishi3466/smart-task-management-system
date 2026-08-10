package com.smarttask.comment.service;

import com.smarttask.comment.dto.CommentResponse;
import com.smarttask.comment.dto.CreateCommentRequest;
import com.smarttask.comment.dto.UpdateCommentRequest;
import com.smarttask.comment.entity.TaskComment;
import com.smarttask.comment.repository.CommentRepository;
import com.smarttask.common.exception.ForbiddenException;
import com.smarttask.common.exception.ResourceNotFoundException;
import com.smarttask.common.exception.UnauthorizedException;
import com.smarttask.project.repository.ProjectMemberRepository;
import com.smarttask.task.entity.Task;
import com.smarttask.task.repository.TaskRepository;
import com.smarttask.user.entity.User;
import com.smarttask.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            TaskRepository taskRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CommentResponse createComment(Long taskId, CreateCommentRequest request) {
        Task task = getTask(taskId);
        User currentUser = getCurrentUser();

        requireMembership(task, currentUser);

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(currentUser)
                .content(request.getContent())
                .build();

        return toResponse(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long taskId) {
        Task task = getTask(taskId);
        User currentUser = getCurrentUser();

        requireMembership(task, currentUser);

        return commentRepository.findByTaskOrderByCreatedAtAscIdAsc(task)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CommentResponse updateComment(
            Long commentId,
            UpdateCommentRequest request) {

        TaskComment comment = getComment(commentId);
        User currentUser = getCurrentUser();

        requireCommentOwner(comment, currentUser);

        comment.setContent(request.getContent());

        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        TaskComment comment = getComment(commentId);
        User currentUser = getCurrentUser();

        requireCommentOwner(comment, currentUser);

        commentRepository.delete(comment);
    }

    private Task getTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found"));
    }

    private TaskComment getComment(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Comment not found"));
    }

    private void requireMembership(Task task, User user) {
        if (!projectMemberRepository.existsByProjectAndUser(
                task.getProject(), user)) {

            throw new ForbiddenException(
                    "You do not have access to this project");
        }
    }

    private void requireCommentOwner(
            TaskComment comment,
            User user) {

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException(
                    "You can only modify your own comments");
        }
    }

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException(
                    "Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Authenticated user not found"));
    }

    private CommentResponse toResponse(TaskComment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .taskId(comment.getTask().getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}