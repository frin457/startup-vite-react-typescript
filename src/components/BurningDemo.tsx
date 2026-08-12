import {
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';

import { useAnimations } from '../hooks/useAnimations';
import type { BurningOptions } from '../effects/types';

import Button from './Button';

export interface BurningDemoRef {
  triggerBurning: (options?: BurningOptions) => void;
  triggerBurningAtPoint: (x: number, y: number) => void;
  triggerBurningBorders: () => void;
  triggerContinuousBurning: () => void;
}

const defaultBurningOptions: BurningOptions = {
  duration: 1200,
  intensity: 1.5,
  flameHeight: 1.5,
  flickerSpeed: 1.2,
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

const BurningDemo = forwardRef<BurningDemoRef>((_, ref) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { triggerEffect } = useAnimations<
    HTMLDivElement,
    'burning'
  >(
    targetRef,
    defaultBurningOptions
  );

  /**
   * Trigger a single burning cycle using the element origin.
   */
  const handleTriggerBurning = (
    options: BurningOptions = {}
  ) => {
    triggerEffect('burning', {
      ...defaultBurningOptions,
      ...options,
      origin: options.origin ?? {
        type: 'element'
      }
    });
  };

  /**
   * Trigger a single burning cycle from a point
   * relative to the target element.
   */
  const handleTriggerBurningAtPoint = (
    x: number,
    y: number
  ) => {
    triggerEffect('burning', {
      ...defaultBurningOptions,
      origin: {
        type: 'point',
        x,
        y
      }
    });
  };

  /**
   * Trigger a single burning cycle across the
   * entire border of the target element.
   */
  const handleTriggerBurningBorders = () => {
    triggerEffect('burning', {
      ...defaultBurningOptions,
      origin: {
        type: 'border'
      }
    });
  };

  /**
   * Trigger a continuous burning effect.
   *
   * effectPeriod is expressed in seconds.
   * 0.4 = new flame batch every 400ms.
   */
  const handleTriggerContinuousBurning = () => {
    triggerEffect('burning', {
      ...defaultBurningOptions,
      origin: {
        type: 'border'
      },
      effectPeriod: 0.4
    });
  };

  /**
   * Convert the mouse position from viewport coordinates
   * into coordinates relative to the target element.
   */
  const handleTargetClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!targetRef.current) return;

    const rect =
      targetRef.current.getBoundingClientRect();

    handleTriggerBurningAtPoint(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  };

  useImperativeHandle(ref, () => ({
    triggerBurning: handleTriggerBurning,
    triggerBurningAtPoint: handleTriggerBurningAtPoint,
    triggerBurningBorders: handleTriggerBurningBorders,
    triggerContinuousBurning: handleTriggerContinuousBurning
  }));

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold">
        Burning Effect
      </h2>

      <p className="text-sm text-gray-600 text-center max-w-md">
        This demo supports element-based, border-based,
        point-based, and continuous burning effects.
      </p>

      {/* Target element */}
      <div
        ref={targetRef}
        onClick={handleTargetClick}
        className="relative flex items-center justify-center w-80 h-40 rounded-lg border-2 border-gray-300 bg-gray-100 cursor-crosshair select-none"
      >
        <span className="text-gray-700 font-medium">
          Click anywhere to burn from that point
        </span>
      </div>

      {/* Burning controls */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* Element-origin burning */}
        <Button
          onClick={() =>
            handleTriggerBurning({
              origin: {
                type: 'element'
              }
            })
          }
          className="px-6 py-3 text-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors"
        >
          Burn From Bottom
        </Button>

        {/* Border-origin burning */}
        <Button
          onClick={handleTriggerBurningBorders}
          className="px-6 py-3 text-lg bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700 transition-colors"
        >
          Burn All Borders
        </Button>

        {/* Point-origin burning */}
        <Button
          onClick={() => {
            if (!targetRef.current) return;

            const rect =
              targetRef.current.getBoundingClientRect();

            handleTriggerBurningAtPoint(
              rect.width / 2,
              rect.height / 2
            );
          }}
          className="px-6 py-3 text-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-yellow-700 transition-colors"
        >
          Burn From Center
        </Button>

        {/* Continuous burning */}
        <Button
          onClick={handleTriggerContinuousBurning}
          className="px-6 py-3 text-lg bg-gradient-to-r from-red-600 to-orange-700 text-white hover:from-red-700 hover:to-orange-800 transition-colors"
        >
          Continuous Burn
        </Button>
      </div>

      <div className="text-sm text-gray-600 text-center max-w-md space-y-2">
        <p>
          <strong>Burn From Bottom:</strong> flames originate
          along the bottom edge of the element.
        </p>

        <p>
          <strong>Burn All Borders:</strong> flames originate
          around the entire perimeter of the element.
        </p>

        <p>
          <strong>Burn From Center:</strong> demonstrates a
          programmatically specified point origin.
        </p>

        <p>
          <strong>Click the target:</strong> starts the burning
          effect at the clicked point.
        </p>

        <p>
          <strong>Continuous Burn:</strong> uses the shared
          effect scheduler to create a new border-burning cycle
          every 0.4 seconds.
        </p>
      </div>
    </div>
  );
});

BurningDemo.displayName = 'BurningDemo';

export default BurningDemo;
