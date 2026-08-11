import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';

/**
 * Assigned Tasks List Component for Dashboard
 */
export const RecentTasksList = ({ tasks = [] }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          My Assigned Tasks
        </h2>
        <EmptyState
          title="No assigned tasks"
          description="You currently have no tasks assigned to you across your active projects."
          icon={Clock}
        />
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-5)',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          My Assigned Tasks
        </h2>
        <Link
          to="/my-tasks"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((task, index) => {
          const overdue = isOverdue(task.dueDate, task.status);
          const isLast = index === tasks.length - 1;

          return (
            <div
              key={task.id}
              className="recent-task-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 8px',
                borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                gap: 12,
                transition: 'background-color var(--transition-fast)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {task.title}
                </div>
                {task.dueDate && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: overdue ? 600 : 400,
                      color: overdue ? 'var(--color-danger)' : 'var(--color-text-muted)',
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Clock size={11} />
                    <span>
                      Due {formatDate(task.dueDate)} {overdue ? '(Overdue)' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

