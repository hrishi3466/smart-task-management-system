import React from 'react';
import { Clock } from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/dateUtils';

/**
 * Task Card Component for Kanban Board
 */
export const TaskCard = ({ task, isOwner, onClick, onDragStart }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      draggable={isOwner}
      onDragStart={(e) => isOwner && onDragStart && onDragStart(e, task.id)}
      onClick={onClick}
      className="card"
      style={{
        padding: 'var(--space-3) var(--space-4)',
        cursor: 'pointer',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
          wordBreak: 'break-word',
        }}
      >
        {task.title}
      </div>

      {/* Description Snippet */}
      {task.description && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-3)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          {task.description}
        </p>
      )}

      {/* Footer: Priority, Due Date, Assignee Avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PriorityBadge priority={task.priority} />

          {task.dueDate && (
            <div
              style={{
                fontSize: 11,
                fontWeight: overdue ? 600 : 400,
                color: overdue ? 'var(--color-danger)' : 'var(--color-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
              title={overdue ? 'Overdue task' : 'Due date'}
            >
              <Clock size={11} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {task.assignee ? (
          <Avatar name={task.assignee.name} size={24} />
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '1px dashed var(--color-border)',
            }}
            title="Unassigned"
          />
        )}
      </div>
    </div>
  );
};
