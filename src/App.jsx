import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// Import dashboard (create a dummy one if you haven't yet, or use your existing one)
// import DashboardPage from './pages/DashboardPage'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* Add the route for the dashboard */}
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
    </Routes>
  );
}

export default App;