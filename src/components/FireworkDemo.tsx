import { forwardRef, useImperativeHandle, useRef } from 'react';
import { triggerFirework } from '../effects/firework';
import Button from './Button';

export interface FireworkRef {
  triggerFire: (string: 'outwards' | 'inwards') => void;
}

const Firework = forwardRef<FireworkRef>((_, ref) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const targetRef2 = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);

  const handleTriggerFire = (string: 'outwards' | 'inwards') => {
    if (string === 'outwards' && targetRef.current) {
      triggerFirework(targetRef.current, {
        duration: 2000,
        intensity: 10,
        colorStops: [
          'rgba(255, 80, 0, 0.8)',
          'rgba(255, 120, 0, 0.6)',
          'rgba(255, 200, 0, 0.4)',
          'rgba(255, 255, 0, 0.2)'
        ]
      });
    }
    if (string === 'inwards' && targetRef2.current) {
      triggerFirework(targetRef2.current, {
        duration: 2000,
        intensity: 7,
        colorStops: [
          'rgba(255, 80, 0, 0.8)',
          'rgba(255, 120, 0, 0.6)',
          'rgba(255, 200, 0, 0.4)',
          'rgba(255, 255, 0, 0.2)'
        ],
        inverted: true
      });
    }
  };

  useImperativeHandle(ref, () => ({
    triggerFire: handleTriggerFire
  }));

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div 
        ref={targetRef}
        className="w-64 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden flex items-center justify-center"
      >
        <span className="text-gray-500">Click below to trigger firework</span>
      </div>

      <Button 
        ref={buttonRef}
        onClick={() => handleTriggerFire('outwards')}
        className="px-6 py-3 text-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors"
      >
        Firework (Outwards)
      </Button>

      <div className="text-sm text-gray-600 text-center max-w-md">
        <p>This demonstrates the firework animation effect that can be used to create a burst of particles outwards on any element.</p>
        <p className="mt-2">Try clicking the button multiple times to see multiple firework effects!</p>
      </div>

      <div 
        ref={targetRef2}
        className="w-64 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden flex items-center justify-center"
      >
        <span className="text-gray-500">Click below to trigger firework</span>
      </div>

      <Button 
        ref={buttonRef2}
        onClick={() => handleTriggerFire('inwards')}
        className="px-6 py-3 text-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors"
      >
        Firework (Inwards)
      </Button>

      <div className="text-sm text-gray-600 text-center max-w-md">
        <p>This demonstrates the firework animation effect that can be used to create a burst of particles inwards on any element.</p>
        <p className="mt-2">Try clicking the button multiple times to see multiple firework effects!</p>
      </div>
    </div>
    
  );
});

Firework.displayName = 'Firework';

export default Firework;
