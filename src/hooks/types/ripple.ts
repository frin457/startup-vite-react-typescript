import { RefObject } from 'react';

export interface RippleOptions {
  /**
   * Color of the ripple effect
   * @default 'rgba(255, 255, 255, 0.7)'
   */
  color?: string;
  /**
   * Duration of the ripple animation in milliseconds
   * @default 600
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
}

export const defaultRippleOptions: RippleOptions = {
  color: 'rgba(255, 255, 255, 0.7)',
  duration: 600,
  maxSize: 1,
  centered: false
};

export type RippleRef = {
  triggerRipple: () => void;
};

export function createRippleRef(
  elementRef: RefObject<HTMLElement>,
  options: {
    centered?: boolean;
    color?: string;
    duration?: number;
    maxSize?: number;
  } = {}
): RippleRef {
  return {
    triggerRipple: () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const event = new MouseEvent('mousedown', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: options.centered ? rect.left + rect.width / 2 : rect.left,
          clientY: options.centered ? rect.top + rect.height / 2 : rect.top,
        });
        elementRef.current.dispatchEvent(event);
      }
    }
  };
}
