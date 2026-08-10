package com.smarttask.project.dto;

import com.smarttask.project.entity.ProjectRole;
import com.smarttask.user.dto.UserResponse;
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
public class ProjectMemberResponse {

    private Long id;
    private UserResponse user;
    private ProjectRole role;
}
