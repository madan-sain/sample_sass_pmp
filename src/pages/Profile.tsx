import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Link as LinkIcon, 
  Mail
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Badge } from '../components/ui/Badge';

export const Profile: React.FC = () => {
  const { addToast } = useApp();
  const [name, setName] = useState('Ethan Hunt');
  const [email, setEmail] = useState('ethan@acme.com');
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Profile changes saved successfully.', 'success');
    }, 1000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Personal Profile Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure credentials, email notifications, and active workspace integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3">Personal Information</h3>
            
            <div className="flex items-center gap-4.5 py-2 select-none">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
                alt="Avatar"
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/20"
              />
              <div>
                <Button variant="outline" size="sm" type="button">Change Picture</Button>
                <span className="text-[10px] text-muted-foreground block mt-1.5">Square JPG, max 2MB uploads.</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="border-t border-border/25 pt-4 mt-2">
              <h3 className="font-bold text-sm text-foreground mb-3.5">Email Notifications</h3>
              <div className="flex flex-col gap-2.5">
                <Checkbox label="Send email digest summaries weekly" checked />
                <Checkbox label="Ping when mentioned in discussions chat room" checked />
                <Checkbox label="Email when due date milestones approach" />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button type="submit" loading={loading}>Save Profile</Button>
            </div>
          </form>
        </div>

        {/* Third-Party Integrations */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              Connected Apps
            </h3>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-background/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <LinkIcon className="h-5 w-5 text-foreground" />
                  <div>
                    <p className="font-bold text-foreground leading-tight">GitHub</p>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">Commit syncing</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-foreground leading-tight">Google Calendar</p>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">Deadline sync</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-[10px] px-2.5">Connect</Button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
