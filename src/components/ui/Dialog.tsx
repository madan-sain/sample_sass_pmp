import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Content container */}
      <div 
        className={`
          relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl dark:shadow-black/60 transition-all duration-300 animate-in fade-in zoom-in-95
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-border/30 pb-3">
          {title && (
            <h3 className="text-lg font-bold text-foreground leading-none">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="text-sm text-foreground/80 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
