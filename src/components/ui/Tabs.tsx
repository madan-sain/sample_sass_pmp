import React, { createContext, useContext, useState } from 'react';

interface TabsContextProps {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(defaultValue);
  const activeValue = controlledValue !== undefined ? controlledValue : localValue;

  const handleValueChange = (val: string) => {
    if (controlledValue === undefined) {
      setLocalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center p-1 rounded-xl glass-panel ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none
        ${isActive 
          ? 'bg-card text-foreground shadow-sm shadow-black/5 dark:shadow-white/5 font-bold scale-[1.02]' 
          : 'text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-black/10'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.value !== value) return null;

  return (
    <div className={`mt-4 outline-none animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};
