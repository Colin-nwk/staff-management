import React, { useState, useRef, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, ChevronUp, Check, AlertTriangle, Info, XCircle, MoreVertical } from 'lucide-react';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-navy-900 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800 dark:bg-gold-500 dark:text-navy-950 dark:hover:bg-gold-400 shadow-md shadow-navy-900/10',
    secondary: 'bg-gold-500 text-white hover:bg-gold-600 focus:ring-gold-500 shadow-sm dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200 dark:bg-transparent dark:border-navy-600 dark:text-slate-200 dark:hover:bg-navy-800',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, noPadding = false, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-navy-900 rounded-xl border border-slate-100 dark:border-navy-800 shadow-sm hover:shadow-md transition-shadow duration-300", 
        !noPadding && "p-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, error, id, ...props }) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={generatedId}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ className, label, error, id, children, ...props }) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={generatedId}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- TextArea ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ className, label, error, id, ...props }) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={generatedId}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// --- Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 dark:bg-navy-700 dark:text-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    error: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    outline: 'bg-transparent border border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300'
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
};

// --- Switch ---
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled, label, className }) => (
  <label className={cn("flex items-center cursor-pointer gap-3 disabled:opacity-50 select-none group", className)}>
    <div className="relative inline-block w-11 h-6 transition-colors duration-200 ease-in-out rounded-full border border-transparent bg-slate-200 dark:bg-navy-700 group-hover:bg-slate-300 dark:group-hover:bg-navy-600 has-[:checked]:bg-navy-900 dark:has-[:checked]:bg-gold-500">
      <input
        type="checkbox"
        className="absolute opacity-0 w-0 h-0 peer"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={cn(
        "absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
        checked ? "translate-x-5 dark:bg-navy-900" : "translate-x-0"
      )}></span>
    </div>
    {label && <span className={cn("text-sm font-medium", disabled ? "text-slate-400" : "text-slate-700 dark:text-slate-300")}>{label}</span>}
  </label>
);

// --- Checkbox ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, label, id, ...props }, ref) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={generatedId}
        className={cn(
          "w-4 h-4 rounded border-slate-300 dark:border-navy-600 text-navy-900 focus:ring-navy-900 dark:focus:ring-gold-500 focus:ring-offset-0 bg-white dark:bg-navy-900 cursor-pointer disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {label && (
        <label htmlFor={generatedId} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
});

// --- Alert ---
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children, className }) => {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  };

  const icons = {
    info: Info,
    success: Check,
    warning: AlertTriangle,
    error: XCircle
  };

  const Icon = icons[variant];

  return (
    <div className={cn("p-4 rounded-lg border flex gap-3 text-sm", styles[variant], className)}>
       <Icon className="w-5 h-5 flex-shrink-0" />
       <div>
         {title && <h5 className="font-bold mb-1">{title}</h5>}
         <div className="leading-relaxed opacity-90">{children}</div>
       </div>
    </div>
  );
};

// --- Accordion ---
interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export const Accordion: React.FC<{ items: AccordionItem[], className?: string }> = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, idx) => (
        <div key={idx} className="border border-slate-200 dark:border-navy-700 rounded-lg overflow-hidden bg-white dark:bg-navy-900">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
          >
            {item.title}
            {openIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-navy-800 mt-2">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Dropdown Menu (Simple) ---
interface DropdownProps {
  trigger: React.ReactNode;
  items: { label: string; onClick?: () => void; danger?: boolean }[];
  align?: 'left' | 'right';
}

export const DropdownMenu: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          "absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-navy-800 ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 origin-top-right",
          align === 'right' ? "right-0" : "left-0"
        )}>
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm transition-colors",
                  item.danger 
                    ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
       <div className={cn("bg-white dark:bg-navy-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-navy-700 flex flex-col max-h-[90vh]", className)}>
         <div className="px-6 py-4 border-b border-slate-100 dark:border-navy-700 flex justify-between items-center bg-slate-50/50 dark:bg-navy-800">
            <h3 className="font-medium text-xl text-navy-900 dark:text-white">{title}</h3>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors p-1 hover:bg-slate-200 dark:hover:bg-navy-700 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
            </button>
         </div>
         <div className="p-6 dark:text-slate-200 overflow-y-auto">
           {children}
         </div>
         {footer && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-navy-700 bg-slate-50/30 dark:bg-navy-900/30 flex justify-end gap-3">
                {footer}
            </div>
         )}
       </div>
    </div>
  );
};
