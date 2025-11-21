// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// Importahin dito ang iba pang pages sa hinaharap

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

    </Routes>
  );
}

export default App;