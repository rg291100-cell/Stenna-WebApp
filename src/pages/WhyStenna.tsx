import React from 'react';
import { Link } from 'react-router-dom';

export const WhyStenna: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <section className="px-6 md:px-12 max-w-screen-xl mx-auto mb-24 md:mb-32">
                <h1 className="text-6xl md:text-9xl font-serif italic mb-12 animate-slide-up">
                    Why Stenna?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8">
                        <img
                            src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2670&auto=format&fit=crop"
                            alt="Craftsmanship"
                            className="w-full aspect-video object-cover mb-8 grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                    <div className="md:col-span-4 flex flex-col justify-end">
                        <p className="text-xl md:text-2xl font-light leading-relaxed mb-8">
                            We don't just cover walls; we curate atmospheres. Stenna represents the convergence of tactile heritage and modern editorial design.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pillars */}
            <section className="px-6 md:px-12 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 mb-32">
                <div className="group">
                    <div className="h-px w-full bg-black mb-6 group-hover:w-1/2 transition-all duration-500"></div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] mb-4">01. Materiality</span>
                    <h3 className="text-3xl font-serif mb-4">Tactile Depth</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Our wallpapers are not flat prints. They are textured narratives, crafted with multiple layers of relief and organic fibers to capture light and shadow.
                    </p>
                </div>

                <div className="group">
                    <div className="h-px w-full bg-black mb-6 group-hover:w-1/2 transition-all duration-500"></div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] mb-4">02. Curation</span>
                    <h3 className="text-3xl font-serif mb-4">Editorial Eye</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Every collection is edited like a magazine issue. We reject trends in favor of timeless, atmospheric aesthetics that define a space without overpowering it.
                    </p>
                </div>

                <div className="group">
                    <div className="h-px w-full bg-black mb-6 group-hover:w-1/2 transition-all duration-500"></div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] mb-4">03. Technology</span>
                    <h3 className="text-3xl font-serif mb-4">Visual Innovation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        With our proprietary AR Visualizer, we bridge the gap between imagination and reality, allowing you to experience our textures in your own space before commitment.
                    </p>
                </div>
            </section>

            {/* Quote */}
            <section className="bg-[#F5F5F3] py-32 px-6 mb-32">
                <div className="max-w-4xl mx-auto text-center">
                    <blockquote className="text-3xl md:text-5xl font-serif italic leading-tight mb-12">
                        "In a world of noise, Stenna offers the luxury of silence and texture."
                    </blockquote>
                    <cite className="not-italic text-[10px] uppercase tracking-[0.3em] block">- Architectural Digest (Review)</cite>
                </div>
            </section>

            {/* Call to Action */}
            <section className="px-6 md:px-12 text-center">
                <h2 className="text-4xl font-serif mb-8">Begin Your Curation</h2>
                <Link
                    to="/catalog"
                    className="inline-block border-b border-black pb-1 text-[10px] uppercase tracking-[0.3em] hover:opacity-50 transition-opacity"
                >
                    Explore Collections
                </Link>
            </section>
        </div>
    );
};
