import { TASK_STATUS, TASK_PRIORITY, PROJECT_STATUS } from '../constants/appConstants';

/**
 * Status and Priority human-readable labels and badge CSS class mappings
 */

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return 'badge-status-todo';
    case TASK_STATUS.IN_PROGRESS:
    case PROJECT_STATUS.IN_PROGRESS:
      return 'badge-status-inprogress';
    case TASK_STATUS.IN_REVIEW:
      return 'badge-status-inreview';
    case TASK_STATUS.DONE:
    case PROJECT_STATUS.COMPLETED:
      return 'badge-status-done';
    case PROJECT_STATUS.PLANNED:
      return 'badge-status-todo';
    case PROJECT_STATUS.ON_HOLD:
      return 'badge-status-inreview';
    case PROJECT_STATUS.ARCHIVED:
      return 'badge-status-todo';
    default:
      return 'badge-status-todo';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return 'To Do';
    case TASK_STATUS.IN_PROGRESS:
      return 'In Progress';
    case TASK_STATUS.IN_REVIEW:
      return 'In Review';
    case TASK_STATUS.DONE:
      return 'Done';
    case PROJECT_STATUS.PLANNED:
      return 'Planned';
    case PROJECT_STATUS.ON_HOLD:
      return 'On Hold';
    case PROJECT_STATUS.COMPLETED:
      return 'Completed';
    case PROJECT_STATUS.ARCHIVED:
      return 'Archived';
    default:
      return status || 'To Do';
  }
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.LOW:
      return 'badge-priority-low';
    case TASK_PRIORITY.MEDIUM:
      return 'badge-priority-medium';
    case TASK_PRIORITY.HIGH:
      return 'badge-priority-high';
    case TASK_PRIORITY.URGENT:
      return 'badge-priority-urgent';
    default:
      return 'badge-priority-low';
  }
};

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.LOW:
      return 'Low';
    case TASK_PRIORITY.MEDIUM:
      return 'Medium';
    case TASK_PRIORITY.HIGH:
      return 'High';
    case TASK_PRIORITY.URGENT:
      return 'Urgent';
    default:
      return priority || 'Low';
  }
};

export const getProjectStatusLabel = (status) => {
  switch (status) {
    case PROJECT_STATUS.PLANNED:
      return 'Planned';
    case PROJECT_STATUS.IN_PROGRESS:
      return 'In Progress';
    case PROJECT_STATUS.COMPLETED:
      return 'Completed';
    case PROJECT_STATUS.ON_HOLD:
      return 'On Hold';
    case PROJECT_STATUS.ARCHIVED:
      return 'Archived';
    default:
      return status || 'Planned';
  }
};
