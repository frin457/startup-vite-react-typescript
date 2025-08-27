import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Playground from './routes/Playground';

const isDev = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/playground" replace />} />
        <Route
          path="/chat"
          element={
            isDev ? (
              <div className="min-h-screen bg-gray-100">
                <ChatBox />
              </div>
            ) : (
              <Navigate to="/playground" replace />
            )
          }
        />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </Router>
  );
};

export default App;
