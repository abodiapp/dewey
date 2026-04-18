import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children: ReactNode;
}

const variants = {
  primary: 'bg-primary text-white shadow-[0_4px_0_0_#46a302] hover:bg-primary-dark active:shadow-none active:translate-y-[4px]',
  secondary: 'bg-bg-elevated text-text-primary border-2 border-border shadow-[0_4px_0_0_#1a2d35] hover:bg-bg-card active:shadow-none active:translate-y-[4px]',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
  danger: 'bg-accent-red text-white shadow-[0_4px_0_0_#cc3c3c] hover:bg-red-600 active:shadow-none active:translate-y-[4px]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-base rounded-2xl',
  lg: 'px-7 py-3.5 text-lg rounded-2xl',
};

export default function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`font-bold transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as any)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
