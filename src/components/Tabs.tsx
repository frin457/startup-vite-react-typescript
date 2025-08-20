import { useState } from 'react';

type TabItem = {
  name: string;
  content: React.ReactNode;
  current?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const currentTab = tabs[activeTab] || tabs[0];

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
        >
          {tabs.map((tab, index) => (
            <option key={tab.name} value={index}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={classNames(
                  index === activeTab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                )}
                aria-current={index === activeTab ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-4">
        {currentTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
