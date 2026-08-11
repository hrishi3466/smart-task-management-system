import React from 'react';
import { CircleDashed, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { getStatusBadgeClass, getStatusLabel } from '../../utils/statusUtils';
import { TASK_STATUS, PROJECT_STATUS } from '../../constants/appConstants';

/**
 * Task & Project Status Badge Component with Status Symbol Language
 */
export const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  const badgeClass = getStatusBadgeClass(status);
  const label = getStatusLabel(status);

  const renderStatusIcon = () => {
    switch (status) {
      case TASK_STATUS.TODO:
      case PROJECT_STATUS.PLANNED:
        return <CircleDashed size={13} strokeWidth={2.2} aria-hidden="true" />;
      case TASK_STATUS.IN_PROGRESS:
      case PROJECT_STATUS.IN_PROGRESS:
        return <Clock size={13} strokeWidth={2.2} aria-hidden="true" />;
      case TASK_STATUS.IN_REVIEW:
      case PROJECT_STATUS.ON_HOLD:
        return <Eye size={13} strokeWidth={2.2} aria-hidden="true" />;
      case TASK_STATUS.DONE:
      case PROJECT_STATUS.COMPLETED:
        return <CheckCircle2 size={13} strokeWidth={2.2} aria-hidden="true" />;
      default:
        return <CircleDashed size={13} strokeWidth={2.2} aria-hidden="true" />;
    }
  };

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {showIcon && renderStatusIcon()}
      <span>{label}</span>
    </span>
  );
};
