import React, { useState, useEffect, useContext } from 'react';
import { Bell, CheckCheck, RotateCw, Filter } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationList } from '../../components/notifications/NotificationList';
import { Button } from '../../components/common/Button';
import { AppContext } from '../../context/AppContext';

/**
 * Dedicated Notifications Management Page (/notifications)
 */
export const NotificationsPage = () => {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
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
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    try {
      await fetchNotifications();
      refreshGlobalUnreadCount();
      addToast('info', 'Refreshed', 'Notification list updated');
    } catch {
      addToast('danger', 'Error', 'Failed to refresh notifications');
    }
  };

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

  const filteredNotifications =
    filter === 'UNREAD'
      ? notifications.filter((n) => !n.readStatus)
      : notifications;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 'var(--space-8)' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                }}
              >
                {unreadCount} unread
              </span>
            )}
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 4, margin: 0 }}>
            Stay updated with task assignments, status changes, comments, and project updates.
          </p>
        </div>

        {/* Top Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Refresh notifications"
          >
            <RotateCw size={14} className={isLoading ? 'spin' : ''} />
            <span>Refresh</span>
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Filter Bar */}
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
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor:
                  filter === 'ALL' ? 'var(--color-bg-surface)' : 'transparent',
                color:
                  filter === 'ALL'
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)',
                boxShadow: filter === 'ALL' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
              }}
            >
              All ({notifications.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('UNREAD')}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor:
                  filter === 'UNREAD' ? 'var(--color-bg-surface)' : 'transparent',
                color:
                  filter === 'UNREAD'
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)',
                boxShadow: filter === 'UNREAD' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Showing {filteredNotifications.length} notification{filteredNotifications.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* List Content */}
        <NotificationList
          notifications={filteredNotifications}
          isLoading={isLoading}
          error={error}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onRetry={fetchNotifications}
          emptyMessage={
            filter === 'UNREAD'
              ? 'No unread notifications'
              : 'You have no notifications right now.'
          }
        />
      </div>
    </div>
  );
};
