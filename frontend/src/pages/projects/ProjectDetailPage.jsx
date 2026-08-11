import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import { taskApi } from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import { parseApiError } from '../../api/client';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { ProjectHeader } from '../../components/projects/ProjectHeader';
import { ProjectMembersModal } from '../../components/projects/ProjectMembersModal';
import { EditProjectModal } from '../../components/projects/EditProjectModal';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { ProjectRole, TaskStatus } from '../../constants/appConstants';

/**
 * Project Detail & Kanban Task Management View Component
 */
export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals state
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createTaskInitialStatus, setCreateTaskInitialStatus] = useState(TaskStatus.TODO);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load project details & tasks
  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [projData, taskList] = await Promise.all([
        projectApi.getProject(projectId),
        taskApi.listTasks(projectId),
      ]);
      setProject(projData);
      setTasks(taskList || []);
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Determine if logged in user is project OWNER
  const isOwner = useMemo(() => {
    if (!project || !currentUser) return false;
    if (project.owner && project.owner.id === currentUser.id) return true;
    if (project.members) {
      const memberRecord = project.members.find((m) => m.user && m.user.id === currentUser.id);
      if (memberRecord && memberRecord.role === ProjectRole.OWNER) return true;
    }
    return false;
  }, [project, currentUser]);

  // Project Management Handlers (OWNER ONLY)
  const handleUpdateProject = async (updateData) => {
    const updated = await projectApi.updateProject(projectId, updateData);
    setProject(updated);
  };

  const handleDeleteProject = async () => {
    await projectApi.deleteProject(projectId);
    navigate('/projects', { replace: true });
  };

  const handleAddMember = async (email, role) => {
    const updated = await projectApi.addMember(projectId, { email, role });
    setProject(updated);
  };

  const handleRemoveMember = async (userId) => {
    const updated = await projectApi.removeMember(projectId, userId);
    setProject(updated);
  };

  // Task Handlers
  const handleCreateTask = async (taskData) => {
    const created = await taskApi.createTask(projectId, {
      ...taskData,
      status: createTaskInitialStatus,
    });
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdateTask = async (taskId, updateData) => {
    const updated = await taskApi.updateTask(taskId, updateData);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(updated);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await taskApi.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Status Change via Drag-and-Drop (OWNER ONLY)
  const handleTaskDropStatus = async (taskId, newStatus) => {
    if (!isOwner) return;
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.status === newStatus) return;

    // Safe optimistic update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const updated = await taskApi.changeStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      // Rollback on authorization / network failure
      setTasks(previousTasks);
      alert(parseApiError(err));
    }
  };

  const handleOpenCreateTask = (initialColStatus = TaskStatus.TODO) => {
    setCreateTaskInitialStatus(initialColStatus);
    setIsCreateTaskOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading project workspace..." />;
  }

  if (errorMsg) {
    return <ErrorState message={errorMsg} onRetry={fetchProjectData} />;
  }

  if (!project) {
    return <ErrorState title="Project Not Found" message="The requested project does not exist or you do not have permission." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Project Header */}
      <ProjectHeader
        project={project}
        isOwner={isOwner}
        onOpenMembers={() => setIsMembersModalOpen(true)}
        onOpenEdit={() => setIsEditModalOpen(true)}
        onDeleteProject={handleDeleteProject}
      />

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        isOwner={isOwner}
        onTaskClick={(t) => setSelectedTask(t)}
        onTaskDropStatus={handleTaskDropStatus}
        onOpenCreateTask={handleOpenCreateTask}
      />

      {/* Team Members Modal */}
      <ProjectMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        project={project}
        isOwner={isOwner}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdateProject={handleUpdateProject}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        initialStatus={createTaskInitialStatus}
        projectMembers={project.members || []}
        onCreateTask={handleCreateTask}
      />

      {/* Task Detail & Comments Modal */}
      <TaskDetailModal
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        isOwner={isOwner}
        projectMembers={project.members || []}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};
