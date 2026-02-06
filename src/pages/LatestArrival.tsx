
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { CircularProgress } from '@mui/material';

const LatestArrival: React.FC = () => {
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products', 'latest'],
        queryFn: async () => {
            const response = await api.get('/api/products');
            // For "Latest", we might want to slice the array or filter, but for now just show all or first 6
            return response.data.slice(0, 6);
        }
    });

    if (isLoading) return (
        <div className="min-h-screen pt-32 px-6 flex justify-center">
            <CircularProgress color="inherit" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen pt-32 px-6 text-center text-red-400 font-mono text-xs">
            Unable to load latest arrivals.
        </div>
    );

    return (
        <div className="bg-white pt-24 min-h-screen">
            <div className="px-6 md:px-12 py-12">
                <div className="max-w-xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-5xl md:text-8xl font-serif mb-8 italic">Latest Arrivals</h1>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 leading-relaxed">
                        Discover our newest additions. A curation of avant-garde textures and timeless classics, fresh from our atelier.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                    {products?.map((product: any) => (
                        <div key={product.id} className="group cursor-pointer">
                            <Link to={`/product/${product.id}`} className="block">
                                <div className="aspect-[3/4] overflow-hidden mb-6 relative bg-gray-50">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : (product.image || '')}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-black hover:text-white transition-all duration-300">
                                            View Detail
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-baseline px-1">
                                    <div>
                                        <h3 className="font-serif text-lg italic mb-1 group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">{product.name}</h3>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400">{product.category}</p>
                                    </div>
                                    <span className="text-xs font-light tracking-wide">${product.price}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {products?.length === 0 && (
                    <div className="text-center text-gray-400 italic font-serif py-20">No new arrivals at the moment.</div>
                )}
            </div>
        </div>
    );
};

export default LatestArrival;
