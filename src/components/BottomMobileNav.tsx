import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  MessageSquare, 
  Plus
} from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';

export const BottomMobileNav: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    createTask,
    projects,
    addToast
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Avoid rendering bottom nav on landing and auth pages
  if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register' || currentPage === 'workspace-select') {
    return null;
  }


  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTask({
      projectId,
      title: taskTitle,
      description: 'Quick task added via mobile shortcut button.',
      status: 'todo',
      priority,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days out
      labels: ['Mobile Quick'],
      assignee: {
        id: 'me',
        name: 'Ethan Hunt',
        role: 'Team Lead',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        email: 'ethan@acme.com',
        status: 'online',
        performance: 100,
        availability: 'available'
      },
      checklist: [],
      progress: 0
    });

    setTaskTitle('');
    setIsModalOpen(false);
    addToast('Task created successfully!', 'success');
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 pointer-events-none select-none">
        <nav className="pointer-events-auto h-16 max-w-lg mx-auto rounded-2xl border border-border bg-card/85 backdrop-blur-lg flex items-center justify-around px-2 shadow-xl dark:shadow-black/50">
          
          {/* Dashboard */}
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${currentPage === 'dashboard' ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Home</span>
          </button>

          {/* Projects */}
          <button
            onClick={() => setCurrentPage('projects')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${currentPage === 'projects' || currentPage === 'project-details' ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FolderKanban className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Projects</span>
          </button>

          {/* Center Floating Plus Button */}
          <div className="relative -mt-8 flex items-center justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95 transition-all cursor-pointer pointer-events-auto"
              title="Add New Task"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {/* Tasks */}
          <button
            onClick={() => setCurrentPage('tasks')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${currentPage === 'tasks' ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <CheckSquare className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Tasks</span>
          </button>

          {/* Chat / Messages */}
          <button
            onClick={() => setCurrentPage('messages')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${currentPage === 'messages' ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[9px] font-bold mt-1">Chat</span>
          </button>

        </nav>
      </div>

      {/* Floating Add Task Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quick Create Task"
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Name"
            placeholder="What needs to be done?"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            autoFocus
          />

          <Select
            label="Project Link"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-semibold text-muted-foreground ml-0.5">Priority</span>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setPriority(prio)}
                  className={`
                    flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer
                    ${priority === prio
                      ? prio === 'low' ? 'bg-success/10 text-success border-success'
                        : prio === 'medium' ? 'bg-warning/10 text-warning border-warning'
                        : 'bg-error/10 text-error border-error'
                      : 'bg-background/40 text-muted-foreground border-border'
                    }
                  `}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};
