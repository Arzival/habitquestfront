import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal - Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
