import { registerEffect } from './types';
import type { RippleOptions } from './types';

const defaultOptions: RippleOptions = {
  color: 'rgba(0, 0, 0, 0.1)',
  duration: 600,
  maxSize: 1,
  centered: false,
  active: true
};

function createRipple(element: HTMLElement, options: RippleOptions) {
  if (!options.active) return;
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * (options.maxSize || 1);
  
  const ripple = document.createElement('div');
  const style = ripple.style;
  
  style.position = 'absolute';
  style.borderRadius = '50%';
  style.backgroundColor = options?.color ?? defaultOptions.color ?? 'rgba(0, 0, 0, 0.1)';
  style.pointerEvents = 'none';
  style.transform = 'scale(0)';
  style.opacity = '0.3';
  style.width = style.height = `${size}px`;
  
  // Handle positioning
  if (options.centered) {
    style.left = `${rect.width / 2 - size / 2}px`;
    style.top = `${rect.height / 2 - size / 2}px`;
  } else if (options.clientX !== undefined && options.clientY !== undefined) {
    // Use absolute positioning if client coordinates are provided
    style.left = `${options.clientX - rect.left - size / 2}px`;
    style.top = `${options.clientY - rect.top - size / 2}px`;
  } else if (options.x !== undefined && options.y !== undefined) {
    // Use relative positioning (0-1) if x,y are provided
    const x = options.x ?? 0.5;  // Default to center if not provided
    const y = options.y ?? 0.5;  // Default to center if not provided
    style.left = `${x * rect.width - size / 2}px`;
    style.top = `${y * rect.height - size / 2}px`;
  } else {
    // Default to center if no position is specified
    style.left = `${rect.width / 2 - size / 2}px`;
    style.top = `${rect.height / 2 - size / 2}px`;
  }
  
  // Add animation
  const duration = options?.duration ?? defaultOptions.duration;
  const animation = ripple.animate(
    [
      { transform: 'scale(0)', opacity: '0.3' },
      { transform: 'scale(2.5)', opacity: '0' }
    ],
    {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    }
  );

  // Clean up after animation completes
  animation.onfinish = () => {
    ripple.remove();
  };

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  return () => {
    ripple.remove();
  };
}

// Register the ripple effect
registerEffect('ripple', (element, options: RippleOptions = {}) => {
  const handleClick = (e: MouseEvent) => {
    if (options.active !== false) {
      createRipple(element, {
        ...options,
        clientX: e.clientX,
        clientY: e.clientY
      });
    }
  };
  
  element.addEventListener('mousedown', handleClick);
  
  return () => {
    element.removeEventListener('mousedown', handleClick);
  };
}, defaultOptions);

// Export for programmatic use
export function triggerRipple(
  element: HTMLElement, 
  options: RippleOptions = {}
) {
  return createRipple(element, {
    ...defaultOptions,
    ...options
  });
}
