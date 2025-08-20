import { useState } from 'react';
import { Button, Dropdown, Tabs, Disclosure, Modal } from '../components';
import RippleDemo from '../components/RippleDemo';

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

const TabsDemo = () => (
  <section className="space-y-4 pt-8 border-t border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800">Tabs</h2>
    <div className="p-4 bg-white rounded-lg shadow">
      <p className="text-gray-600">Tabs component demo would go here</p>
    </div>
  </section>
);

const DisclosureDemo = () => (
  <section className="space-y-4 pt-8 border-t border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800">Disclosure (Accordion)</h2>
    <div className="p-4 bg-white rounded-lg shadow">
      <Disclosure />
    </div>
  </section>
);

const UIComponentsDemo = () => (
  <div className="space-y-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Headless UI Components</h1>
    <ButtonsDemo />
    <DropdownDemo />
    <ModalDemo />
    <TabsDemo />
    <DisclosureDemo />
  </div>
);

const Playground = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Components Playground</h1>
        <Tabs 
          tabs={[
            { name: 'UI Components', content: <UIComponentsDemo /> },
            { name: 'Ripple Effect', content: <RippleDemo /> },
          ]} 
        />
      </div>
    </div>
  );
};

export default Playground;
