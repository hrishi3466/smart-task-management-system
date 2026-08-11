import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Users, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

/**
 * Projects Grid Component for Dashboard displaying real completion ratios
 */
export const ProjectQuickGrid = ({ projects = [], projectTaskStats = {} }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-4)' }}>
          Active Projects
        </h2>
        <EmptyState
          title="No projects available"
          description="You are currently not a member of any projects."
          icon={FolderKanban}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Active Projects</h2>
        <Link
          to="/projects"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View all projects <ArrowRight size={14} />
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {projects.map((project) => {
          const stats = projectTaskStats[project.id] || { total: 0, completed: 0 };
          const percent =
            stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const memberCount = project.members ? project.members.length : 1;

          return (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: var_space_3(),
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{project.name}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  {project.description && (
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--color-text-secondary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: 'var(--space-2)' }}>
                  {/* Progress Bar */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: 'var(--color-text-muted)',
                      marginBottom: 4,
                    }}
                  >
                    <span>Completion</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                      {percent}% ({stats.completed}/{stats.total})
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

                  {/* Team Members Count */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: 'var(--color-text-muted)',
                      marginTop: 10,
                    }}
                  >
                    <Users size={14} />
                    <span>{memberCount} team member{memberCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

function var_space_3() {
  return 'var(--space-3)';
}
