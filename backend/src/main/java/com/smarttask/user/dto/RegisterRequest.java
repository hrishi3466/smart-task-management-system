package com.smarttask.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request data used to register a new user.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    /**
     * The user's display name.
     */
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    /**
     * The user's email address.
     */
    @NotBlank
    @Email
    private String email;

    /**
     * The user's password.
     */
    @NotBlank
    @Size(min = 8, max = 100)
    private String password;
}
