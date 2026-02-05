import React from 'react';
import { Link } from 'react-router-dom';

export const ShopByRoom: React.FC = () => {
    const rooms = [
        { name: 'Living Room', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80', link: '/catalog?room=Living' },
        { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1616594039964-40891a90b399?auto=format&fit=crop&q=80', link: '/catalog?room=Bedroom' },
        { name: 'Kids Room', image: 'https://images.unsplash.com/photo-1596464716127-f9a0859b0ebb?auto=format&fit=crop&q=80', link: '/catalog?room=Kids%20Room' },
        { name: 'Dining Room', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80', link: '/catalog?room=Dining' },
        { name: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80', link: '/catalog?room=Office' },
        { name: 'Bathroom', image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80', link: '/catalog?room=Bathroom' },
    ];

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-12">
            <div className="text-center mb-16">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 block mb-4">Interiors</span>
                <h1 className="text-4xl md:text-5xl font-serif italic">Shop By Room</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <Link key={room.name} to={room.link} className="group relative aspect-[3/4] overflow-hidden block">
                        <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute bottom-8 left-8">
                            <span className="text-white text-2xl font-serif italic drop-shadow-sm">{room.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
