import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Header: React.FC<{ onMenuOpen: () => void }> = ({ onMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-6 flex justify-between items-center ${isScrolled || !isHome ? 'bg-white text-black py-4 border-b border-gray-100' : 'bg-transparent text-white delay-200'
    }`;

  return (
    <header className={headerClass}>
      <div className="flex-1 flex items-start">
        <button
          onClick={onMenuOpen}
          className="group flex flex-col gap-1.5 p-2 -ml-2 hover:opacity-50 transition-opacity"
        >
          <span className={`w-8 h-[1px] transition-colors duration-500 ${isScrolled || !isHome ? 'bg-black' : 'bg-white'}`}></span>
          <span className={`w-8 h-[1px] transition-colors duration-500 ${isScrolled || !isHome ? 'bg-black' : 'bg-white'}`}></span>
        </button>
      </div>

      <Link to="/" className="flex-1 flex justify-center group ml-32">
        <h1 className={`text-4xl md:text-5xl font-serif tracking-tight font-bold transition-all duration-500 ${isHome && !isScrolled ? 'tracking-widest' : ''}`}>
          STENNA
        </h1>
      </Link>

      <div className="flex-1 flex justify-end items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
        <div className="hidden xl:flex items-center gap-8">
          <Link to="/catalog" className="hover:opacity-50 transition-opacity">CATALOG</Link>
          <Link to="/visualizer" className="hover:opacity-50 transition-opacity">TRY-ON</Link>
        </div>

        <Link to="/login" className="hidden md:block hover:underline underline-offset-4 decoration-[0.5px]">
          Account
        </Link>

      </div>
    </header>
  );
};

const FullMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white" />

      {/* Content */}
      <div className="relative h-full flex flex-col p-6 md:p-12">
        <div className="flex justify-between items-center mb-12">
          <span className="text-[10px] tracking-widest uppercase font-medium">Menu</span>
          <button
            onClick={onClose}
            className="text-[10px] tracking-widest uppercase hover:underline underline-offset-4"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center gap-2 md:gap-4 overflow-hidden">
          {[
            { name: 'New Arrivals', path: '/catalog', sub: 'The Latest' },
            { name: 'Collections', path: '/', sub: 'Curated' },
            { name: 'Wallpapers', path: '/catalog', sub: 'All Products' },
            { name: 'Virtual Try-On', path: '/visualizer', sub: 'AR Tool' },
            { name: 'The Journal', path: '/journal', sub: 'Editorial' },
          ].map((item, idx) => (
            <div key={item.name} className="group relative overflow-hidden">
              <Link
                to={item.path}
                onClick={onClose}
                className="block text-5xl md:text-8xl font-serif tracking-tight hover:italic transition-all duration-500 hover:translate-x-4 mix-blend-difference"
              >
                {item.name}
              </Link>
              <span className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-8 transition-all duration-500 text-[10px] tracking-widest uppercase">
                {item.sub}
              </span>
            </div>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-end text-[10px] tracking-widest text-gray-500 uppercase gap-6">
          <div className="flex flex-col gap-2">
            <Link to="/login" className="hover:text-black transition-colors">My Account</Link>
            <Link to="/orders" className="hover:text-black transition-colors">Orders & Returns</Link>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Instagram</a>
            <a href="#" className="hover:text-black transition-colors">Pinterest</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div >
  );
};

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-black selection:text-white">
      <Header onMenuOpen={() => setIsMenuOpen(true)} />
      <FullMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main>
        <Outlet />
      </main>

      <footer className="bg-white px-6 md:px-12 py-24 border-t border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-serif mb-8 italic">Curated Interiors</h2>
            <p className="text-gray-500 mb-10 max-w-sm text-sm leading-relaxed font-light">
              We explore the intersection of textile heritage and contemporary atmosphere. Join our mailing list for seasonal lookbooks.
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border-b border-gray-200 py-3 text-[10px] uppercase tracking-widest focus:border-black focus:outline-none w-full max-w-[240px] transition-colors"
              />
              <button className="text-[10px] uppercase tracking-widest border-b border-black py-3 font-bold">Join</button>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-[10px] tracking-[0.2em] uppercase">
            <h3 className="font-bold mb-3">Discovery</h3>
            <Link to="/catalog">All Wallpapers</Link>
            <Link to="/catalog">New Arrivals</Link>
            <Link to="/visualizer">Visualizer</Link>
          </div>
          <div className="flex flex-col gap-5 text-[10px] tracking-[0.2em] uppercase text-gray-400">
            <h3 className="font-bold mb-3 text-black">Inquiry</h3>
            <span>Shipping & Rates</span>
            <span>Returns Policy</span>
            <span>Trade Relations</span>
            <span>Contact Studio</span>
          </div>
        </div>
        <div className="text-[9px] tracking-[0.4em] text-gray-300 text-center uppercase border-t border-gray-50 pt-12">
          Crafting Quiet Luxury • Since 2024
        </div>
      </footer>
    </div>
  );
};
