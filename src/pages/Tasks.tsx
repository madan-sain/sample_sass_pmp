import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Task } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Calendar as CalIcon, 
  CheckSquare, 
  Grid, 
  List as ListIcon, 
  Trash
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Sheet } from '../components/ui/Sheet';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';

export const Tasks: React.FC = () => {
  const {
    tasks,
    projects,
    members,
    createTask,
    updateTaskStatus,
    toggleTaskChecklistItem,
    addTaskChecklistItem,
    addTaskComment,
    deleteTask,
    selectedTaskId,
    setSelectedTaskId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [search, setSearch] = useState('');
  
  // Create Task Modal fields
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjId, setTaskProjId] = useState(projects[0]?.id || '');
  const [taskPrio, setTaskPrio] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDue, setTaskDue] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState(members[0]?.id || '');

  // Checklist / Comment inputs in drawer
  const [newCheckItemText, setNewCheckItemText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const currentTask = tasks.find((t) => t.id === selectedTaskId);

  // Filtered tasks
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop!
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    const id = e.dataTransfer.getData('taskId');
    if (id) {
      updateTaskStatus(id, status);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const assignee = members.find((m) => m.id === taskAssigneeId) || members[0];

    createTask({
      projectId: taskProjId,
      title: taskTitle,
      description: taskDesc,
      status: 'todo',
      priority: taskPrio,
      dueDate: taskDue || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      labels: ['Feature'],
      assignee,
      checklist: [],
      progress: 0
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskDue('');
    setIsCreateModalOpen(false);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItemText.trim() || !selectedTaskId) return;
    addTaskChecklistItem(selectedTaskId, newCheckItemText);
    setNewCheckItemText('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTaskId) return;
    addTaskComment(selectedTaskId, newCommentText);
    setNewCommentText('');
  };

  const columns: { status: Task['status']; title: string; color: string }[] = [
    { status: 'backlog', title: 'Backlog', color: 'border-t-purple-500' },
    { status: 'todo', title: 'To Do', color: 'border-t-blue-500' },
    { status: 'in_progress', title: 'In Progress', color: 'border-t-amber-500' },
    { status: 'review', title: 'In Review', color: 'border-t-orange-500' },
    { status: 'done', title: 'Completed', color: 'border-t-green-500' }
  ];

  const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'success'
  } as const;

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Sprints & Kanban Workspace</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure backlog milestones and team workflows.</p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2.5">
          <Plus className="h-4.5 w-4.5" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:max-w-md relative">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs"
          />
        </div>

        {/* View toggles tabs */}
        <div className="border border-border/80 rounded-xl p-1 bg-background/50 flex gap-0.5 select-none shrink-0 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === 'kanban' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid className="h-3.8 w-3.8" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ListIcon className="h-3.8 w-3.8" />
            <span>List Table</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === 'calendar' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <CalIcon className="h-3.8 w-3.8" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {/* View Contents */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4.5 items-start mt-2">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
                className={`
                  flex flex-col gap-3 p-3.5 rounded-2xl bg-card/40 border border-border/50 min-h-[500px] border-t-3 ${col.color}
                `}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-1.5 pb-1">
                  <span className="text-xs font-extrabold text-foreground tracking-wide capitalize flex items-center gap-1.5">
                    {col.title}
                  </span>
                  <span className="h-5 w-5 rounded-full bg-accent/60 text-[10px] font-extrabold text-muted-foreground flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards list */}
                <div className="flex flex-col gap-2.5 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all select-none text-left flex flex-col gap-3 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-wrap gap-1">
                          {t.labels.map((lbl) => (
                            <span key={lbl} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-extrabold tracking-wider uppercase">
                              {lbl}
                            </span>
                          ))}
                        </div>
                        <Badge variant={priorityColors[t.priority]}>{t.priority}</Badge>
                      </div>

                      <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {t.title}
                      </h4>

                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>

                      {/* Checklist count progress */}
                      {t.checklist.length > 0 && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80 font-bold">
                          <CheckSquare className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {t.checklist.filter((item) => item.checked).length} / {t.checklist.length}
                          </span>
                        </div>
                      )}

                      {/* Card footer details */}
                      <div className="flex items-center justify-between border-t border-border/25 pt-3 mt-1 text-[9.5px] font-bold text-muted-foreground">
                        <span className="flex items-center gap-1 leading-none">
                          <CalIcon className="h-3.2 w-3.2 text-primary" />
                          {t.dueDate}
                        </span>
                        
                        <img
                          src={t.assignee.avatar}
                          alt={t.assignee.name}
                          title={t.assignee.name}
                          className="h-5.5 w-5.5 rounded-full object-cover border border-border"
                        />
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-12 border border-dashed border-border/40 rounded-xl text-center text-[10px] text-muted-foreground/60 italic font-medium">
                      Drag tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List Table View */}
      {activeTab === 'list' && (
        <div className="border border-border/60 bg-card/45 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs select-none">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80 font-bold uppercase tracking-wider">
                  <th className="p-4 font-bold">Task Name</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Priority</th>
                  <th className="p-4 font-bold">Due Date</th>
                  <th className="p-4 font-bold">Assignee</th>
                  <th className="p-4 font-bold text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {filteredTasks.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-accent/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedTaskId(t.id)}
                  >
                    <td className="p-4">
                      <div className="font-bold text-foreground hover:underline text-sm">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-xs">{t.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-accent text-foreground font-semibold text-[10px]">
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={priorityColors[t.priority]}>{t.priority}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground font-semibold">{t.dueDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={t.assignee.avatar} alt={t.assignee.name} className="h-6 w-6 rounded-full object-cover border border-border" />
                        <span className="font-medium text-foreground/80">{t.assignee.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="font-bold">{t.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View representation */}
      {activeTab === 'calendar' && (
        <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/25 pb-3">
            <span className="text-sm font-bold text-foreground">July 2026</span>
            <span className="text-xs text-muted-foreground">Month Grid</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-bold text-muted-foreground select-none">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
              <span key={d} className="pb-1 text-[10px] uppercase tracking-wider">{d.slice(0, 3)}</span>
            ))}

            {Array.from({ length: 31 }, (_, i) => {
              const day = i - 2; // Offset
              const isValid = day >= 1;
              const isToday = day === 21;
              const dayTasks = tasks.filter((t) => isValid && parseInt(t.dueDate.split('-')[2]) === day);

              return (
                <div
                  key={i}
                  className={`
                    border border-border/40 rounded-xl p-2 min-h-[90px] flex flex-col gap-1.5 text-left relative
                    ${isToday ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/10' : 'bg-background/25'}
                    ${!isValid ? 'opacity-0 pointer-events-none' : ''}
                  `}
                >
                  <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{isValid ? day : ''}</span>
                  
                  {/* Task tags in calendar date */}
                  <div className="flex flex-col gap-1 overflow-hidden flex-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <button
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTaskId(t.id);
                        }}
                        className="text-[9px] font-extrabold truncate px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 text-left cursor-pointer border border-primary/15"
                      >
                        {t.title}
                      </button>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[8px] text-muted-foreground/80 font-bold pl-1">+{dayTasks.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Sprint Task"
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement dynamic alerts"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Description"
            placeholder="Details of the scope..."
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Project Link"
              value={taskProjId}
              onChange={(e) => setTaskProjId(e.target.value)}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />

            <Select
              label="Assignee"
              value={taskAssigneeId}
              onChange={(e) => setTaskAssigneeId(e.target.value)}
              options={members.map((m) => ({ value: m.id, label: m.name }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={taskPrio}
              onChange={(e) => setTaskPrio(e.target.value as any)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />

            <Input
              label="Due Date"
              type="date"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end mt-3">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Task Details Drawer Sheet */}
      <Sheet
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
        title="Sprint Task Details"
      >
        {currentTask && (
          <div className="flex flex-col gap-5 text-left text-xs">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-extrabold uppercase tracking-wide">
                  {projects.find((p) => p.id === currentTask.projectId)?.name || 'Project'}
                </span>
                <Badge variant={priorityColors[currentTask.priority]}>{currentTask.priority}</Badge>
                <span className="capitalize px-1.5 py-0.5 rounded bg-muted text-[8.5px] font-bold">{currentTask.status.replace('_', ' ')}</span>
              </div>
              <h2 className="text-base font-extrabold text-foreground">{currentTask.title}</h2>
              <p className="text-muted-foreground leading-relaxed mt-2.5">{currentTask.description}</p>
            </div>

            <div className="border-t border-border/30 pt-4 flex justify-between gap-3 text-[11px] font-bold">
              <div>
                <span className="text-[9px] text-muted-foreground uppercase block mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  <img src={currentTask.assignee.avatar} className="h-6.5 w-6.5 rounded-full object-cover" />
                  <span>{currentTask.assignee.name}</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-muted-foreground uppercase block mb-1">Due Date</span>
                <div className="flex items-center gap-1.5 text-foreground mt-0.5">
                  <CalIcon className="h-4 w-4 text-primary" />
                  <span>{currentTask.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Checklist Section */}
            <div className="border-t border-border/30 pt-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Task Checklist</span>
              
              <div className="flex flex-col gap-2">
                {currentTask.checklist.map((item) => (
                  <Checkbox
                    key={item.id}
                    label={item.text}
                    checked={item.checked}
                    onChange={() => toggleTaskChecklistItem(currentTask.id, item.id)}
                  />
                ))}

                {currentTask.checklist.length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic font-medium">No items in the checklist yet.</p>
                )}
              </div>

              {/* Add checklist input */}
              <form onSubmit={handleAddChecklist} className="flex gap-2 items-center mt-1">
                <input
                  type="text"
                  placeholder="Add item..."
                  value={newCheckItemText}
                  onChange={(e) => setNewCheckItemText(e.target.value)}
                  className="flex-1 h-8 px-3 rounded-lg border border-border bg-background/50 text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                  required
                />
                <Button size="sm" type="submit" className="h-8">Add</Button>
              </form>
            </div>

            {/* Comments Section */}
            <div className="border-t border-border/30 pt-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Task Discussions</span>
              
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
                {currentTask.comments.map((tc) => (
                  <div key={tc.id} className="flex gap-2.5 text-[11px]">
                    <img src={tc.avatar} alt={tc.user} className="h-7 w-7 rounded-lg object-cover shrink-0 mt-0.5" />
                    <div className="flex-1 bg-background/50 border border-border/30 rounded-xl p-2.5">
                      <div className="flex justify-between font-bold text-[10px] mb-0.5">
                        <span className="text-foreground">{tc.user}</span>
                        <span className="text-muted-foreground/60">{tc.timestamp}</span>
                      </div>
                      <p className="text-foreground/90 font-medium leading-normal mt-0.5">{tc.text}</p>
                    </div>
                  </div>
                ))}

                {currentTask.comments.length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic font-medium py-2">No discussions yet.</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Discuss this task..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 h-8 px-3 rounded-lg border border-border bg-background/50 text-xs focus:outline-none focus:border-primary"
                  required
                />
                <Button size="sm" type="submit" className="h-8">Post</Button>
              </form>
            </div>

            {/* Delete button */}
            <div className="border-t border-border/30 pt-4 mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  deleteTask(currentTask.id);
                  setSelectedTaskId(null);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-error hover:bg-error/15 px-3.5 py-2 border border-error/25 hover:border-error/40 rounded-xl cursor-pointer transition-colors"
              >
                <Trash className="h-4.5 w-4.5" />
                <span>Delete Task</span>
              </button>
            </div>

          </div>
        )}
      </Sheet>

    </div>
  );
};
