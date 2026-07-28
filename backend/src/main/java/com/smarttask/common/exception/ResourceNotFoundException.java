package com.smarttask.common.exception;

/**
 * Exception thrown when a requested resource cannot be found.
 *
 * <p>Use this exception when application code expects a resource such as an
 * entity, task, or user to exist, but no matching record is available.</p>
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Creates a new resource not found exception with the provided message.
     *
     * @param message detail message describing the missing resource
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
