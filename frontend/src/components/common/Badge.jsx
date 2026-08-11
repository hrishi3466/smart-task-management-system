import React from 'react';

/**
 * Reusable Badge Component
 */
export const Badge = ({ children, className = '', style = {} }) => {
  return (
    <span className={`badge ${className}`} style={style}>
      {children}
    </span>
  );
};
