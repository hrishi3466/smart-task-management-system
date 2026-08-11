import React from 'react';

/**
 * Centered Loading Spinner / Container Component
 */
export const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-6)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <span className="spinner" style={{ width: 28, height: 28 }} />
      {message && <span style={{ fontSize: 14 }}>{message}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
