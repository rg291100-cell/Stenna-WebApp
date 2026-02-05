
import React from 'react';
import { Link } from 'react-router-dom';

const rooms = [
    { name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a90c377?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Dining', image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Workspace', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200' },
];

const RoomType: React.FC = () => {
    return (
        <div className="bg-[#f5f5f3] pt-24 min-h-screen">
            <div className="px-6 md:px-12 py-12">
                <h1 className="text-5xl md:text-8xl font-serif mb-8 italic">By Room</h1>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-16">Curated atmospheres for every space.</p>

                <div className="flex flex-col gap-32">
                    {rooms.map((room, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="w-full md:w-2/3 aspect-[16/9] overflow-hidden group relative">
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s]"
                                />
                            </div>
                            <div className="w-full md:w-1/3 flex flex-col items-start">
                                <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-4">0{idx + 1}</span>
                                <h2 className="text-4xl md:text-6xl font-serif mb-6">{room.name}</h2>
                                <Link to="/catalog" className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-2 hover:opacity-50 transition-opacity">
                                    Shop this Look
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomType;
