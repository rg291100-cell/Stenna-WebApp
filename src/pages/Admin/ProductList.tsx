import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CircularProgress } from '@mui/material';

export const ProductList: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const response = await api.get('/api/products');
            return response.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        }
    });

    if (isLoading) return <div className="p-12"><CircularProgress color="inherit" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-serif italic">Inventory</h2>
                <Link to="/admin/products/new" className="bg-black text-white text-xs uppercase tracking-widest px-6 py-3 hover:opacity-80 transition-opacity">
                    Add New Product
                </Link>
            </div>

            <div className="bg-white border border-gray-100">
                <div className="grid grid-cols-12 border-b border-gray-100 p-4 text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50">
                    <div className="col-span-1">Image</div>
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">SKU</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {products?.map((p: any) => (
                    <div key={p.id} className="grid grid-cols-12 border-b border-gray-100 p-4 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-1">
                            <img src={p.images?.[0] || p.image} alt={p.name} className="w-12 h-16 object-cover" />
                        </div>
                        <div className="col-span-4 font-serif">{p.name}</div>
                        <div className="col-span-2 text-xs text-gray-500">{p.sku}</div>
                        <div className="col-span-2 text-xs font-bold">${Number(p.price)}</div>
                        <div className="col-span-2 text-[10px] uppercase">{p.category}</div>
                        <div className="col-span-1 flex justify-end gap-4">
                            <Link to={`/admin/products/${p.id}/edit`} className="text-gray-400 hover:text-black">
                                Edit
                            </Link>
                            <button
                                onClick={() => { if (confirm('Delete product?')) deleteMutation.mutate(p.id) }}
                                className="text-red-300 hover:text-red-500"
                            >
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
