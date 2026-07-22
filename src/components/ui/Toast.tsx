import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Info, AlertTriangle, AlertOctagon } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    info: <Info className="h-5 w-5 text-primary" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
    error: <AlertOctagon className="h-5 w-5 text-error" />
  };

  const borders = {
    success: 'border-success/30 dark:border-success/20',
    info: 'border-primary/30 dark:border-primary/20',
    warning: 'border-warning/30 dark:border-warning/20',
    error: 'border-error/30 dark:border-error/20'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-card border shadow-lg dark:shadow-black/40 animate-in slide-in-from-bottom duration-300
            ${borders[t.type]}
          `}
        >
          <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
          <div className="flex-1 text-sm text-foreground/90 font-medium leading-normal">
            {t.message}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/80 p-0.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
