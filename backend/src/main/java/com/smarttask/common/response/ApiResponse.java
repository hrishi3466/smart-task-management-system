package com.smarttask.common.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Standard response wrapper used by API endpoints to return consistent results,
 * including the operation result, HTTP status code, message, payload, and timestamp.
 *
 * @param <T> type of payload returned in the response
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    /**
     * Indicates whether the API request completed successfully.
     */
    private boolean success;

    /**
     * HTTP status code associated with the API response.
     */
    private int status;

    /**
     * Human-readable message describing the API result.
     */
    private String message;

    /**
     * Payload returned by the API endpoint.
     */
    private T data;

    /**
     * Time at which the response object was created.
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
