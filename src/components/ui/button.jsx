import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'hover:bg-slate-700 text-slate-300 hover:text-white',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700'
  };

  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1 text-xs',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };