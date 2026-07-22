import React from 'react';
import { 
  ShieldAlert, 
  Users, 
  CreditCard, 
  Activity, 
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const AdminDashboard: React.FC = () => {
  const systemLogs = [
    { time: '2026-07-21 22:01:14', actor: 'System Worker', action: 'database backup completed', status: 'success' },
    { time: '2026-07-21 21:55:02', actor: 'Sarah Chen', action: 'API key generated for Strap integrations', status: 'info' },
    { time: '2026-07-21 21:30:19', actor: 'Gateway Worker', action: 'firewall rule penetrations check flagged port 8080', status: 'warning' },
    { time: '2026-07-21 19:12:45', actor: 'Ethan Hunt', action: 'billing subscription upgrade successful', status: 'success' }
  ];

  const adminStats = [
    { title: 'Registered Accounts', value: '412', change: '+24 this week', icon: <Users className="h-5 w-5 text-primary" /> },
    { title: 'Active Subscriptions', value: '189', change: '+8 this week', icon: <CreditCard className="h-5 w-5 text-secondary" /> },
    { title: 'Monthly Revenue Recurring', value: '$8,420', change: '+14% expansion rate', icon: <ArrowUpRight className="h-5 w-5 text-success" /> },
    { title: 'Support Open Tickets', value: '3', change: '0 critical pending', icon: <ShieldAlert className="h-5 w-5 text-error" /> }
  ];

  const logStatusColors = {
    success: 'success',
    info: 'primary',
    warning: 'warning',
    error: 'error'
  } as const;

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">System Admin Hub</h1>
          <p className="text-xs text-muted-foreground mt-1">Review centralized server audit logs, user volumes, and system-wide performance status.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {adminStats.map((stat) => (
          <div key={stat.title} className="p-5 rounded-2xl glass-card flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">{stat.title}</span>
              <div className="h-9 w-9 rounded-xl bg-background/50 border border-border/80 flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground leading-none">{stat.value}</p>
              <span className="text-[10px] text-muted-foreground font-bold block mt-2">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Central Audit Logs Table */}
      <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
        <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3 flex items-center gap-1.5">
          <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
          Central System Audit logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs select-none">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground/80 font-bold uppercase tracking-wider">
                <th className="pb-3 font-bold">Timestamp</th>
                <th className="pb-3 font-bold">Actor</th>
                <th className="pb-3 font-bold">System Action Details</th>
                <th className="pb-3 font-bold text-right">Event Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/25 text-foreground/80 font-mono">
              {systemLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 text-[11px] text-muted-foreground/85 font-semibold">{log.time}</td>
                  <td className="py-3 font-bold text-foreground">{log.actor}</td>
                  <td className="py-3 truncate max-w-sm font-semibold">{log.action}</td>
                  <td className="py-3 text-right">
                    <Badge variant={logStatusColors[log.status as keyof typeof logStatusColors]}>{log.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
