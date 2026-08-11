import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Floating Toast Notification Container matching Global Design System
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useContext(AppContext);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380,
        width: 'calc(100% - 48px)',
      }}
    >
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isSuccess = t.type === 'success';

        return (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className="animate-fade-in-up"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isError
                ? 'var(--color-danger-bg)'
                : isSuccess
                ? 'var(--color-success-bg)'
                : 'var(--color-bg-surface)',
              color: isError
                ? 'var(--color-danger)'
                : isSuccess
                ? 'var(--color-success)'
                : 'var(--color-text-primary)',
              border: `1px solid ${
                isError
                  ? '#fca5a5'
                  : isSuccess
                  ? '#a7f3d0'
                  : 'var(--color-border)'
              }`,
              boxShadow: 'var(--shadow-lg)',
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ marginTop: 2, flexShrink: 0 }}>
              {isError ? (
                <AlertCircle size={18} />
              ) : isSuccess ? (
                <CheckCircle2 size={18} />
              ) : (
                <Info size={18} color="var(--color-primary)" />
              )}
            </div>
            <div style={{ flex: 1 }}>
              {t.title && <div style={{ fontWeight: 600, fontSize: 13 }}>{t.title}</div>}
              <div style={{ fontSize: 13, color: 'inherit' }}>{t.message}</div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(t.id);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                opacity: 0.7,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
