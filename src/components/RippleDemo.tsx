import { forwardRef, useImperativeHandle, useRef} from 'react';
import Button from './Button';

export interface RippleDemoRef {
  focus: () => void;
}

const RippleDemo = forwardRef<RippleDemoRef>((_, ref) => {
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
          options={{
            color: 'rgb(69, 72, 211)',
            duration: 3000,
            maxSize: 2,
            centered: false
          }}
        >
          Click me for ripple effect!
        </Button>
      </div>
    );
});

export default RippleDemo;