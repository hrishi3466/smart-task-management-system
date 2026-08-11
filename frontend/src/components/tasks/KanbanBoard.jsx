import React from 'react';
import { Plus } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { Button } from '../common/Button';
import { TaskStatus } from '../../constants/appConstants';

/**
 * Kanban Board Component matching exact TaskStatus backend enums
 */
export const KanbanBoard = ({
  tasks = [],
  isOwner,
  onTaskClick,
  onTaskDropStatus,
  onOpenCreateTask,
}) => {
  // Columns must strictly match TaskStatus: TODO, IN_PROGRESS, COMPLETED, CANCELLED
  const columns = [
    { status: TaskStatus.TODO, title: 'To Do' },
    { status: TaskStatus.IN_PROGRESS, title: 'In Progress' },
    { status: TaskStatus.COMPLETED, title: 'Completed' },
    { status: TaskStatus.CANCELLED, title: 'Cancelled' },
  ];

  const tasksByStatus = (statusVal) => {
    return tasks.filter((t) => t.status === statusVal);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Board Controls Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700 }}>
          Tasks ({tasks.length})
        </div>

        {/* OWNER Add Task Action */}
        {isOwner && (
          <Button variant="primary" size="sm" onClick={() => onOpenCreateTask(TaskStatus.TODO)}>
            <Plus size={16} /> Add Task
          </Button>
        )}
      </div>

      {/* Kanban Columns Grid (Responsive horizontal overflow on mobile) */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-4)',
          alignItems: 'flex-start',
        }}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={tasksByStatus(col.status)}
            isOwner={isOwner}
            onTaskClick={onTaskClick}
            onTaskDrop={onTaskDropStatus}
            onOpenCreateTask={onOpenCreateTask}
          />
        ))}
      </div>
    </div>
  );
};
