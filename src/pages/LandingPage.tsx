import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Shield,
  Plus,
  Minus,
  BarChart3,
  Users,
  Layers,
  Clock,
  GitBranch,
  Star,
  ChevronRight,
  Play,
  RotateCcw,
  MousePointerClick,
  CheckCircle2,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

/* ─── Animated Counter ─── */
const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let cur = 0;
          const step = end / (duration / 16);
          const tick = () => {
            cur += step;
            if (cur >= end) { setCount(end); } else { setCount(Math.floor(cur)); requestAnimationFrame(tick); }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, ref };
};

/* ================================================================== */
export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* Playground */
  const [demoTasks, setDemoTasks] = useState([
    { id: 'd1', title: 'Design system tokens', status: 'done', priority: 'low' as const },
    { id: 'd2', title: 'API integration layer', status: 'progress', priority: 'high' as const },
    { id: 'd3', title: 'User onboarding flow', status: 'todo', priority: 'medium' as const },
  ]);
  const [newTask, setNewTask] = useState('');

  const teamsC = useCounter(2400);
  const tasksC = useCounter(1200000, 2500);
  const uptimeC = useCounter(99);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(p => (p + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  const toggleFaq = (i: number) => setOpenFaqIndex(openFaqIndex === i ? null : i);
  const advanceTask = (id: string) => {
    const flow: Record<string, string> = { todo: 'progress', progress: 'done', done: 'todo' };
    setDemoTasks(prev => prev.map(t => t.id === id ? { ...t, status: flow[t.status] } : t));
  };
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setDemoTasks(prev => [...prev, { id: 'dx' + Math.random().toString(36).slice(2, 7), title: newTask, status: 'todo', priority: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)] }]);
    setNewTask('');
  };
  const resetBoard = () => setDemoTasks([
    { id: 'd1', title: 'Design system tokens', status: 'done', priority: 'low' },
    { id: 'd2', title: 'API integration layer', status: 'progress', priority: 'high' },
    { id: 'd3', title: 'User onboarding flow', status: 'todo', priority: 'medium' },
  ]);

  /* ─── Feature Showcases (left-right alternating) ─── */
  const showcases = [
    {
      badge: 'Kanban & Sprints',
      badgeIcon: <GitBranch className="h-3 w-3" />,
      title: 'Drag, drop, and ship — your way',
      desc: 'Organize work visually with fully interactive Kanban boards. Drag tasks between columns, set priorities, and track progress — all in real-time with your team.',
      bullets: ['Drag-and-drop task cards', 'Custom columns & workflows', 'Story points & sprint planning'],
    },
    {
      badge: 'Analytics',
      badgeIcon: <BarChart3 className="h-3 w-3" />,
      title: 'Insights that drive decisions',
      desc: 'Track velocity, burndown charts, and team performance with live-updating dashboards. Understand where bottlenecks form and optimize your sprint cadence.',
      bullets: ['Sprint velocity tracking', 'Burndown & cumulative flow', 'Team capacity heatmaps'],
    },
    {
      badge: 'Collaboration',
      badgeIcon: <MessageSquare className="h-3 w-3" />,
      title: 'Built-in messaging that stays in context',
      desc: 'No more switching to Slack for project updates. Threaded comments, @mentions, and file sharing — all embedded directly inside tasks and projects.',
      bullets: ['Threaded task comments', '@mention notifications', 'File attachments & previews'],
    },
  ];

  const pricingPlans = [
    { name: 'Free', price: 0, desc: 'For individuals and small side projects.', features: ['Up to 3 projects', '1 workspace', 'Basic Kanban board', '500 MB storage', 'Community support'], cta: 'Get Started Free', popular: false },
    { name: 'Pro', price: billingCycle === 'monthly' ? 12 : 9, desc: 'For growing teams shipping products faster.', features: ['Unlimited projects', 'Unlimited workspaces', 'Sprint planning & timelines', '50 GB storage', 'Priority email support', 'Advanced analytics'], cta: 'Start Pro Trial', popular: true },
    { name: 'Enterprise', price: billingCycle === 'monthly' ? 49 : 39, desc: 'For organizations needing scale & compliance.', features: ['Everything in Pro', 'SSO & SAML', 'Audit log & compliance', 'Unlimited storage', 'Dedicated account manager', '99.99% SLA guarantee'], cta: 'Contact Sales', popular: false },
  ];

  const testimonials = [
    { text: 'FlowBoard replaced three separate tools for us. Our sprint velocity increased 40% in the first quarter.', name: 'Sarah Chen', role: 'VP of Engineering, Stripe', initials: 'SC' },
    { text: 'The cleanest project management UI I have ever used. Our designers actually enjoy updating their tasks now.', name: 'Marcus Rivera', role: 'Design Lead, Figma', initials: 'MR' },
    { text: 'We migrated 200+ engineers from Jira in under a week. The onboarding experience is phenomenal.', name: 'Priya Sharma', role: 'CTO, Razorpay', initials: 'PS' },
  ];

  const faqs = [
    { q: 'How does the free plan work?', a: 'The free plan includes up to 3 active projects, 1 workspace, and basic Kanban boards. No credit card required. Upgrade anytime as your team grows.' },
    { q: 'Can I import from Jira, Asana, or Trello?', a: 'Yes — FlowBoard supports one-click migration from Jira, Asana, Trello, Linear, and Monday.com. Your projects, tasks, and comments are preserved.' },
    { q: 'Is my data secure?', a: 'Absolutely. We are SOC 2 Type II certified. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Enterprise plans include SSO and audit logging.' },
    { q: 'Do you offer a startup discount?', a: 'Yes! Startups with under $5M in funding qualify for 50% off Pro plans for the first year. Contact our sales team to apply.' },
    { q: 'What integrations are available?', a: 'FlowBoard integrates with Slack, GitHub, GitLab, Figma, Google Drive, Notion, and 40+ other tools via our API and Zapier connector.' },
  ];

  const colCfg: Record<string, { label: string; border: string; dot: string }> = {
    todo: { label: 'To Do', border: 'border-t-blue-400', dot: 'bg-blue-400' },
    progress: { label: 'In Progress', border: 'border-t-amber-400', dot: 'bg-amber-400' },
    done: { label: 'Done', border: 'border-t-emerald-400', dot: 'bg-emerald-400' },
  };
  const prioColor: Record<string, string> = { low: 'text-blue-400', medium: 'text-amber-400', high: 'text-rose-400' };

  /* ================================================================ */
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-pattern mask-radial-wide pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-glow-blue blur-[160px] rounded-full pointer-events-none opacity-30 animate-drift-slow" />
      <div className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] bg-glow-purple blur-[160px] rounded-full pointer-events-none opacity-25 animate-drift-slower" />
      <div className="absolute top-[55%] left-[25%] w-[400px] h-[400px] bg-glow-blue blur-[120px] rounded-full pointer-events-none opacity-15 animate-drift-slow" />

      {/* ──────── NAVBAR ──────── */}
      <header className="h-16 border-b border-border/30 px-6 lg:px-16 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/25">F</div>
          <span className="font-extrabold text-lg tracking-tight">FlowBoard</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#playground" className="hover:text-foreground transition-colors">Playground</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage('login')}>Sign In</Button>
          <Button variant="primary" size="sm" onClick={() => setCurrentPage('register')}>Get Started <ArrowRight className="h-3.5 w-3.5" /></Button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  HERO — Left text + Right dashboard preview                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 pt-16 pb-10 lg:pt-24 lg:pb-16 max-w-7xl mx-auto w-full relative z-10">
        <div className="absolute inset-0 bg-dot-pattern mask-radial pointer-events-none opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="flex flex-col items-start text-left">
            <Badge variant="primary" className="mb-5 animate-pulse-subtle gap-1.5 py-1">
              <Sparkles className="h-3 w-3" />
              Now in public beta — free for early teams
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.08]">
              Ship products faster with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-secondary">FlowBoard</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mt-5 max-w-lg leading-relaxed">
              The modern project management platform for agile teams. Plan sprints, track tasks, and collaborate — all in one beautiful workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button size="lg" onClick={() => setCurrentPage('register')}>
                Start Free — No Card Required <ArrowRight className="h-4.5 w-4.5" />
              </Button>
              <a href="#playground">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Play className="h-4 w-4 text-primary" /> Try Live Demo
                </Button>
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground/60 mt-4 font-medium">Trusted by 2,400+ teams · No credit card required</p>
          </div>

          {/* Right — Mini dashboard preview */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-4 shadow-2xl dark:shadow-black/40 relative overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-border/25 pb-2.5 mb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <span className="ml-auto text-[9px] text-muted-foreground font-mono px-2 py-0.5 rounded bg-background/50 border border-border/20">app.flowboard.io</span>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Active Tasks', value: '24', color: 'text-primary', trend: '+12%' },
                { label: 'Sprint Progress', value: '78%', color: 'text-secondary', trend: '+5%' },
                { label: 'Team Velocity', value: '94', color: 'text-success', trend: '+8%' },
              ].map((kpi, i) => (
                <div key={i} className="p-3 rounded-xl border border-border/40 bg-background/30">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{kpi.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className={`text-xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
                    <span className="text-[8px] font-bold text-success">{kpi.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div className="rounded-xl border border-border/40 bg-background/25 p-3 mb-3">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Productivity</span>
              <svg className="w-full h-16 mt-2" viewBox="0 0 200 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q20,20 40,28 T80,15 T120,22 T160,10 T200,18" fill="none" stroke="var(--primary)" strokeWidth="2" />
                <path d="M0,35 Q20,20 40,28 T80,15 T120,22 T160,10 T200,18 L200,40 L0,40 Z" fill="url(#heroGrad)" />
              </svg>
            </div>

            {/* Mini kanban */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { col: 'To Do', color: 'border-t-blue-400', items: ['API design', 'Auth flow'] },
                { col: 'In Progress', color: 'border-t-amber-400', items: ['Dashboard UI'] },
                { col: 'Done', color: 'border-t-emerald-400', items: ['Setup CI/CD', 'DB schema'] },
              ].map((c, i) => (
                <div key={i} className={`p-2 rounded-lg border border-border/30 bg-background/20 ${c.color} border-t-2`}>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{c.col}</span>
                  <div className="flex flex-col gap-1 mt-1.5">
                    {c.items.map((item, j) => (
                      <div key={j} className="text-[9px] font-medium text-foreground/80 p-1.5 rounded bg-card/60 border border-border/20">{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── SOCIAL PROOF ──────── */}
      <section className="px-6 py-10 max-w-5xl mx-auto z-10">
        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.15em] text-center mb-6">Trusted by teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground/40">
          {['Vercel', 'Stripe', 'Figma', 'Linear', 'Notion'].map(b => (
            <span key={b} className="text-lg font-extrabold tracking-tight select-none">{b}</span>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  FEATURE SHOWCASES — Alternating left/right                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section id="features" className="px-6 lg:px-16 py-20 max-w-7xl mx-auto w-full z-10 relative">
        <div className="absolute inset-0 bg-grid-small mask-fade-bottom pointer-events-none" />

        <div className="text-center max-w-xl mx-auto mb-20 relative">
          <Badge variant="primary" className="mb-4 gap-1"><Zap className="h-3 w-3" /> Features</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Everything your team needs</h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Built for modern product teams — from sprint planning to deployment tracking.</p>
        </div>

        <div className="flex flex-col gap-24 relative">
          {showcases.map((item, idx) => {
            const isReversed = idx % 2 !== 0;
            return (
              <div key={idx} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}>
                {/* Text side */}
                <div className={`flex flex-col items-start text-left ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <Badge variant="secondary" className="mb-4 gap-1">{item.badgeIcon} {item.badge}</Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-md">{item.desc}</p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {item.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-center gap-2.5 text-sm text-foreground/85 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual side */}
                <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  {idx === 0 && (
                    /* Kanban visual */
                    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 shadow-xl">
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { col: 'Backlog', color: 'border-t-purple-400', tasks: [{ t: 'Refactor auth module', p: 'High' }, { t: 'Update API docs', p: 'Low' }] },
                          { col: 'In Progress', color: 'border-t-amber-400', tasks: [{ t: 'Design new dashboard', p: 'Medium' }] },
                          { col: 'Done', color: 'border-t-emerald-400', tasks: [{ t: 'Setup CI/CD pipeline', p: 'High' }, { t: 'Database migrations', p: 'Medium' }] },
                        ].map((c, ci) => (
                          <div key={ci} className={`p-3 rounded-xl border border-border/30 bg-background/25 ${c.color} border-t-[3px]`}>
                            <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">{c.col}</span>
                            <div className="flex flex-col gap-2 mt-2">
                              {c.tasks.map((tk, ti) => (
                                <div key={ti} className="p-2.5 rounded-lg border border-border/40 bg-card/60">
                                  <p className="text-[11px] font-semibold text-foreground leading-snug">{tk.t}</p>
                                  <span className={`text-[8px] font-bold uppercase mt-1 inline-block ${tk.p === 'High' ? 'text-rose-400' : tk.p === 'Medium' ? 'text-amber-400' : 'text-blue-400'}`}>{tk.p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {idx === 1 && (
                    /* Analytics visual */
                    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 shadow-xl">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { label: 'Velocity', val: '34 pts', delta: '+18%', color: 'text-primary' },
                          { label: 'Cycle Time', val: '2.4 days', delta: '-12%', color: 'text-success' },
                        ].map((m, mi) => (
                          <div key={mi} className="p-3.5 rounded-xl border border-border/35 bg-background/25">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{m.label}</span>
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <p className={`text-lg font-extrabold ${m.color}`}>{m.val}</p>
                              <span className="text-[8px] font-bold text-success">{m.delta}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border border-border/35 bg-background/20 p-3">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Sprint Burndown</span>
                        <svg className="w-full h-24 mt-2" viewBox="0 0 200 50" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Ideal line */}
                          <line x1="0" y1="5" x2="200" y2="45" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                          {/* Actual burndown */}
                          <path d="M0,5 Q30,8 60,18 T120,25 T180,38 L200,42" fill="none" stroke="var(--secondary)" strokeWidth="2.5" />
                          <path d="M0,5 Q30,8 60,18 T120,25 T180,38 L200,42 L200,50 L0,50 Z" fill="url(#burnGrad)" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {idx === 2 && (
                    /* Chat visual */
                    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 shadow-xl">
                      <div className="flex flex-col gap-3">
                        {[
                          { name: 'Sarah C.', initials: 'SC', msg: 'Updated the sprint board — moved 3 tasks to review. Can someone check the API tests?', time: '2m ago', color: 'from-primary to-blue-400' },
                          { name: 'Marcus R.', initials: 'MR', msg: 'Looks good! I will review the auth module changes this afternoon. 🚀', time: '1m ago', color: 'from-secondary to-purple-400' },
                          { name: 'You', initials: 'YO', msg: 'Great — I have attached the updated wireframes to the task. @Sarah take a look when you can.', time: 'Just now', color: 'from-emerald-500 to-teal-500' },
                        ].map((m, mi) => (
                          <div key={mi} className="flex gap-3 items-start">
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold text-[9px] shrink-0`}>{m.initials}</div>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-[11px] font-bold text-foreground">{m.name}</span>
                                <span className="text-[8px] text-muted-foreground">{m.time}</span>
                              </div>
                              <p className="text-[11px] text-foreground/75 mt-0.5 leading-relaxed">{m.msg}</p>
                            </div>
                          </div>
                        ))}
                        {/* Input */}
                        <div className="mt-1 flex gap-2">
                          <div className="flex-1 h-8 rounded-lg border border-border/40 bg-background/30 flex items-center px-3 text-[10px] text-muted-foreground/50">Type a message...</div>
                          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><ArrowRight className="h-3.5 w-3.5 text-white" /></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────── FEATURE GRID (compact) ──────── */}
      <section className="px-6 lg:px-16 py-16 max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Layers className="h-5 w-5" />, title: 'Smart Workspaces', desc: 'Isolated environments with custom roles and permissions.', color: 'text-primary' },
            { icon: <Shield className="h-5 w-5" />, title: 'Enterprise Security', desc: 'SOC 2, SSO, 2FA, and granular access controls.', color: 'text-error' },
            { icon: <Clock className="h-5 w-5" />, title: 'Time Tracking', desc: 'Automatic logging with billable hour exports.', color: 'text-warning' },
            { icon: <TrendingUp className="h-5 w-5" />, title: 'OKR Tracking', desc: 'Align team goals with measurable key results.', color: 'text-success' },
            { icon: <Users className="h-5 w-5" />, title: 'Resource Planning', desc: 'Balance workloads across team members visually.', color: 'text-secondary' },
            { icon: <Zap className="h-5 w-5" />, title: 'Automations', desc: 'Trigger workflows on status changes and deadlines.', color: 'text-primary' },
          ].map((f, i) => (
            <div key={i} className="p-5 rounded-2xl glass-card flex items-start gap-4 group">
              <div className={`h-10 w-10 rounded-xl bg-background border border-border/60 flex items-center justify-center ${f.color} shadow-sm shrink-0 group-hover:shadow-md transition-shadow`}>
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── METRICS ──────── */}
      <section className="px-6 py-14 z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <div ref={teamsC.ref} className="p-7 rounded-2xl glass-card">
            <p className="text-3xl font-extrabold text-primary">{teamsC.count.toLocaleString()}+</p>
            <p className="text-xs text-muted-foreground font-semibold mt-1.5">Teams worldwide</p>
          </div>
          <div ref={tasksC.ref} className="p-7 rounded-2xl glass-card">
            <p className="text-3xl font-extrabold text-secondary">{(tasksC.count / 1000000).toFixed(1)}M+</p>
            <p className="text-xs text-muted-foreground font-semibold mt-1.5">Tasks completed</p>
          </div>
          <div ref={uptimeC.ref} className="p-7 rounded-2xl glass-card">
            <p className="text-3xl font-extrabold text-success">{uptimeC.count}.9%</p>
            <p className="text-xs text-muted-foreground font-semibold mt-1.5">Uptime SLA</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  LIVE PLAYGROUND                                            */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section id="playground" className="px-6 lg:px-16 py-20 max-w-7xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left — description */}
          <div className="lg:col-span-2 flex flex-col items-start text-left lg:sticky lg:top-24">
            <Badge variant="secondary" className="mb-4 gap-1"><MousePointerClick className="h-3 w-3" /> Interactive</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">Try it yourself</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              This is a fully interactive Kanban board. Add tasks, click any card to advance its status, and watch the metrics update in real-time.
            </p>

            {/* Live stats */}
            <div className="mt-8 flex flex-col gap-3 w-full">
              {[
                { label: 'To Do', value: demoTasks.filter(t => t.status === 'todo').length, color: 'text-blue-400' },
                { label: 'In Progress', value: demoTasks.filter(t => t.status === 'progress').length, color: 'text-amber-400' },
                { label: 'Completed', value: demoTasks.filter(t => t.status === 'done').length, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card/30">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</span>
                  <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
                </div>
              ))}
              <div className="p-3 rounded-xl border border-border/40 bg-card/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                  <span className="text-xs font-extrabold text-foreground">
                    {demoTasks.length ? Math.round((demoTasks.filter(t => t.status === 'done').length / demoTasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${demoTasks.length ? Math.round((demoTasks.filter(t => t.status === 'done').length / demoTasks.length) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — board */}
          <div className="lg:col-span-3 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-4 shadow-xl relative">
            {/* Chrome */}
            <div className="flex items-center justify-between border-b border-border/25 pb-2.5 mb-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/50 text-[9px] text-muted-foreground font-mono border border-border/20">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Sandbox
              </div>
              <button onClick={resetBoard} className="text-[10px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            {/* Add task */}
            <form onSubmit={addTask} className="flex gap-2 mb-4">
              <input type="text" placeholder="Add a new task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} className="flex-1 h-9 px-3 rounded-xl border border-border/40 bg-background/30 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors" />
              <Button size="sm" type="submit" className="h-9 gap-1 text-xs"><Plus className="h-3.5 w-3.5" /> Add</Button>
            </form>

            {/* Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['todo', 'progress', 'done'] as const).map(col => {
                const cfg = colCfg[col];
                const tasks = demoTasks.filter(t => t.status === col);
                return (
                  <div key={col} className={`p-3 rounded-xl bg-background/25 border border-border/30 ${cfg.border} border-t-[3px] min-h-[170px]`}>
                    <div className="flex items-center justify-between mb-2 px-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        <span className="text-[10px] font-bold text-foreground uppercase tracking-wide">{cfg.label}</span>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground bg-accent/50 rounded-full h-4.5 w-4.5 flex items-center justify-center">{tasks.length}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {tasks.map(t => (
                        <div key={t.id} onClick={() => advanceTask(t.id)} className="p-2.5 rounded-lg border border-border/40 bg-card hover:border-primary/20 transition-all cursor-pointer group animate-fade-in-scale" title="Click to advance">
                          <p className="text-[11px] font-semibold text-foreground group-hover:text-primary leading-snug">{t.title}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className={`text-[8px] font-bold uppercase ${prioColor[t.priority]}`}>{t.priority}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── PRICING ──────── */}
      <section id="pricing" className="px-6 lg:px-16 py-20 max-w-6xl mx-auto text-center z-10 relative">
        <div className="absolute inset-0 bg-dot-pattern mask-radial pointer-events-none opacity-30" />
        <div className="max-w-xl mx-auto mb-12 relative">
          <Badge variant="secondary" className="mb-4 gap-1"><Star className="h-3 w-3" /> Pricing</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Start free, scale as you grow</h2>
          <p className="text-sm text-muted-foreground mt-3">No hidden fees. Cancel anytime.</p>
          <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border/60 bg-background/50 mt-6">
            <button onClick={() => setBillingCycle('monthly')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Monthly</button>
            <button onClick={() => setBillingCycle('yearly')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${billingCycle === 'yearly' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Yearly <span className="ml-1 text-[9px] font-extrabold text-emerald-500">-25%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch relative">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`p-7 rounded-2xl border text-left flex flex-col relative transition-all duration-300 ${plan.popular ? 'border-primary/60 bg-card shadow-xl shadow-primary/5 md:scale-[1.03] z-10' : 'border-border/50 bg-card/50 hover:border-border'}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">Most Popular</span>}
              <div className="mb-5">
                <h3 className="font-extrabold text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-border/30">
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="text-xs text-muted-foreground font-medium">/ user / {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <ul className="flex-1 flex flex-col gap-2.5 mb-6">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-xs text-foreground/80 font-medium">
                    <Check className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" /><span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full" onClick={() => setCurrentPage('register')}>{plan.cta}</Button>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── TESTIMONIALS — left/right ──────── */}
      <section className="px-6 lg:px-16 py-20 bg-muted/30 dark:bg-black/15 border-y border-border/30 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left — heading */}
            <div className="lg:col-span-2 text-left">
              <Badge variant="muted" className="mb-4 gap-1"><Star className="h-3 w-3" /> Testimonials</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">Loved by product teams everywhere</h2>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Here is what engineering leads and designers say about FlowBoard.</p>

              <div className="flex gap-1.5 mt-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activeTestimonial === i ? 'w-7 bg-primary' : 'w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40'}`} />
                ))}
              </div>
            </div>

            {/* Right — card */}
            <div className="lg:col-span-3 p-7 rounded-2xl glass-card text-left flex flex-col gap-5 min-h-[170px] transition-all duration-500">
              <p className="text-sm text-foreground/90 italic leading-relaxed flex-1">"{testimonials[activeTestimonial].text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-white font-bold text-xs">{testimonials[activeTestimonial].initials}</div>
                <div>
                  <p className="text-xs font-bold text-foreground">{testimonials[activeTestimonial].name}</p>
                  <p className="text-[10px] text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── FAQ — left/right ──────── */}
      <section id="faq" className="px-6 lg:px-16 py-20 max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left */}
          <div className="lg:col-span-2 text-left lg:sticky lg:top-24">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">Frequently asked questions</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Can't find what you're looking for?</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setCurrentPage('login')}>Contact Support</Button>
          </div>

          {/* Right — accordions */}
          <div className="lg:col-span-3 flex flex-col gap-2.5">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={i} className="border border-border/50 bg-card/40 rounded-xl overflow-hidden transition-all">
                  <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm text-foreground hover:bg-accent/20 transition-colors cursor-pointer">
                    <span>{faq.q}</span>
                    {isOpen ? <Minus className="h-4 w-4 text-primary shrink-0" /> : <Plus className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0 }}>
                    <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed">{faq.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="px-6 py-16 z-10">
        <div className="max-w-4xl mx-auto p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-small mask-radial pointer-events-none opacity-50" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to ship faster?</h2>
              <p className="text-sm text-muted-foreground mt-3">Join 2,400+ teams already using FlowBoard. Get started in under 2 minutes.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Button size="lg" onClick={() => setCurrentPage('register')}>Get Started Free <ArrowRight className="h-4.5 w-4.5" /></Button>
              <Button variant="outline" size="lg" onClick={() => setCurrentPage('login')}>Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="mt-auto border-t border-border/30 py-12 px-6 bg-card/20 backdrop-blur-sm z-10 text-xs">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-[10px]">F</div>
              <span className="font-extrabold text-sm">FlowBoard</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">Modern project management for teams that ship.</p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-3">Product</h4>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#" className="hover:text-foreground transition-colors">Changelog</a>
              <a href="#" className="hover:text-foreground transition-colors">Roadmap</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-3">Resources</h4>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">API Reference</a>
              <a href="#" className="hover:text-foreground transition-colors">Blog</a>
              <a href="#" className="hover:text-foreground transition-colors">Status Page</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-3">Company</h4>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Careers</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground">
          <span>© 2026 FlowBoard, Inc. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
