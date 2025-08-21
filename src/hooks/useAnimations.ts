import { RefObject } from 'react';
import { EffectType, EffectOptionsMap, getEffectHandler } from '../effects/types';

export type EffectsRef = {
  triggerEffect: <K extends EffectType>(
    effectType: K, 
    options?: EffectOptionsMap[K] & { active?: boolean }
  ) => void;
};

export function useAnimations<T extends HTMLElement, K extends EffectType>(
  ref: RefObject<T>,
  options: EffectOptionsMap[K] & { active?: boolean } = { active: true }
): EffectsRef {
  // Return methods to trigger effects programmatically
  return {
    triggerEffect: <K extends EffectType>(
      type: K, 
      effectOptions: EffectOptionsMap[K] & { active?: boolean } = {}
    ) => {
      if (!ref.current) return;
      
      const handler = getEffectHandler(type);
      if (!handler) {
        console.warn(`No handler registered for effect type: ${type}`);
        return;
      }
      
      // For ripple effect, handle position if provided
      if (type === 'ripple' && effectOptions) {
        const rippleOptions = { ...options, ...effectOptions } as EffectOptionsMap['ripple'] & { active?: boolean };
        if ('x' in rippleOptions && 'y' in rippleOptions && 
            rippleOptions.x !== undefined && rippleOptions.y !== undefined) {
          const rect = ref.current.getBoundingClientRect();
          rippleOptions.clientX = rect.left + rippleOptions.x;
          rippleOptions.clientY = rect.top + rippleOptions.y;
          delete rippleOptions.x;
          delete rippleOptions.y;
        }
        handler(ref.current, { ...rippleOptions, active: true });
      } else {
        handler(ref.current, { ...options, ...effectOptions, active: true });
      }
    }
  };
}
