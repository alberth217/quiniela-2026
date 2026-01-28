import React, { useState } from 'react';
import { Trophy, Home, BarChart2, LogOut, Ticket, Book, ClipboardList, Menu, X, User, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ currentUser, onLogout }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50';
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isActive(to)}`}
            onClick={() => setMobileMenuOpen(false)}
        >
            <Icon size={18} />
            {label}
        </Link>
    );

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                {/* LOGO */}
                <div className="flex items-center gap-2">
                    <img src="/img/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                    <span className="font-black text-xl tracking-tighter text-blue-900 hidden sm:block">PREDIGOL</span>
                </div>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-1">
                    <NavItem to="/dashboard" icon={Home} label="Inicio" />
                    <NavItem to="/partidos" icon={Calendar} label="Calendario" />
                    <NavItem to="/predicciones" icon={ClipboardList} label="Predicciones" />
                    <NavItem to="/ranking" icon={Trophy} label="Ranking" />
                    <NavItem to="/reglas" icon={Book} label="Reglas" />
                    <NavItem to="/pagos" icon={Ticket} label="Pagos" />
                    {currentUser?.es_admin && (
                        <NavItem to="/admin" icon={ClipboardList} label="Admin Panel" />
                    )}
                </div>

                {/* USER & ACTIONS */}
                <div className="flex items-center gap-4">
                    {currentUser && (
                        <Link to="/perfil" className="hidden md:flex flex-col items-end mr-2 hover:opacity-80 transition-opacity">
                            <span className="text-xs text-slate-400 font-bold uppercase">Bienvenido</span>
                            <span className="text-sm font-bold text-slate-800 leading-none">{currentUser.nombre}</span>
                        </Link>
                    )}

                    {/* Botón Logout Desktop */}
                    <button onClick={onLogout} className="hidden md:block p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Cerrar Sesión">
                        <LogOut size={20} />
                    </button>

                    {/* Botón Menú Móvil */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-2 animate-fade-in-down">
                    {currentUser && (
                        <div className="mb-4 pb-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                {currentUser.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">{currentUser.nombre}</div>
                                <div className="text-xs text-slate-500">{currentUser.email}</div>
                            </div>
                        </div>
                    )}
                    <NavItem to="/dashboard" icon={Home} label="Inicio" />
                    <NavItem to="/partidos" icon={Calendar} label="Calendario" />
                    <NavItem to="/predicciones" icon={ClipboardList} label="Predicciones" />
                    <NavItem to="/ranking" icon={Trophy} label="Ranking" />
                    <NavItem to="/reglas" icon={Book} label="Reglas" />
                    <NavItem to="/pagos" icon={Ticket} label="Pagos" />
                    <NavItem to="/perfil" icon={User} label="Mi Perfil" />

                    <button
                        onClick={onLogout}
                        className="mt-2 w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
