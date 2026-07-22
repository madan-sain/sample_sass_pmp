import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Folder, 
  File, 
  Upload, 
  Search, 
  Trash,
  Database,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';

export const FileManager: React.FC = () => {
  const { addToast } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');

  // Initial file storage list
  const [files, setFiles] = useState([
    { id: '1', name: 'dashboard-preview-draft.fig', size: '14.5 MB', folder: 'Design Layouts', date: '2 hours ago', type: 'Figma' },
    { id: '2', name: 'api-architecture-spec.pdf', size: '2.8 MB', folder: 'Development Specs', date: '1 day ago', type: 'PDF' },
    { id: '3', name: 'financial-ledger-2026.xlsx', size: '890 KB', folder: 'Accounting Logs', date: '4 days ago', type: 'Excel' },
    { id: '4', name: 'terms-and-privacy.docx', size: '1.2 MB', folder: 'Legal Docs', date: '1 week ago', type: 'Word' }
  ]);

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newF = {
      id: 'f_' + Math.random().toString(36).substr(2, 9),
      name: newFileName,
      size: newFileSize || '1.5 MB',
      folder: 'General Uploads',
      date: 'Just now',
      type: newFileName.split('.').pop()?.toUpperCase() || 'FILE'
    };

    setFiles((prev) => [newF, ...prev]);
    setNewFileName('');
    setNewFileSize('');
    setIsFileModalOpen(false);
    addToast(`File "${newFileName}" uploaded successfully!`, 'success');
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addToast('File removed from storage.', 'warning');
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">SaaS Cloud Storage</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage project assets, wireframes, and architectural schematics.</p>
        </div>

        <Button onClick={() => setIsFileModalOpen(true)} className="gap-2 shrink-0">
          <Upload className="h-4.5 w-4.5" />
          <span>Upload File</span>
        </Button>
      </div>

      {/* Storage allocation status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl glass-card flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Storage Used</span>
            <p className="text-base font-extrabold text-foreground mt-0.5">2.5 GB / 10 GB limit</p>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mt-1.5">
              <div className="h-full bg-primary" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:max-w-md relative">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search cloud files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs"
          />
        </div>

        {/* View mode toggle */}
        <div className="border border-border/80 rounded-xl p-1 bg-background/50 flex gap-0.5 select-none shrink-0 w-full sm:w-auto justify-center">
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

      {/* Directories */}
      <div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3 ml-1">Folders</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Design Layouts', 'Development Specs', 'Accounting Logs', 'Legal Docs'].map((folder) => (
            <div key={folder} className="p-4 rounded-2xl glass-card text-left flex items-center gap-3.5 hover:border-primary/20 transition-all select-none">
              <div className="h-9 w-9 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center text-secondary shrink-0">
                <Folder className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{folder}</p>
                <span className="text-[9.5px] text-muted-foreground">12 assets</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid or List of files */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mt-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-5 rounded-2xl glass-card flex flex-col justify-between gap-5 relative text-left group hover:border-primary/10"
            >
              <div className="flex justify-between items-start">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <File className="h-4.5 w-4.5" />
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground truncate">{file.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {file.size} &bull; {file.folder}
                </p>
              </div>

              <div className="border-t border-border/25 pt-3.5 flex justify-between text-[9.5px] font-bold text-muted-foreground">
                <span>{file.type}</span>
                <span>{file.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border/60 bg-card/45 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs select-none">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-muted-foreground/80 font-bold uppercase tracking-wider">
                  <th className="p-4 font-bold">File Name</th>
                  <th className="p-4 font-bold">Folder</th>
                  <th className="p-4 font-bold">Size</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-4 flex items-center gap-2.5">
                      <File className="h-4.5 w-4.5 text-primary" />
                      <span className="font-bold text-foreground">{file.name}</span>
                    </td>
                    <td className="p-4 text-muted-foreground font-semibold">{file.folder}</td>
                    <td className="p-4 text-muted-foreground font-semibold">{file.size}</td>
                    <td className="p-4 text-muted-foreground font-semibold">{file.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-error hover:bg-error/15 transition-colors cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog for Upload */}
      <Dialog
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title="Upload File Mock"
      >
        <form onSubmit={handleCreateFile} className="flex flex-col gap-4">
          <Input
            label="File Name"
            placeholder="e.g. wireframes-v2.pdf"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Size"
            placeholder="e.g. 4.2 MB"
            value={newFileSize}
            onChange={(e) => setNewFileSize(e.target.value)}
          />

          <div className="flex gap-3 justify-end mt-3">
            <Button variant="outline" type="button" onClick={() => setIsFileModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Mock
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
};
