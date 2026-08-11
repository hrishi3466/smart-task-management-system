import React, { useEffect, useState, useCallback } from 'react';
import { FolderKanban, CheckSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { taskApi } from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import { parseApiError } from '../../api/client';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { RecentTasksList } from '../../components/dashboard/RecentTasksList';
import { ProjectQuickGrid } from '../../components/dashboard/ProjectQuickGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { isOverdue } from '../../utils/dateUtils';

/**
 * Dashboard Page Component displaying calculated real metrics from backend APIs
 * Transformed with SaaS product hierarchy, welcome header, and responsive layout.
 */
export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [projectTaskStats, setProjectTaskStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Fetch accessible projects (GET /api/projects)
      const projectList = await projectApi.listProjects();
      const loadedProjects = projectList || [];
      setProjects(loadedProjects);

      // 2. Fetch tasks for each accessible project (GET /api/projects/{projectId}/tasks)
      const userAssigned = [];
      const statsMap = {};

      for (const proj of loadedProjects) {
        try {
          const tasks = await taskApi.listTasks(proj.id);
          const taskArr = Array.isArray(tasks) ? tasks : [];

          // Compute project completion ratio
          const completedCount = taskArr.filter((t) => t.status === 'DONE').length;
          statsMap[proj.id] = {
            total: taskArr.length,
            completed: completedCount,
          };

          // Filter tasks assigned to current user
          const assigned = taskArr.filter(
            (t) => t.assignee && t.assignee.id === currentUser.id
          );
          userAssigned.push(...assigned);
        } catch {
          // If a single project fails to load tasks, continue with others
          statsMap[proj.id] = { total: 0, completed: 0 };
        }
      }

      // Sort user assigned tasks by due date (nearest first)
      userAssigned.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

      setAssignedTasks(userAssigned);
      setProjectTaskStats(statsMap);
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading workspace dashboard..." />;
  }

  if (errorMsg) {
    return <ErrorState message={errorMsg} onRetry={fetchDashboardData} />;
  }

  // Calculate real dashboard summary metrics
  const totalProjects = projects.length;
  const totalAssignedTasks = assignedTasks.length;
  const completedAssignedTasks = assignedTasks.filter((t) => t.status === 'DONE').length;
  const overdueAssignedTasks = assignedTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }} className="dashboard-container">
      {/* Welcome Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Welcome back, {currentUser?.name || 'User'}! 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
            Here is an overview of your active project workspaces, assigned tasks, and completion velocity.
          </p>
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <StatsCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          color="var(--color-primary)"
          subtitle="Active workspaces"
        />
        <StatsCard
          title="Assigned Tasks"
          value={totalAssignedTasks}
          icon={CheckSquare}
          color="var(--color-info)"
          subtitle="Tasks assigned to you"
        />
        <StatsCard
          title="Completed Tasks"
          value={completedAssignedTasks}
          icon={CheckCircle2}
          color="var(--color-success)"
          subtitle="Tasks marked Done"
        />
        <StatsCard
          title="Overdue Tasks"
          value={overdueAssignedTasks}
          icon={AlertTriangle}
          color={overdueAssignedTasks > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)'}
          subtitle="Past due date"
        />
      </div>

      {/* Main Content Layout: Active Projects Grid & Recent Tasks List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        <ProjectQuickGrid projects={projects} projectTaskStats={projectTaskStats} />
        <RecentTasksList tasks={assignedTasks.slice(0, 6)} />
      </div>
    </div>
  );
};

