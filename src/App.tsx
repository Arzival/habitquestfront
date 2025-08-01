import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal redirige al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Ruta del dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
