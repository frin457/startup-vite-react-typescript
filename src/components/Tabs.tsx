import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useAnimations, EffectsRef, EffectOptions } from '../hooks/useAnimations';
import { createRippleRef, RippleOptions } from '../hooks/types/ripple';

type TabItem = {
  name: string;
  content: React.ReactNode;
  current?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  effectOptions?: EffectOptions;
};

export type TabsRef = {
  triggerRipple: (options?: { x?: number; y?: number } & RippleOptions) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Tabs = forwardRef<TabsRef, TabsProps>(
  ({ tabs, effectOptions = { active: true } }, ref) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const rippleRef = useRef<ReturnType<typeof createRippleRef> | null>(null);

    // Initialize ripple ref
    useEffect(() => {
      if (tabsContainerRef.current) {
        rippleRef.current = createRippleRef(tabsContainerRef, {
          centered: true,
          ...(effectOptions?.config as RippleOptions || {})
        });
      }
    }, [effectOptions?.config]);

    // Expose the ripple trigger through ref
    useImperativeHandle(ref, () => ({
      triggerRipple: (options = {}) => {
        if (rippleRef.current) {
          const { x, y, ...rippleOptions } = options;
          rippleRef.current = createRippleRef(tabsContainerRef, {
            ...rippleOptions,
            ...(x !== undefined && y !== undefined 
              ? { clientX: x, clientY: y }
              : { centered: true }
            )
          });
          rippleRef.current.triggerRipple();
        }
      }
    }));

    const handleTabClick = (index: number, e: React.MouseEvent) => {
      setActiveTab(index);
      
      // Trigger ripple effect at the click position on the outermost div
      if (tabsContainerRef.current) {
        rippleRef.current?.triggerRipple();
      }
    };

    return (
      <div 
        ref={tabsContainerRef}
        className="relative overflow-hidden" // Ensure ripple stays within bounds
      >
        <div className="block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab, index) => {
                const isActive = index === activeTab;
                return (
                  <button
                    key={tab.name}
                    onClick={(e) => handleTabClick(index, e)}
                    className={classNames(
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm relative overflow-hidden'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="py-4">
          {tabs[activeTab]?.content}
        </div>
      </div>
    );
  }
);

export default Tabs;
