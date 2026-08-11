import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationList } from './NotificationList';
import { AppContext } from '../../context/AppContext';

/**
 * Top Bar Notification Dropdown Popover matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const NotificationPopover = ({ isOpen, onClose }) => {
  const { fetchUnreadCount: refreshGlobalUnreadCount, addToast } = useContext(AppContext);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(0);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      refreshGlobalUnreadCount();
    } catch {
      addToast('danger', 'Error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refreshGlobalUnreadCount();
      addToast('success', 'Success', 'All notifications marked as read');
    } catch {
      addToast('danger', 'Error', 'Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      refreshGlobalUnreadCount();
      addToast('info', 'Deleted', 'Notification removed');
    } catch {
      addToast('danger', 'Error', 'Failed to delete notification');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: 360,
        maxWidth: 'calc(100vw - 32px)',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 1100,
        overflow: 'hidden',
      }}
    >
      {/* Popover Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Notifications</h3>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--color-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Notification List Body */}
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        <NotificationList
          notifications={notifications.slice(0, 5)}
          isLoading={isLoading}
          error={error}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onRetry={fetchNotifications}
          compact
        />
      </div>

      {/* Popover Footer Link */}
      <div
        style={{
          padding: 'var(--space-2) var(--space-4)',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-subtle)',
          textAlign: 'center',
        }}
      >
        <Link
          to="/notifications"
          onClick={onClose}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            textDecoration: 'none',
          }}
        >
          View all notifications <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
};
