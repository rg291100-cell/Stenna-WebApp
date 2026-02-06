import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { CircularProgress } from '@mui/material';
import { generateDesignAdvice } from '../services/geminiService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-xs tracking-widest uppercase text-left"
      >
        <span>{title}</span>
        <span className="text-xl font-light">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-6 text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [hasHinted, setHasHinted] = useState(false);

  // Cart Logic
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Fetch specific product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  // Fetch all products for navigation (cached if visited Catalog)
  const { data: allProducts } = useQuery({
    queryKey: ['products', 'All'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  useEffect(() => {
    if (product) {
      setLoadingAdvice(true);
      generateDesignAdvice("minimalist living room", product.name)
        .then(res => setAdvice(res))
        .finally(() => setLoadingAdvice(false));

      window.scrollTo(0, 0);

      if (!sessionStorage.getItem('stenna_nav_hint')) {
        setHasHinted(true);
        sessionStorage.setItem('stenna_nav_hint', 'true');
      }
    }
  }, [product, id]);

  // Combine and Randomize Media
  // Truly randomized layout on every mount
  const mediaItems = React.useMemo(() => {
    if (!product) return [];

    const images = (product.images?.length > 0 ? product.images : [product.image]).map((src: string) => ({ type: 'image', src }));
    const videos = (product.videos || []).map((src: string) => ({ type: 'video', src }));

    let combined = [...images, ...videos];

    if (combined.length === 0) return [];

    const first = combined[0];
    const rest = combined.slice(1);

    // True Fisher-Yates Shuffle for the rest
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    // Assign Spans with chaotic variety
    const randomizedRest = rest.map((item) => {
      const rand = Math.random();
      let span = 'small';

      if (item.type === 'video') {
        // Videos are larger
        span = rand > 0.3 ? 'large' : 'wide';
      } else {
        // Image distribution (adjusted for more masonry feel)
        if (rand > 0.80) span = 'large';
        else if (rand > 0.50) span = 'wide';
        else if (rand > 0.25) span = 'tall';
        else span = 'small';
      }
      return { ...item, span };
    });

    return [first, ...randomizedRest];
  }, [product]);

  // Loading Skeleton to prevent white screen flash
  if (isLoading) {
    return (
      <div className="pt-0 min-h-screen bg-white">
        <div className="flex flex-col md:flex-row relative">
          <div className="w-full md:w-[65%] grid grid-cols-2 gap-1 animate-pulse">
            <div className="col-span-2 h-[60vh] bg-gray-100"></div>
            <div className="col-span-1 h-[40vh] bg-gray-100"></div>
            <div className="col-span-1 h-[40vh] bg-gray-100"></div>
          </div>
          <div className="w-full md:w-[35%] px-12 py-32 space-y-8">
            <div className="h-4 w-20 bg-gray-100 rounded"></div>
            <div className="h-12 w-3/4 bg-gray-100 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
            <div className="space-y-2 pt-8">
              <div className="h-2 w-full bg-gray-100 rounded"></div>
              <div className="h-2 w-full bg-gray-100 rounded"></div>
              <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !product) return <div className="min-h-screen pt-40 text-center">Product not found.</div>;

  // Navigation Logic
  // Navigation Logic
  // Filter other products in same category
  const categoryProducts = allProducts?.filter((p: any) => p.category === product.category) || [];
  const currentIndex = categoryProducts.findIndex((p: any) => p.id === product.id);

  // ensure we have more than 1 product to navigate
  const hasMultipleProducts = categoryProducts.length > 1;

  const nextProduct = hasMultipleProducts ? categoryProducts[(currentIndex + 1) % categoryProducts.length] : null;
  const prevProduct = hasMultipleProducts ? categoryProducts[(currentIndex - 1 + categoryProducts.length) % categoryProducts.length] : null;

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop');
  const galleryImages = product.images?.length > 1 ? product.images : [mainImage];

  const handleAddToCart = () => {
    if (!product) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: 1,
      collection: product.collection?.title
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  // Swipe Logic
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && nextProduct) {
      navigate(`/product/${nextProduct.id}`);
    }
    if (isRightSwipe && prevProduct) {
      navigate(`/product/${prevProduct.id}`);
    }
  };

  // Smooth Image Component
  const SmoothImage = ({ src, alt, className, priority = false }: { src: string, alt: string, className?: string, priority?: boolean }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
      />
    );
  }

  return (
    <div
      className="pt-0 min-h-screen bg-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex flex-col md:flex-row relative">

        {/* Gallery Section */}
        <div className="w-full md:w-[65%] relative">

          {/* Navigation Overlay - Fixed/Sticky */}
          <div className="fixed top-0 bottom-0 left-0 w-24 z-50 pointer-events-none hidden md:flex items-center justify-start pl-6">
            {prevProduct && (
              <button
                onClick={() => navigate(`/product/${prevProduct.id}`)}
                className="w-12 h-12 rounded-full border border-black/10 bg-white/80 backdrop-blur text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 pointer-events-auto shadow-sm group"
                aria-label="Previous Product"
              >
                <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
              </button>
            )}
          </div>

          <div className="fixed top-0 bottom-0 right-[35%] w-24 z-50 pointer-events-none hidden md:flex items-center justify-end pr-6">
            {nextProduct && (
              <button
                onClick={() => navigate(`/product/${nextProduct.id}`)}
                className="w-12 h-12 rounded-full border border-black/10 bg-white/80 backdrop-blur text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 pointer-events-auto shadow-sm group"
                aria-label="Next Product"
              >
                <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            )}
          </div>

          {/* Mobile Navigation (Bottom fixed) - Optional, kept as backup visuals */}
          <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center gap-4 md:hidden pointer-events-none opacity-0">
            {/* Hidden visually on mobile as swipe is primary, but kept in DOM if needed or opacity 0 to not block view */}
          </div>

          {/* Fixed First Image */}
          {mediaItems.length > 0 && (
            <div className="w-full mb-1">
              {mediaItems[0].type === 'video' ? (
                <video
                  src={mediaItems[0].src}
                  controls
                  className="w-full h-auto object-cover"
                />
              ) : (
                <SmoothImage
                  src={mediaItems[0].src}
                  alt={`${product.name} - Main View`}
                  className="w-full h-auto object-cover"
                  priority={true}
                />
              )}
            </div>
          )}

          {/* Randomized Grid for Remaining Items */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 auto-rows-[150px] md:auto-rows-[200px] gap-1 bg-white grid-flow-dense">
            {mediaItems.slice(1).map((item, idx) => {
              // Determine styles based on span data
              // Mobile: mostly 1 col or 2 cols. Desktop: 3 cols supports more variety.

              let spanClass = 'col-span-1 row-span-1'; // Default small

              if (item.span === 'large') spanClass = 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]';
              else if (item.span === 'wide') spanClass = 'col-span-2 row-span-1 aspect-[2/1]';
              else if (item.span === 'tall') spanClass = 'col-span-1 row-span-2 aspect-[1/2]';
              else spanClass = 'col-span-1 row-span-1 aspect-square'; // small

              return (
                <div
                  key={`${item.type}-${idx}`}
                  className={`relative group overflow-hidden bg-gray-50 ${spanClass}`}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SmoothImage
                      src={item.src}
                      alt={`${product.name} - View ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                      priority={false}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-[35%] px-6 md:px-12 py-12 md:py-32 md:h-screen md:sticky md:top-0 overflow-y-auto bg-white flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400">{product.collection?.title || 'Stenna Collection'}</span>
            <h1 className="text-4xl md:text-5xl font-serif leading-tight">{product.name}</h1>
            <p className="text-xl font-light mt-1 text-gray-600">${product.price} / roll</p>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed italic font-light">
            {product.description}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">
                <span className="text-gray-400">Length</span>
                <span>{product.rollLength || '10m'}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">
                <span className="text-gray-400">Width</span>
                <span>{product.rollWidth || '52cm'}</span>
              </div>
              {product.designStyle && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Design Style</span>
                  <span>{product.designStyle}</span>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Color</span>
                  <span>{product.color}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Material</span>
                  <span>{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-gray-100 pb-2">
                  <span className="text-gray-400">Weight</span>
                  <span>{product.weight}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Link
              to={`/visualizer?id=${product.id}`}
              className="w-full border border-black text-black text-[10px] uppercase tracking-[0.2em] py-5 text-center hover:bg-black hover:text-white transition-all"
            >
              Virtual Preview
            </Link>
          </div>

          <div className="mt-4">
            <Accordion title="Editorial Commentary">
              <div className="p-5 bg-gray-50 border-l border-black italic">
                {loadingAdvice ? (
                  <div className="flex gap-2 items-center py-2">
                    <span className="text-xs text-gray-400">Consulting AI Stylist...</span>
                  </div>
                ) : (
                  <p className="font-serif text-base leading-relaxed">"{advice}"</p>
                )}
              </div>
            </Accordion>
            <Accordion title="The Build">
              Digitally mastered textures on non-woven 180gsm stock. Breathable, PVC-free, and printed with light-fast pigments.
            </Accordion>
            <Accordion title="Care & Maintenance">
              Wipe clean with a damp cloth. High resistance to direct sunlight. Suitable for high-traffic residential areas.
            </Accordion>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
            <h4 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-center text-gray-400">Complete the Look</h4>
            <div className="grid grid-cols-2 gap-4">
              {allProducts?.filter((p: any) => p.id !== product.id).slice(0, 2).map((wp: any) => (
                <Link key={wp.id} to={`/product/${wp.id}`} className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                    <img src={wp.images?.[0] || wp.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={wp.name} />
                  </div>
                  <div className="text-[9px] tracking-widest uppercase flex flex-col gap-1">
                    <span className="font-bold">{wp.name}</span>
                    <span className="text-gray-400">${wp.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
