package com.smarttask.user.dto;

import com.smarttask.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response returned after user-related operations.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    /**
     * User identifier.
     */
    private Long id;

    /**
     * User's full name.
     */
    private String name;

    /**
     * User's email address.
     */
    private String email;

    /**
     * Assigned application role.
     */
    private Role role;
}