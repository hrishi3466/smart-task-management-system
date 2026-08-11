import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, Menu, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AppContext } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { NotificationPopover } from '../notifications/NotificationPopover';

/**
 * Top Application Header Component matching Global Design System
 */
export const TopHeader = ({ onToggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { unreadCount, fetchUnreadCount } = useContext(AppContext);
  const location = useLocation();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Poll for unread count periodically (30s)
  useEffect(() => {
    fetchUnreadCount();
    const timer = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchUnreadCount]);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive current page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/my-tasks')) return 'My Tasks';
    if (path.startsWith('/notifications')) return 'Notifications';
    if (path.startsWith('/profile')) return 'User Profile';
    return 'Workspace';
  };

  return (
    <header
      style={{
        height: 64,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="mobile-menu-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: 4,
            display: 'none',
          }}
          aria-label="Open mobile menu"
        >
          <Menu size={22} />
        </button>

        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
          {getPageTitle()}
        </h1>
      </div>

      {/* Center: Global Search Input Shell */}
      <div
        style={{
          position: 'relative',
          maxWidth: 320,
          width: '100%',
          display: 'none',
        }}
        className="header-search-container"
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 10,
            top: 9,
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="search"
          placeholder="Search projects, tasks..."
          className="input-field"
          style={{
            paddingLeft: 34,
            fontSize: 13,
            backgroundColor: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-pill)',
          }}
        />
      </div>

      {/* Right: Notifications & User Avatar Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Notification Bell Button */}
        <div ref={notificationRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-danger)',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  border: '2px solid var(--color-bg-surface)',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPopover
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* User Profile Dropdown Trigger */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
            }}
            aria-label="User profile menu"
          >
            <Avatar name={currentUser?.name || 'User'} size={32} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                lineHeight: 1.2,
              }}
              className="user-menu-label"
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
                {currentUser?.name || 'User'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {currentUser?.role || 'USER'}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: 200,
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '4px 0',
                zIndex: 1100,
                backdropFilter: 'blur(8px)',
                animation: 'fadeInUp var(--transition-fast) forwards',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{currentUser?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{currentUser?.email}</div>
              </div>

              <Link
                to="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <User size={16} /> My Profile
              </Link>

              <button
                type="button"
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  fontSize: 13,
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
