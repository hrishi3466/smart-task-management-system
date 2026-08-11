import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import { CommentItem } from './CommentItem';
import { Button } from '../common/Button';
import { parseApiError } from '../../api/client';

/**
 * Task Comments Section Component matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const CommentSection = ({ taskId }) => {
  const { currentUser } = useAuth();
  const { comments, isLoading, error, createComment, updateComment, deleteComment } =
    useComments(taskId);

  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsPosting(true);
    setErrorMsg(null);
    try {
      await createComment(newComment.trim());
      setNewComment('');
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      style={{
        marginTop: 'var(--space-6)',
        paddingTop: 'var(--space-6)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 'var(--space-4)',
        }}
      >
        <MessageSquare size={16} style={{ color: 'var(--color-primary)' }} />
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
          Comments ({comments ? comments.length : 0})
        </h3>
      </div>

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

      {/* Post Comment Input Box */}
      <form onSubmit={handlePostComment} style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={2000}
            disabled={isPosting}
            className="input-field"
            style={{ resize: 'vertical', paddingBottom: 40 }}
          />
          <div
            style={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {newComment.length}/2000
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isPosting}
              disabled={!newComment.trim() || isPosting}
            >
              <Send size={12} /> Post
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {isLoading && (!comments || comments.length === 0) ? (
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
          Loading comments...
        </div>
      ) : !comments || comments.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
          No comments on this task yet. Be the first to comment!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser?.id}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
