import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';

/**
 * Reusable Notification List Container
 */
export const NotificationList = ({
  notifications = [],
  isLoading = false,
  error = null,
  onMarkAsRead,
  onDelete,
  onRetry,
  compact = false,
  emptyMessage = 'You have no notifications right now.',
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <LoadingSpinner text="Loading notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <ErrorState
          title="Failed to load notifications"
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6) var(--space-4)' }}>
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={emptyMessage}
        />
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          compact={compact}
        />
      ))}
    </div>
  );
};
