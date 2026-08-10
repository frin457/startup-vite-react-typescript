import { registerEffect } from './types';
import type { BurningOptions, BurningOrigin } from './types';

const defaultBurningOptions: BurningOptions = {
  duration: 1200,
  intensity: 1,
  flameHeight: 1.2,
  flickerSpeed: 1,
  colorStops: [
    'rgba(255, 80, 0, 0.9)',
    'rgba(255, 120, 0, 0.7)',
    'rgba(255, 200, 0, 0.5)',
    'rgba(255, 255, 0, 0.3)'
  ],
  active: true,
  origin: {
    type: 'element'
  }
};

function createFlameParticle() {
  const particle = document.createElement('div');
  const width = 4 + Math.random() * 8;
  const height = 10 + Math.random() * 20;

  Object.assign(particle.style, {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: '50% 50% 20% 20%',
    pointerEvents: 'none',
    transformOrigin: 'center bottom',
    willChange: 'transform, opacity',
    zIndex: '9999',
    filter: 'blur(2px)'
  });

  return { particle, width, height };
}

function getElementOrigin(rect: DOMRect, height: number) {
  return {
    x: Math.random() * rect.width,
    y: rect.height - height / 2 
  };
}

function getPointOrigin(origin: BurningOrigin, height: number) {
if (origin.type === 'point') {
    return {
      x: origin.x,
      y: origin.y - height / 2
    };
  }
  
}

function getBorderOrigin(rect: DOMRect) {
  const perimeter =
    2 * rect.width +
    2 * rect.height;

  const distance = Math.random() * perimeter;

  if (distance < rect.width) {
    return {
      x: distance,
      y: 0
    };
  }

  if (distance < rect.width + rect.height) {
    return {
      x: rect.width,
      y: distance - rect.width
    };
  }

  if (distance < 2 * rect.width + rect.height) {
    return {
      x: rect.width - (distance - rect.width - rect.height),
      y: rect.height
    };
  }

  return {
    x: 0,
    y: rect.height - (distance - 2 * rect.width - rect.height)
  };
}

function getParticleOrigin(
  rect: DOMRect,
  origin: BurningOrigin,
  height: number
) {
  switch (origin.type) {
    case 'element':
      return getElementOrigin(rect, height);

    case 'border':
      return getBorderOrigin(rect);

    case 'point':
      return getPointOrigin(origin, height);
  }
}

function animateBurning(
  element: HTMLElement,
  options: BurningOptions = {}
) {
  if (!options.active) return;

  const {
    duration,
    intensity = 1,
    colorStops = [],
    flameHeight = 1.2,
    flickerSpeed = 1,
    origin = { type: 'element' }
  } = options;

  const rect = element.getBoundingClientRect();
  const particles: HTMLDivElement[] = [];
  const particleCount = Math.floor(15 * intensity);
  const baseFlameHeight = rect.height * 0.15 * flameHeight;

  // Create flame particles
  for (let i = 0; i < particleCount; i++) {
    const { particle, height } = createFlameParticle();

    const color =
      colorStops[Math.floor(Math.random() * colorStops.length)] ||
      'orange';

    const { x, y } = getParticleOrigin(rect, origin, height) || {};

    // Random flicker movement
    const flickerX = (Math.random() - 0.5) * 15 * flickerSpeed;

    // Random scale for natural look
    const startScale = 0.5 + Math.random() * 0.5;
    const endScale = 0.1 + Math.random() * 0.3;

    // Random height variation
    const heightMultiplier = 0.5 + Math.random() * 1.5;

    Object.assign(particle.style, {
      left: `${x}px`,
      top: `${y}px`,
      background: `linear-gradient(to top, ${color} 0%, transparent 100%)`,
      opacity: '0.8',
      transform: `scale(${startScale})`
    });

    element.style.position = 'relative';
    element.style.overflow = 'visible';
    element.appendChild(particle);
    particles.push(particle);

    // Animate each flame particle
    const animation = particle.animate(
      [
        {
          transform: `translate(0, 0) scale(${startScale})`,
          opacity: 0.8,
          filter: 'blur(2px)'
        },
        {
          transform: `translate(${flickerX}px, -${
            baseFlameHeight * heightMultiplier
          }px) scale(${endScale})`,
          opacity: 0,
          filter: 'blur(4px)'
        }
      ],
      {
        duration:
          (duration || 1200) * (0.7 + Math.random() * 0.6),
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }
    );

    // Clean up after animation
    animation.onfinish = () => {
      particle.remove();
    };
  }

  return () => {
    particles.forEach((particle) => particle.remove());
  };
}

// Register the burning effect
declare module './types' {
  interface EffectOptionsMap {
    burning: BurningOptions;
  }
}

registerEffect(
  'burning',
  (element, options: BurningOptions = {}) => {
    const mergedOptions = {
      ...defaultBurningOptions,
      ...options
    };

    let cleanup: (() => void) | undefined;
    let interval: number | undefined;

    if (mergedOptions.active) {
      // Initial animation
      cleanup = animateBurning(element, mergedOptions);

      // Set up interval for continuous burning effect
      interval = window.setInterval(() => {
        cleanup = animateBurning(element, mergedOptions);
      }, mergedOptions.duration! / 3);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }

      if (cleanup) {
        cleanup();
      }
    };
  },
  defaultBurningOptions
);

// Export for programmatic use
export function triggerBurning(
  element: HTMLElement,
  options: BurningOptions = {}
) {
  return animateBurning(element, {
    ...defaultBurningOptions,
    ...options
  });
}
