import React from 'react';
import { CheckCircle2, Users, TrendingUp, ChevronDown, Menu, Plus } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

/**
 * Premium Split-Hero Authentication Layout matching Reference Design
 */
export const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="auth-page-container">
      {/* Ambient Liquid Backdrop Aura Blobs */}
      <div className="auth-ambient-aura" aria-hidden="true">
        <div className="auth-aura-blob auth-aura-blob-1" />
        <div className="auth-aura-blob auth-aura-blob-2" />
      </div>

      {/* Main Split / Centered Layout Wrapper */}
      <div className="auth-split-wrapper">
        {/* Left Side: Desktop Hero Showcase (Visible on >= 1024px) */}
        <div className="auth-hero-section">
          {/* Top Brand Logo */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <BrandLogo size="lg" />
          </div>

          {/* Hero Headline & Subtitle */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1 className="auth-hero-headline">
              Work smart.<br />
              <span className="auth-hero-gradient">Deliver more.</span>
            </h1>
            <p className="auth-hero-subtitle">
              Organize tasks, manage projects, and collaborate with your team — all in one place.
            </p>
          </div>

          {/* Key Feature Value Props */}
          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon-badge">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="auth-feature-title">Plan &amp; Organize</h3>
                <p className="auth-feature-desc">Break down work and stay organized effortlessly.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon-badge">
                <Users size={18} />
              </div>
              <div>
                <h3 className="auth-feature-title">Collaborate</h3>
                <p className="auth-feature-desc">Work together in real-time and get more done.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon-badge">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="auth-feature-title">Track Progress</h3>
                <p className="auth-feature-desc">Monitor progress and hit your deadlines with confidence.</p>
              </div>
            </div>
          </div>

          {/* Layered Showcase Display Composition */}
          <div className="auth-showcase-wrapper" aria-hidden="true">
            {/* Layer 1: Large Organic Blue Background Circle */}
            <div className="auth-hero-organic-circle" />

            {/* Layer 1 Accent: Decorative Grid Dots */}
            <div className="auth-hero-grid-dots">
              <span /><span /><span /><span />
              <span /><span /><span /><span />
              <span /><span /><span /><span />
            </div>

            {/* Layer 2: Main Kanban Product Dashboard UI Mockup */}
            <div className="auth-showcase-board-card">
              {/* Mini Sidebar */}
              <div className="auth-board-sidebar">
                <div className="auth-board-sidebar-logo" />
                <div className="auth-board-sidebar-icon active" />
                <div className="auth-board-sidebar-icon" />
                <div className="auth-board-sidebar-icon" />
                <div className="auth-board-sidebar-icon" />
              </div>

              {/* Board Content Area */}
              <div className="auth-board-content">
                {/* Header Bar */}
                <div className="auth-board-header">
                  <div className="auth-board-title">
                    <span>Team Project</span>
                    <ChevronDown size={14} />
                  </div>
                  <div className="auth-board-avatars">
                    <span className="auth-avatar av-1" />
                    <span className="auth-avatar av-2" />
                    <span className="auth-avatar av-3" />
                    <span className="auth-avatar-more">+3</span>
                  </div>
                </div>

                {/* Columns Container */}
                <div className="auth-board-columns">
                  {/* To Do Column */}
                  <div className="auth-board-col">
                    <div className="auth-col-header">
                      <span>To Do</span>
                      <span className="auth-col-count">12</span>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">Design landing page</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 20</span>
                      </div>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">Setup analytics</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 18</span>
                      </div>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">User research</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 16</span>
                      </div>
                    </div>
                  </div>

                  {/* In Progress Column */}
                  <div className="auth-board-col">
                    <div className="auth-col-header">
                      <span>In Progress</span>
                      <span className="auth-col-count">8</span>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">Build dashboard UI</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 21</span>
                      </div>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">API integration</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 19</span>
                      </div>
                    </div>
                    <div className="auth-add-task-btn">+ Add task</div>
                  </div>

                  {/* Review Column */}
                  <div className="auth-board-col">
                    <div className="auth-col-header">
                      <span>Review</span>
                      <span className="auth-col-count">5</span>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">QA testing</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 22</span>
                      </div>
                    </div>
                    <div className="auth-card-item">
                      <div className="auth-card-title">Bug fixes</div>
                      <div className="auth-card-meta">
                        <span className="auth-mini-avatar" />
                        <span className="auth-card-date">May 20</span>
                      </div>
                    </div>
                    <div className="auth-add-task-btn">+ Add task</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 3: Floating "My Tasks" Overlapping Foreground Panel */}
            <div className="auth-showcase-mytasks-card">
              <div className="auth-mytasks-header">
                <div className="auth-mytasks-title">
                  <span>My Tasks</span>
                  <ChevronDown size={14} />
                </div>
                <Menu size={16} style={{ color: '#94a3b8' }} />
              </div>

              {/* Group: Today */}
              <div className="auth-mytasks-group">
                <div className="auth-mytasks-group-label">Today</div>
                <div className="auth-mytasks-row">
                  <div className="auth-checkbox" />
                  <span className="auth-mytasks-name">Design system updates</span>
                  <span className="auth-mytasks-badge tag-high">High</span>
                </div>
                <div className="auth-mytasks-row">
                  <div className="auth-checkbox" />
                  <span className="auth-mytasks-name">Daily stand-up</span>
                  <span className="auth-mytasks-badge tag-medium">Medium</span>
                </div>
                <div className="auth-mytasks-row">
                  <div className="auth-checkbox" />
                  <span className="auth-mytasks-name">Project meeting</span>
                  <span className="auth-mytasks-badge tag-low">Low</span>
                </div>
              </div>

              {/* Group: Upcoming */}
              <div className="auth-mytasks-group">
                <div className="auth-mytasks-group-label">Upcoming</div>
                <div className="auth-mytasks-row">
                  <div className="auth-checkbox" />
                  <span className="auth-mytasks-name">Update documentation</span>
                  <span className="auth-mytasks-badge tag-medium">Medium</span>
                </div>
                <div className="auth-mytasks-row">
                  <div className="auth-checkbox" />
                  <span className="auth-mytasks-name">Review pull requests</span>
                  <span className="auth-mytasks-badge tag-low">Low</span>
                </div>
              </div>

              {/* Floating Action Add Button */}
              <div className="auth-mytasks-fab">
                <Plus size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Surface Form Panel */}
        <div className="auth-form-section">
          {/* Mobile Brand Logo (Visible on < 1024px) */}
          <div className="auth-mobile-logo">
            <BrandLogo size="auth" />
          </div>

          {/* Form Card Surface Container */}
          <div className="auth-form-card animate-fade-in-up">
            {title && (
              <h2 className="auth-form-heading">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="auth-form-subheading">
                {subtitle}
              </p>
            )}

            {/* Auth Form Children */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};


