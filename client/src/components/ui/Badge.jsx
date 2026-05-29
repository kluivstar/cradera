import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ children, variant = 'gray', className }) => {
  const variants = {
    gray: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-amber-50 text-amber-600',
    red: 'bg-rose-50 text-rose-600',
    blue: 'bg-sky-50 text-sky-600',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider',
      variants[variant] || variants.gray,
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
