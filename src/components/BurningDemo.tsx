import { forwardRef, useImperativeHandle, useRef } from 'react';
import { triggerBurning } from '../effects/burning';
import Button from './Button';

export interface BurningDemoRef {
  triggerBurning: () => void;
}

const BurningDemo = forwardRef<BurningDemoRef>((_, ref) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTriggerBurning = () => {
    if (targetRef.current) {
      triggerBurning(targetRef.current, {
        duration: 1200,
        intensity: 1.5,
        flameHeight: 1.5,
        flickerSpeed: 1.2,
        colorStops: [
          'rgba(255, 80, 0, 0.9)',
          'rgba(255, 120, 0, 0.7)',
          'rgba(255, 200, 0, 0.5)',
          'rgba(255, 255, 0, 0.3)'
        ]
      });
    }
  };

  useImperativeHandle(ref, () => ({
    triggerBurning: handleTriggerBurning
  }));

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div 
        ref={targetRef}
        className="w-64 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-visible flex items-center justify-center"
      >
        <span className="text-gray-500">Click below to burn</span>
      </div>

      <Button 
        ref={buttonRef}
        onClick={handleTriggerBurning}
        className="px-6 py-3 text-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors"
      >
        Trigger Burning Effect
      </Button>

      <div className="text-sm text-gray-600 text-center max-w-md">
        <p>This demonstrates the burning animation effect that simulates flames rising from the bottom of the element.</p>
        <p className="mt-2">Try clicking the button multiple times to see multiple flame effects!</p>
      </div>
    </div>
  );
});

BurningDemo.displayName = 'BurningDemo';

export default BurningDemo;
