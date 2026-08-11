import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { taskApi } from '../../api/taskApi';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { ProjectStatus } from '../../constants/appConstants';

/**
 * Projects List Page Component
 */
export const ProjectsPage = () => {
  const { projects, isLoading, error, fetchProjects, createProject } = useProjects();
  const [taskStats, setTaskStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch task progress statistics for each project
  const loadTaskStats = useCallback(async (projectList) => {
    if (!projectList || projectList.length === 0) return;
    const statsMap = {};
    for (const p of projectList) {
      try {
        const tasks = await taskApi.listTasks(p.id);
        const taskArr = Array.isArray(tasks) ? tasks : [];
        const completed = taskArr.filter((t) => t.status === 'DONE').length;
        statsMap[p.id] = { total: taskArr.length, completed };
      } catch {
        statsMap[p.id] = { total: 0, completed: 0 };
      }
    }
    setTaskStats(statsMap);
  }, []);

  useEffect(() => {
    if (projects && projects.length > 0) {
      loadTaskStats(projects);
    }
  }, [projects, loadTaskStats]);

  // Client-side search & status filtering
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, selectedStatus]);

  const handleCreateProject = async (newProjectData) => {
    await createProject(newProjectData);
    await fetchProjects();
  };

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: ProjectStatus.PLANNED, label: 'Planned' },
    { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ProjectStatus.COMPLETED, label: 'Completed' },
    { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
    { value: ProjectStatus.ARCHIVED, label: 'Archived' },
  ];

  if (isLoading && (!projects || projects.length === 0)) {
    return <LoadingSpinner fullPage message="Loading projects..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchProjects} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Projects</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Manage and track workspace projects
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Project
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-4)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
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
            placeholder="Search projects by name..."
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

        {/* Status Filter Dropdown */}
        <div style={{ width: 160 }}>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusFilterOptions}
          />
        </div>
      </div>

      {/* Projects Grid Container */}
      {!filteredProjects || filteredProjects.length === 0 ? (
        <EmptyState
          title={searchQuery || selectedStatus !== 'ALL' ? 'No matching projects' : 'No projects created'}
          description={
            searchQuery || selectedStatus !== 'ALL'
              ? 'Try adjusting your search criteria or status filter.'
              : 'Get started by creating your first workspace project.'
          }
          icon={FolderKanban}
          actionLabel={!searchQuery && selectedStatus === 'ALL' ? 'New Project' : undefined}
          onAction={!searchQuery && selectedStatus === 'ALL' ? () => setIsModalOpen(true) : undefined}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              taskStats={taskStats[project.id]}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal Dialog */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};
