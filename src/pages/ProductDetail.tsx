import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/* ----------------------------- Accordion ----------------------------- */
const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-xs tracking-widest uppercase"
      >
        <span>{title}</span>
        <span className="text-xl font-light">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-4 text-sm text-gray-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

/* --------------------------- Product Detail --------------------------- */
export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  /* --------------------------- Fetch product -------------------------- */
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    },
  });

  /* ------------------------- Fetch all products ------------------------ */
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/api/products');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setDragOffset(0);
    setIsDragging(false);
  }, [id]);

  /* --------------------------- Loading state --------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  /* ---------------------------- Error state ---------------------------- */
  if (isError || !product) {
    return (
      <div className="min-h-screen pt-40 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  /* ---------------------------- Image logic ---------------------------- */
  let images: string[] = [];
  try {
    if (typeof product.images === 'string') {
      images = JSON.parse(product.images);
    } else if (Array.isArray(product.images)) {
      images = product.images;
    }
  } catch (err) {
    console.error('Invalid images JSON:', product.images);
  }

  if (!images || images.length === 0) {
    images = [
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop'
    ];
  }

  const mainImage = images[0];

  /* ----------------------- Navigation (prev/next) ---------------------- */
  const sameCategory = allProducts.filter(
    (p: any) => p.category === product.category
  );

  const currentIndex = sameCategory.findIndex((p: any) => p.id === product.id);

  const prevProduct =
    sameCategory.length > 1
      ? sameCategory[(currentIndex - 1 + sameCategory.length) % sameCategory.length]
      : null;

  const nextProduct =
    sameCategory.length > 1
      ? sameCategory[(currentIndex + 1) % sameCategory.length]
      : null;

  /* ----------------------------- Swipe Handlers --------------------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX.current;

    // Check if swipe is possible in that direction
    if (diff > 0 && !prevProduct) return;
    if (diff < 0 && !nextProduct) return;

    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (!touchStartX.current) return;

    const threshold = window.innerWidth / 4;

    if (dragOffset < -threshold && nextProduct) {
      setDragOffset(-window.innerWidth);
      setTimeout(() => navigate(`/product/${nextProduct.id}`), 300);
    } else if (dragOffset > threshold && prevProduct) {
      setDragOffset(window.innerWidth);
      setTimeout(() => navigate(`/product/${prevProduct.id}`), 300);
    } else {
      setDragOffset(0);
    }

    touchStartX.current = null;
  };

  return (
    <div className="relative overflow-hidden">
      {/* -------------------------- Gallery Modal -------------------------- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto">
          <div className="sticky top-0 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 transition-all duration-300">
            <span className="text-[10px] uppercase tracking-widest font-bold">{product.name} Gallery</span>
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-black hover:bg-black hover:text-white transition-all duration-500"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1 p-1">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-auto object-cover animate-fade-in"
                alt={`${product.name} ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* -------------------------- Main Wrapper -------------------------- */}
      <div
        className="min-h-screen bg-white pt-24 md:pt-32 transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex flex-col md:flex-row">
          {/* Featured Image */}
          <div className="w-full md:w-[65%] group relative cursor-zoom-in" onClick={() => setIsGalleryOpen(true)}>
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto object-cover md:h-[calc(100vh-8rem)] md:sticky md:top-32"
            />
            <div className="absolute bottom-6 right-6 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 text-[8px] tracking-[0.3em] uppercase border border-black/5 pointer-events-none">
              View Gallery / {images.length} Images
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-[35%] px-6 md:px-12 py-12">
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold block mb-4">
              {product.collection?.title || 'Stenna Collection'}
            </span>

            <h1 className="text-4xl md:text-5.5xl font-serif leading-tight">
              {product.name}
            </h1>

            <p className="text-xl text-gray-600 mt-3 font-light">
              ₹{Number(product.price)} / roll
            </p>

            <div className="mt-8 mb-10 h-px bg-gray-100 w-24" />

            <p className="text-sm font-light text-gray-500 leading-relaxed italic">
              "{product.description}"
            </p>

            {/* Specs */}
            <div className="mt-12 space-y-4">
              {product.rollLength && <Spec label="Length" value={product.rollLength} />}
              {product.rollWidth && <Spec label="Width" value={product.rollWidth} />}
              {product.designStyle && <Spec label="Style" value={product.designStyle} />}
              {product.color && <Spec label="Color" value={product.color} />}
              {product.material && <Spec label="Material" value={product.material} />}
              {product.weight && <Spec label="Weight" value={product.weight} />}
            </div>

            {/* Actions */}
            <div className="mt-12">
              <Link
                to={`/visualizer?id=${product.id}`}
                className="block w-full text-center bg-black text-white text-[10px] uppercase tracking-[0.2em] py-5 hover:bg-gray-800 transition-colors shadow-xl"
              >
                Launch Visualizer
              </Link>
            </div>

            {/* Accordions */}
            <div className="mt-16">
              <Accordion title="Craftsmanship">
                Artisanal production using eco-certified European substrates. Our wallpapers feature deep surface relief and high durability for residential and hospitality environments.
              </Accordion>
              <Accordion title="Care Guide">
                Resistant to surface moisture. Gently wipe with a soft, non-abrasive damp cloth to preserve the ink richness. Avoid chemical agents.
              </Accordion>
            </div>

            {/* Navigation */}
            <div className="mt-16 flex justify-between pt-8 border-t border-gray-50">
              {prevProduct && (
                <button
                  onClick={() => navigate(`/product/${prevProduct.id}`)}
                  className="group flex flex-col items-start gap-1"
                >
                  <span className="text-[8px] uppercase tracking-widest text-gray-400">Previous</span>
                  <span className="text-xs font-serif italic group-hover:underline underline-offset-4 tracking-wide">{prevProduct.name}</span>
                </button>
              )}
              {nextProduct && (
                <button
                  onClick={() => navigate(`/product/${nextProduct.id}`)}
                  className="group flex flex-col items-end gap-1 text-right"
                >
                  <span className="text-[8px] uppercase tracking-widest text-gray-400">Next</span>
                  <span className="text-xs font-serif italic group-hover:underline underline-offset-4 tracking-wide">{nextProduct.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Helpers ------------------------------ */
const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] border-b border-gray-50 pb-3">
    <span className="text-gray-400 font-medium">{label}</span>
    <span className="text-black">{value}</span>
  </div>
);
