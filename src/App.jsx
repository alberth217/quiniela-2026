import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Admin from './Admin';
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
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mis-puntos" element={<MisPuntos />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/pago-exitoso" element={<PagoExitoso />} />
      <Route path="/pago-fallido" element={<PagoFallido />} />
    </Routes>
  );
}

export default App;