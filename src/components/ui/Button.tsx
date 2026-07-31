import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-gold text-black hover:bg-gold/90',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-gold/50 text-gold hover:bg-gold/10',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2 rounded-xl',
  };
  
  return (
    <button 
      className={cn(
        'rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2', 
        variants[variant],
        sizes[size],
        className
      )} 
      {...props} 
    />
  );
};
