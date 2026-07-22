import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Key, 
  Trash, 
  Plus, 
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { members, currentWorkspace, setCurrentWorkspace, addToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Stripe sync webhook', value: 'pk_live_51Ny8cSBt...4242', created: '2026-06-15' },
    { id: '2', name: 'Figma layout exporter', value: 'pk_live_99Jb3HdA...1234', created: '2026-07-10' }
  ]);

  const handleWorkspaceSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Workspace settings saved.', 'success');
    }, 1000);
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: 'k_' + Math.random().toString(36).substr(2, 9),
      name: 'Developer Integration Key',
      value: 'pk_live_' + Math.random().toString(36).substr(2, 9) + '...' + Math.floor(Math.random() * 9000 + 1000),
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys((prev) => [...prev, newKey]);
    addToast('Developer API key generated.', 'success');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    addToast('API key revoked.', 'warning');
  };

  const toggleRevealKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Workspace Administration</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure company branding, manage teammate permissions, and roll developer API keys.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Branding & Teammates */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Workspace branding */}
          <form onSubmit={handleWorkspaceSave} className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3">Workspace Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Workspace Display Name"
                value={currentWorkspace}
                onChange={(e) => setCurrentWorkspace(e.target.value)}
                required
              />
              
              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-xs font-semibold text-muted-foreground ml-0.5">Branding Accent</span>
                <div className="flex gap-2 items-center h-10 select-none">
                  {['#3B82F6', '#7C3AED', '#10B981', '#F59E0B'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-6 w-6 rounded-full border border-card shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => addToast(`Accent changed to ${color}`, 'success')}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Button type="submit" loading={loading}>Save Settings</Button>
            </div>
          </form>

          {/* Members permissions */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Teammate Roles & Permissions
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs select-none">
                <thead>
                  <tr className="border-b border-border/30 text-muted-foreground/80 font-bold">
                    <th className="pb-3 font-bold">Teammate</th>
                    <th className="pb-3 font-bold">Role</th>
                    <th className="pb-3 font-bold text-right">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/25 text-foreground/80">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-accent/40 transition-colors">
                      <td className="py-2.5 flex items-center gap-2.5">
                        <img src={m.avatar} className="h-6.5 w-6.5 rounded-lg object-cover" />
                        <span className="font-bold text-foreground">{m.name}</span>
                      </td>
                      <td className="py-2.5 font-semibold text-muted-foreground">{m.role}</td>
                      <td className="py-2.5 text-right font-bold">
                        <select 
                          className="bg-card border border-border rounded-lg text-[10px] font-bold p-1 cursor-pointer"
                          defaultValue={m.name.includes('Sarah') ? 'admin' : 'member'}
                          onChange={(e) => addToast(`${m.name} set to ${e.target.value}`, 'success')}
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="guest">Guest</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: API Keys */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/25 pb-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              API Access Keys
            </h3>
            <button
              onClick={handleGenerateKey}
              className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
              title="Generate New Key"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            {apiKeys.map((key) => {
              const isRevealed = showKeys[key.id] || false;
              return (
                <div key={key.id} className="p-3.5 border border-border bg-background/25 rounded-xl flex flex-col gap-2 relative text-left group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-foreground leading-tight truncate pr-4">{key.name}</span>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-muted-foreground/60 hover:text-error shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded p-0.5"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Values row */}
                  <div className="flex items-center justify-between gap-2.5 font-mono text-[10px] bg-card border border-border/40 p-2 rounded-lg mt-1 select-all">
                    <span className="truncate">{isRevealed ? key.value.replace('...', '') : '••••••••••••••••••••••••'}</span>
                    <div className="flex gap-1 items-center shrink-0">
                      <button 
                        type="button" 
                        onClick={() => toggleRevealKey(key.id)}
                        className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                      >
                        {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(key.value);
                          addToast('API key copied.', 'success');
                        }}
                        className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="text-[9px] text-muted-foreground/60 block font-medium mt-1">Created {key.created}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
