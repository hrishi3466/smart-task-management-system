package com.smarttask.notification.repository;

import com.smarttask.notification.entity.Notification;
import com.smarttask.user.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDescIdDesc(User user);

    long countByUserAndReadStatus(User user, boolean readStatus);
}