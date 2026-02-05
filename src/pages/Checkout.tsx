import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';

export const Checkout: React.FC = () => {
    const { items, removeItem, clearCart, totalItems } = useCart();
    const navigate = useNavigate();
    const [orderType, setOrderType] = useState<'SAMPLE' | 'PURCHASE_ORDER'>('SAMPLE');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/api/orders', data);
        },
        onSuccess: () => {
            setSuccess(true);
            clearCart();
            setTimeout(() => navigate('/'), 3000);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to place order');
        }
    });

    const handleSubmit = () => {
        if (items.length === 0) return;
        mutation.mutate({
            type: orderType,
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        });
    };

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen pt-40 px-6 text-center">
                <h1 className="text-4xl font-serif italic mb-4">Your Bag is Empty</h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Add samples or products from the catalog.</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen pt-40 px-6 text-center">
                <h1 className="text-4xl font-serif italic mb-4">Order Confirmed</h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Thank you for your request. We will be in touch shortly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 pb-24 bg-white">
            <h1 className="text-4xl md:text-6xl font-serif italic mb-12">Checkout</h1>

            <div className="flex flex-col md:flex-row gap-16">
                <div className="w-full md:w-2/3">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-black">
                        <span className="text-[10px] uppercase tracking-widest font-bold">Item</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Quantity</span>
                    </div>

                    <div className="flex flex-col gap-8">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div className="flex gap-6">
                                    <div className="w-20 h-24 bg-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-serif italic">{item.name}</h4>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{item.collection}</p>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-[9px] uppercase tracking-widest text-red-400 mt-3 hover:text-black underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="font-mono text-sm">{item.quantity}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/3 bg-gray-50 p-8 h-fit">
                    <h3 className="text-lg font-serif italic mb-6">Summary</h3>

                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                            <span>Type</span>
                            <select
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value as any)}
                                className="bg-transparent border-b border-gray-300 focus:outline-none text-right font-bold"
                            >
                                <option value="SAMPLE">Sample Request</option>
                                <option value="PURCHASE_ORDER">Purchase Order</option>
                            </select>
                        </div>
                    </div>

                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        {mutation.isPending ? <CircularProgress size={16} color="inherit" /> : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};
