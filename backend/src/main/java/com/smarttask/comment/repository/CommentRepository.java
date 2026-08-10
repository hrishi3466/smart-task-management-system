package com.smarttask.comment.repository;

import com.smarttask.comment.entity.TaskComment;
import com.smarttask.task.entity.Task;
import com.smarttask.user.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<TaskComment, Long> {

    List<TaskComment> findByTaskOrderByCreatedAtAscIdAsc(Task task);

    boolean existsByIdAndUser(Long commentId, User user);
}