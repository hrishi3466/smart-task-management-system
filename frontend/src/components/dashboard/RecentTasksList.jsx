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
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-4)' }}>
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
    <div className="card" style={{ padding: 'var(--space-5)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>My Assigned Tasks</h2>
        <Link
          to="/my-tasks"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.map((task) => {
          const overdue = isOverdue(task.dueDate, task.status);
          return (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
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
                      fontSize: 12,
                      color: overdue ? 'var(--color-danger)' : 'var(--color-text-muted)',
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Clock size={12} />
                    <span>
                      Due {formatDate(task.dueDate)} {overdue ? '(Overdue)' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
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
