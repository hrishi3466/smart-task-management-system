import React from 'react';
import { ChevronsUp, ChevronUp, Equal, ChevronDown, ChevronsDown } from 'lucide-react';
import { getPriorityBadgeClass, getPriorityLabel } from '../../utils/statusUtils';
import { TASK_PRIORITY } from '../../constants/appConstants';

/**
 * Task Priority Badge Component with Directional Chevron & Bar Symbols
 */
export const PriorityBadge = ({ priority, showIcon = true, className = '' }) => {
  const badgeClass = getPriorityBadgeClass(priority);
  const label = getPriorityLabel(priority);

  const renderPriorityIcon = () => {
    switch (priority) {
      case TASK_PRIORITY.URGENT:
        return <ChevronsUp size={14} strokeWidth={2.5} aria-hidden="true" />;
      case TASK_PRIORITY.HIGH:
        return <ChevronUp size={14} strokeWidth={2.5} aria-hidden="true" />;
      case TASK_PRIORITY.MEDIUM:
        return <Equal size={14} strokeWidth={2.5} aria-hidden="true" />;
      case TASK_PRIORITY.LOW:
        return <ChevronDown size={14} strokeWidth={2.5} aria-hidden="true" />;
      default:
        return <ChevronsDown size={14} strokeWidth={2.5} aria-hidden="true" />;
    }
  };

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {showIcon && renderPriorityIcon()}
      <span>{label}</span>
    </span>
  );
};
