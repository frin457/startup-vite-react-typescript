import { forwardRef, useImperativeHandle, useRef} from 'react';
import Button from './Button';
import { triggerRipple } from '../effects';
import { defaultRippleOptions } from '../hooks/types/ripple';

export interface RippleDemoRef {
  focus: () => void;
}

const RippleDemo = forwardRef<RippleDemoRef>((_, ref) => {
  const targetButtonRef = useRef<HTMLButtonElement>(null);
  
    const handleTriggerRipple = () => {
      if (targetButtonRef.current) {
        const button = targetButtonRef.current;
      //   const rect = button.getBoundingClientRect();
        
        // Trigger ripple at the center of the target button
        triggerRipple(button, {
          color: 'rgba(198, 211, 233, 0.6)', // blue-500 with 60% opacity
          duration: 1000,
          maxSize: 1.5,
          centered: true,
          x: 0.5,  // Center X (0-1)
          y: 0.5   // Center Y (0-1)
        });
      }
    };
    const buttonRef = useRef<HTMLButtonElement>(null);
  
    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));
  
    return (
      <div className="flex flex-col items-center justify-center p-8">
        
        <Button 
          ref={buttonRef}
          variant="danger"
          ripple={true}
          className="px-6 py-3 text-lg"
          options={defaultRippleOptions}
        >
          Default Ripple
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 pt-8">Remote Effect Test</h1>
      
      <div className="space-y-8 w-full max-w-md">
        {/* Trigger Button */}
        <div className="text-center">
          <Button 
            onClick={handleTriggerRipple}
            className="w-full py-3 text-lg"
          >
            Click to Trigger Ripple
          </Button>
          <p className="mt-2 text-sm text-gray-500">Click this button to trigger ripple on the button below</p>
        </div>

        {/* Target Button */}
        <div className="text-center">
          <Button 
            ref={targetButtonRef}
            variant="primary"
            className="w-full py-3 text-lg relative overflow-hidden"
          >
            Watch Me Ripple
          </Button>
          <p className="mt-2 text-sm text-gray-500">This button will show a ripple effect</p>
        </div>
      </div>
      </div>
    );
});

export default RippleDemo;