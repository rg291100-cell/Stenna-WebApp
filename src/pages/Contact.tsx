
import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#Fdfdfd] pt-32 px-6 md:px-12">
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
                <div>
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-12">Get in Touch</h1>
                    <p className="text-sm text-gray-500 mb-12 max-w-md leading-relaxed">
                        For general inquiries, custom projects, or trade applications, please resort to the form or contact us directly.
                    </p>

                    <div className="space-y-8 text-sm">
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Email</span>
                            <a href="mailto:hello@stenna.com" className="hover:underline">hello@stenna.com</a>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Studio</span>
                            <p>12 Rue du Faubourg Saint-Honoré,<br />75008 Paris, France</p>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Press</span>
                            <a href="mailto:press@stenna.com" className="hover:underline">press@stenna.com</a>
                        </div>
                    </div>
                </div>

                <form className="space-y-12 pt-4">
                    <div className="space-y-12">
                        <div className="relative">
                            <input type="text" placeholder="Name" className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black font-light" />
                        </div>
                        <div className="relative">
                            <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black font-light" />
                        </div>
                        <div className="relative">
                            <textarea placeholder="Message" rows={4} className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-black font-light resize-none"></textarea>
                        </div>
                    </div>
                    <button className="bg-black text-white px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors w-full md:w-auto">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
