import { RefObject } from 'react';
import {
  EffectType,
  EffectOptionsMap,
  getEffectHandler
} from '../effects/types';

export interface EffectExecutionOptions {
  active?: boolean;

  /**
   * Number of seconds between effect executions.
   *
   * Undefined = execute once.
   *
   * Example:
   * effectPeriod: 0.5
   * => execute every 500ms
   */
  effectPeriod?: number;
}

export type EffectsRef = {
  triggerEffect: <K extends EffectType>(
    effectType: K,
    options?: EffectOptionsMap[K] & EffectExecutionOptions
  ) => (() => void) | void;
};

function runEffect<
  T extends HTMLElement,
  K extends EffectType
>(
  element: T,
  type: K,
  handler: ReturnType<typeof getEffectHandler<K>>,
  options: EffectOptionsMap[K] & EffectExecutionOptions
): (() => void) | void {
  if (!handler) {
    console.warn(
      `No handler registered for effect type: ${type}`
    );
    return;
  }

  const {
    effectPeriod,
    ...effectOptions
  } = options;

  const activeCleanups = new Set<() => void>();
  let intervalId: number | undefined;
  let stopped = false;

  const execute = () => {
    if (stopped) return;

    const cleanup = handler(
      element,
      effectOptions as EffectOptionsMap[K]
    );

    if (typeof cleanup !== 'function') {
      return;
    }

    let active = true;

    const trackedCleanup = () => {
      if (!active) return;

      active = false;
      activeCleanups.delete(trackedCleanup);
      cleanup();
    };

    activeCleanups.add(trackedCleanup);
  };

  // Execute immediately.
  execute();

  // One-shot effect.
  if (
    effectPeriod === undefined ||
    effectPeriod <= 0
  ) {
    return () => {
      stopped = true;

      activeCleanups.forEach((cleanup) => {
        cleanup();
      });

      activeCleanups.clear();
    };
  }

  // Continuous effect.
  intervalId = window.setInterval(
    execute,
    effectPeriod * 1000
  );

  return () => {
    stopped = true;

    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }

    activeCleanups.forEach((cleanup) => {
      cleanup();
    });

    activeCleanups.clear();
  };
}

export function useAnimations<
  T extends HTMLElement,
  K extends EffectType
>(
  ref: RefObject<T | null>,
  options: EffectOptionsMap[K] &
    EffectExecutionOptions = {
      active: true
    } as EffectOptionsMap[K] &
      EffectExecutionOptions
): EffectsRef {
  return {
    triggerEffect: (
      type,
      effectOptions = {} as EffectOptionsMap[K] &
        EffectExecutionOptions
    ) => {
      if (!ref.current) {
        return;
      }

      const handler = getEffectHandler(type);

      if (!handler) {
        console.warn(
          `No handler registered for effect type: ${type}`
        );
        return;
      }

      // Special handling for ripple positioning
      if (type === 'ripple') {
        const rippleOptions = {
          ...options,
          ...effectOptions
        } as EffectOptionsMap['ripple'] &
          EffectExecutionOptions;

        if (
          'x' in rippleOptions &&
          'y' in rippleOptions &&
          rippleOptions.x !== undefined &&
          rippleOptions.y !== undefined
        ) {
          const rect =
            ref.current.getBoundingClientRect();

          rippleOptions.clientX =
            rect.left + rippleOptions.x;

          rippleOptions.clientY =
            rect.top + rippleOptions.y;

          delete rippleOptions.x;
          delete rippleOptions.y;
        }

        return runEffect(
          ref.current,
          type,
          handler,
          {
            ...rippleOptions,
            active: true
          } as EffectOptionsMap[K] &
            EffectExecutionOptions
        );
      }

      return runEffect(
        ref.current,
        type,
        handler,
        {
          ...options,
          ...effectOptions,
          active: true
        } as EffectOptionsMap[K] &
          EffectExecutionOptions
      );
    }
  };
}