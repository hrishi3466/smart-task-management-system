# Smart Task Flow — Design System Specification

This document establishes the official visual design system for **Smart Task Flow**, derived from the approved UI reference designs (Login, Projects, Project Details, Task Details, Notifications, Profile & Settings).

---

## 1. Design System Foundations & Principles

The visual language of **Smart Task Flow** is designed for productivity, clarity, and enterprise reliability.

### Core Visual Principles:
1. **Calm & Productive Workspace**: Clean neutral backgrounds with controlled brand accents. Reduces visual clutter to keep the user focused on tasks.
2. **High Information Hierarchy**: Distinct typography weights, crisp borders, and subtle surface elevation separate content without distracting decorative elements.
3. **Strictly Enterprise-Ready (No AI Trends)**:
   - **NO** excessive glassmorphic backdrop filters.
   - **NO** neon blue/purple AI glow effects or multi-stop gradients.
   - **NO** overly rounded cards or decorative floating shadows.
   - **NO** unnecessary decorative illustrations or animated distractions.
4. **Consistency Across Domains**: All components (buttons, inputs, cards, status badges, tables, modals) share identical padding rules, radii, font sizes, and state transitions.

---

## 2. Design Tokens

### 2.1 Color Palette

The color system uses refined slate neutrals paired with an enterprise blue primary accent and distinct semantic status colors.

```css
:root {
  /* Brand & Primary Colors */
  --color-primary: #2563eb;          /* Primary Blue (Interactions, active tabs, primary buttons) */
  --color-primary-hover: #1d4ed8;    /* Darker Blue for hover states */
  --color-primary-active: #1e40af;   /* Deep Blue for active/pressed states */
  --color-primary-subtle: #eff6ff;   /* Light tint for selected rows, active nav background */

  /* Neutral Background & Surface Colors */
  --color-bg-app: #f8fafc;           /* App-wide main background (Slate 50) */
  --color-bg-surface: #ffffff;       /* Card, Modal, Sidebar, and Header background (White) */
  --color-bg-subtle: #f1f5f9;        /* Input background, table headers, hover tint (Slate 100) */
  --color-bg-muted: #e2e8f0;         /* Disabled backgrounds, dividers (Slate 200) */

  /* Border & Divider Colors */
  --color-border: #e2e8f0;           /* Default subtle card and container border */
  --color-border-hover: #cbd5e1;     /* Interactive element border hover (Slate 300) */
  --color-border-focus: #2563eb;     /* Focused input & keyboard ring border */

  /* Typography Text Colors */
  --color-text-primary: #0f172a;     /* Main headings, body text, primary labels (Slate 900) */
  --color-text-secondary: #475569;   /* Subtitles, secondary labels, description text (Slate 600) */
  --color-text-muted: #94a3b8;       /* Placeholders, disabled text, caption timestamps (Slate 400) */
  --color-text-inverse: #ffffff;     /* Text on primary buttons and dark surfaces */

  /* Semantic Feedback Colors */
  --color-success: #16a34a;          /* Green 600 (Completed tasks, success toasts) */
  --color-success-bg: #f0fdf4;       /* Green 50 tint */
  --color-warning: #d97706;          /* Amber 600 (Medium priority, warning alerts) */
  --color-warning-bg: #fffbeb;       /* Amber 50 tint */
  --color-danger: #dc2626;           /* Red 600 (Urgent priority, destructive actions, errors) */
  --color-danger-bg: #fef2f2;        /* Red 50 tint */
  --color-info: #0284c7;             /* Sky 600 (In Review status, info messages) */
  --color-info-bg: #f0f9ff;          /* Sky 50 tint */

  /* Task Status Tokens */
  --color-status-todo-bg: #f1f5f9;
  --color-status-todo-text: #475569;
  --color-status-inprogress-bg: #eff6ff;
  --color-status-inprogress-text: #2563eb;
  --color-status-inreview-bg: #f0f9ff;
  --color-status-inreview-text: #0284c7;
  --color-status-done-bg: #f0fdf4;
  --color-status-done-text: #16a34a;

  /* Task Priority Tokens */
  --color-priority-low-bg: #f1f5f9;
  --color-priority-low-text: #64748b;
  --color-priority-medium-bg: #fffbeb;
  --color-priority-medium-text: #d97706;
  --color-priority-high-bg: #fff7ed;
  --color-priority-high-text: #ea580c;
  --color-priority-urgent-bg: #fef2f2;
  --color-priority-urgent-text: #dc2626;
}
```

---

### 2.2 Typography

Typography is clean, highly legible, and structured with standardized line heights and letter spacing.

* **Primary Font Family**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Monospace Font Family**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

| Scale Level | Font Size | Font Weight | Line Height | Letter Spacing | Target Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Heading 1 (Page Title)** | `24px (1.5rem)` | Bold (`700`) | `32px` | `-0.02em` | Page top headers, main auth title |
| **Heading 2 (Section Title)** | `18px (1.125rem)` | Semi-Bold (`600`) | `24px` | `-0.01em` | Card group titles, modal headers |
| **Heading 3 (Card Header)** | `15px (0.9375rem)` | Semi-Bold (`600`) | `20px` | `0em` | Task titles, project card titles |
| **Body (Main Text)** | `14px (0.875rem)` | Regular (`400`) | `20px` | `0em` | Form inputs, table cells, descriptions |
| **Body Semi-Bold** | `14px (0.875rem)` | Medium (`500`) | `20px` | `0em` | Button text, table headers, navigation links |
| **Secondary / Caption** | `12px (0.75rem)` | Regular (`400`) | `16px` | `0.01em` | Timestamps, badge labels, helper text |
| **Micro Badge** | `11px (0.6875rem)` | Medium (`500`) | `14px` | `0.02em` | Compact task pills, unread count badge |

---

### 2.3 Spacing Scale

A rigid 4px/8px-based spacing scale guarantees vertical rhythm across components and pages.

```css
--space-1: 4px;    /* Micro gaps between icons and labels */
--space-2: 8px;    /* Compact element padding, badge padding */
--space-3: 12px;   /* Standard input padding, list item gap */
--space-4: 16px;   /* Card body padding, grid gaps */
--space-5: 20px;   /* Modal padding, container padding */
--space-6: 24px;   /* Page section spacing, large card gaps */
--space-8: 32px;   /* Page content outer padding */
--space-12: 48px;  /* Auth layout margins, hero top gap */
```

---

### 2.4 Borders & Radius

* **Border Thickness**: `1px` default (`2px` for focused inputs/active tabs).
* **Border Style**: `solid`
* **Default Border Color**: `--color-border` (`#e2e8f0`)

```css
--radius-sm: 4px;     /* Small badges, button icons, form checkboxes */
--radius-md: 6px;     /* Standard buttons, input fields, select dropdowns */
--radius-lg: 8px;     /* Cards, modals, slide-over drawers, table containers */
--radius-xl: 12px;    /* Large panel containers, onboarding cards */
--radius-pill: 9999px;/* Round avatars, pill status badges */
```

---

### 2.5 Elevation & Shadows

Shadows are subtle and functional, used strictly to lift floating elements (dropdowns, popovers, modals) above page background content.

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);           /* Flat cards, buttons on hover */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 
             0 2px 4px -1px rgba(0, 0, 0, 0.04);         /* Dropdowns, popovers, task cards */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05);         /* Modals, slide-over drawers */
```

---

## 3. Component Design Language

Every component follows strict visual, spacing, typography, and state rules.

### 3.1 Buttons
* **Primary Button**: Background `--color-primary`, text `#ffffff`. Hover `--color-primary-hover`. Focus 2px ring `--color-primary-subtle`.
* **Secondary Button**: Background `#ffffff`, border `1px solid --color-border`, text `--color-text-primary`. Hover background `--color-bg-subtle`.
* **Ghost / Icon Button**: Transparent background, text `--color-text-secondary`. Hover background `--color-bg-subtle`, text `--color-text-primary`.
* **Danger Button**: Background `--color-danger`, text `#ffffff`. Hover `--color-danger` dark.

### 3.2 Form Inputs & Selects
* **Visual Treatment**: Background `#ffffff` (or `--color-bg-surface`), border `1px solid --color-border`, radius `--radius-md` (6px), font size `14px`, padding `10px 14px`.
* **Focus State**: Border changes to `--color-primary` with `0 0 0 3px --color-primary-subtle` focus ring.
* **Error State**: Border changes to `--color-danger`, inline helper text `--color-danger`.

### 3.3 Status & Priority Badges
* **Status Badges**: Pill radius (`9999px`), padding `3px 10px`, font size `12px`, weight `500`. Uses status-specific background and text color tokens.
* **Priority Badges**: Includes priority indicator icon/dot paired with label text. Uses priority-specific color tokens.

### 3.4 Cards (Project & Task Cards)
* **Visual Treatment**: Background `--color-bg-surface` (`#ffffff`), border `1px solid --color-border`, radius `--radius-lg` (8px), padding `16px`.
* **Hover Behavior**: Subtle border hover `--color-border-hover` and shadow `--shadow-sm`. No dramatic scaling or 3D rotations.

### 3.5 Modals & Slide-Over Drawers
* **Overlay Backdrop**: `rgba(15, 23, 42, 0.5)` (Slate 900 50% opacity backdrop).
* **Container**: Background `#ffffff`, radius `--radius-lg` (8px), shadow `--shadow-lg`, clean header with close icon (`X`).

---

## 4. Navigation System & Sidebar Layout

### 4.1 Application Shell Architecture
* **Sidebar Navigation**: Fixed left-hand panel (Width: `240px` on Desktop).
  - Background: `--color-bg-surface` (`#ffffff`) with right border `1px solid --color-border`.
  - Brand Area: "SMART TASK FLOW" logo & application title.
  - Active Item: Background `--color-primary-subtle`, left active indicator bar `3px solid --color-primary`, text `--color-primary` (weight `600`).
  - Inactive Items: Text `--color-text-secondary`, hover background `--color-bg-subtle`.
* **Top Header Bar**: Fixed top panel (Height: `64px`).
  - Contains breadcrumbs/page title, global search bar, notification popover button with unread count badge, and current user avatar dropdown.

### 4.2 Navigation Mapping (Backend Supported vs Unsupported)

| Navigation Item | Associated Route | Backend Support Status | Notes |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `/dashboard` | ✅ **Supported** | Main metrics overview & task list |
| **Projects** | `/projects` | ✅ **Supported** | Projects grid & management |
| **My Tasks** | `/my-tasks` | ✅ **Supported** | Cross-project user task list |
| **Notifications** | `/notifications` | ✅ **Supported** | Notification center |
| **Profile** | `/profile` | ✅ **Supported** | Read-only profile view |
| *Calendar* | N/A | ❌ **Visual-Only Reference** | *Not supported by current backend API* |
| *Analytics / Reports* | N/A | ❌ **Visual-Only Reference** | *Not supported by current backend API* |
| *Sprint Planning* | N/A | ❌ **Visual-Only Reference** | *Not supported by current backend API* |
| *File Storage* | N/A | ❌ **Visual-Only Reference** | *Not supported by current backend API* |

---

## 5. Authentication Screen Design

Derived from the approved Login visual reference.

* **Layout**: Centered card layout (`max-width: 420px`) on `--color-bg-app` background.
* **Branding**: Smart Task Flow icon + title + subtitle ("Sign in to your account").
* **Form Inputs**: Email input, Password input with toggle show/hide icon.
* **Primary Action**: Full-width Primary Button ("Sign In").
* **Social Login Buttons**: Visually styled "Sign in with Google" and "Sign in with Microsoft" buttons.
  - *Note*: Social login buttons are marked as **Visual-Only Reference (Future SSO Integration)** because the current backend REST API supports email/password authentication only.
* **Footer Link**: "Don't have an account? Sign up" pointing to `/register`.

---

## 6. Supported Backend Features vs. Visual-Only References

To maintain absolute data integrity, the frontend distinguishes between supported backend features and unsupported reference elements:

| UI Feature in Reference Screenshots | Supported by Current Backend? | Frontend Implementation Strategy |
| :--- | :--- | :--- |
| **User Login & Registration** | ✅ **YES** | REST calls to `/api/auth/login` and `/api/auth/register` |
| **Project CRUD & Team Management** | ✅ **YES** | REST calls to `/api/projects` and member endpoints |
| **Kanban Board & Task CRUD** | ✅ **YES** | REST calls to `/api/projects/{id}/tasks` and `/api/tasks/{id}` |
| **Task Status / Priority / Assignee / Due Date Patching** | ✅ **YES** | REST PATCH calls to task endpoints |
| **Task Comments Thread** | ✅ **YES** | REST calls to `/api/tasks/{id}/comments` and `/api/comments/{id}` |
| **In-App Notification Center** | ✅ **YES** | REST calls to `/api/notifications` |
| **Read-Only Profile View** | ✅ **YES** | REST call to `GET /api/users/me` |
| *OAuth Social Login (Google/Microsoft)* | ❌ **NO (Visual Reference Only)** | Rendered as disabled/future integration buttons or omitted in MVP |
| *Standalone Activity Feed* | ❌ **NO (Visual Reference Only)** | Removed from current scope; documented as future backend feature |
| *Realtime WebSockets / SSE* | ❌ **NO (Visual Reference Only)** | Uses REST polling (30s) & action refetches |
| *Subtasks / Checklists* | ❌ **NO (Visual Reference Only)** | Omitted in task drawer; documented for future backend update |
| *File Attachments Storage* | ❌ **NO (Visual Reference Only)** | Omitted in task drawer; documented for future backend update |

---

## 7. Responsive Design Breakpoints

The UI adapts gracefully across three standard viewport tiers without layout breaking:

```
Desktop:  >= 1200px  (Full multi-column layout, persistent 240px sidebar, 4-column Kanban)
Tablet:   768px–1199px (Condensed 64px icon sidebar or drawer, 2-column project grid, 2-column Kanban)
Mobile:   < 768px   (Hidden sidebar with hamburger header toggle, 1-column layouts, single-column tabbed Kanban)
```

---

## 8. Accessibility Requirements (WCAG 2.1 AA)

1. **Color Contrast**: All text elements satisfy a minimum contrast ratio of 4.5:1 against their backgrounds (7:1 for headers).
2. **Keyboard Focus States**: Focused interactive elements display a distinct 2px blue focus outline (`outline: 2px solid #2563eb; outline-offset: 2px`).
3. **Dual-Coding for Status/Priority**: Statuses and priorities use both text labels and color badges (never color alone).
4. **Form Labels & Error Associations**: All inputs have explicit `<label>` tags and `aria-describedby` pointing to error message IDs.
5. **Icon-Only Buttons**: Any button containing only an icon has an explicit `aria-label="Action description"`.

---

## 9. CSS Design Token Implementation Guidelines

All design tokens are implemented in `frontend/src/styles/index.css` using standard CSS Custom Properties. Component utility classes are declared in `frontend/src/styles/components.css`. No external styling libraries (like TailwindCSS or Bootstrap) are introduced.
