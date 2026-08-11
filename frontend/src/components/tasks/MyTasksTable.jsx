import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FolderKanban } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDate, isOverdue } from '../../utils/dateUtils';

/**
 * Tabular View Component for My Tasks
 */
export const MyTasksTable = ({ tasks = [], projectMap = {}, onTaskClick }) => {
  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        overflowX: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              borderBottom: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
            }}
          >
            <th style={{ padding: '12px 16px' }}>Task Title</th>
            <th style={{ padding: '12px 16px' }}>Project</th>
            <th style={{ padding: '12px 16px' }}>Priority</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
            <th style={{ padding: '12px 16px' }}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const project = projectMap[task.projectId];
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task, project)}
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                className="table-row-hover"
              >
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {task.title}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                  {project ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <FolderKanban size={14} style={{ color: 'var(--color-primary)' }} />
                      {project.name}
                    </span>
                  ) : (
                    `Project #${task.projectId}`
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={task.status} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {task.dueDate ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        color: overdue ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                        fontWeight: overdue ? 600 : 400,
                      }}
                    >
                      <Clock size={13} />
                      {formatDate(task.dueDate)} {overdue ? '(Overdue)' : ''}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>No due date</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
