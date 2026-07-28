package com.smarttask.common.exception;

/**
 * Exception thrown when a request cannot be authenticated.
 *
 * <p>Use this exception for 401 Unauthorized responses, such as when
 * credentials are missing, invalid, expired, or otherwise fail authentication.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
