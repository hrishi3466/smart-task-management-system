import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { Button } from '../common/Button';

/**
 * Kanban Status Column Component matching exact TaskStatus enums
 */
export const KanbanColumn = ({
  status,
  title,
  tasks = [],
  isOwner,
  onTaskClick,
  onTaskDrop,
  onOpenCreateTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    if (!isOwner) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (!isOwner) return;
    e.preventDefault();
    setIsDragOver(false);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      const taskId = Number(taskIdStr);
      onTaskDrop(taskId, status);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: '1 1 280px',
        minWidth: 260,
        maxWidth: 340,
        backgroundColor: isDragOver ? 'var(--color-primary-subtle)' : 'var(--color-bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: isDragOver ? '2px dashed var(--color-primary)' : '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 220px)',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
      }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</h3>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {tasks.length}
          </span>
        </div>

        {/* OWNER can trigger task creation */}
        {isOwner && onOpenCreateTask && (
          <button
            type="button"
            onClick={() => onOpenCreateTask(status)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 'var(--radius-md)',
            }}
            title="Create task in this column"
            aria-label={`Create task in ${title}`}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Task List */}
      <div
        style={{
          padding: 'var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-6) var(--space-2)',
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--color-text-muted)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isOwner={isOwner}
              onClick={() => onTaskClick(task)}
              onDragStart={handleDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};
