import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutGrid, 
  List, 
  Search, 
  Plus, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';

export const Projects: React.FC = () => {
  const {
    projects,
    createProject,
    setCurrentPage,
    setSelectedProjectId,
    members
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projPriority, setProjPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [projDueDate, setProjDueDate] = useState('');
  const [projCategory, setProjCategory] = useState('Development');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    createProject({
      name: projName,
      description: projDesc,
      status: 'planning',
      priority: projPriority,
      dueDate: projDueDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0], // 2 weeks default
      category: projCategory,
      members: [members[0], members[1]] // assign first two as default
    });

    setProjName('');
    setProjDesc('');
    setProjDueDate('');
    setIsModalOpen(false);
  };

  const statusColors = {
    planning: 'secondary',
    active: 'primary',
    review: 'warning',
    completed: 'success',
    paused: 'muted'
  } as const;

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Active Work Projects</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage and track your active workspace targets.</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2.5">
          <Plus className="h-4.5 w-4.5" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:max-w-md relative">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3.5 w-full sm:w-auto shrink-0 justify-end">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 text-xs py-1.5"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'planning', label: 'Planning' },
              { value: 'active', label: 'Active' },
              { value: 'review', label: 'In Review' },
              { value: 'completed', label: 'Completed' },
              { value: 'paused', label: 'Paused' }
            ]}
          />

          {/* Toggle buttons */}
          <div className="border border-border/80 rounded-xl p-1 bg-background/50 flex gap-0.5 select-none">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProjectId(p.id);
                setCurrentPage('project-details');
              }}
              className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-5 cursor-pointer text-left relative overflow-hidden group"
            >
              {/* Top Banner details */}
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{p.category}</span>
                <Badge variant={statusColors[p.status]}>{p.status}</Badge>
              </div>

              <div>
                <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors text-base tracking-wide leading-tight">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                  {p.description}
                </p>
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>Progress</span>
                  <span className="text-foreground">{p.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              {/* Card Footer details */}
              <div className="flex items-center justify-between border-t border-border/25 pt-4.5">
                {/* Members list avatars */}
                <div className="flex -space-x-2.5 overflow-hidden">
                  {p.members.map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar}
                      alt={m.name}
                      title={m.name}
                      className="inline-block h-6.5 w-6.5 rounded-full object-cover ring-2 ring-card"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[10.5px] font-bold text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Due {p.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="border border-border/60 bg-card/45 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs select-none">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80 font-bold uppercase tracking-wider">
                  <th className="p-4 font-bold">Project Name</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Progress</th>
                  <th className="p-4 font-bold">Due Date</th>
                  <th className="p-4 font-bold text-center">Members</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-accent/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setCurrentPage('project-details');
                    }}
                  >
                    <td className="p-4">
                      <div className="font-bold text-foreground hover:underline text-sm">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate">{p.description}</div>
                    </td>
                    <td className="p-4 text-muted-foreground font-semibold">{p.category}</td>
                    <td className="p-4">
                      <Badge variant={statusColors[p.status]}>{p.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="font-bold">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-semibold">{p.dueDate}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center -space-x-1.5">
                        {p.members.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            className="h-6 w-6 rounded-full object-cover ring-2 ring-card"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-accent/80 transition-colors cursor-pointer">
                        <ChevronRight className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="py-16 text-center border border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">No Projects Found</h4>
            <p className="text-xs text-muted-foreground mt-1">Try relaxing your search terms or filters.</p>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Project Name"
            placeholder="e.g. Phoenix Overhaul"
            value={projName}
            onChange={(e) => setProjName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Description"
            placeholder="Summary of the scope and deliverables..."
            value={projDesc}
            onChange={(e) => setProjDesc(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={projPriority}
              onChange={(e) => setProjPriority(e.target.value as any)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />

            <Select
              label="Category"
              value={projCategory}
              onChange={(e) => setProjCategory(e.target.value)}
              options={[
                { value: 'Development', label: 'Development' },
                { value: 'Design', label: 'Design' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Operations', label: 'Operations' }
              ]}
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={projDueDate}
            onChange={(e) => setProjDueDate(e.target.value)}
          />

          <div className="flex gap-3 justify-end mt-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
};
