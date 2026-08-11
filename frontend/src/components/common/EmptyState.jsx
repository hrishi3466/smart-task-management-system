import React from 'react';
import { Button } from './Button';

/**
 * Reusable Empty State Container
 */
export const EmptyState = ({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  icon: Icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-4)',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border)',
        margin: 'var(--space-4) 0',
      }}
    >
      {Icon && (
        <div
          style={{
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-bg-subtle)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <Icon size={32} />
        </div>
      )}
      <h3 style={{ marginBottom: 'var(--space-1)', color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-text-secondary)',
          maxWidth: 400,
          marginBottom: actionLabel ? 'var(--space-4)' : 0,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
