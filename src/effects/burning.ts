import { registerEffect } from './types';

interface BurningOptions {
  duration?: number;
  intensity?: number;
  colorStops?: string[];
  active?: boolean;
  flameHeight?: number;
  flickerSpeed?: number;
}

const defaultOptions: BurningOptions = {
  duration: 1200,
  intensity: 1,
  flameHeight: 1.2,  // Multiplier for flame height
  flickerSpeed: 1,    // Speed of flame flickering
  colorStops: [
    'rgba(255, 80, 0, 0.9)',   // Bright orange
    'rgba(255, 120, 0, 0.7)',  // Orange
    'rgba(255, 200, 0, 0.5)',  // Yellow-orange
    'rgba(255, 255, 0, 0.3)'   // Yellow
  ],
  active: true
};

function createFlameParticle() {
  const particle = document.createElement('div');
  const width = 4 + Math.random() * 8;  // Random width for natural look
  const height = 10 + Math.random() * 20; // Random height for variation
  
  Object.assign(particle.style, {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: '50% 50% 20% 20%',  // Flame shape
    pointerEvents: 'none',
    transformOrigin: 'center bottom',
    willChange: 'transform, opacity',
    zIndex: '9999',
    filter: 'blur(2px)'
  });
  
  return { particle, width, height };
}

function animateBurning(element: HTMLElement, options: BurningOptions = {}) {
  if (!options.active) return;
  
  const { 
    duration, 
    intensity = 1, 
    colorStops = [], 
    flameHeight = 1.2,
    flickerSpeed = 1
  } = options;
  
  const rect = element.getBoundingClientRect();
  const particles: HTMLDivElement[] = [];
  const particleCount = Math.floor(15 * intensity);
  const baseFlameHeight = rect.height * 0.15 * flameHeight;
  
  // Create flame particles
  for (let i = 0; i < particleCount; i++) {
    const { particle, width, height } = createFlameParticle();
    const color = colorStops[Math.floor(Math.random() * colorStops.length)] || 'orange';
    
    // Position particles at the bottom of the element
    const x = Math.random() * rect.width;
    const y = rect.height - height / 2;
    
    // Random flicker movement
    const flickerX = (Math.random() - 0.5) * 15 * flickerSpeed;
    const flickerY = (Math.random() - 0.5) * 5 * flickerSpeed;
    
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
          transform: `translate(${flickerX}px, -${baseFlameHeight * heightMultiplier}px) scale(${endScale})`,
          opacity: 0,
          filter: 'blur(4px)'
        }
      ],
      {
        duration: (duration || 1200) * (0.7 + Math.random() * 0.6),
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
    particles.forEach(p => p.remove());
  };
}

// Register the burning effect
declare module './types' {
  interface EffectOptionsMap {
    burning: BurningOptions;
  }
}

registerEffect('burning', (element, options: BurningOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  let cleanup: (() => void) | undefined;
  let interval: number;
  
  if (mergedOptions.active) {
    // Initial animation
    cleanup = animateBurning(element, mergedOptions);
    
    // Set up interval for continuous burning effect
    interval = window.setInterval(() => {
      cleanup = animateBurning(element, mergedOptions);
    }, mergedOptions.duration! / 3);
  }
  
  return () => {
    clearInterval(interval);
    if (cleanup) cleanup();
  };
}, defaultOptions);

// Export for programmatic use
export function triggerBurning(element: HTMLElement, options: BurningOptions = {}) {
  return animateBurning(element, { ...defaultOptions, ...options });
}
