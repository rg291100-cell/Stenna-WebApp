import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CircularProgress } from '@mui/material';

// Define types locally or rely on implicit types
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];   // ✅ backend field
  category: string;
  collectionId?: string;
  collection?: { title: string };
}


const ProductCard: React.FC<{ wallpaper: any }> = ({ wallpaper }) => {
  const [isHovered, setIsHovered] = useState(false);
  const displayImage = wallpaper.images && wallpaper.images.length > 0 ? wallpaper.images[0] : wallpaper.image;

  // Fallback for demo if no image
  const finalImage =
    Array.isArray(wallpaper.images) && wallpaper.images.length > 0
      ? wallpaper.images[0]
      : 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop';

  return (
    <div
      className="group relative flex flex-col mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/product/${wallpaper.id}`}
        className="block overflow-hidden bg-gray-50 aspect-[3/4] relative cursor-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%2220%22 cy=%2220%22 r=%2218%22 fill=%22white%22 opacity=%220.9%22/><text x=%2250%%22 y=%2250%%22 dy=%22.3em%22 text-anchor=%22middle%22 font-family=%22serif%22 font-style=%22italic%22 font-size=%228%22 fill=%22black%22>View</text></svg>'),_pointer]"
      >
        <img
          src={finalImage}
          alt={wallpaper.name}
          className="w-full h-full object-cover transition-all duration-[2s] ease-out scale-100 group-hover:scale-105"
          loading="lazy"
        />

        {isHovered && (
          <div className="absolute inset-0 bg-black/5 flex items-end justify-center pb-12 animate-in fade-in duration-700">
            <Link
              to={`/visualizer?id=${wallpaper.id}`}
              className="bg-white/95 backdrop-blur-md text-[9px] tracking-[0.3em] uppercase px-8 py-4 hover:bg-black hover:text-white transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              Try on Wall
            </Link>
          </div>
        )}
      </Link>

      <div className="mt-8 flex flex-col gap-2 px-1 text-center md:text-left">
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-light">{wallpaper.collection?.title || 'Stenna Collection'}</span>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-1">
          <Link to={`/product/${wallpaper.id}`}>
            <h3 className="text-sm uppercase tracking-[0.2em] font-light hover:italic transition-all duration-300">{wallpaper.name}</h3>
          </Link>
          <span className="text-[10px] text-gray-400 tracking-widest">₹{Number(wallpaper.price)}/roll</span>
        </div>
      </div>
    </div>
  );
};

export const Catalog: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ room: string[], color: string[], theme: string[] }>({
    room: [],
    color: [],
    theme: []
  });

  const categories = ['All', 'Modern', 'Classic', 'Textured', 'Nature'];

  // Constants
  const categoryQuotes: Record<string, string> = {
    'Modern': 'The Modern Minimal series focuses on the dialogue between negative space and architectural shadow.',
    'Classic': 'A heritage revival where timeless symmetry meets contemporary restraint.',
    'Textured': 'Surface exploration prioritizing material depth and hand-applied artisan finishes.',
    'Nature': 'Botanical poetry captured through soft watercolor traces and organic movement.',
    'All': 'A complete study of the Stenna atmosphere across every curated collection.'
  };

  const FILTER_OPTIONS = {
    room: ['Living', 'Bedroom', 'Dining', 'Office', 'Kids Room'],
    color: ['Neutral', 'Dark', 'Warm', 'Green', 'White'],
    theme: ['Minimalist', 'Nature', 'Modern', 'Luxury', 'Industrial']
  };

  // Helper Functions
  const toggleFilter = (type: 'room' | 'color' | 'theme', value: string) => {
    setActiveFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  // Fetch from API
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/api/products');
      return res.data;
    },
    retry: 1,
  });

  const filteredProducts = React.useMemo(() => {
    let list = products;

    // Category filter
    if (filter !== 'All') {
      list = list.filter(
        (p: any) => p.category?.toUpperCase() === filter.toUpperCase()
      );
    }

    // Room filter
    if (activeFilters.room.length) {
      list = list.filter((p: any) =>
        activeFilters.room.includes(p.room)
      );
    }

    // Color filter
    if (activeFilters.color.length) {
      list = list.filter((p: any) =>
        activeFilters.color.includes(p.color)
      );
    }

    // Theme filter
    if (activeFilters.theme.length) {
      list = list.filter((p: any) =>
        activeFilters.theme.includes(p.theme)
      );
    }

    return list;
  }, [products, filter, activeFilters]);




  if (isLoading) return (
    <div className="min-h-screen pt-32 px-6 flex justify-center">
      <CircularProgress color="inherit" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-32 px-6 text-center text-red-400 font-mono text-xs">
      {/* @ts-ignore */}
      Unable to load catalog. {error?.response?.status === 401 ? 'Please login to view.' : 'Server error.'}
    </div>
  );

  return (
    <div className="pt-32 pb-32 px-6 md:px-12 lg:px-24 bg-white min-h-screen relative">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-12">
        <div className="max-w-md">
          <h1 className="text-6xl md:text-8xl font-serif mb-6 italic animate-in fade-in slide-in-from-left-4 duration-1000">The Catalog</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 leading-loose">
            A curated study of contemporary surfaces and artisanal textures. Restraint as an art form.
          </p>
        </div>

        <div className="flex gap-8 items-center overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-[10px] tracking-[0.4em] uppercase whitespace-nowrap pb-2 border-b-2 transition-all duration-500 ${filter === cat ? 'border-black text-black' : 'border-transparent text-gray-300 hover:text-black'
                }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`ml-4 p-2 rounded-full border transition-all ${isFilterOpen || Object.values(activeFilters).flat().length > 0 ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mb-24 p-8 border border-gray-100 bg-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Room */}
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-6">Room Type</h4>
              <div className="flex flex-wrap gap-4">
                {FILTER_OPTIONS.room.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleFilter('room', opt)}
                    className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${activeFilters.room.includes(opt) ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-black'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-6">Colour Scheme</h4>
              <div className="flex flex-wrap gap-4">
                {FILTER_OPTIONS.color.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleFilter('color', opt)}
                    className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${activeFilters.color.includes(opt) ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-black'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-6">Theme</h4>
              <div className="flex flex-wrap gap-4">
                {FILTER_OPTIONS.theme.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleFilter('theme', opt)}
                    className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${activeFilters.theme.includes(opt) ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-black'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => { setActiveFilters({ room: [], color: [], theme: [] }); setIsFilterOpen(false); }}
              className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-black underline underline-offset-4"
            >
              Clear & Close
            </button>
          </div>
        </div>
      )}

      {/* Luxury Editorial Grid - 2 columns for ALL categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-20 gap-y-12 transition-all duration-1000">
        {filteredProducts.map((wp: any) => (
          <ProductCard key={wp.id} wallpaper={wp} />
        ))}

      </div>

      {products && products.length === 0 && (
        <div className="py-40 text-center text-gray-300 italic font-serif text-xl animate-pulse">
          No masterpieces found matching your criteria.
        </div>
      )}

      {/* Editorial Quote */}
      <div className="mt-40 pt-40 border-t border-gray-50 flex justify-center">
        <p className="max-w-2xl text-center font-serif text-2xl italic text-gray-400 leading-relaxed transition-opacity duration-1000">
          "{categoryQuotes[filter]}"
        </p>
      </div>
    </div>
  );
};
