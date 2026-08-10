package com.smarttask.project.repository;

import com.smarttask.project.entity.Project;
import com.smarttask.project.entity.ProjectMember;
import com.smarttask.project.entity.ProjectRole;
import com.smarttask.user.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    boolean existsByProjectAndUser(Project project, User user);

    boolean existsByProjectAndUserAndRole(Project project, User user, ProjectRole role);

    Optional<ProjectMember> findByProjectAndUser(Project project, User user);

    List<ProjectMember> findByProjectOrderByIdAsc(Project project);
}
