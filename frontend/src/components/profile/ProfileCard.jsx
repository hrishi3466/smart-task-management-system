import React from 'react';
import { User, Mail, ShieldCheck, Hash, Key, CheckCircle } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

/**
 * Profile Card component displaying user details matching design system tokens
 */
export const ProfileCard = ({ user }) => {
  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Header Banner Accent */}
      <div
        style={{
          height: 100,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #3b82f6 100%)',
          position: 'relative',
        }}
      />

      {/* Avatar & Main Info Header */}
      <div style={{ padding: '0 var(--space-6) var(--space-6)', marginTop: -40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div
            style={{
              padding: 4,
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: '50%',
              display: 'inline-block',
            }}
          >
            <Avatar name={user.name || 'User'} size={72} />
          </div>

          {/* Role Badge */}
          <Badge variant={isAdmin ? 'purple' : 'primary'}>
            <ShieldCheck size={14} style={{ marginRight: 4 }} />
            {user.role || 'USER'}
          </Badge>
        </div>

        {/* User Identity Info */}
        <div style={{ marginTop: 'var(--space-3)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
            {user.name}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
            {user.email}
          </p>
        </div>

        {/* Info Grid Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {/* User ID Item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Hash size={18} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                User ID
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                #{user.id}
              </div>
            </div>
          </div>

          {/* Email Item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Mail size={18} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Email Address
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', wordBreak: 'break-all' }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* System Role Item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Application Role
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {user.role}
              </div>
            </div>
          </div>

          {/* Account Status Item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-success)',
              }}
            >
              <CheckCircle size={18} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Account Status
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-success)' }}>
                Active Session
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
