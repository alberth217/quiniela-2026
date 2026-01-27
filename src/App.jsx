import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';
import ProtectedRoute from './ProtectedRoute';
import PagoExitoso from './PagoExitoso';
import PagoFallido from './PagoFallido';

// Layout & Pages
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import Predicciones from './Predicciones';
import Ranking from './Ranking';
import Reglas from './Reglas';
import Pagos from './Pagos';
import Perfil from './Perfil';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas del Dashboard con Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/predicciones" element={<Predicciones />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/reglas" element={<Reglas />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Admin Route */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminPanel />} />
      </Route>

      <Route path="/pago-exitoso" element={<PagoExitoso />} />
      <Route path="/pago-fallido" element={<PagoFallido />} />
    </Routes>
  );
}

export default App;