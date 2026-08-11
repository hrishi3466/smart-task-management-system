import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

/**
 * Project Card Component matching SMART_TASK_FLOW_DESIGN_SYSTEM.md
 */
export const ProjectCard = ({ project, taskStats }) => {
  const stats = taskStats || { total: 0, completed: 0 };
  const percent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const memberCount = project.members ? project.members.length : 1;

  return (
    <div
      className="card"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-5)',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div>
        {/* Card Header: Title & Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 'var(--space-2)',
          }}
        >
          <Link
            to={`/projects/${project.id}`}
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
            }}
          >
            {project.name}
          </Link>
          <StatusBadge status={project.status} />
        </div>

        {/* Project Description */}
        <p
          style={{
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-4)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 38,
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Progress Bar Section */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              marginBottom: 4,
            }}
          >
            <span>Progress</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {percent}% ({stats.completed}/{stats.total} tasks)
            </span>
          </div>
          <div
            style={{
              height: 6,
              width: '100%',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${percent}%`,
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Card Footer: Members Count & Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            <Users size={14} />
            <span>
              {memberCount} member{memberCount !== 1 ? 's' : ''}
            </span>
          </div>

          <Link
            to={`/projects/${project.id}`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              textDecoration: 'none',
            }}
          >
            Open <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
