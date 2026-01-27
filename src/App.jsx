import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Admin from './Admin';
import ProtectedRoute from './ProtectedRoute';
import PagoExitoso from './PagoExitoso';
import PagoFallido from './PagoFallido';

import Ranking from './Ranking';
import MisPuntos from './MisPuntos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/ranking" element={
        <ProtectedRoute requirePayment={true}>
          <Ranking />
        </ProtectedRoute>
      } />
      <Route path="/mis-puntos" element={
        <ProtectedRoute requirePayment={true}>
          <MisPuntos />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="/pago-exitoso" element={<PagoExitoso />} />
      <Route path="/pago-fallido" element={<PagoFallido />} />
    </Routes>
  );
}

export default App;