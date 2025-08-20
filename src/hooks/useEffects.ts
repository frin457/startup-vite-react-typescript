import { useEffect, useRef, RefObject } from 'react';
import useRippleEffect from './useRippleEffect';
import { RippleOptions } from './types/ripple';

export type EffectType = 'ripple' //| 'scale' | 'fade'; // Add more effect types as needed

export type EffectOptions = {
  config?: RippleOptions | null; // Add other effect options here
  active: boolean;
};

export type EffectsRef = {
  triggerEffect: (effectType: EffectType, options?: EffectOptions) => void;
};

export function useAnimations<T extends HTMLElement>(
  ref: RefObject<T>,
  options: EffectOptions = {
    active: false  
  }
): EffectsRef {
  const internalRef = useRef<T>(null);
  const currentRef = ref || internalRef;

  useRippleEffect(
    currentRef,
    options.active ?  (options.config || {}): null
  );
  // Initialize effects based on options
  useEffect(() => {
    if (!currentRef.current) return;
    // Initialize other effects here
    // if (options.scale) { ... }
    // if (options.fade) { ... }
  }, [currentRef, options]);

  // Return methods to trigger effects programmatically
  return {
    triggerEffect: (effectType: EffectType, options?: EffectOptions) => {
      if (!currentRef.current) return;

      switch (effectType) {
        case 'ripple': {
            const rippleConfig = options?.config as RippleOptions & { x?: number; y?: number };
            const event = new MouseEvent('mousedown', {
              view: window,
              bubbles: true,
              cancelable: true,
              clientX: currentRef.current.getBoundingClientRect().left + (rippleConfig?.x || 0),
              clientY: currentRef.current.getBoundingClientRect().top + (rippleConfig?.y || 0)
            });
            currentRef.current.dispatchEvent(event);
            break;
          }
        
        // Add other effect types here
        // case 'scale':
        //   // Handle scale effect
        //   break;
        
        default:
          console.warn(`Effect type "${effectType}" is not implemented`);
      }
    }
  };
}
