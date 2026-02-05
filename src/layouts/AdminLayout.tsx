import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
            navigate('/login', { state: { from: { pathname: '/admin/products' } } });
        }
    }, [isAuthenticated, user, isLoading, navigate]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!isAuthenticated || user?.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
                <div className="p-8 border-b border-gray-100">
                    <h1 className="text-xl font-serif italic">Stenna Admin</h1>
                    <p className="text-xs text-gray-400 mt-2">Welcome, {user?.companyName || 'Admin'}</p>
                </div>
                <nav className="p-6 flex flex-col gap-4">
                    <Link to="/admin/products" className="text-sm tracking-widest uppercase hover:text-gray-500">Products</Link>
                    <Link to="/admin/settings" className="text-sm tracking-widest uppercase hover:text-gray-500">Settings</Link>

                    <div className="h-px bg-gray-100 my-4" />
                    <Link to="/" className="text-xs text-gray-400 hover:text-black">View Site</Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 w-full p-12">
                <Outlet />
            </main>
        </div>
    );
};
