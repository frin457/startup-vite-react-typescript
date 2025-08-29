import { registerEffect } from './types';

interface FireworkOptions {
  duration?: number;
  intensity?: number;
  colorStops?: string[];
  particleSize?: number;
  spread?: number;
  active?: boolean;
  inverted?: boolean;
}

const defaultOptions: FireworkOptions = {
  duration: 1000,
  intensity: 1,
  particleSize: 8,
  spread: 1.2,
  colorStops: [
    'rgba(255, 80, 0, 0.8)',  // Orange-red
    'rgba(255, 120, 0, 0.6)', // Orange
    'rgba(255, 200, 0, 0.4)', // Yellow-orange
    'rgba(255, 255, 0, 0.2)'  // Yellow
  ],
  active: true,
  inverted: false
};

function createParticle(size: number) {
  const particle = document.createElement('div');
  Object.assign(particle.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    pointerEvents: 'none',
    transformOrigin: 'center center',
    willChange: 'transform, opacity',
    zIndex: '999'
  });
  return particle;
}

function getRandomPositionOnBorder(rect: DOMRect,particleSize: number, inverted: boolean): {x: number, y: number} {
  // Choose a random edge (0: top, 1: right, 2: bottom, 3: left)
  const edge = Math.floor(Math.random() * 4);
  
  switch (edge) {
    case 0: // Top edge
      return { x: Math.random() * rect.width, y: 0  };
    case 1: // Right edge
      return { x: rect.width - (inverted ? (particleSize * 2) : 0), y: Math.random() * rect.height };
    case 2: // Bottom edge
      return { x: Math.random() * rect.width, y: rect.height - (inverted ? (particleSize * 1.4) : 0) };
    case 3: // Left edge
      return { x: 0 , y: Math.random() * rect.height };
    default:
      return { x: 0, y: 0 };
  }
}

function animateFirework(element: HTMLElement, options: FireworkOptions = {}) {
  if (!options.active) return;
  
  const { duration, intensity = 1, colorStops = [], particleSize = 8, spread = 1.2 } = options;
  const rect = element.getBoundingClientRect();
  const particles: HTMLDivElement[] = [];
  const particleCount = Math.floor(20 * intensity);
  
  // Ensure the element has relative or absolute positioning
  const elementPosition = window.getComputedStyle(element).position;
  if (elementPosition === 'static') {
    element.style.position = 'relative';
  }
  
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle(particleSize);
    const color = colorStops[Math.floor(Math.random() * colorStops.length)] || 'orange';
    
    // Get position relative to the element
    const { x, y } = getRandomPositionOnBorder(rect,particleSize, options.inverted ?? false);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate direction from center to edge
    const angle = Math.atan2(y - centerY, x - centerX);
    const distance = Math.min(rect.width, rect.height) * 0.1 * spread;
    
    // Calculate end position (inward from the edge)
    const endX = centerX + Math.cos(angle) * distance * (0.5 + Math.random() );
    const endY = centerY + Math.sin(angle) * distance * (0.5 + Math.random() );
    
    // Position the particle relative to the element
    Object.assign(particle.style, {
      left: `${ options.inverted ? x : centerX}px`,
      top: `${ options.inverted ? y : centerY}px`,
      backgroundColor: color,
      opacity: '0.8',
      transform: 'scale(1)'
    });
    
    element.appendChild(particle);
    particles.push(particle);
    
    // Base animation keyframes
    const keyframes: Keyframe[] = [
      { 
        transform: 'scale(1)',
        opacity: 1
      },
      { 
        transform: options.inverted 
          ? `translate(${endX - x}px, ${endY - y}px) scale(${0.2 + Math.random()})` //firework in
          : `translate(${x - endX}px, ${y - endY}px) scale(${0.2 + Math.random()})`, //firework out
        opacity: 0
      }
    ];
    
    // Add additional steps for firework out
    if (!options.inverted) {
      keyframes.push(
        { 
          transform: `translate(${x - endX - ((options.intensity ?? 5) + Math.random())}px, ${y - endY - ((options.intensity ?? 5) + Math.random()) * 0.5}px) scale(${0.1 + Math.random()})`,
          opacity: 0.5
        },
        { 
          transform: `translate(${x - endX - ((options.intensity ?? 5) + Math.random()) * 0.5}px, ${y - endY - ((options.intensity ?? 5) + Math.random()) * 0.5}px) scale(${0.1 + Math.random()})`,
          opacity: 0
        }
      );
    } else {
      // For firework in, just add the final opacity change
    //   keyframes.unshift({ 
    //     transform: `scale(${0.1 + Math.random()})`,
    //     opacity: 1
    //   },
    //   { 
    //     transform: `scale(1)`,
    //     opacity: 0.5
    //   });
      keyframes.push({
        opacity: 0
      });
    }

    const animation = particle.animate(
      keyframes,
      {
        duration: (duration || 1000) * (0.8 + Math.random() * 0.4),
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }
    );
    
    animation.onfinish = () => {
      particle.remove();
    };
  }
  
  return () => {
    particles.forEach(p => p.remove());
  };
}

declare module './types' {
  interface EffectOptionsMap {
    firework: FireworkOptions;
  }
}

registerEffect('firework', (element, options: FireworkOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  let cleanup: (() => void) | undefined;
  let interval: number;
  
  if (mergedOptions.active) {
    cleanup = animateFirework(element, mergedOptions);
    
    interval = window.setInterval(() => {
      cleanup = animateFirework(element, mergedOptions);
    }, mergedOptions.duration! / 2);
  }
  
  return () => {
    clearInterval(interval);
    if (cleanup) cleanup();
  };
}, defaultOptions);

export function triggerFirework(element: HTMLElement, options: FireworkOptions = {}) {
  return animateFirework(element, { ...defaultOptions, ...options });
}
