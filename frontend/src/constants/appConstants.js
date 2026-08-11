/**
 * Enums matching application domain entities
 */

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  DONE: 'DONE',
};

export const TaskStatus = TASK_STATUS;

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const TaskPriority = TASK_PRIORITY;

export const PROJECT_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  ARCHIVED: 'ARCHIVED',
};

export const ProjectStatus = PROJECT_STATUS;

export const PROJECT_ROLE = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
};

export const ProjectRole = PROJECT_ROLE;

export const GLOBAL_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export const Role = GLOBAL_ROLE;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smart_task_token',
};
