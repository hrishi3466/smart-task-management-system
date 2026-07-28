package com.smarttask.common.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Standard error response wrapper used by API endpoints to return consistent
 * error details, including validation error messages when applicable.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * Indicates whether the API request completed successfully.
     */
    private boolean success;

    /**
     * HTTP status code associated with the error response.
     */
    private int status;

    /**
     * Human-readable message describing the error.
     */
    private String message;

    /**
     * Time at which the error response object was created.
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Detailed validation or processing errors related to the request.
     */
    private List<String> errors;
}
