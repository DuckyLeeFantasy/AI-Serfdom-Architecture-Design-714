import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-slate-600 text-slate-200',
    outline: 'border border-slate-600 text-slate-300'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };