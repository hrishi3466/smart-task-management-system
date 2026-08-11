import React from 'react';

/**
 * Reusable User Avatar Component displaying initials matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const Avatar = ({ name = 'User', size = 32, className = '', style = {} }) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-primary-subtle)',
        color: 'var(--color-primary)',
        fontWeight: 600,
        fontSize: size <= 32 ? 12 : 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        flexShrink: 0,
        border: '1px solid #bfdbfe',
        ...style,
      }}
      title={name}
    >
      {initials}
    </div>
  );
};
