package com.smarttask.common.exception;

/**
 * Exception thrown when attempting to create a resource that already exists.
 *
 * <p>Use this exception for duplicate resource conflicts, such as when a user
 * attempts to register with an email address or username that is already in use.</p>
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * Creates a new duplicate resource exception with the provided message.
     *
     * @param message detail message describing the duplicate resource conflict
     */
    public DuplicateResourceException(String message) {
        super(message);
    }
}
