import React from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  UserPlus,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  FolderPlus,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';

/**
 * Returns an icon and background color token based on notification type
 */
const getNotificationTypeMeta = (type) => {
  switch (type) {
    case 'TASK_ASSIGNED':
      return {
        icon: <CheckSquare size={16} style={{ color: 'var(--color-primary)' }} />,
        bg: 'var(--color-primary-subtle)',
      };
    case 'TASK_STATUS_UPDATED':
      return {
        icon: <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />,
        bg: 'var(--color-success-subtle, rgba(34, 197, 94, 0.1))',
      };
    case 'TASK_COMMENT_ADDED':
      return {
        icon: <MessageSquare size={16} style={{ color: 'var(--color-info, #3b82f6)' }} />,
        bg: 'rgba(59, 130, 246, 0.1)',
      };
    case 'PROJECT_MEMBER_ADDED':
    case 'PROJECT_ROLE_UPDATED':
      return {
        icon: <UserPlus size={16} style={{ color: 'var(--color-purple, #8b5cf6)' }} />,
        bg: 'rgba(139, 92, 246, 0.1)',
      };
    default:
      return {
        icon: <Bell size={16} style={{ color: 'var(--color-text-secondary)' }} />,
        bg: 'var(--color-bg-subtle)',
      };
  }
};

/**
 * Individual Notification Item Component
 */
export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false,
}) => {
  const { icon, bg } = getNotificationTypeMeta(notification.type);
  const isUnread = !notification.readStatus;

  return (
    <div
      className="notification-item"
      style={{
        padding: compact ? 'var(--space-3) var(--space-4)' : 'var(--space-4)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: isUnread ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        position: 'relative',
        transition: 'background-color 0.15s ease',
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {icon}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <p
            style={{
              margin: 0,
              fontSize: compact ? 13 : 14,
              fontWeight: isUnread ? 600 : 400,
              color: 'var(--color-text-primary)',
              lineHeight: 1.4,
              wordBreak: 'break-word',
            }}
          >
            {notification.message}
          </p>

          {/* Unread Badge Indicator */}
          {isUnread && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: 4,
              }}
              title="Unread"
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            {formatRelativeTime(notification.createdAt)}
          </span>

          {/* Item Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isUnread && onMarkAsRead && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                }}
                title="Mark as read"
                aria-label="Mark notification as read"
              >
                <CheckCircle2 size={13} />
                {!compact && <span>Mark read</span>}
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 4px',
                  borderRadius: 'var(--radius-sm)',
                }}
                title="Delete notification"
                aria-label="Delete notification"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
