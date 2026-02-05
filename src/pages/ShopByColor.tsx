import React from 'react';
import { Link } from 'react-router-dom';

export const ShopByColor: React.FC = () => {
    const colors = [
        { name: 'Green', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80', link: '/catalog?color=Green' },
        { name: 'Neutral', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80', link: '/catalog?color=Neutral' },
        { name: 'Dark', image: 'https://images.unsplash.com/photo-1505691938895-1758d7bab58d?auto=format&fit=crop&q=80', link: '/catalog?color=Dark' },
        { name: 'Warm', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80', link: '/catalog?color=Warm' },
        { name: 'White', image: 'https://images.unsplash.com/photo-1595166661073-61c0627e8d0e?auto=format&fit=crop&q=80', link: '/catalog?color=White' },
        { name: 'Blue', image: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80', link: '/catalog?color=Blue' },
    ];

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12">
            <div className="text-center mb-16">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 block mb-4">Palette</span>
                <h1 className="text-4xl md:text-5xl font-serif italic">Shop By Color</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {colors.map((color) => (
                    <Link key={color.name} to={color.link} className="group relative aspect-square overflow-hidden block">
                        <img
                            src={color.image}
                            alt={color.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-2xl font-serif italic drop-shadow-md">{color.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
