import React, { useState } from 'react';
import { X, UserPlus, Trash2, Shield, User } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { ProjectRole } from '../../constants/appConstants';
import { parseApiError } from '../../api/client';

/**
 * Project Members Management Modal matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const ProjectMembersModal = ({
  isOpen,
  onClose,
  project,
  isOwner,
  onAddMember,
  onRemoveMember,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen || !project) return null;

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // New member additions strictly use ProjectRole.MEMBER per backend rules
      await onAddMember(email.trim(), ProjectRole.MEMBER);
      setEmail('');
      setSuccessMsg(`Added ${email} to project.`);
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (userId, memberName) => {
    if (window.confirm(`Remove ${memberName} from this project?`)) {
      setIsLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await onRemoveMember(userId);
        setSuccessMsg(`Removed ${memberName} from project.`);
      } catch (err) {
        setErrorMsg(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const members = project.members || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        padding: 'var(--space-4)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="members-modal-title"
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 520,
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-subtle)',
          }}
        >
          <h2 id="members-modal-title" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            Project Team Members
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-6)' }}>
          {errorMsg && (
            <div
              role="alert"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-danger-bg)',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                fontSize: 13,
                marginBottom: 'var(--space-4)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-success)',
                fontSize: 13,
                marginBottom: 'var(--space-4)',
              }}
            >
              {successMsg}
            </div>
          )}

          {/* OWNER Add Member Form */}
          {isOwner && (
            <form onSubmit={handleAddMemberSubmit} style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Add New Member
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user email address..."
                    required
                    disabled={isLoading}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <Button type="submit" variant="primary" loading={isLoading} size="md">
                  <UserPlus size={16} /> Add Member
                </Button>
              </div>
            </form>
          )}

          {/* Existing Members List */}
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            Team List ({members.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
            {members.map((m) => {
              const memberUser = m.user || {};
              const isMemberOwner = m.role === ProjectRole.OWNER;

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={memberUser.name} size={32} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {memberUser.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {memberUser.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: isMemberOwner ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
                        color: isMemberOwner ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {isMemberOwner ? <Shield size={12} /> : <User size={12} />}
                      {m.role}
                    </span>

                    {/* OWNER can remove non-owner members */}
                    {isOwner && !isMemberOwner && (
                      <button
                        type="button"
                        onClick={() => handleRemove(memberUser.id, memberUser.name)}
                        disabled={isLoading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-danger)',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                        title="Remove member"
                        aria-label={`Remove ${memberUser.name} from project`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
