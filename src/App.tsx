import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Playground from './routes/Playground';

const isDev = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBox />} />
        <Route 
          path="/playground" 
          element={
            isDev ? (
              <Playground />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
