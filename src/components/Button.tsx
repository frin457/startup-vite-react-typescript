import React, { forwardRef, useRef, RefObject, useEffect } from 'react';
import useRippleEffect from '../hooks/useRippleEffect';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  ripple?: boolean | {
    color?: string;
    duration?: number;
    maxSize?: number;
    centered?: boolean;
  };
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
    children, 
    variant = 'primary', 
    className = '',
    ripple = false,
    onClick,
    ...props 
  }, forwardedRef) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Combine the forwarded ref with our local ref
    useEffect(() => {
      if (!forwardedRef) return;
      
      if (typeof forwardedRef === 'function') {
        forwardedRef(buttonRef.current);
      } else {
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = buttonRef.current;
      }
    }, [forwardedRef]);
    
    // Always call the hook, but conditionally apply the effect
    useRippleEffect(
      buttonRef as RefObject<HTMLElement>,
      ripple ? {
        color: 'rgba(255, 255, 255, 0.5)',
        duration: 600,
        maxSize: 2,
        centered: false
      }: false
    );
  
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
  
    return (
      <button
        ref={buttonRef}
        className={`
            ${baseStyles} 
            ${variants[variant]} 
            ${className}
            ${ripple ? 'relative overflow-hidden' : ''}
        `}
        style={{ position: 'relative', overflow: 'hidden' }}
        onClick={onClick}
        {...props}
      >
        <span className={`${ripple ? 'relative z-10' : ''}`}>
    {children}
  </span>
      </button>
    );
  });
export default Button;
export type { ButtonProps };