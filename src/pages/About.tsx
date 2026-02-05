
import React from 'react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="h-[80vh] w-full relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000"
                    alt="Studio"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-12 left-6 md:left-12 text-white">
                    <h1 className="text-6xl md:text-9xl font-serif italic">Stenna.</h1>
                </div>
            </div>

            <div className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                <p className="text-xl md:text-3xl font-serif leading-relaxed text-center mb-24">
                    "We are a design house dedicated to the art of surface. We believe that walls are not merely boundaries, but canvases for expression."
                </p>

                <div className="flex flex-col gap-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <img src="https://images.unsplash.com/photo-1595405404535-779870be84B6?auto=format&fit=crop&q=80&w=800" className="w-full aspect-[4/5] object-cover" alt="Craft" />
                        <div className="space-y-6">
                            <h3 className="text-3xl font-serif italic">Artisan Craft</h3>
                            <p className="text-sm text-gray-500 leading-loose">
                                Every pattern begins by hand. In our Stockholm atelier, our artists work with ink, charcoal, and gouache to create original textures that are then digitized with the highest fidelity.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="space-y-6 md:text-right">
                            <h3 className="text-3xl font-serif italic">Sustainable Luxury</h3>
                            <p className="text-sm text-gray-500 leading-loose">
                                We print on demand to eliminate waste, using FSC-certified non-woven papers and eco-friendly water-based inks. Luxury should not cost the earth.
                            </p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1616469829718-0faf16324280?auto=format&fit=crop&q=80&w=800" className="w-full aspect-[4/5] object-cover" alt="Sustainability" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
