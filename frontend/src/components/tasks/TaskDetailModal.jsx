import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { CommentSection } from '../comments/CommentSection';
import { TaskStatus, TaskPriority } from '../../constants/appConstants';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { parseApiError } from '../../api/client';

/**
 * Task Detail Modal Container Component
 */
export const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  isOwner,
  projectMembers = [],
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(TaskStatus.TODO);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || TaskStatus.TODO);
      setPriority(task.priority || TaskPriority.MEDIUM);
      setAssigneeId(task.assignee ? task.assignee.id.toString() : '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
      setIsEditing(false);
      setErrorMsg(null);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await onUpdateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        await onDeleteTask(task.id);
        onClose();
      } catch (err) {
        setErrorMsg(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.COMPLETED, label: 'Completed' },
    { value: TaskStatus.CANCELLED, label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' },
    { value: TaskPriority.URGENT, label: 'Urgent' },
  ];

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...projectMembers.map((m) => ({
      value: m.user ? m.user.id.toString() : '',
      label: m.user ? m.user.name : 'Unknown User',
    })),
  ];

  const overdue = isOverdue(task.dueDate, task.status);

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
      aria-labelledby="task-detail-title"
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isOwner && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  title="Edit Task"
                  aria-label="Edit task"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  title="Delete Task"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}

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
        </div>

        {/* Scrollable Content Body */}
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>
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

          {isEditing && isOwner ? (
            /* OWNER Edit Form */
            <form onSubmit={handleSaveEdit}>
              <Input
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />

              <div className="input-group">
                <label className="input-label" htmlFor="edit-task-desc">
                  Description
                </label>
                <textarea
                  id="edit-task-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  disabled={isLoading}
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={statusOptions}
                  disabled={isLoading}
                />
                <Select
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={priorityOptions}
                  disabled={isLoading}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Select
                  label="Assignee"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  options={assigneeOptions}
                  disabled={isLoading}
                />
                <div className="input-group">
                  <label className="input-label" htmlFor="edit-due-date">
                    Due Date
                  </label>
                  <input
                    id="edit-due-date"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={isLoading}>
                  Save Task
                </Button>
              </div>
            </form>
          ) : (
            /* Read-only / Overview Display */
            <div>
              <h2 id="task-detail-title" style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>
                {task.title}
              </h2>

              <p
                style={{
                  fontSize: 14,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  margin: '0 0 var(--space-6) 0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {task.description || 'No description provided.'}
              </p>

              {/* Task Metadata Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12,
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  marginBottom: 'var(--space-6)',
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>
                    Assignee
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    {task.assignee ? (
                      <>
                        <Avatar name={task.assignee.name} size={20} />
                        <span style={{ fontWeight: 500 }}>{task.assignee.name}</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>Unassigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>
                    Due Date
                  </span>
                  <div
                    style={{
                      marginTop: 2,
                      fontWeight: 500,
                      color: overdue ? 'var(--color-danger)' : 'var(--color-text-primary)',
                    }}
                  >
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'} {overdue ? '(Overdue)' : ''}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>
                    Created By
                  </span>
                  <div style={{ marginTop: 2, fontWeight: 500 }}>
                    {task.createdBy ? task.createdBy.name : 'Unknown'}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: 11 }}>
                    Created At
                  </span>
                  <div style={{ marginTop: 2, color: 'var(--color-text-secondary)' }}>
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              </div>

              {/* Task Comments Section */}
              <CommentSection taskId={task.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
