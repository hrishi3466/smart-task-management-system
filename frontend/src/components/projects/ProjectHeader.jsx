import React, { useState } from 'react';
import { Users, UserPlus, Settings, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

/**
 * Project Header Component for ProjectDetailPage matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const ProjectHeader = ({
  project,
  isOwner,
  onOpenMembers,
  onOpenEdit,
  onDeleteProject,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.name}"? This action cannot be undone and will delete all associated tasks.`
      )
    ) {
      setIsDeleting(true);
      try {
        await onDeleteProject();
      } catch {
        setIsDeleting(false);
      }
    }
  };

  const memberCount = project.members ? project.members.length : 1;

  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Back Link */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <Link
          to="/projects"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      {/* Main Header Content */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          {project.description && (
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
              {project.description}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 13,
              color: 'var(--color-text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={16} />
              <span>
                {memberCount} team member{memberCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div>Owner: {project.owner?.name || 'Unknown'}</div>
          </div>
        </div>

        {/* OWNER Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={onOpenMembers}>
            <Users size={14} /> Team Members ({memberCount})
          </Button>

          {isOwner && (
            <>
              <Button variant="secondary" size="sm" onClick={onOpenEdit}>
                <Settings size={14} /> Edit Project
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={isDeleting}
              >
                <Trash2 size={14} /> Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
