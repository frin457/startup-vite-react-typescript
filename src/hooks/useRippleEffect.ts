import { useEffect } from 'react';
import { RippleOptions, defaultRippleOptions } from './types/ripple';

/**
 * Custom hook that applies a water ripple effect to a DOM element
 * @param elementRef Reference to the target element
 * @param options Configuration options for the ripple effect or false to disable
 */
const useRippleEffect = (
  elementRef: React.RefObject<HTMLElement | null | undefined>,
  options: RippleOptions | null = {}
) => {
  useEffect(() => {
    if (!options) return;
    
    const element = elementRef.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      // Get the button's position and dimensions
      const rect = element.getBoundingClientRect();
      
      // Create ripple element
      const ripple = document.createElement('div');
      const size = Math.max(rect.width, rect.height) * (options.maxSize || 1);
      
      // Position the ripple
      const x = options.centered ? '50%' : `${e.clientX - rect.left}px`;
      const y = options.centered ? '50%' : `${e.clientY - rect.top}px`;
      
      // Style the ripple
      ripple.style.position = 'absolute';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.background = options.color || defaultRippleOptions.color || 'rgba(255, 255, 255, 0.7)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = `transform ${options.duration || defaultRippleOptions.duration}ms, opacity ${options.duration || defaultRippleOptions.duration}ms`;
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
      }, options.duration || defaultRippleOptions.duration);
    };

    element.addEventListener('mousedown', handleMouseDown);
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
    };
  }, [elementRef, options]);
};
  
export default useRippleEffect;