import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  User,
  X,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

/**
 * Sidebar Navigation Component matching Global Design System
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 1150,
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: 240,
          backgroundColor: 'var(--color-bg-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1200,
          transition: 'transform var(--transition-normal)',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
        className={`sidebar-container ${isOpen ? 'is-open' : ''}`}
      >
        {/* Brand Area */}
        <div
          style={{
            minHeight: 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px var(--space-5)',
            borderBottom: '1px solid var(--color-border)',
          }}
          className="sidebar-brand-header"
        >
          <BrandLogo size="md" className="sidebar-logo" />

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'none',
              padding: 4,
              borderRadius: 'var(--radius-md)',
            }}
            className="mobile-close-btn"
            aria-label="Close sidebar navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav style={{ padding: 'var(--space-4) var(--space-2)', flex: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} style={{ marginBottom: 4 }}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '9px 14px',
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    })}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
