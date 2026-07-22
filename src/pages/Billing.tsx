import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Sparkles, 
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Billing: React.FC = () => {
  const { addToast } = useApp();
  const [activeTier, setActiveTier] = useState<'free' | 'pro' | 'enterprise'>('pro');

  const handleUpgrade = (tier: 'free' | 'pro' | 'enterprise') => {
    if (activeTier === tier) return;
    setActiveTier(tier);
    addToast(`Successfully switched to ${tier.toUpperCase()} tier!`, 'success');
  };

  const invoices = [
    { id: 'INV-0245', date: '2026-07-01', desc: 'Pro Platform - Monthly recurring', amount: '$19.00', status: 'Paid' },
    { id: 'INV-0198', date: '2026-06-01', desc: 'Pro Platform - Monthly recurring', amount: '$19.00', status: 'Paid' },
    { id: 'INV-0124', date: '2026-05-01', desc: 'Pro Platform - Sign up credit', amount: '$0.00', status: 'Paid' }
  ];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 text-left overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Billing & Subscriptions</h1>
          <p className="text-xs text-muted-foreground mt-1">Upgrade your tier plans, manage invoicing records, and review storage allocations.</p>
        </div>
      </div>

      {/* Subscription Status + Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active plan overview */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 border border-border/20 text-white relative overflow-hidden flex flex-col justify-between gap-6 shadow-md">
          <div className="absolute right-[-10%] top-[-10%] w-56 h-48 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-primary-light text-[9.5px] font-extrabold mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Current Tier Status</span>
            </div>
            <h3 className="text-lg font-extrabold capitalize text-white">{activeTier} Platform Plan</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Renewing automatically on August 01, 2026 via card ending in <span className="font-bold">4242</span>.
            </p>
          </div>

          <p className="text-2xl font-extrabold text-white leading-none">
            {activeTier === 'pro' ? '$19.00' : activeTier === 'free' ? '$0.00' : '$79.00'}
            <span className="text-[11px] text-slate-300/80 font-bold ml-1">/ month</span>
          </p>
        </div>

        {/* Usage meters (1) */}
        <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Project Allocation</span>
            <p className="text-2xl font-extrabold text-foreground mt-1">
              3 / {activeTier === 'free' ? '3' : 'Unlimited'}
            </p>
          </div>
          <div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: activeTier === 'free' ? '100%' : '15%' }} />
            </div>
            <span className="text-[10px] text-muted-foreground/80 font-bold block mt-2">
              {activeTier === 'free' ? 'Plan limit reached. Upgrade to Pro for unlimited.' : '15% of project capacity used.'}
            </span>
          </div>
        </div>

        {/* Usage meters (2) */}
        <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Mock Cloud Storage</span>
            <p className="text-2xl font-extrabold text-foreground mt-1">
              2.5 GB / {activeTier === 'free' ? '500 MB' : activeTier === 'pro' ? '10 GB' : '100 GB'}
            </p>
          </div>
          <div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: activeTier === 'free' ? '100%' : '25%' }} />
            </div>
            <span className="text-[10px] text-muted-foreground/80 font-bold block mt-2">
              25% of cloud space allocated.
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Card details and Upgrades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upgrade choices */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-5">
          <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3">Available Upgrades</h3>
          
          <div className="flex flex-col gap-4">
            {/* Pro Card option */}
            <div className="p-4 rounded-xl border border-border/70 bg-background/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-foreground">Pro Platform Plan</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Unlimited projects, custom themes, 10 GB space.</p>
              </div>
              <Button
                variant={activeTier === 'pro' ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleUpgrade('pro')}
                disabled={activeTier === 'pro'}
                className="shrink-0 font-bold"
              >
                {activeTier === 'pro' ? 'Active Tier' : 'Upgrade to Pro'}
              </Button>
            </div>

            {/* Enterprise Card option */}
            <div className="p-4 rounded-xl border border-border/70 bg-background/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-foreground">Enterprise Corporation</h4>
                <p className="text-[11px] text-muted-foreground mt-1">API keys access, custom branding logs, 100 GB space.</p>
              </div>
              <Button
                variant={activeTier === 'enterprise' ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => handleUpgrade('enterprise')}
                disabled={activeTier === 'enterprise'}
                className="shrink-0 font-bold"
              >
                {activeTier === 'enterprise' ? 'Active Tier' : 'Upgrade to Enterprise'}
              </Button>
            </div>
          </div>
        </div>

        {/* Credit Card Payment card mock */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
          <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Payment Method
          </h3>
          
          {/* Card Mock Visual */}
          <div className="p-5 rounded-xl bg-gradient-to-tr from-secondary to-indigo-600 text-white flex flex-col justify-between gap-6 shadow relative overflow-hidden h-36">
            <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
            <div className="flex items-start justify-between w-full">
              <span className="text-[10px] font-bold tracking-widest uppercase">Acme Business</span>
              <span className="text-sm font-extrabold italic">VISA</span>
            </div>
            <div>
              <p className="font-mono text-sm tracking-wider">•••• •••• •••• 4242</p>
              <div className="flex justify-between items-end mt-2.5 text-[10px]">
                <span>EXP: 12/29</span>
                <span>CVC: •••</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
        <h3 className="font-bold text-sm text-foreground border-b border-border/25 pb-3">Transaction History & Invoices</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground/80 font-bold">
                <th className="pb-3.5 font-bold">Invoice ID</th>
                <th className="pb-3.5 font-bold">Billing Date</th>
                <th className="pb-3.5 font-bold">Description</th>
                <th className="pb-3.5 font-bold">Amount</th>
                <th className="pb-3.5 font-bold">Status</th>
                <th className="pb-3.5 font-bold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/25 text-foreground/80">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3.5 font-bold text-foreground">{inv.id}</td>
                  <td className="py-3.5 font-semibold">{inv.date}</td>
                  <td className="py-3.5 truncate max-w-xs">{inv.desc}</td>
                  <td className="py-3.5 font-bold">{inv.amount}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-accent/80 transition-colors cursor-pointer">
                      <Download className="h-4.5 w-4.5" />
                    </button>
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
