package com.smarttask.project.dto;

import com.smarttask.project.entity.ProjectStatus;
import com.smarttask.user.dto.UserResponse;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private UserResponse owner;
    private List<ProjectMemberResponse> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
