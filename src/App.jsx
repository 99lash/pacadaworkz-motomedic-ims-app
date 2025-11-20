import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/views/LoginPage'; // Assume you created this file
// import Dashboard from './modules/users/views/Dashboard'; // Assume you create this file later

// (Optional: A simple mock function to check if the user is logged in)
const isAuthenticated = () => {
  // In a real app, this checks for a valid token in localStorage
  return false; 
};

function App() {
  return (
    <Routes>
      <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" replace />} 
      />
    </Routes>
  );
}

export default App;