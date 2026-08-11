import React from 'react';

/**
 * Metric Summary Card Component matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
/**
 * Metric Summary Card Component matching Product Design System
 */
export const StatsCard = ({ title, value, icon: Icon, color = 'var(--color-primary)', subtitle }) => {
  return (
    <div
      className="card stats-card-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-5)',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: 4,
            fontFamily: 'var(--font-display)',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            fontFamily: 'var(--font-display)',
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-primary-subtle)',
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(37, 99, 235, 0.12)',
          }}
        >
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};
