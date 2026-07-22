import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  id,
  checked,
  onChange,
  ...props
}) => {
  const checkboxId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className="flex items-center gap-2.5 text-left select-none">
      <div className="relative flex items-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`
            peer w-5 h-5 rounded-lg border border-border bg-background text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer transition-all duration-200
            checked:bg-primary checked:border-primary
            ${className}
          `}
          {...props}
        />
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.2 h-3.2 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-foreground/80 font-medium cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};
