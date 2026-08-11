import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Button } from '../common/Button';

/**
 * Individual Comment Item Component with author ownership edit/delete checks
 */
export const CommentItem = ({ comment, currentUserId, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);

  // Ownership check: only original comment author can edit or delete
  const isAuthor = comment.userId === currentUserId;

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setIsLoading(true);
    try {
      await onUpdate(comment.id, editContent.trim());
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this comment?')) {
      setIsLoading(true);
      try {
        await onDelete(comment.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Avatar name={comment.userName} size={32} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Comment Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {comment.userName}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          {/* Edit/Delete Actions (AUTHOR ONLY) */}
          {isAuthor && !isEditing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: 2,
                }}
                title="Edit comment"
                aria-label="Edit comment"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  padding: 2,
                }}
                title="Delete comment"
                aria-label="Delete comment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Comment Body */}
        {isEditing ? (
          <div style={{ marginTop: 6 }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              className="input-field"
              style={{ fontSize: 13, resize: 'vertical', marginBottom: 6 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="primary" onClick={handleSaveEdit} loading={isLoading}>
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              lineHeight: 1.4,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};
