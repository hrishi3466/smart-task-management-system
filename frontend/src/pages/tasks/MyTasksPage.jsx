import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  List,
  LayoutGrid,
  Filter,
} from 'lucide-react';
import { useMyTasks } from '../../hooks/useMyTasks';
import { projectApi } from '../../api/projectApi';
import { taskApi } from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { MyTasksTable } from '../../components/tasks/MyTasksTable';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { TaskStatus, TaskPriority, ProjectRole } from '../../constants/appConstants';
import { isOverdue } from '../../utils/dateUtils';

/**
 * My Tasks Page Component
 */
export const MyTasksPage = () => {
  const { currentUser } = useAuth();
  const { myTasks, isLoading, error, fetchMyTasks } = useMyTasks();

  const [projectMap, setProjectMap] = useState({});
  const [projectList, setProjectList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch project map to show project titles and compute member roles
  const loadProjects = useCallback(async () => {
    try {
      const list = await projectApi.listProjects();
      if (Array.isArray(list)) {
        setProjectList(list);
        const pMap = {};
        list.forEach((p) => {
          pMap[p.id] = p;
        });
        setProjectMap(pMap);
      }
    } catch {
      // Ignore if project list fails to load
    }
  }, []);

  useEffect(() => {
    fetchMyTasks();
    loadProjects();
  }, [fetchMyTasks, loadProjects]);

  // Derived real summary statistics
  const stats = useMemo(() => {
    const total = myTasks.length;
    const completed = myTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const overdueCount = myTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const dueToday = myTasks.filter(
      (t) =>
        t.dueDate &&
        t.dueDate.slice(0, 10) === todayStr &&
        t.status !== TaskStatus.COMPLETED
    ).length;

    return { total, completed, overdueCount, dueToday };
  }, [myTasks]);

  // Client-side filtering & sorting
  const filteredTasks = useMemo(() => {
    return myTasks
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
        const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
        const matchesOverdue = !showOverdueOnly || isOverdue(t.dueDate, t.status);

        return matchesSearch && matchesStatus && matchesPriority && matchesOverdue;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'priority') {
          const priorityRank = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
        }
        return 0;
      });
  }, [myTasks, searchQuery, selectedStatus, selectedPriority, showOverdueOnly, sortBy]);

  // Selected task project & authorization calculation
  const selectedTaskProject = useMemo(() => {
    if (!selectedTask) return null;
    return projectMap[selectedTask.projectId] || null;
  }, [selectedTask, projectMap]);

  const isSelectedTaskOwner = useMemo(() => {
    if (!selectedTaskProject || !currentUser) return false;
    if (selectedTaskProject.owner && selectedTaskProject.owner.id === currentUser.id) return true;
    if (selectedTaskProject.members) {
      const record = selectedTaskProject.members.find(
        (m) => m.user && m.user.id === currentUser.id
      );
      if (record && record.role === ProjectRole.OWNER) return true;
    }
    return false;
  }, [selectedTaskProject, currentUser]);

  const handleUpdateTask = async (taskId, updateData) => {
    const updated = await taskApi.updateTask(taskId, updateData);
    await fetchMyTasks();
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(updated);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await taskApi.deleteTask(taskId);
    await fetchMyTasks();
    setSelectedTask(null);
  };

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.COMPLETED, label: 'Completed' },
    { value: TaskStatus.CANCELLED, label: 'Cancelled' },
  ];

  const priorityFilterOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' },
    { value: TaskPriority.URGENT, label: 'Urgent' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Sort by Due Date' },
    { value: 'priority', label: 'Sort by Priority' },
  ];

  if (isLoading && myTasks.length === 0) {
    return <LoadingSpinner fullPage message="Loading assigned tasks..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMyTasks} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>My Tasks</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
          Tasks assigned to you across all workspace projects
        </p>
      </div>

      {/* Summary Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <StatsCard
          title="Assigned Tasks"
          value={stats.total}
          icon={CheckSquare}
          color="var(--color-primary)"
        />
        <StatsCard
          title="Due Today"
          value={stats.dueToday}
          icon={Clock}
          color="var(--color-info)"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdueCount}
          icon={AlertTriangle}
          color={stats.overdueCount > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)'}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="var(--color-success)"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-3)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my tasks..."
            style={{
              width: '100%',
              padding: '6px 12px 6px 32px',
              fontSize: 13,
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ width: 140 }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusFilterOptions}
          />
        </div>

        {/* Priority Dropdown */}
        <div style={{ width: 140 }}>
          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            options={priorityFilterOptions}
          />
        </div>

        {/* Sort Dropdown */}
        <div style={{ width: 160 }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
          />
        </div>

        {/* Overdue Only Filter Toggle */}
        <Button
          variant={showOverdueOnly ? 'danger' : 'secondary'}
          size="sm"
          onClick={() => setShowOverdueOnly(!showOverdueOnly)}
        >
          Overdue Only
        </Button>

        {/* View Switcher (Table vs Grid) */}
        <div style={{ display: 'flex', gap: 4, borderLeft: '1px solid var(--color-border)', paddingLeft: 8 }}>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              background: viewMode === 'table' ? 'var(--color-primary-subtle)' : 'none',
              color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 6,
              cursor: 'pointer',
            }}
            title="Table View"
            aria-label="Table view"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={{
              background: viewMode === 'grid' ? 'var(--color-primary-subtle)' : 'none',
              color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 6,
              cursor: 'pointer',
            }}
            title="Grid View"
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Task List / Grid Display */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={
            searchQuery || selectedStatus !== 'ALL' || selectedPriority !== 'ALL' || showOverdueOnly
              ? 'No tasks match your active filter criteria.'
              : 'You currently have no tasks assigned to you.'
          }
          icon={CheckSquare}
        />
      ) : viewMode === 'table' ? (
        <MyTasksTable
          tasks={filteredTasks}
          projectMap={projectMap}
          onTaskClick={(t) => setSelectedTask(t)}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isOwner={false} // Prevents drag-and-drop in My Tasks grid view
              onClick={() => setSelectedTask(task)}
            />
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        isOwner={isSelectedTaskOwner}
        projectMembers={selectedTaskProject?.members || []}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};
