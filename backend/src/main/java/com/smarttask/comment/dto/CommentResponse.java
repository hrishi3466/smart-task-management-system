package com.smarttask.comment.dto;

import java.time.LocalDateTime;
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
public class CommentResponse {

    private Long id;

    private Long taskId;

    private Long userId;

    private String userName;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}