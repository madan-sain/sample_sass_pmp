import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Calendar as CalIcon,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const Dashboard: React.FC = () => {
  const {
    projects,
    tasks,
    members,
    setCurrentPage,
    setSelectedTaskId
  } = useApp();

  const activeTasks = tasks.filter(t => t.status !== 'done');


  // KPI Metrics
  const kpis = [
    { title: 'Total Projects', value: projects.length, change: '+12% this month', icon: <FolderKanban className="h-5 w-5 text-primary" />, trend: 'up' },
    { title: 'Active Tasks', value: activeTasks.length, change: '-4 since yesterday', icon: <CheckSquare className="h-5 w-5 text-secondary" />, trend: 'down' },
    { title: 'Team Members', value: members.length, change: '2 online now', icon: <Users className="h-5 w-5 text-success" />, trend: 'up' },
    { title: 'Monthly Velocity', value: '88%', change: '+3% last sprint', icon: <TrendingUp className="h-5 w-5 text-warning" />, trend: 'up' }
  ];

  // Activities logs list
  const activities = [
    { id: '1', user: 'Sarah Chen', action: 'updated', target: 'Upgrade bundle manager to Vite', time: '10m ago', avatar: members[1].avatar },
    { id: '2', user: 'Alex Rivera', action: 'commented on', target: 'Phoenix Redesign', time: '1h ago', avatar: members[0].avatar },
    { id: '3', user: 'Marcus Johnson', action: 'joined project', target: 'Aether Marketing Site', time: '4h ago', avatar: members[2].avatar }
  ];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto">
      
      {/* 1. Welcome Card Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 via-slate-900 to-indigo-950 border border-border/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md shadow-black/15">
        <div className="absolute right-[-10%] top-[-20%] w-[350px] h-[250px] bg-glow-blue blur-[80px] rounded-full pointer-events-none opacity-40" />
        <div className="absolute left-[30%] bottom-[-30%] w-[300px] h-[200px] bg-glow-purple blur-[80px] rounded-full pointer-events-none opacity-25" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-primary-light text-[10px] font-extrabold mb-3">
            <Sparkles className="h-3 w-3" />
            <span>Workspace Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, Ethan!
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Your team is completing tasks at a record velocity this week. You have <span className="text-primary-light font-bold">2 items requiring review</span>.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('tasks')}
          className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <span>Go to Taskboard</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="p-5 rounded-2xl glass-card flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">{kpi.title}</span>
              <div className="h-9 w-9 rounded-xl bg-background/50 border border-border/80 flex items-center justify-center shadow-sm">
                {kpi.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground leading-none">{kpi.value}</p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold">
                <span className={kpi.trend === 'up' ? 'text-success' : 'text-error'}>
                  {kpi.change.split(' ')[0]}
                </span>
                <span className="text-muted-foreground/80">{kpi.change.split(' ').slice(1).join(' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity SVG Chart Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">SaaS Productivity Velocity</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Simulated hourly task completion counts.</p>
            </div>
            <Badge variant="success">
              +14% Increase
            </Badge>
          </div>
          
          {/* Simulated Premium SVG Chart */}
          <div className="h-44 w-full relative mt-2">
            <svg className="w-full h-full text-primary" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              {/* Line path */}
              <path
                d="M 0,25 C 10,24 15,10 25,12 C 35,14 45,5 55,8 C 65,10 75,1 85,2 C 95,3 100,5 100,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Fill Path */}
              <path
                d="M 0,25 C 10,24 15,10 25,12 C 35,14 45,5 55,8 C 65,10 75,1 85,2 C 95,3 100,5 100,5 L 100,30 L 0,30 Z"
                fill="url(#gradient-blue)"
              />
              {/* Plot dots */}
              <circle cx="25" cy="12" r="0.75" fill="currentColor" />
              <circle cx="55" cy="8" r="0.75" fill="currentColor" />
              <circle cx="85" cy="2" r="0.75" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end text-[9px] font-bold text-muted-foreground/80 pt-2 px-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Sprint Completion Circular Chart */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 justify-between">
          <div className="border-b border-border/30 pb-3">
            <h3 className="font-bold text-sm text-foreground">Sprint Goal Progress</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tasks done vs. target backlog.</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-95">
                <circle cx="56" cy="56" r="46" stroke="var(--border)" strokeWidth="8.5" fill="transparent" className="opacity-80" />
                <circle cx="56" cy="56" r="46" stroke="var(--primary)" strokeWidth="9" fill="transparent" strokeDasharray={289} strokeDashoffset={289 * (1 - 0.72)} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-foreground leading-none">72%</span>
                <span className="text-[9px] text-muted-foreground/80 font-bold uppercase mt-1">Done</span>
              </div>
            </div>
          </div>

          <div className="flex justify-around text-center text-xs pt-1 border-t border-border/25 mt-1">
            <div>
              <p className="font-bold text-foreground">18</p>
              <span className="text-[10px] text-muted-foreground">Finished</span>
            </div>
            <div>
              <p className="font-bold text-foreground">25</p>
              <span className="text-[10px] text-muted-foreground">Sprint Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Tasks list, Activity, Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Tasks List */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/30 pb-3">
            <h3 className="font-bold text-sm text-foreground">My Sprint Backlog</h3>
            <button 
              onClick={() => setCurrentPage('tasks')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>View Board</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs select-none">
              <thead>
                <tr className="border-b border-border/30 text-muted-foreground/80 font-bold">
                  <th className="pb-3.5 font-bold">Task Name</th>
                  <th className="pb-3.5 font-bold">Priority</th>
                  <th className="pb-3.5 font-bold">Due Date</th>
                  <th className="pb-3.5 font-bold text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {tasks.slice(0, 4).map((t) => (
                  <tr key={t.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3">
                      <button
                        onClick={() => {
                          setSelectedTaskId(t.id);
                          setCurrentPage('tasks');
                        }}
                        className="font-bold text-foreground hover:text-primary hover:underline cursor-pointer truncate max-w-xs text-left"
                      >
                        {t.title}
                      </button>
                    </td>
                    <td className="py-3">
                      <Badge variant={t.priority === 'high' ? 'error' : t.priority === 'medium' ? 'warning' : 'success'}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground font-medium">{t.dueDate}</td>
                    <td className="py-3 text-right font-bold">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="w-8 shrink-0">{t.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side widgets: Mini Calendar + Activity Feed */}
        <div className="flex flex-col gap-6">
          {/* Mini Calendar Widget */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/25 pb-2.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CalIcon className="h-4 w-4 text-primary" />
                July 2026
              </span>
              <span className="text-[10px] text-muted-foreground font-bold">Today: Jul 21</span>
            </div>
            
            {/* Calendar Grid representation */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-muted-foreground select-none">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              {Array.from({ length: 31 }, (_, i) => {
                const day = i - 2; // offset to align days
                const isValid = day >= 1;
                const isToday = day === 21;
                const hasTask = [20, 24, 25, 28].includes(day);

                return (
                  <div
                    key={i}
                    className={`
                      h-6.5 w-6.5 rounded-lg flex flex-col items-center justify-center relative font-semibold
                      ${isToday ? 'bg-primary text-white font-extrabold shadow-sm' : ''}
                      ${isValid && !isToday ? 'text-foreground/95 hover:bg-accent/80' : ''}
                      ${!isValid ? 'text-transparent' : ''}
                    `}
                  >
                    {isValid ? day : ''}
                    {hasTask && !isToday && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed Widget */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/25 pb-2.5">
              <Clock className="h-4 w-4 text-primary" />
              Activity Feed
            </h3>
            
            <div className="flex flex-col gap-3.5">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs text-left">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="h-7 w-7 rounded-lg object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground/90 font-medium">
                      <span className="font-bold text-foreground">{act.user}</span> {act.action}{' '}
                      <span className="font-semibold text-primary truncate block sm:inline">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
