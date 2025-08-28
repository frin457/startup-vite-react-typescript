export type EffectType = 'ripple' | 'scale' | 'fade' | 'firework' | 'burning';

export interface RippleOptions {
  color?: string;
  duration?: number;
  maxSize?: number;
  centered?: boolean;
  x?: number;  // Relative position (0-1)
  y?: number;  // Relative position (0-1)
  clientX?: number;  // Absolute position
  clientY?: number;  // Absolute position
  active?: boolean;
}

export interface ScaleOptions {
  factor?: number;
  duration?: number;
}

export interface FadeOptions {
  duration?: number;
  opacity?: number;
}

export interface FireworkOptions {
  duration?: number;
  intensity?: number;
  colorStops?: string[];
  active?: boolean;
  particleSize?: number;
  spread?: number;
}

export interface BurningOptions {
  duration?: number;
  intensity?: number;
  colorStops?: string[];
  active?: boolean;
  flameHeight?: number;
  flickerSpeed?: number;
}

export interface EffectOptionsMap {
  ripple: RippleOptions;
  scale: ScaleOptions;
  fade: FadeOptions;
  firework: FireworkOptions;
  burning: BurningOptions;
}

export type EffectHandler<T extends HTMLElement = HTMLElement, O extends object = Record<string, never>> = (
  element: T,
  options: O
) => (() => void) | void;

type EffectRegistry = {
  [K in EffectType]: {
    handler: EffectHandler<HTMLElement, EffectOptionsMap[K]>;
    defaultOptions: EffectOptionsMap[K];
  };
};

const effectRegistry: Partial<EffectRegistry> = {};

export function registerEffect<K extends EffectType>(
  name: K,
  handler: EffectHandler<HTMLElement, EffectOptionsMap[K]>,
  defaultOptions?: EffectOptionsMap[K]
): void {
  effectRegistry[name] = {
    handler,
    defaultOptions: defaultOptions || {} as EffectOptionsMap[K]
  };
}

export function getEffectHandler<K extends EffectType>(
  name: K
): EffectHandler<HTMLElement, EffectOptionsMap[K]> | undefined {
  return effectRegistry[name]?.handler;
}

export function getEffectOptions<K extends EffectType>(
  name: K
): EffectOptionsMap[K] | undefined {
  return effectRegistry[name]?.defaultOptions;
}
