import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import config from './config';

const { API_URL } = config;

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    });

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        let userId = null;

        if (userStr) {
            const user = JSON.parse(userStr);
            // Updating state just in case, though useState init handles first render
            setCurrentUser(user);
            userId = user.id;
        } else {
            navigate('/login');
            return;
        }

        // Sync User Status Logic
        const syncUserParams = async () => {
            if (userId) {
                try {
                    const userRes = await fetch(`${API_URL}/usuarios/${userId}`);
                    if (userRes.ok) {
                        const freshUser = await userRes.json();
                        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

                        // Sync local storage if payment status changed
                        if (freshUser.pago_realizado !== storedUser.pago_realizado) {
                            console.log("🔄 Sincronizando estado de pago confirmado...");
                            const updatedUser = { ...storedUser, pago_realizado: freshUser.pago_realizado };
                            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                            setCurrentUser(updatedUser);
                        }
                    }
                } catch (err) {
                    console.error("Error sincronizando usuario:", err);
                }
            }
        };

        syncUserParams();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    if (!currentUser) return null; // Or a loader

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0">
            <Navbar currentUser={currentUser} onLogout={handleLogout} />
            <div className="max-w-[1600px] mx-auto">
                <Outlet context={{ currentUser }} />
            </div>
        </div>
    );
};

export default DashboardLayout;
