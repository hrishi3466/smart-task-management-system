import React from 'react';
import { Button } from './Button';

/**
 * Reusable Error State Container with retry action
 */
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading data.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6) var(--space-4)',
        backgroundColor: 'var(--color-danger-bg)',
        border: '1px solid #fecaca',
        borderRadius: 'var(--radius-lg)',
        margin: 'var(--space-4) 0',
      }}
    >
      <h3 style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-1)' }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: onRetry ? 'var(--space-4)' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
