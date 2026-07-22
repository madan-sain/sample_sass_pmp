import React from 'react';
import { useApp } from '../context/AppContext';
import type { Member } from '../context/AppContext';
import { 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Plus
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const Team: React.FC = () => {
  const {
    members,
    setCurrentPage,
    setActiveConversationId,
    addToast
  } = useApp();

  const handleMessage = (member: Member) => {
    // Map member direct conversation ID
    let convoId = 'c_sarah'; // fallback
    if (member.name.toLowerCase().includes('sarah')) {
      convoId = 'c_sarah';
    } else {
      // simulate routing
      convoId = 'c_general';
    }
    setActiveConversationId(convoId);
    setCurrentPage('messages');
    addToast(`Opened conversation with ${member.name}`, 'info');
  };

  const availabilityColors = {
    available: 'success',
    busy: 'warning',
    ooo: 'error'
  } as const;

  const onlineColors = {
    online: 'bg-success',
    offline: 'bg-muted-foreground/60',
    away: 'bg-warning'
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Team Hub & Availability</h1>
          <p className="text-xs text-muted-foreground mt-1">Review team performance metrics and contact online coworkers.</p>
        </div>

        <Button className="gap-2.5">
          <Plus className="h-4.5 w-4.5" />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-6 relative"
          >
            {/* Top info */}
            <div className="flex items-start justify-between">
              <div className="relative">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/20"
                />
                {/* Status Dot */}
                <span className={`absolute bottom-[-2px] right-[-2px] h-3.5 w-3.5 rounded-full border-2 border-card ${onlineColors[m.status]}`} />
              </div>

              <div className="flex flex-col gap-1 items-end">
                <Badge variant={availabilityColors[m.availability]}>
                  {m.availability === 'ooo' ? 'Out of Office' : m.availability}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-semibold capitalize mt-1">Status: {m.status}</span>
              </div>
            </div>

            {/* Profile Detail */}
            <div className="text-left">
              <h3 className="font-extrabold text-base text-foreground leading-tight">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
              
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3 font-semibold">
                <Mail className="h-3.8 w-3.8 text-primary" />
                <span>{m.email}</span>
              </div>
            </div>

            {/* Performance progress meter */}
            <div className="flex flex-col gap-1.5 border-t border-border/25 pt-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  Sprint Efficiency
                </span>
                <span className="text-foreground">{m.performance}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
                  style={{ width: `${m.performance}%` }}
                />
              </div>
            </div>

            {/* Message Action */}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-1 gap-2.5 font-bold text-xs"
              onClick={() => handleMessage(m)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Member</span>
            </Button>
          </div>
        ))}
      </div>

    </div>
  );
};
