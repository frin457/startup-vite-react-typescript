import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Playground from './routes/Playground';
import TestPage from './routes/TestPage';

const isDev = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';

const App = () => {

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
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
