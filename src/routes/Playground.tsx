import { useState, useRef } from 'react';
import { Button, Dropdown, Tabs, Disclosure, Modal } from '../components';
import RippleDemo from '../components/RippleDemo';
import { TabsRef } from '../components/Tabs';
import { triggerRipple } from '../effects';

const ButtonsDemo = () => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-800">Buttons</h2>
    <div className="flex flex-wrap gap-4">
      <Button>Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="danger">Danger Button</Button>
    </div>
  </section>
);

const DropdownDemo = () => (
  <section className="space-y-4 pt-8 border-t border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800">Dropdown Menu</h2>
    <div className="p-4 bg-white rounded-lg shadow">
      <Dropdown />
    </div>
  </section>
);

const ModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section className="space-y-4 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Modal</h2>
      <div className="p-4 bg-white rounded-lg shadow space-y-4">
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p className="text-gray-700">This is a modal dialog. Click outside or press the close button to dismiss.</p>
        </Modal>
      </div>
    </section>
  );
};

const TabsDemo = ({ onTabClick }: { onTabClick: () => void }) => {
  return (
    <section 
      className="space-y-4 pt-8 border-t border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors p-4 rounded-lg"
      onClick={onTabClick}
    >
      <h2 className="text-xl font-semibold text-gray-800">Tabs</h2>
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-600">Click to scroll to top and see ripple effect on active tab</p> 
      </div>
    </section>
  );
};

const DisclosureDemo = () => (
  <section className="space-y-4 pt-8 border-t border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800">Disclosure (Accordion)</h2>
    <div className="p-4 bg-white rounded-lg shadow">
      <Disclosure />
    </div>
  </section>
);


const Playground = () => {
  const tabsRef = useRef<TabsRef>(null);
  
  const handleTabClick = () => {
    // Get the active tab element
    const activeTab = document.querySelector('.tab-button[data-active="true"]') as HTMLElement;
    
    if (activeTab) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // After scroll, trigger ripple on the active tab
      setTimeout(() => {
        if (tabsRef.current) {
          // Trigger ripple on the active tab
          triggerRipple(activeTab, {
            color: 'rgba(59, 130, 246, 0.6)',
            duration: 1600,
            maxSize: 1.5,
            centered: true
          });
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Components Playground</h1>
        <Tabs 
          ref={tabsRef}
          tabs={[
            { 
              name: 'UI Components', 
              content: (
                <div className="space-y-12">
                  <ButtonsDemo />
                  <DropdownDemo />
                  <ModalDemo />
                  <TabsDemo onTabClick={handleTabClick} />
                  <DisclosureDemo />
                </div>
              ) 
            },
            { name: 'Ripple Effect', content: <RippleDemo /> },
          ]} 
        />
      </div>
    </div>
  );
};

export default Playground;
