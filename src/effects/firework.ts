import { registerEffect } from './types';

interface FireworkOptions {
  duration?: number;
  intensity?: number;
  colorStops?: string[];
  active?: boolean;
  particleSize?: number;
  spread?: number;
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
  active: true
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
    zIndex: '9999'
  });
  return particle;
}

function getRandomPositionOnBorder(rect: DOMRect): {x: number, y: number} {
  const perimeter = 2 * (rect.width + rect.height);
  const randomPos = Math.random() * perimeter;
  
  if (randomPos < rect.width) {
    return { x: randomPos, y: 0 };
  } else if (randomPos < rect.width + rect.height) {
    return { x: rect.width, y: randomPos - rect.width };
  } else if (randomPos < 2 * rect.width + rect.height) {
    return { x: (2 * rect.width + rect.height) - randomPos, y: rect.height };
  } else {
    return { x: 0, y: perimeter - randomPos };
  }
}

function animateFirework(element: HTMLElement, options: FireworkOptions = {}) {
  if (!options.active) return;
  
  const { duration, intensity = 1, colorStops = [], particleSize = 8, spread = 1.2 } = options;
  const rect = element.getBoundingClientRect();
  const particles: HTMLDivElement[] = [];
  const particleCount = Math.floor(20 * intensity);
  
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle(particleSize);
    const color = colorStops[Math.floor(Math.random() * colorStops.length)] || 'orange';
    
    const { x, y } = getRandomPositionOnBorder(rect);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX);
    const distance = Math.min(rect.width, rect.height) * 0.5 * spread;
    
    const endX = x + Math.cos(angle) * distance * (0.5 + Math.random() * 0.5);
    const endY = y + Math.sin(angle) * distance * (0.5 + Math.random() * 0.5);
    
    Object.assign(particle.style, {
      left: `${x}px`,
      top: `${y}px`,
      background: color,
      boxShadow: `0 0 ${5 + Math.random() * 10}px ${color}`
    });
    
    element.style.position = 'relative';
    element.style.overflow = 'visible';
    element.appendChild(particle);
    particles.push(particle);
    
    const animation = particle.animate(
      [
        { 
          transform: 'scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(${endX - x}px, ${endY - y}px) scale(${0.2 + Math.random() * 0.3})`,
          opacity: 0
        }
      ],
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
