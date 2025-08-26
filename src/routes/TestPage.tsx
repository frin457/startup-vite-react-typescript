import { useRef } from 'react';
import { Button } from '../components';
import { triggerRipple } from '../effects/ripple';

const TestPage = () => {
  const targetButtonRef = useRef<HTMLButtonElement>(null);

  const handleTriggerRipple = () => {
    if (targetButtonRef.current) {
      const button = targetButtonRef.current;
    //   const rect = button.getBoundingClientRect();
      
      // Trigger ripple at the center of the target button
      triggerRipple(button, {
        color: 'rgba(59, 130, 246, 0.6)', // blue-500 with 60% opacity
        duration: 800,
        maxSize: 1.5,
        centered: true,
        x: 0.5,  // Center X (0-1)
        y: 0.5   // Center Y (0-1)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ripple Effect Test</h1>
      
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
};

export default TestPage;
