package com.smarttask.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enables Spring Data JPA auditing so entity timestamp fields such as createdAt
 * and updatedAt are populated automatically during persistence lifecycle events.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
