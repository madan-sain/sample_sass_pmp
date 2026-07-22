import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Upload, 
  File,
  Send,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';

export const ProjectDetails: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setCurrentPage,
    addProjectComment,
    addProjectFile,
    tasks
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const project = projects.find((p) => p.id === selectedProjectId);
  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setCurrentPage('projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  // Filter tasks associated with this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedCount = projectTasks.filter((t) => t.status === 'done').length;
  const totalCount = projectTasks.length;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addProjectComment(project.id, commentText);
    setCommentText('');
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    addProjectFile(project.id, {
      name: fileName,
      size: fileSize || '1.2 MB',
      type: fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT'
    });

    setFileName('');
    setFileSize('');
    setIsFileModalOpen(false);
  };

  const statusColors = {
    planning: 'secondary',
    active: 'primary',
    review: 'warning',
    completed: 'success',
    paused: 'muted'
  } as const;

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Back Button & Hero Details Header */}
      <div className="flex flex-col gap-4 border-b border-border/30 pb-5">
        <button
          onClick={() => {
            setSelectedProjectId(null);
            setCurrentPage('projects');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer self-start transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{project.category}</span>
              <Badge variant={statusColors[project.status]}>{project.status}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">{project.name}</h1>
            <p className="text-xs text-muted-foreground mt-2 max-w-2xl leading-relaxed">{project.description}</p>
          </div>
          
          <div className="flex gap-4 items-center shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Due Date</p>
              <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{project.dueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left and Right Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 parts): Progress, Files, Comments */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Progress and Task Summary */}
          <div className="p-6 rounded-2xl glass-card grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Project Progress</span>
                <p className="text-2xl font-extrabold text-foreground mt-1">{project.progress}%</p>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3 text-left sm:border-l sm:border-border/30 sm:pl-6">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Sprint Workload</span>
                <p className="text-2xl font-extrabold text-foreground mt-1">
                  {completedCount} / {totalCount}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCount > 0 
                  ? `${Math.round((completedCount / totalCount) * 100)}% of tasks completed successfully.`
                  : 'No tasks currently mapped to this project.'}
              </p>
            </div>
          </div>

          {/* Cloud Files & Mock Uploads */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">Shared Files</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Asset storage directory.</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setIsFileModalOpen(true)}>
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {project.files.map((file) => (
                <div key={file.id} className="p-3.5 rounded-xl border border-border/60 bg-background/25 flex items-center justify-between gap-3 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <File className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground/80 mt-0.5">{file.size} &bull; {file.type}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 shrink-0 font-medium group-hover:text-primary transition-colors">{file.uploadedAt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Feed Thread */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-5">
            <div>
              <h3 className="font-bold text-sm text-foreground">Discussions Thread</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Post project announcements or reviews.</p>
            </div>

            {/* Comment boxes */}
            <div className="flex flex-col gap-4.5 max-h-72 overflow-y-auto">
              {project.comments.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground italic">
                  No comments yet. Start the conversation below!
                </div>
              ) : (
                project.comments.map((comm) => (
                  <div key={comm.id} className="flex gap-3 text-xs">
                    <img
                      src={comm.avatar}
                      alt={comm.user}
                      className="h-8.5 w-8.5 rounded-xl object-cover shrink-0 mt-0.5 ring-1 ring-border"
                    />
                    <div className="flex-1 bg-background/40 border border-border/40 rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">{comm.user}</span>
                        <span className="text-[9px] text-muted-foreground/60">{comm.timestamp}</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed font-medium mt-1">{comm.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post input form */}
            <form onSubmit={handlePostComment} className="flex gap-2.5 items-center mt-2.5">
              <Input
                placeholder="Write a message to your team..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
                required
              />
              <Button variant="primary" type="submit" size="icon" className="shrink-0 rounded-xl">
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>
          </div>

        </div>

        {/* Right Column: Members, Timeline, Activities */}
        <div className="flex flex-col gap-6">
          
          {/* Members */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/25 pb-3">
              <Users className="h-4.5 w-4.5 text-primary" />
              Project Members
            </h3>
            
            <div className="flex flex-col gap-3">
              {project.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-lg object-cover ring-1 ring-border" />
                    <div>
                      <p className="font-bold text-foreground leading-tight">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{m.role}</p>
                    </div>
                  </div>
                  <Badge variant="muted">{m.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/25 pb-3">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Recent Actions Activity
            </h3>

            <div className="relative border-l border-border pl-4.5 ml-2.5 flex flex-col gap-5 text-xs text-left">
              {project.activity.map((act) => (
                <div key={act.id} className="relative">
                  {/* Circle dot marker */}
                  <span className="absolute left-[-24px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                  <div>
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      <span className="font-bold text-foreground">{act.user}</span> {act.action}{' '}
                      <span className="font-semibold text-primary">{act.target}</span>
                    </p>
                    <span className="text-[9px] text-muted-foreground/60 block mt-0.5">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Upload File dialog */}
      <Dialog
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title="Upload Shared Asset File"
      >
        <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
          <Input
            label="File Name"
            placeholder="e.g. system-requirements.pdf"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="File Size"
            placeholder="e.g. 2.4 MB"
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
          />

          <div className="flex gap-3 justify-end mt-3">
            <Button variant="outline" type="button" onClick={() => setIsFileModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Asset
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
};
