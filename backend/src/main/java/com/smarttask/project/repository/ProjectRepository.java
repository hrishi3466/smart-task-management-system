package com.smarttask.project.repository;

import com.smarttask.project.entity.Project;
import com.smarttask.user.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("""
            select distinct p
            from Project p
            join ProjectMember pm on pm.project = p
            where pm.user = :user
            order by p.updatedAt desc, p.id desc
            """)
    List<Project> findAccessibleProjects(@Param("user") User user);
}
