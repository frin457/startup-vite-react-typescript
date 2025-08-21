import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRef } from 'react';
import Tabs, { TabsRef } from './components/Tabs';
import ChatBox from './components/ChatBox';
import Playground from './routes/Playground';
import type { RippleOptions } from './effects/types';

const isDev = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';

const App = () => {
  const tabsRef = useRef<TabsRef>(null);

  const handleTriggerRipple = () => {
    tabsRef.current?.triggerEffect('ripple', {
      centered: true,
      color: 'rgba(255, 0, 0, 0.3)',
      duration: 800
    } as RippleOptions);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route
          path="/chat"
          element={
            isDev ? (
              <div className="min-h-screen bg-gray-100">
                <ChatBox />
              </div>
            ) : (
              <Navigate to="/test" replace />
            )
          }
        />
        <Route path="/playground" element={<Playground />} />
        <Route 
          path="/test" 
          element={
            <div className="min-h-screen p-8 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Effects System Demo</h1>
                
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h2 className="text-lg font-semibold mb-4">Tabs with Ripple Effect</h2>
                  <Tabs
                    ref={tabsRef}
                    tabs={[
                      { 
                        name: 'Tab 1', 
                        content: <div className="p-4">Content for Tab 1</div> 
                      },
                      { 
                        name: 'Tab 2', 
                        content: <div className="p-4">Content for Tab 2</div> 
                      },
                      { 
                        name: 'Tab 3', 
                        content: <div className="p-4">Content for Tab 3</div>,
                        disabled: true
                      },
                    ]}
                    effectOptions={{
                      color: 'rgba(134, 135, 138, 0.48)',
                      duration: 600
                    }}
                  />
                  
                  <div className="mt-4">
                    <button
                      onClick={handleTriggerRipple}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Trigger Ripple Programmatically
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Custom Button with Ripple</h2>
                  <button
                    className="relative overflow-hidden px-6 py-3 bg-green-500 text-white rounded-lg"
                    onClick={(e) => {
                      tabsRef.current?.triggerEffect('ripple', {
                        clientX: e.clientX,
                        clientY: e.clientY,
                        color: 'rgba(255, 255, 255, 0.5)',
                        duration: 500,
                        active: true
                      } as RippleOptions);
                    }}
                  >
                    Click Me for Ripple
                  </button>
                </div>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
