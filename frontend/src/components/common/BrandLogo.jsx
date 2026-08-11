import React from 'react';

/**
 * Official Smart Task Flow Brand Logo Component using Canonical PNG Asset.
 * Sized responsively to preserve natural aspect ratio without distortion.
 */
export const BrandLogo = ({ size = 'md', width, height, className = '', style = {} }) => {
  const logoWidths = {
    sm: 145,       // Small inline / secondary badge
    mobile: 155,   // Mobile Header / Mobile Sidebar (145–175px)
    md: 180,       // Desktop Sidebar (170–200px)
    lg: 210,       // Standard Large Brand
    auth: 215,     // Login / Auth Page Hero (190–230px)
  };

  const targetWidth = width || logoWidths[size] || logoWidths.md;

  return (
    <div
      className={`brand-logo-container brand-logo-${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        userSelect: 'none',
        lineHeight: 0,
        ...style,
      }}
    >
      <img
        src="/branding/smart-task-flow-logo.png"
        alt="Smart Task Flow"
        style={{
          width: typeof targetWidth === 'number' ? `${targetWidth}px` : targetWidth,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

