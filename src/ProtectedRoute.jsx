import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requirePayment = false, requireAdmin = false }) => {
    const location = useLocation();
    const userStr = localStorage.getItem('currentUser');

    // 1. Check if user is logged in
    if (!userStr) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const user = JSON.parse(userStr);

    // 2. Check if payment is required and not made
    if (requirePayment && !user.pago_realizado) {
        return <Navigate to="/dashboard?tab=pagos" replace />;
    }

    // 3. Check if admin is required
    if (requireAdmin && !user.es_admin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
