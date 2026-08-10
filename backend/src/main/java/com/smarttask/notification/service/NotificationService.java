package com.smarttask.notification.service;

import com.smarttask.notification.entity.NotificationType;
import com.smarttask.common.exception.ForbiddenException;
import com.smarttask.common.exception.ResourceNotFoundException;
import com.smarttask.common.exception.UnauthorizedException;
import com.smarttask.notification.dto.NotificationResponse;
import com.smarttask.notification.dto.UnreadNotificationCountResponse;
import com.smarttask.notification.entity.Notification;
import com.smarttask.notification.repository.NotificationRepository;
import com.smarttask.user.entity.User;
import com.smarttask.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications() {
        User currentUser = getCurrentUser();

        return notificationRepository
                .findByUserOrderByCreatedAtDescIdDesc(currentUser)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UnreadNotificationCountResponse getUnreadCount() {
        User currentUser = getCurrentUser();

        long unreadCount =
                notificationRepository.countByUserAndReadStatus(
                        currentUser,
                        false);

        return UnreadNotificationCountResponse.builder()
                .unreadCount(unreadCount)
                .build();
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User currentUser = getCurrentUser();

        Notification notification = getNotification(notificationId);

        requireOwnership(notification, currentUser);

        notification.setReadStatus(true);

        return toResponse(notification);
    }

    @Transactional
    public void markAllAsRead() {
        User currentUser = getCurrentUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDescIdDesc(currentUser);

        notifications.forEach(notification ->
                notification.setReadStatus(true));
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        User currentUser = getCurrentUser();

        Notification notification = getNotification(notificationId);

        requireOwnership(notification, currentUser);

        notificationRepository.delete(notification);
    }

    @Transactional
    public NotificationResponse createNotification(
            User user,
            NotificationType type,
            String message) {

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .readStatus(false)
                .build();

        return toResponse(notificationRepository.save(notification));
    }

    private Notification getNotification(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found"));
    }

    private void requireOwnership(
            Notification notification,
            User currentUser) {

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException(
                    "You can only modify your own notifications");
        }
    }

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException(
                    "Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Authenticated user not found"));
    }

    private NotificationResponse toResponse(
            Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .readStatus(notification.isReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}