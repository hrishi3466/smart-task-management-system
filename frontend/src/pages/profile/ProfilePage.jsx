import React, { useState, useEffect, useContext } from 'react';
import { User, RotateCw, KeyRound, Shield, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { parseApiError } from '../../api/client';
import { ProfileCard } from '../../components/profile/ProfileCard';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { AppContext } from '../../context/AppContext';

/**
 * Dedicated User Profile Page (/profile)
 */
export const ProfilePage = () => {
  const { currentUser: authUser } = useAuth();
  const { addToast } = useContext(AppContext);

  const [user, setUser] = useState(authUser);
  const [isLoading, setIsLoading] = useState(!authUser);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userApi.getCurrentUser();
      setUser(data);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, []);

  const handleRefresh = async () => {
    try {
      await fetchProfile();
      addToast('info', 'Refreshed', 'Profile details updated');
    } catch {
      addToast('danger', 'Error', 'Failed to refresh user profile');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 'var(--space-8)' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            User Profile
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 4, margin: 0 }}>
            View your authenticated account credentials and system privileges.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label="Refresh profile"
        >
          <RotateCw size={14} className={isLoading ? 'spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Main Content Body */}
      {isLoading && !user ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <LoadingSpinner text="Loading profile details..." />
        </div>
      ) : error && !user ? (
        <ErrorState
          title="Failed to load profile"
          message={error}
          onRetry={fetchProfile}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Profile Card */}
          <ProfileCard user={user || authUser} />

          {/* Session & Security Info Card */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-4)' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                  Security & Authentication
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>
                  System authentication and session status
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  Authentication Type
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  JWT Bearer Token
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                  Session Storage
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Secure LocalStorage (`smart_task_token`)
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <Info size={16} style={{ color: 'var(--color-primary)', marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Account modifications and role updates are strictly managed by system administrators through Spring Boot backend security services.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
