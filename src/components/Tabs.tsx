import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useAnimations } from '../hooks/useAnimations';
import type { EffectType, EffectOptionsMap } from '../effects/types';

type TabItem = {
  name: string;
  content: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  effectType?: EffectType;
  effectOptions?: EffectOptionsMap[EffectType] & { active?: boolean };
  className?: string;
};

export type TabsRef = {
  triggerEffect: <K extends EffectType>(
    type: K, 
    options?: EffectOptionsMap[K] & { active?: boolean }
  ) => void;
};

const Tabs = forwardRef<TabsRef, TabsProps>(({ 
  tabs, 
  effectOptions = { active: true },
  className = ''
}, ref) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize animations
  const { triggerEffect } = useAnimations(tabsContainerRef, effectOptions);

  // Expose the triggerEffect method through ref
  useImperativeHandle(ref, () => ({
    triggerEffect: <K extends EffectType>(
      type: K, 
      options?: EffectOptionsMap[K] & { active?: boolean }
    ) => {
      if (effectOptions.active && tabsContainerRef.current) {
        triggerEffect(type, options);
      }
    }
  }));

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    // console.log(e)
    // Trigger ripple at (0,0) position of the tabs container
    // if (tabsContainerRef.current) {
    //   triggerEffect('ripple', {
    //     ...effectOptions,
    //     x: 0,  // 0% from left
    //     y: 0,  // 0% from top
    //     // clientX: tabsContainerRef.current.getBoundingClientRect().x,
    //     // clientY: tabsContainerRef.current.getBoundingClientRect().y,
    //     // centered: true,  // Center the ripple at the specified coordinates
    //     active: true
    //   });
    // }
  };

  return (
    <div className={className}>
      <div 
        className="relative overflow-hidden"
        ref={tabsContainerRef}
      >
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(index)}
                disabled={tab.disabled}
                className={classNames(
                  index === activeTab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                )}
                data-active={index === activeTab ? 'true' : 'false'}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
});

// Helper function for class names
function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

Tabs.displayName = 'Tabs';

export default Tabs;
