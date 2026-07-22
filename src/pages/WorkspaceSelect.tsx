import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  User, 
  Briefcase, 
  Plus, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';

export const WorkspaceSelect: React.FC = () => {
  const { 
    setCurrentPage, 
    setCurrentWorkspace, 
    addToast 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [workspaces, setWorkspaces] = useState<
    { name: string; type: 'org' | 'personal' | 'client'; projectsCount: number; membersCount: number }[]
  >([
    { name: 'Acme Corp HQ', type: 'org', projectsCount: 3, membersCount: 5 },
    { name: 'Personal Projects', type: 'personal', projectsCount: 1, membersCount: 1 },
    { name: 'Client Work', type: 'client', projectsCount: 2, membersCount: 3 }
  ]);

  const handleSelect = (name: string) => {
    setCurrentWorkspace(name);
    addToast(`Switched workspace to: ${name}`, 'success');
    setCurrentPage('dashboard');
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const newWs = {
      name: newWorkspaceName,
      type: 'personal' as const,
      projectsCount: 0,
      membersCount: 1
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setNewWorkspaceName('');
    setIsModalOpen(false);
    addToast(`Workspace "${newWorkspaceName}" created!`, 'success');
  };

  const icons = {
    org: <Building2 className="h-6 w-6 text-primary" />,
    personal: <User className="h-6 w-6 text-secondary" />,
    client: <Briefcase className="h-6 w-6 text-success" />
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 px-6 relative transition-colors duration-300">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-glow-blue blur-[110px] rounded-full pointer-events-none opacity-20" />
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-glow-purple blur-[110px] rounded-full pointer-events-none opacity-20" />

      <div className="w-full max-w-2xl mx-auto relative z-10 text-center">
        
        {/* Brand */}
        <div className="flex flex-col items-center gap-3.5 mb-10 select-none">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold shadow-md shadow-primary/20">
            A
          </div>
          <span className="font-extrabold text-2xl tracking-tight">Antigravity Projects</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Choose your workspace</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Select an existing hub or configure a new organization space.
          </p>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 mb-8">
          {workspaces.map((ws) => (
            <button
              key={ws.name}
              onClick={() => handleSelect(ws.name)}
              className="group p-6 rounded-2xl glass-card text-left flex flex-col justify-between gap-6 cursor-pointer w-full"
            >
              <div className="flex items-start justify-between w-full">
                <div className="h-11 w-11 rounded-xl bg-card border border-border/80 flex items-center justify-center shadow-sm">
                  {icons[ws.type]}
                </div>
                <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                  <ArrowRight className="h-4.5 w-4.5 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-foreground text-base tracking-wide leading-tight group-hover:text-primary transition-colors">
                  {ws.name}
                </h3>
                <div className="flex items-center gap-3.5 mt-2.5 text-xs text-muted-foreground">
                  <span>{ws.projectsCount} {ws.projectsCount === 1 ? 'Project' : 'Projects'}</span>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  <span>{ws.membersCount} {ws.membersCount === 1 ? 'Member' : 'Members'}</span>
                </div>
              </div>
            </button>
          ))}

          {/* Create New Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-6 rounded-2xl border border-dashed border-border/80 bg-background/20 hover:bg-card/40 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer w-full min-h-[170px]"
          >
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm block text-foreground">Create Workspace</span>
              <span className="text-[11px] text-muted-foreground block mt-1">Spin up a brand new board</span>
            </div>
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => setCurrentPage('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-error hover:bg-error/5 px-4.5 py-2.5 rounded-xl border border-transparent hover:border-error/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>

      </div>

      {/* Create Workspace Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Workspace"
      >
        <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Apollo Team Space"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            required
            autoFocus
          />

          <div className="flex gap-3.5 justify-end mt-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Workspace
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
