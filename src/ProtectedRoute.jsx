import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requirePayment = false }) => {
    const location = useLocation();
    const userStr = localStorage.getItem('currentUser');

    // 1. Check if user is logged in
    if (!userStr) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const user = JSON.parse(userStr);

    // 2. Check if payment is required and not made
    if (requirePayment && !user.pago_realizado) {
        // Redirect to Dashboard where the payment button is located, passing a state to open the 'Pagos' tab optionally
        // or we could redirect to a specific "Payment Required" page if it existed.
        // For now, let's redirect to Dashboard with a query param or state?
        // Actually, simply redirecting to dashboard (which is accessible) stands as the "Payment Required" landing
        return <Navigate to="/dashboard?tab=pagos" replace />;
    }

    return children;
};

export default ProtectedRoute;
