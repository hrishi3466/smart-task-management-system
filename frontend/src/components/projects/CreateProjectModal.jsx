import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { ProjectStatus } from '../../constants/appConstants';
import { parseApiError } from '../../api/client';

/**
 * Modal Dialog for Creating a New Project matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(ProjectStatus.PLANNED);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Project name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Project name must be at least 2 characters';
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
      await onCreateProject({
        name: name.trim(),
        description: description.trim() || undefined,
        status,
      });
      // Reset form on success
      setName('');
      setDescription('');
      setStatus(ProjectStatus.PLANNED);
      onClose();
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: ProjectStatus.PLANNED, label: 'Planned' },
    { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ProjectStatus.COMPLETED, label: 'Completed' },
    { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
    { value: ProjectStatus.ARCHIVED, label: 'Archived' },
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
      aria-labelledby="modal-title"
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 480,
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Modal Header */}
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
          <h2 id="modal-title" style={{ fontSize: 16, fontWeight: 700 }}>
            Create New Project
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

        {/* Modal Form Body */}
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
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Redesign"
            error={fieldErrors.name}
            required
            disabled={isLoading}
          />

          <div className="input-group">
            <label className="input-label" htmlFor="project-desc">
              Description
            </label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of project goals and scope..."
              rows={3}
              disabled={isLoading}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            disabled={isLoading}
          />

          {/* Modal Footer Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              marginTop: 'var(--space-6)',
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
