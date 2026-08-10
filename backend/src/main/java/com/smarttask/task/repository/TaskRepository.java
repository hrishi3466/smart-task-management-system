package com.smarttask.task.repository;

import com.smarttask.project.entity.Project;
import com.smarttask.task.entity.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectOrderByUpdatedAtDescIdDesc(Project project);
}
