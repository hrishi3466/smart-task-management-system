package com.smarttask.task.dto;

import com.smarttask.task.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
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
public class ChangeTaskStatusRequest {

    @NotNull(message = "Task status is required")
    private TaskStatus status;
}
