import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            login(token, user);

            // Determine redirect path
            let redirectPath = from;
            if (from === '/' && user.role === 'ADMIN') {
                redirectPath = '/admin/products';
            }

            navigate(redirectPath, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Image Side */}
            <div className="hidden lg:block w-1/2 relative bg-gray-100 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1628413993904-94ecb60d616c?q=80&w=1200"
                    alt="Login Background"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-12 left-12">
                    <h1 className="text-white text-3xl font-serif tracking-widest">STENNA</h1>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative">
                <Link to="/" className="absolute top-12 right-12 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black">
                    Close
                </Link>

                <div className="w-full max-w-sm">
                    <h2 className="text-4xl font-serif italic mb-12">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-light text-lg"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 block">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors font-light text-lg"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform duration-300"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <span className="text-sm text-gray-400 font-light">Don't have an account? </span>
                        <Link to="/register" className="text-sm border-b border-black pb-0.5 ml-2 hover:opacity-50">Apply for Access</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
