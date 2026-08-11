# API Integration Map & Frontend Capability Analysis

This document provides a comprehensive mapping of all backend REST endpoints in **Smart Task Flow** to their request/response schemas, security requirements, and corresponding frontend views.

---

## 1. Authentication Mechanism & Request Conventions

* **Authentication Protocol**: JWT (JSON Web Token) Header-Based Authentication.
* **Token Storage**: Browser `localStorage` / `sessionStorage`.
* **Required Header for Authenticated Requests**:
  ```http
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```
* **Base URL Prefix**: `/api` (configured via Vite API proxy or environment variable `VITE_API_BASE_URL`).
* **Standard Success Response Shape (`ApiResponse<T>`)**:
  ```json
  {
    "success": true,
    "status": 200,
    "message": "Operation description",
    "data": { ... },
    "timestamp": "2026-08-11T16:20:00"
  }
  ```
* **Standard Error Response Shape (`ErrorResponse`)**:
  ```json
  {
    "success": false,
    "status": 400,
    "message": "Validation failed / Error description",
    "timestamp": "2026-08-11T16:20:00",
    "errors": [
      "field: validation error detail"
    ]
  }
  ```
* **Special Case Exception**: `GET /api/users/me` returns `UserResponse` directly without the `ApiResponse` wrapper.

---

## 2. Comprehensive Endpoint Mapping Table

| Endpoint | HTTP Method | Request Body Schema | Query Parameters | Response Shape | Auth Required | Consuming Frontend Page / Component |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `{ "name": "string (min:2, max:100)", "email": "string (valid email)", "password": "string (min:8, max:100)" }` | None | `ApiResponse<AuthResponse>` (`{ token: string, tokenType: "Bearer", user: UserResponse }`) | **Public** | Register / Sign Up Page |
| `/api/auth/login` | `POST` | `{ "email": "string (valid email)", "password": "string (min:8, max:100)" }` | None | `ApiResponse<AuthResponse>` (`{ token: string, tokenType: "Bearer", user: UserResponse }`) | **Public** | Login / Sign In Page |
| `/api/users/me` | `GET` | None | None | `UserResponse` (`{ id: number, name: string, email: string, role: "ADMIN" \| "USER" }`) | **Bearer Token** | App Initialization, User Profile Header, User Drawer |
| `/api/projects` | `POST` | `{ "name": "string (max:150)", "description": "string (max:1000)" }` | None | `ApiResponse<ProjectResponse>` | **Bearer Token** | Projects Overview, Create Project Modal |
| `/api/projects` | `GET` | None | None | `ApiResponse<List<ProjectResponse>>` | **Bearer Token** | Projects Dashboard, Sidebar Project List, Global Project Selector |
| `/api/projects/{projectId}` | `GET` | None | None | `ApiResponse<ProjectResponse>` | **Bearer Token** | Project Detail Workspace (Kanban/List/Board Header) |
| `/api/projects/{projectId}` | `PUT` | `{ "name": "string (max:150)", "description": "string (max:1000)", "status": "ACTIVE" \| "COMPLETED" \| "ARCHIVED" }` | None | `ApiResponse<ProjectResponse>` | **Bearer Token** | Project Settings Modal / Edit Project Drawer |
| `/api/projects/{projectId}` | `DELETE` | None | None | `ApiResponse<Void>` (`data: null`) | **Bearer Token** | Project Settings (Delete Project Confirmation) |
| `/api/projects/{projectId}/members` | `POST` | `{ "email": "string (valid email)", "role": "OWNER" \| "ADMIN" \| "MEMBER" \| "VIEWER" }` | None | `ApiResponse<ProjectResponse>` | **Bearer Token** | Project Team Settings, Add Member Modal |
| `/api/projects/{projectId}/members/{userId}` | `DELETE` | None | None | `ApiResponse<ProjectResponse>` | **Bearer Token** | Project Team Settings, Member List Remove Action |
| `/api/projects/{projectId}/tasks` | `POST` | `{ "title": "string (max:150)", "description": "string (max:2000)", "priority": "LOW" \| "MEDIUM" \| "HIGH" \| "URGENT", "assigneeId": number, "dueDate": "ISO LocalDateTime" }` | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Project Workspace, Create Task Modal / Column Quick Add |
| `/api/projects/{projectId}/tasks` | `GET` | None | None | `ApiResponse<List<TaskResponse>>` | **Bearer Token** | Project Kanban Board, Project Task List View, Gantt/Timeline View |
| `/api/tasks/{taskId}` | `GET` | None | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Task Detail Modal / Slide-over Panel |
| `/api/tasks/{taskId}` | `PUT` | `{ "title": "string (max:150)", "description": "string (max:2000)", "status": "TODO" \| "IN_PROGRESS" \| "IN_REVIEW" \| "DONE", "priority": "LOW" \| "MEDIUM" \| "HIGH" \| "URGENT", "assigneeId": number, "dueDate": "ISO LocalDateTime" }` | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Task Detail Modal / Edit Task Form |
| `/api/tasks/{taskId}` | `DELETE` | None | None | `ApiResponse<Void>` (`data: null`) | **Bearer Token** | Task Detail Actions, Kanban Card Action Menu |
| `/api/tasks/{taskId}/assignee` | `PATCH` | `{ "assigneeId": number }` | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Task Card Quick Assignee Dropdown, Task Detail Assignee Picker |
| `/api/tasks/{taskId}/status` | `PATCH` | `{ "status": "TODO" \| "IN_PROGRESS" \| "IN_REVIEW" \| "DONE" }` | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Kanban Board Drag-and-Drop Drop Handler, Task Status Select |
| `/api/tasks/{taskId}/priority` | `PATCH` | `{ "priority": "LOW" \| "MEDIUM" \| "HIGH" \| "URGENT" }` | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Task Priority Dropdown (Board & Detail view) |
| `/api/tasks/{taskId}/due-date` | `PATCH` | `{ "dueDate": "ISO LocalDateTime" }` | None | `ApiResponse<TaskResponse>` | **Bearer Token** | Task Due Date Picker (Board & Detail view) |
| `/api/tasks/{taskId}/comments` | `POST` | `{ "content": "string (max:2000)" }` | None | `ApiResponse<CommentResponse>` | **Bearer Token** | Task Detail Comments Section (Add Comment Input) |
| `/api/tasks/{taskId}/comments` | `GET` | None | None | `ApiResponse<List<CommentResponse>>` | **Bearer Token** | Task Detail Comments Thread / Activity Feed |
| `/api/comments/{commentId}` | `PUT` | `{ "content": "string (max:2000)" }` | None | `ApiResponse<CommentResponse>` | **Bearer Token** | Task Detail Comment Inline Edit |
| `/api/comments/{commentId}` | `DELETE` | None | None | `ApiResponse<Void>` (`data: null`) | **Bearer Token** | Task Detail Comment Delete Action |
| `/api/notifications` | `GET` | None | None | `ApiResponse<List<NotificationResponse>>` | **Bearer Token** | Top Navigation Notification Bell Popover, Notification Center |
| `/api/notifications/unread-count` | `GET` | None | None | `ApiResponse<UnreadNotificationCountResponse>` (`{ unreadCount: number }`) | **Bearer Token** | Top Bar Notification Badge (Polling / Real-time sync) |
| `/api/notifications/{notificationId}/read` | `PUT` | None | None | `ApiResponse<NotificationResponse>` | **Bearer Token** | Notification Popover Item Click |
| `/api/notifications/read-all` | `PUT` | None | None | `ApiResponse<Void>` (`data: null`) | **Bearer Token** | Notification Popover "Mark All as Read" Action |
| `/api/notifications/{notificationId}` | `DELETE` | None | None | `ApiResponse<Void>` (`data: null`) | **Bearer Token** | Notification Item Delete Action |

---

## 3. Data Transfer Objects (DTO) Reference Shapes

### UserResponse
```typescript
interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}
```

### ProjectResponse & ProjectMemberResponse
```typescript
interface ProjectMemberResponse {
  id: number;
  user: UserResponse;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
}

interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  owner: UserResponse;
  members: ProjectMemberResponse[];
  createdAt: string; // ISO LocalDateTime
  updatedAt: string; // ISO LocalDateTime
}
```

### TaskResponse
```typescript
interface TaskResponse {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
  assignee: UserResponse | null;
  createdBy: UserResponse;
  createdAt: string;
  updatedAt: string;
}
```

### CommentResponse
```typescript
interface CommentResponse {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### NotificationResponse
```typescript
interface NotificationResponse {
  id: number;
  type: "TASK_ASSIGNED" | "TASK_STATUS_CHANGED" | "TASK_COMMENT_ADDED" | "PROJECT_MEMBER_ADDED";
  message: string;
  readStatus: boolean;
  createdAt: string;
}
```

---

## 4. Frontend vs. Backend Capability Comparison

### ✅ UI Features Fully Supported by Backend
1. **User Authentication & Session Management**:
   - Registration (`POST /api/auth/register`)
   - Login (`POST /api/auth/login`)
   - Profile/Current User check (`GET /api/users/me`)
2. **Project Workspace Lifecycle**:
   - Creating projects (`POST /api/projects`)
   - Listing accessible projects (`GET /api/projects`)
   - Viewing single project details (`GET /api/projects/{projectId}`)
   - Editing project details & status (`PUT /api/projects/{projectId}`)
   - Archiving / Deleting projects (`DELETE /api/projects/{projectId}`)
3. **Project Team Management**:
   - Inviting / adding team members by exact email and role (`POST /api/projects/{projectId}/members`)
   - Removing team members (`DELETE /api/projects/{projectId}/members/{userId}`)
4. **Kanban Board & Task Management**:
   - Creating tasks inside a project (`POST /api/projects/{projectId}/tasks`)
   - Listing tasks per project (`GET /api/projects/{projectId}/tasks`)
   - Viewing task details (`GET /api/tasks/{taskId}`)
   - Drag-and-drop task status updates (`PATCH /api/tasks/{taskId}/status`)
   - Changing task priority (`PATCH /api/tasks/{taskId}/priority`)
   - Changing task assignee (`PATCH /api/tasks/{taskId}/assignee`)
   - Changing due date (`PATCH /api/tasks/{taskId}/due-date`)
   - Deleting tasks (`DELETE /api/tasks/{taskId}`)
5. **Task Discussions / Comments**:
   - Fetching task comments thread (`GET /api/tasks/{taskId}/comments`)
   - Posting new comments (`POST /api/tasks/{taskId}/comments`)
   - Editing own comments (`PUT /api/comments/{commentId}`)
   - Deleting comments (`DELETE /api/comments/{commentId}`)
6. **In-App Notification Center**:
   - Unread count badge (`GET /api/notifications/unread-count`)
   - Fetching notification list (`GET /api/notifications`)
   - Marking individual notification as read (`PUT /api/notifications/{notificationId}/read`)
   - Marking all notifications as read (`PUT /api/notifications/read-all`)
   - Deleting notification (`DELETE /api/notifications/{notificationId}`)

---

### ⚠️ UI Features Requiring Frontend Adaptations or Backend Enhancements

| UI Feature | Current Backend Limitation | Frontend Adaptation / Solution | Recommended Backend Fix (If modifying logic in future) |
| :--- | :--- | :--- | :--- |
| **Global "My Tasks" View** | No endpoint like `/api/tasks/my-tasks` or `/api/tasks?assigneeId=me`. Tasks can only be fetched per project. | Fetch tasks for all accessible projects in parallel or sequentially, then filter tasks client-side where `task.assignee.id === currentUser.id`. | Add `GET /api/tasks/my-tasks` endpoint returning tasks assigned to current user across all projects. |
| **Global User Search / Auto-complete** | No `/api/users/search` or `GET /api/users` endpoint. | When assigning tasks, populate the assignee dropdown using `project.members` list. For project invitations, require typing the exact email address. | Add `GET /api/users/search?query=...` or `GET /api/users` to support global user auto-completion. |
| **Server-side Task Search & Filters** | `GET /api/projects/{projectId}/tasks` returns all tasks for a project without query params for status, priority, or search term. | Perform client-side searching (title/description), filtering (status, priority, assignee), and sorting (due date, priority, title) in JavaScript. | Add query params `GET /api/projects/{projectId}/tasks?status=...&priority=...&search=...` if project task counts grow large. |
| **Activity Feed / Audit Log View** | No explicit audit log or activity endpoints (`/api/activity` or `/api/projects/{id}/activity`) in backend. | Construct a dynamic activity timeline using task `createdAt`/`updatedAt`, comments, and user notification events. | Create an `ActivityLog` entity and `/api/projects/{id}/activities` endpoint for enterprise audit logs. |
| **API Response Standard Wrapping Consistency** | `GET /api/users/me` returns `UserResponse` raw JSON object directly, whereas all other endpoints wrap payload in `ApiResponse<T>` (`{ success, status, message, data, timestamp }`). | The frontend API client interceptor checks if the response object has a `.data` attribute or returns the body directly, normalizing responses automatically. | Align `UserController.getCurrentUser()` to return `ApiResponse<UserResponse>`. |

---

## 5. Recommended Frontend Application Structure

```
frontend/src/
├── api/
│   ├── client.js          # Axios / Fetch client with Bearer token interceptor & error normalization
│   ├── auth.js            # Authentication API functions
│   ├── projects.js        # Project & Member API functions
│   ├── tasks.js           # Task API functions
│   ├── comments.js        # Comment API functions
│   └── notifications.js   # Notification API functions
├── components/
│   ├── common/            # Buttons, Inputs, Modals, Badges, Toast notifications
│   ├── layout/            # Navbar, Sidebar, TopHeader, NotificationPopover
│   ├── projects/          # ProjectCard, CreateProjectModal, MemberManagementModal
│   ├── tasks/             # TaskCard, KanbanBoard, KanbanColumn, TaskDetailModal, CreateTaskModal
│   ├── comments/          # CommentList, CommentItem, AddCommentBox
│   └── notifications/     # NotificationList, NotificationItem
├── context/
│   ├── AuthContext.jsx    # Auth state management (user, token, login, logout)
│   └── AppContext.jsx     # Active project, notifications count, theme state
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx  # My Tasks & Overview
│   ├── ProjectsPage.jsx   # Projects listing & creation
│   ├── ProjectDetailPage.jsx # Board, List, Settings tabs
│   └── NotificationsPage.jsx
├── App.jsx                # Router & protected route wrappers
├── index.css              # Glassmorphic, modern CSS design system
└── main.jsx
```
