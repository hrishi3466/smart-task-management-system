package com.smarttask.user.repository;

import com.smarttask.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for performing database operations on User entities.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by email address.
     *
     * @param email user's email
     * @return optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user with the given email exists.
     *
     * @param email user's email
     * @return true if a user exists, otherwise false
     */
    boolean existsByEmail(String email);
}