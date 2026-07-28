package com.smarttask.user.entity;

import com.smarttask.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a user of the Smart Task Management System.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    /**
     * Full name of the user.
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Unique email address used for authentication.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * BCrypt hashed password.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Role assigned to the user.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}

