import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { TaskPriority, TaskStatus } from '../../constants/appConstants';
import { parseApiError } from '../../api/client';

/**
 * Modal Dialog for Creating a New Task (OWNER only)
 */
export const CreateTaskModal = ({
  isOpen,
  onClose,
  initialStatus = TaskStatus.TODO,
  projectMembers = [],
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Task title is required';
    } else if (title.trim().length > 150) {
      errors.title = 'Title must not exceed 150 characters';
    }

    if (description && description.length > 2000) {
      errors.description = 'Description must not exceed 2000 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await onCreateTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority(TaskPriority.MEDIUM);
      setAssigneeId('');
      setDueDate('');
      onClose();
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

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
      aria-labelledby="create-task-title"
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
          <h2 id="create-task-title" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            Create New Task
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-6)' }}>
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

          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement user login form"
            error={fieldErrors.title}
            required
            disabled={isLoading}
          />

          <div className="input-group">
            <label className="input-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details and instructions..."
              rows={3}
              disabled={isLoading}
              className={`input-field ${fieldErrors.description ? 'has-error' : ''}`}
              style={{ resize: 'vertical' }}
            />
            {fieldErrors.description && (
              <span className="input-error-msg">{fieldErrors.description}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={priorityOptions}
              disabled={isLoading}
            />

            <Select
              label="Assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              options={assigneeOptions}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="task-due-date">
              Due Date
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
              className="input-field"
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 'var(--space-6)',
            }}
          >
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
