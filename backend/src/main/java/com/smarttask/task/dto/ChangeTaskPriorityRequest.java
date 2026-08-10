package com.smarttask.task.dto;

import com.smarttask.task.entity.TaskPriority;
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
public class ChangeTaskPriorityRequest {

    @NotNull(message = "Task priority is required")
    private TaskPriority priority;
}
