package com.smarttask.common.exception;

/**
 * Exception thrown when a request cannot be processed because the provided
 * input is invalid or violates application rules.
 */
public class BadRequestException extends RuntimeException {

    /**
     * Creates a new bad request exception with the provided message.
     *
     * @param message detail message describing why the request is invalid
     */
    public BadRequestException(String message) {
        super(message);
    }
}
