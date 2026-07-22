import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions
export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  performance: number; // 0-100
  availability: 'available' | 'busy' | 'ooo';
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface TaskComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  labels: string[];
  assignee: Member;
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  progress: number;
}

export interface ProjectComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface ProjectActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'paused';
  progress: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  members: Member[];
  category: string;
  comments: ProjectComment[];
  activity: ProjectActivity[];
  files: ProjectFile[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  file?: { name: string; size: string; type: string };
}

export interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
  members: string[];
  messages: ChatMessage[];
  unreadCount: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type PageView =
  | 'landing'
  | 'login'
  | 'register'
  | 'workspace-select'
  | 'dashboard'
  | 'projects'
  | 'project-details'
  | 'tasks'
  | 'team'
  | 'analytics'
  | 'billing'
  | 'messages'
  | 'files'
  | 'profile'
  | 'settings'
  | 'admin';

interface AppContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  currentWorkspace: string;
  setCurrentWorkspace: (workspace: string) => void;
  workspaces: string[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Data State
  members: Member[];
  projects: Project[];
  tasks: Task[];
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  notifications: SystemNotification[];
  toasts: ToastMessage[];
  
  // Handlers
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  createProject: (project: Omit<Project, 'id' | 'progress' | 'comments' | 'activity' | 'files'>) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  addProjectComment: (projectId: string, text: string) => void;
  addProjectFile: (projectId: string, file: Omit<ProjectFile, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  
  createTask: (task: Omit<Task, 'id' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  addTaskChecklistItem: (taskId: string, text: string) => void;
  toggleTaskChecklistItem: (taskId: string, itemId: string) => void;
  addTaskComment: (taskId: string, text: string) => void;
  deleteTask: (taskId: string) => void;
  
  sendChatMessage: (conversationId: string, text: string, file?: ChatMessage['file']) => void;
  markNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;

  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Mock Team Members
const mockMembers: Member[] = [
  { id: 'm1', name: 'Alex Rivera', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', email: 'alex@acme.com', status: 'online', performance: 94, availability: 'available' },
  { id: 'm2', name: 'Sarah Chen', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', email: 'sarah.c@acme.com', status: 'online', performance: 98, availability: 'available' },
  { id: 'm3', name: 'Marcus Johnson', role: 'UX Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', email: 'marcus.j@acme.com', status: 'away', performance: 88, availability: 'busy' },
  { id: 'm4', name: 'Elena Rostova', role: 'QA Engineer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', email: 'elena@acme.com', status: 'online', performance: 92, availability: 'available' },
  { id: 'm5', name: 'David Kim', role: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', email: 'david.k@acme.com', status: 'offline', performance: 90, availability: 'ooo' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [currentWorkspace, setCurrentWorkspace] = useState<string>('Acme Corp HQ');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const workspaces = ['Acme Corp HQ', 'Personal Projects', 'Client Work'];

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync theme with HTML tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toast Handlers
  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Projects State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'p1',
      name: 'Phoenix Redesign',
      description: 'Complete visual and architectural overhaul of the Phoenix core product platform, integrating shadcn and glassmorphism elements.',
      status: 'active',
      progress: 68,
      priority: 'high',
      dueDate: '2026-08-15',
      members: [mockMembers[0], mockMembers[1], mockMembers[2]],
      category: 'Development',
      comments: [
        { id: 'c1', user: 'Sarah Chen', avatar: mockMembers[1].avatar, text: 'Vite migration is complete. Working on tailwind configuration next.', timestamp: '2 hours ago' },
        { id: 'c2', user: 'Alex Rivera', avatar: mockMembers[0].avatar, text: 'Awesome. Can we review the new dashboard mockups this Thursday?', timestamp: '1 hour ago' }
      ],
      activity: [
        { id: 'act1', user: 'Sarah Chen', action: 'completed milestone', target: 'Vite Upgrade', timestamp: '2 hours ago' },
        { id: 'act2', user: 'Marcus Johnson', action: 'uploaded file', target: 'dashboard-layout.fig', timestamp: '5 hours ago' }
      ],
      files: [
        { id: 'f1', name: 'dashboard-layout.fig', size: '14.2 MB', type: 'Figma Design', uploadedBy: 'Marcus Johnson', uploadedAt: '5 hours ago' },
        { id: 'f2', name: 'project-brief.pdf', size: '1.8 MB', type: 'PDF Document', uploadedBy: 'Alex Rivera', uploadedAt: '1 day ago' }
      ]
    },
    {
      id: 'p2',
      name: 'Aether Marketing Site',
      description: 'Designing and building the search engine optimized marketing platform for Aether Analytics SaaS product.',
      status: 'planning',
      progress: 25,
      priority: 'medium',
      dueDate: '2026-09-01',
      members: [mockMembers[0], mockMembers[2], mockMembers[3]],
      category: 'Marketing',
      comments: [],
      activity: [
        { id: 'act3', user: 'Alex Rivera', action: 'created project', target: 'Aether Marketing Site', timestamp: 'Yesterday' }
      ],
      files: [
        { id: 'f3', name: 'seo-strategy.docx', size: '420 KB', type: 'Word Doc', uploadedBy: 'Alex Rivera', uploadedAt: 'Yesterday' }
      ]
    },
    {
      id: 'p3',
      name: 'Sentinel Security Audit',
      description: 'Annual penetration testing, vulnerability scanning, and security patch application for server infrastructure.',
      status: 'review',
      progress: 90,
      priority: 'high',
      dueDate: '2026-07-30',
      members: [mockMembers[1], mockMembers[4]],
      category: 'Operations',
      comments: [
        { id: 'c3', user: 'David Kim', avatar: mockMembers[4].avatar, text: 'All major port scans came back clean. Checking firewalls next.', timestamp: '1 day ago' }
      ],
      activity: [
        { id: 'act4', user: 'David Kim', action: 'updated status to', target: 'Review Required', timestamp: '1 day ago' }
      ],
      files: [
        { id: 'f4', name: 'pentest-report-draft.pdf', size: '4.5 MB', type: 'PDF Report', uploadedBy: 'David Kim', uploadedAt: '1 day ago' }
      ]
    }
  ]);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      projectId: 'p1',
      title: 'Upgrade bundle manager to Vite',
      description: 'Replace the existing Webpack bundler with Vite to achieve ultra-fast Hot Module Replacement and light builds.',
      status: 'done',
      priority: 'high',
      dueDate: '2026-07-20',
      labels: ['Tech Debt', 'Dev'],
      assignee: mockMembers[1],
      checklist: [
        { id: 'ch1', text: 'Initialize Vite config', checked: true },
        { id: 'ch2', text: 'Port env files', checked: true },
        { id: 'ch3', text: 'Verify dynamic imports', checked: true }
      ],
      comments: [
        { id: 'tc1', user: 'Sarah Chen', avatar: mockMembers[1].avatar, text: 'Build times decreased by 74%! HMR works under 100ms.', timestamp: 'Yesterday' }
      ],
      progress: 100
    },
    {
      id: 't2',
      projectId: 'p1',
      title: 'Design Dashboard Wireframes',
      description: 'Create Figma wireframes showing glassmorphic layout, metrics graphs, sidebar links, and light/dark configurations.',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-07-25',
      labels: ['Design', 'UX'],
      assignee: mockMembers[2],
      checklist: [
        { id: 'ch4', text: 'Desktop sidebar design', checked: true },
        { id: 'ch5', text: 'Responsive mobile layout', checked: false },
        { id: 'ch6', text: 'Dark mode styling rules', checked: false }
      ],
      comments: [],
      progress: 33
    },
    {
      id: 't3',
      projectId: 'p1',
      title: 'Create React Global State Context',
      description: 'Build AppContext provider mapping projects, tasks, user metadata, notifications, and application settings.',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2026-07-28',
      labels: ['Dev', 'Architecture'],
      assignee: mockMembers[1],
      checklist: [
        { id: 'ch7', text: 'Define TS Types', checked: true },
        { id: 'ch8', text: 'Write mock dataset', checked: true },
        { id: 'ch9', text: 'Expose state actions', checked: false }
      ],
      comments: [],
      progress: 66
    },
    {
      id: 't4',
      projectId: 'p2',
      title: 'Draft landing copy and hero text',
      description: 'Draft the sales narrative highlighting value props, pricing structure tiers, and platform features.',
      status: 'todo',
      priority: 'low',
      dueDate: '2026-08-05',
      labels: ['Copywriting'],
      assignee: mockMembers[0],
      checklist: [
        { id: 'ch10', text: 'Draft Hero Section', checked: false },
        { id: 'ch11', text: 'Feature checklist outline', checked: false }
      ],
      comments: [],
      progress: 0
    },
    {
      id: 't5',
      projectId: 'p3',
      title: 'Firewall rules penetration check',
      description: 'Run scanning scripts against external gateways to ensure closed ports and security settings.',
      status: 'review',
      priority: 'high',
      dueDate: '2026-07-24',
      labels: ['Security', 'Ops'],
      assignee: mockMembers[4],
      checklist: [
        { id: 'ch12', text: 'Nmap vulnerability scan', checked: true }
      ],
      comments: [],
      progress: 100
    },
    {
      id: 't6',
      projectId: 'p1',
      title: 'Setup Eslint and formatting rules',
      description: 'Install Prettier and configure custom ESLint configs supporting React Compiler and TS checks.',
      status: 'backlog',
      priority: 'low',
      dueDate: '2026-08-10',
      labels: ['Chore'],
      assignee: mockMembers[3],
      checklist: [],
      comments: [],
      progress: 0
    }
  ]);

  // Chat Conversations State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c_general',
      name: '# general-announcements',
      isGroup: true,
      members: ['m1', 'm2', 'm3', 'm4', 'm5'],
      messages: [
        { id: 'm_1', senderId: 'm1', text: 'Welcome everyone to the Acme Corp SaaS platform redesign workspace! Let\'s use this channel for global announcements.', timestamp: '2 days ago' },
        { id: 'm_2', senderId: 'm2', text: 'Excited to be working on this! Vite upgrade is already completed on branch main.', timestamp: '1 day ago' },
        { id: 'm_3', senderId: 'm3', text: 'Draft wireframes will be ready for review tomorrow morning.', timestamp: '4 hours ago' }
      ],
      unreadCount: 0
    },
    {
      id: 'c_dev',
      name: '# dev-team',
      isGroup: true,
      members: ['m2', 'm4', 'm5'],
      messages: [
        { id: 'md_1', senderId: 'm5', text: 'Are the Docker containers updated for the staging environments?', timestamp: 'Yesterday' },
        { id: 'md_2', senderId: 'm2', text: 'Yes, David. Pulled the latest Node image and set up build arguments.', timestamp: 'Yesterday' }
      ],
      unreadCount: 2
    },
    {
      id: 'c_sarah',
      name: 'Sarah Chen',
      isGroup: false,
      members: ['me', 'm2'],
      messages: [
        { id: 'ms_1', senderId: 'm2', text: 'Hi, do you need help with setting up the global context structure?', timestamp: 'Yesterday' },
        { id: 'ms_2', senderId: 'me', text: 'Yes, please! Especially matching standard types with project models.', timestamp: 'Yesterday' },
        { id: 'ms_3', senderId: 'm2', text: 'I created a boilerplate for mock data inside AppContext. Let me know if that works.', timestamp: '5 mins ago' }
      ],
      unreadCount: 0
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>('c_general');

  // Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: 'n1', title: 'Task Completed', description: 'Sarah Chen completed "Upgrade bundle manager to Vite"', type: 'success', timestamp: '2 hours ago', read: false },
    { id: 'n2', title: 'Mentioned in Chat', description: 'Marcus Johnson tagged you in #general-announcements', type: 'info', timestamp: '4 hours ago', read: false },
    { id: 'n3', title: 'Due Date Approaching', description: 'Sentinel Security Audit is due in 3 days', type: 'warning', timestamp: '1 day ago', read: true }
  ]);

  // Project Actions
  const createProject = (projectData: Omit<Project, 'id' | 'progress' | 'comments' | 'activity' | 'files'>) => {
    const newProject: Project = {
      ...projectData,
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      progress: 0,
      comments: [],
      activity: [{ id: 'act_' + Date.now(), user: 'You', action: 'created project', target: projectData.name, timestamp: 'Just now' }],
      files: []
    };
    setProjects((prev) => [newProject, ...prev]);
    addToast(`Project "${projectData.name}" created successfully!`, 'success');
  };

  const updateProjectProgress = (projectId: string, progress: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, progress } : p))
    );
  };

  const addProjectComment = (projectId: string, text: string) => {
    const newComment: ProjectComment = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      text,
      timestamp: 'Just now'
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              comments: [...p.comments, newComment],
              activity: [
                { id: 'act_' + Date.now(), user: 'You', action: 'commented on', target: p.name, timestamp: 'Just now' },
                ...p.activity
              ]
            }
          : p
      )
    );
    addToast('Comment posted.', 'success');
  };

  const addProjectFile = (projectId: string, fileData: Omit<ProjectFile, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newFile: ProjectFile = {
      ...fileData,
      id: 'f_' + Math.random().toString(36).substr(2, 9),
      uploadedBy: 'You',
      uploadedAt: 'Just now'
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              files: [newFile, ...p.files],
              activity: [
                { id: 'act_' + Date.now(), user: 'You', action: 'uploaded file', target: fileData.name, timestamp: 'Just now' },
                ...p.activity
              ]
            }
          : p
      )
    );
    addToast(`File "${fileData.name}" uploaded successfully.`, 'success');
  };

  // Task Actions
  const createTask = (taskData: Omit<Task, 'id' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: 't_' + Math.random().toString(36).substr(2, 9),
      comments: []
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast(`Task "${taskData.title}" created.`, 'success');
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (t.status !== newStatus) {
            // Trigger toast alert for movement
            const statusLabels = {
              backlog: 'Backlog',
              todo: 'To Do',
              in_progress: 'In Progress',
              review: 'In Review',
              done: 'Done'
            };
            addToast(`"${t.title}" moved to ${statusLabels[newStatus]}`, 'success');
            
            // Add activity log to matching project
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.id === t.projectId
                  ? {
                      ...p,
                      activity: [
                        { id: 'act_' + Date.now(), user: 'You', action: `moved task "${t.title}" to`, target: statusLabels[newStatus], timestamp: 'Just now' },
                        ...p.activity
                      ]
                    }
                  : p
              )
            );
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, progress } : t))
    );
  };

  const addTaskChecklistItem = (taskId: string, text: string) => {
    const newItem: TaskChecklistItem = {
      id: 'ch_' + Math.random().toString(36).substr(2, 9),
      text,
      checked: false
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newChecklist = [...t.checklist, newItem];
          const completedCount = newChecklist.filter((c) => c.checked).length;
          const progress = newChecklist.length > 0 ? Math.round((completedCount / newChecklist.length) * 100) : 0;
          return { ...t, checklist: newChecklist, progress };
        }
        return t;
      })
    );
  };

  const toggleTaskChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newChecklist = t.checklist.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          );
          const completedCount = newChecklist.filter((c) => c.checked).length;
          const progress = newChecklist.length > 0 ? Math.round((completedCount / newChecklist.length) * 100) : 0;
          return { ...t, checklist: newChecklist, progress };
        }
        return t;
      })
    );
  };

  const addTaskComment = (taskId: string, text: string) => {
    const newComment: TaskComment = {
      id: 'tc_' + Math.random().toString(36).substr(2, 9),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      text,
      timestamp: 'Just now'
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t))
    );
    addToast('Task comment added.', 'success');
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('Task deleted successfully.', 'warning');
  };

  // Chat Actions
  const sendChatMessage = (conversationId: string, text: string, file?: ChatMessage['file']) => {
    const newMessage: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      text,
      timestamp: 'Just now',
      file
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );

    // Simulate reply if direct chat or channel
    if (conversationId === 'c_sarah') {
      setTimeout(() => {
        const replyMessage: ChatMessage = {
          id: 'msg_reply_' + Math.random().toString(36).substr(2, 9),
          senderId: 'm2',
          text: "Sure, let's look at the component structure. I think our layout looks extremely clean in dark mode!",
          timestamp: 'Just now'
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === 'c_sarah' ? { ...c, messages: [...c.messages, replyMessage] } : c
          )
        );
        addToast('New message from Sarah Chen', 'info');
      }, 3000);
    }
  };

  // Notifications Actions
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read.', 'success');
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentPage,
        setCurrentPage,
        currentWorkspace,
        setCurrentWorkspace,
        workspaces,
        sidebarCollapsed,
        setSidebarCollapsed,
        members: mockMembers,
        projects,
        tasks,
        conversations,
        activeConversationId,
        setActiveConversationId,
        notifications,
        toasts,
        addToast,
        removeToast,
        createProject,
        updateProjectProgress,
        addProjectComment,
        addProjectFile,
        createTask,
        updateTaskStatus,
        updateTaskProgress,
        addTaskChecklistItem,
        toggleTaskChecklistItem,
        addTaskComment,
        deleteTask,
        sendChatMessage,
        markNotificationsAsRead,
        clearNotification,
        selectedProjectId,
        setSelectedProjectId,
        selectedTaskId,
        setSelectedTaskId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
