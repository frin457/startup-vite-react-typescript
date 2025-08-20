import { useEffect } from 'react';

type RippleOptions = {
  /**
   * Color of the ripple effect
   * @default 'rgba(255, 255, 255, 0.7)'
   */
  color?: string;
  /**
   * Duration of the ripple animation in milliseconds
   * @default 1000
   */
  duration?: number;
  /**
   * Maximum size of the ripple as a percentage of the largest dimension
   * @default 1 (100%)
   */
  maxSize?: number;
  /**
   * Whether to center the ripple effect
   * @default false
   */
  centered?: boolean;
};

/**
 * Custom hook that applies a water ripple effect to a DOM element
 * @param options Configuration options for the ripple effect
 * @returns A ref callback to attach to the target element
 */
const useRippleEffect = (
    elementRef: React.RefObject<HTMLElement | null | undefined>,
    options: RippleOptions | boolean = {}
  ) => {
    const {
      color = 'rgba(255, 0, 0, 0.5)',
      duration = 3000,
      maxSize = 1,
      centered = false,
    } = typeof options === 'object' ? options : {};

    useEffect(() => {
      // Move the conditional check inside useEffect
      if (options === false) return;
      
      const element = elementRef.current;
      if (!element) return;

      const handleMouseDown = (e: MouseEvent) => {
        const element = elementRef.current;
        if (!element) return;

        // Get the button's position and dimensions
        const rect = element.getBoundingClientRect();
        
        // Create ripple element
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height) * (maxSize || 1);
        
        // Position the ripple
        const x = centered ? '50%' : `${e.clientX - rect.left}px`;
        const y = centered ? '50%' : `${e.clientY - rect.top}px`;
        
        // Style the ripple
        ripple.style.position = 'absolute';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.background = color || 'rgba(255, 255, 255, 0.7)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.opacity = '1';
        ripple.style.transition = `transform ${duration}ms, opacity ${duration}ms`;
        ripple.style.left = x;
        ripple.style.top = y;
        
        // Add ripple to the button
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Trigger the animation
        requestAnimationFrame(() => {
          ripple.style.transform = 'translate(-50%, -50%) scale(4)';
          ripple.style.opacity = '0';
        });
        
        // Remove the ripple after animation completes
        setTimeout(() => {
          ripple.remove();
        }, duration);
      };

      element.addEventListener('mousedown', handleMouseDown);
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
      };
    }, [elementRef, color, duration, maxSize, centered, options]);
  };
  
  export default useRippleEffect;