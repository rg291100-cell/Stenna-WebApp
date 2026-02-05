import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Hero: React.FC<{ videoUrl: string, imageUrl: string }> = ({ videoUrl, imageUrl }) => {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-[#e5e5e5]">
            <div className="absolute inset-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                    <img
                        src={imageUrl}
                        alt="Hero Fallback"
                        className="w-full h-full object-cover"
                    />
                </video>
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12 text-white z-10">
                <span className="block text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 animate-fade-in-up">The New Collection</span>
                <h2 className="text-4xl md:text-8xl font-serif italic mb-8 animate-fade-in-up delay-200">
                    Curated Walls
                </h2>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 animate-fade-in-up delay-300 w-full md:w-auto px-6 md:px-0">
                    <Link
                        to="/catalog"
                        className="bg-white text-black px-8 py-3 md:px-10 md:py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-lg text-center w-full md:w-auto"
                    >
                        Shop Wallpaper
                    </Link>
                    <Link
                        to="/visualizer"
                        className="border border-white backdrop-blur-sm text-white px-8 py-3 md:px-10 md:py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all text-center w-full md:w-auto"
                    >
                        Virtual Try-On
                    </Link>
                </div>
            </div>
        </section>
    );
};

const TransformYourWalls: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    return (
        <section className="py-32 px-6 md:px-20 bg-[#f8f5f1] flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            {/* Text Side - Left */}
            <div className="w-full md:w-1/3 z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 block">Wallpaper</span>
                <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-[#2c2c2c]">
                    TRANSFORM <br /> YOUR WALLS
                </h2>
                <p className="text-sm font-light text-gray-600 leading-relaxed mb-8 max-w-sm">
                    At Stenna, we have a curated range of over 700 wallpapers for you to choose from. View our full range to gather some inspiration or shop by colour below.
                </p>
                <Link to="/catalog" className="inline-block border border-black px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                    Shop Wallpaper
                </Link>
            </div>

            {/* Collage Side - Right */}
            <div className="w-full md:w-2/3 h-[80vh] relative">
                {/* Main Image */}
                <div className="absolute top-0 right-0 w-[65%] h-[85%] overflow-hidden shadow-xl">
                    <img
                        src={imageUrl}
                        alt="Living Room"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                    />
                </div>
                {/* Overlap Image 1 - Bottom Left */}
                <div className="absolute bottom-10 left-[10%] w-[35%] h-[45%] overflow-hidden shadow-2xl border-4 border-white z-20">
                    <img
                        src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80"
                        alt="Texture Detail"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                    />
                </div>
                {/* Overlap Image 2 - Top Center/Left - Abstract/Swatch */}
                <div className="absolute top-[15%] left-[20%] w-[20%] h-[20%] overflow-hidden shadow-lg z-0 -rotate-3">
                    <img
                        src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80"
                        alt="Swatch"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>
            </div>
        </section>
    );
}

const ShopByColourSection: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    return (
        <section className="py-32 px-6 md:px-20 bg-[#f8f5f1] text-[#2c2c2c] relative">
            <div className="flex flex-col md:flex-row-reverse items-center gap-20">
                {/* Text Side - Right/Center */}
                <div className="w-full md:w-1/3 z-10 md:pl-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 block">Palette</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                        SHOP BY <br /> COLOUR
                    </h2>
                    <p className="text-sm font-light text-gray-600 leading-relaxed mb-8 max-w-sm">
                        Curated palettes for the modern home. From serene neutrals to bold statements, find the shade that speaks to you.
                    </p>
                    <Link to="/shop-by-color" className="inline-block border border-black px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                        View Colours
                    </Link>
                </div>

                {/* Collage Side - Left */}
                <div className="w-full md:w-2/3 h-[80vh] relative">
                    {/* Main Image - Center */}
                    <div className="absolute top-[5%] left-[15%] w-[50%] h-[70%] overflow-hidden shadow-xl z-10">
                        <img
                            src={imageUrl}
                            alt="Green Wall"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Floating Circle Swatch */}
                    <div className="absolute top-[-5%] left-[55%] w-32 h-32 rounded-full bg-[#7a8b78] shadow-lg z-20" />

                    {/* Side Image */}
                    <div className="absolute bottom-[0%] right-[5%] w-[35%] h-[45%] overflow-hidden shadow-lg border-2 border-white z-20">
                        <img
                            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80"
                            alt="Detail"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Background Detail Image */}
                    <div className="absolute top-[20%] left-[0%] w-[25%] h-[35%] overflow-hidden opacity-90 z-0 grayscale">
                        <img
                            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80"
                            alt="Architecture"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

const ShopByRoomSection: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
    return (
        <section className="py-32 px-6 md:px-20 bg-[#f8f5f1] flex flex-col md:flex-row items-center gap-16">
            {/* Text Side - Right/Center */}
            <div className="w-full md:w-1/3 md:order-2 z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 block">Interiors</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-[#2c2c2c]">
                    SHOP BY <br /> ROOM
                </h2>
                <p className="text-sm font-light text-gray-600 leading-relaxed mb-8 max-w-sm">
                    Discover wallpaper collections curated for specific spaces. From calming bedrooms to vibrant living areas, find the perfect match for your walls.
                </p>
                <Link to="/shop-by-room" className="inline-block border border-black px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                    View Rooms
                </Link>
            </div>

            {/* Collage Side - Left */}
            <div className="w-full md:w-2/3 md:order-1 h-[70vh] relative">
                {/* Main Large Image */}
                <div className="absolute top-0 left-0 w-[55%] h-[80%] overflow-hidden shadow-xl z-10">
                    <img
                        src={imageUrl}
                        alt="Jungle Mural"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Secondary Image - Top Right */}
                <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] overflow-hidden shadow-lg z-0">
                    <img
                        src="https://images.unsplash.com/photo-1596464716127-f9a0859b0ebb?auto=format&fit=crop&q=80"
                        alt="Kids Room"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Detail Image - Bottom Center/Right */}
                <div className="absolute bottom-[5%] right-[15%] w-[30%] h-[35%] overflow-hidden shadow-2xl border-4 border-white z-20 rotate-2">
                    <img
                        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80"
                        alt="Detail Art"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}

const FeaturedVideo: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
    // Moved state to parent

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-20">
                <div className="w-full md:w-1/2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-4">Behind the Design</span>
                    <h3 className="text-4xl font-serif mb-6 italic">Artistry in Motion</h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed mb-8 max-w-md">
                        Each Stenna wallpaper begins as a hand-drawn sketch, evolving through rigorous digital refinement before being printed on the finest European substrates. We believe in the slow art of creation.
                    </p>
                    <Link to="/about" className="inline-block bg-black text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                        Our Process
                    </Link>
                </div>
                <div className="w-full md:w-1/2 aspect-video overflow-hidden shadow-2xl relative bg-black">
                    <video key={videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-90">
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
            </div>
        </section>
    )
}

// Context for Home Settings to avoid prop drilling if we wanted, but simplistic prop passing or individual components fetching is fine.
// Since Home is the parent, let's fetch here and pass down, or let components fetch.
// Fetching at Home level is cleaner.

export const Home: React.FC = () => {
    const [settings, setSettings] = useState({
        homepage_video_url: 'https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4',
        homepage_hero_image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2680',
        homepage_transform_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
        homepage_color_image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80',
        homepage_room_image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const keys = [
                    'homepage_video_url',
                    'homepage_hero_image',
                    'homepage_transform_image',
                    'homepage_color_image',
                    'homepage_room_image'
                ];

                const newSettings = { ...settings };

                await Promise.all(keys.map(async (key) => {
                    const res = await api.get(`/api/settings/${key}`);
                    if (res.data && res.data.value) {
                        // @ts-ignore
                        newSettings[key] = res.data.value;
                    }
                }));

                setSettings(newSettings);
            } catch (error) {
                console.error('Failed to fetch home settings', error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="bg-[#f8f5f1]">
            <Hero videoUrl={settings.homepage_video_url} imageUrl={settings.homepage_hero_image} />
            <TransformYourWalls imageUrl={settings.homepage_transform_image} />
            <ShopByColourSection imageUrl={settings.homepage_color_image} />
            <ShopByRoomSection imageUrl={settings.homepage_room_image} />
            <FeaturedVideo videoUrl={settings.homepage_video_url} />

            {/* Newsletter / Footer Preamble */}
            <section className="py-32 bg-black text-white text-center px-6">
                <h4 className="text-4xl font-serif italic mb-6">Join the Editorial</h4>
                <p className="text-sm font-light text-gray-400 mb-8 max-w-lg mx-auto">
                    Sign up for early access to new collections, collaborative releases, and interior design insights.
                </p>
                <div className="flex max-w-sm mx-auto border-b border-white/30 pb-2">
                    <input type="email" placeholder="Email Address" className="bg-transparent w-full outline-none text-sm placeholder-gray-500 font-light tracking-wide" />
                    <button className="text-[10px] uppercase tracking-[0.2em]">Subscribe</button>
                </div>
            </section>
        </div>
    );
};
