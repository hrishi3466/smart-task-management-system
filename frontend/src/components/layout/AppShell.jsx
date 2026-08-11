import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

/**
 * AppShell Layout Component for Protected Routes
 * Handles desktop 240px persistent sidebar and responsive tablet/mobile viewports
 */
export const AppShell = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-app)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: 240, // Offsets desktop persistent sidebar width
        }}
        className="app-main-content"
      >
        <TopHeader onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <main style={{ flex: 1, padding: 'var(--space-6)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
