
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'Floral & Botanic', image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=800' },
    { name: 'Geometric', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800' },
    { name: 'Abstract', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800' },
    { name: 'Solid Texture', image: 'https://images.unsplash.com/photo-1628413993904-94ecb60d616c?auto=format&fit=crop&q=80&w=800' },
];

const WallpaperPattern: React.FC = () => {
    return (
        <div className="bg-white pt-24 min-h-screen">
            <div className="px-6 md:px-12 py-12">
                <h1 className="text-5xl md:text-8xl font-serif mb-16 italic text-center md:text-left">Patterns</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat, idx) => (
                        <Link to="/catalog" key={idx} className="group relative aspect-[4/3] overflow-hidden block">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h2 className="text-4xl md:text-5xl font-serif text-white italic group-hover:scale-110 transition-transform duration-700">
                                    {cat.name}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallpaperPattern;
