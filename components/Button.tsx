import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'white';
  withArrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  withArrow = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300";
  
  const variants = {
    primary: "bg-brand-gold text-white hover:bg-brand-dark",
    outline: "border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white",
    white: "bg-white text-brand-dark hover:bg-brand-gray"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight className="ml-2 w-4 h-4" />}
    </button>
  );
};