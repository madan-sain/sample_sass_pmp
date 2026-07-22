import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Analytics dashboard updated.', 'success');
    }, 1000);
  };

  // Activity Heatmap Mock
  // 5 rows (days) by 24 columns (weeks)
  const heatmapRows = 5;
  const heatmapCols = 26;
  const generateIntensity = () => {
    const val = Math.random();
    if (val < 0.3) return 'bg-muted';
    if (val < 0.6) return 'bg-success/20 border-success/10';
    if (val < 0.8) return 'bg-success/50 border-success/20';
    return 'bg-success border-success/35';
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Business Intelligence & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Review SaaS margins, task velocities, and team commit frequencies.</p>
        </div>

        <Button variant="outline" onClick={handleRefresh} loading={loading} className="gap-2 shrink-0">
          <RefreshCw className="h-4.5 w-4.5" />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* Grid: Big Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Performance Graph (SVG line) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/25 pb-3">
            <div>
              <h3 className="font-bold text-sm text-foreground">Revenue Expansion Rates</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Recurring subscriptions vs. service invoices.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="success" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+24.5% MoM</span>
              </Badge>
            </div>
          </div>

          <div className="h-56 w-full relative mt-4">
            <svg className="w-full h-full text-primary" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blue-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="7.5" x2="100" y2="7.5" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              <line x1="0" y1="22.5" x2="100" y2="22.5" stroke="var(--border)" strokeWidth="0.1" strokeDasharray="1,1" />
              
              {/* Plot path */}
              <path
                d="M 0,28 C 10,25 20,18 30,22 C 40,26 50,10 60,12 C 70,14 80,4 90,6 C 95,7 100,2 100,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 0,28 C 10,25 20,18 30,22 C 40,26 50,10 60,12 C 70,14 80,4 90,6 C 95,7 100,2 100,2 L 100,30 L 0,30 Z"
                fill="url(#blue-glow)"
              />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end text-[9px] font-bold text-muted-foreground/80 pt-2 px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>
        </div>

        {/* Burn Down Completion Rates (SVG bars) */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
          <div className="border-b border-border/25 pb-3">
            <h3 className="font-bold text-sm text-foreground">Sprint Completion Rates</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tasks delivered across past milestones.</p>
          </div>

          <div className="h-56 w-full flex items-end justify-between px-2 pt-6 pb-2 relative">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 bottom-8 border-b border-border/30" />
            <div className="absolute inset-x-0 bottom-20 border-b border-border/30" />
            <div className="absolute inset-x-0 bottom-32 border-b border-border/30" />

            {/* Bar 1 */}
            <div className="flex flex-col items-center gap-2 w-7.5 relative z-10">
              <div className="w-full bg-secondary rounded-t-lg transition-all duration-500" style={{ height: '70px' }} />
              <span className="text-[9px] font-bold text-muted-foreground/80">Sp 4</span>
            </div>

            {/* Bar 2 */}
            <div className="flex flex-col items-center gap-2 w-7.5 relative z-10">
              <div className="w-full bg-secondary rounded-t-lg transition-all duration-500" style={{ height: '110px' }} />
              <span className="text-[9px] font-bold text-muted-foreground/80">Sp 5</span>
            </div>

            {/* Bar 3 */}
            <div className="flex flex-col items-center gap-2 w-7.5 relative z-10">
              <div className="w-full bg-secondary rounded-t-lg transition-all duration-500" style={{ height: '90px' }} />
              <span className="text-[9px] font-bold text-muted-foreground/80">Sp 6</span>
            </div>

            {/* Bar 4 */}
            <div className="flex flex-col items-center gap-2 w-7.5 relative z-10">
              <div className="w-full bg-primary rounded-t-lg transition-all duration-500" style={{ height: '140px' }} />
              <span className="text-[9px] font-bold text-muted-foreground/80">Sp 7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Commit Activity Heatmap Grid */}
      <div className="p-6 rounded-2xl glass-card flex flex-col gap-4.5">
        <div>
          <h3 className="font-bold text-sm text-foreground">Task Activity Commit Heatmap</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Visual commit metrics mapped by week and day.</p>
        </div>

        <div className="overflow-x-auto pb-1 mt-2.5">
          <div className="flex flex-col gap-1.5 min-w-[500px]">
            {Array.from({ length: heatmapRows }, (_, rowIdx) => (
              <div key={rowIdx} className="flex gap-1.5 items-center">
                {/* Day label */}
                <span className="w-8 text-[9px] font-bold text-muted-foreground select-none">
                  {['Mon', 'Wed', 'Fri', 'Sat', 'Sun'][rowIdx] || ' '}
                </span>
                
                {/* Heatmap blocks */}
                {Array.from({ length: heatmapCols }, (_, colIdx) => (
                  <div
                    key={colIdx}
                    className={`h-4.5 w-4.5 rounded border border-transparent transition-all ${generateIntensity()}`}
                    title={`Week ${colIdx + 1}, Commit rate: High`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[9px] font-bold text-muted-foreground mt-2 select-none">
          <span>Less</span>
          <div className="h-3 w-3 rounded bg-muted border border-border/30" />
          <div className="h-3 w-3 rounded bg-success/20 border-success/10" />
          <div className="h-3 w-3 rounded bg-success/50 border-success/20" />
          <div className="h-3 w-3 rounded bg-success border-success/35" />
          <span>More</span>
        </div>
      </div>

    </div>
  );
};
