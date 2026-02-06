import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { generateDesignAdvice } from '../services/geminiService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/* -------------------------------- Accordion -------------------------------- */

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

/* ------------------------------ Product Detail ------------------------------ */

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  /* ------------------------------- Fetch Product ------------------------------ */

  const { data: rawProduct, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  /* -------------------------- Normalize product ONCE -------------------------- */

  const product = useMemo(() => {
    if (!rawProduct) return null;

    return {
      ...rawProduct,
      images: Array.isArray(rawProduct.images) && rawProduct.images.length > 0
        ? rawProduct.images
        : [
          'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop'
        ],
      videos: Array.isArray(rawProduct.videos) ? rawProduct.videos : []
    };
  }, [rawProduct]);

  /* ------------------------------ Fetch All Products ------------------------------ */

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/api/products');
      return res.data;
    },
    staleTime: 5 * 60 * 1000
  });

  /* ------------------------------ Side Effects ------------------------------ */

  useEffect(() => {
    if (!product) return;

    setLoadingAdvice(true);
    generateDesignAdvice('minimalist living room', product.name)
      .then(setAdvice)
      .finally(() => setLoadingAdvice(false));

    window.scrollTo(0, 0);
  }, [product]);

  /* ------------------------------- Media Builder ------------------------------- */

  const mediaItems = useMemo(() => {
    if (!product) return [];

    const images = product.images.map((src: string) => ({ type: 'image', src }));
    const videos = product.videos.map((src: string) => ({ type: 'video', src }));

    const combined = [...images, ...videos];
    if (combined.length === 0) return [];

    const [first, ...rest] = combined;

    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    return [
      first,
      ...rest.map(item => ({
        ...item,
        span: item.type === 'video'
          ? 'large'
          : ['small', 'wide', 'tall', 'large'][Math.floor(Math.random() * 4)]
      }))
    ];
  }, [product]);

  /* ------------------------------- Loading / Error ------------------------------- */

  if (isLoading) {
    return <div className="min-h-screen bg-white animate-pulse" />;
  }

  if (error || !product) {
    return <div className="min-h-screen pt-40 text-center">Product not found.</div>;
  }

  /* ------------------------------ Navigation Logic ------------------------------ */

  const categoryProducts =
    allProducts?.filter((p: any) => p.category === product.category) || [];

  const index = categoryProducts.findIndex((p: any) => p.id === product.id);
  const nextProduct = categoryProducts[(index + 1) % categoryProducts.length];
  const prevProduct =
    categoryProducts[(index - 1 + categoryProducts.length) % categoryProducts.length];

  /* ------------------------------ Smooth Image ------------------------------ */

  const SmoothImage = ({ src, alt, priority = false }: any) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'
          }`}
      />
    );
  };

  /* --------------------------------- Render --------------------------------- */

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">

        {/* ------------------------------ Gallery ------------------------------ */}
        <div className="w-full md:w-[65%]">

          {/* Main Media */}
          {mediaItems[0] && (
            <div className="mb-1">
              {mediaItems[0].type === 'video' ? (
                <video src={mediaItems[0].src} controls className="w-full" />
              ) : (
                <SmoothImage
                  src={mediaItems[0].src}
                  alt={product.name}
                  priority
                />
              )}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
            {mediaItems.slice(1).map((item: any, i: number) => (
              <div key={i} className="bg-gray-50 overflow-hidden">
                {item.type === 'video' ? (
                  <video src={item.src} muted loop autoPlay className="w-full h-full object-cover" />
                ) : (
                  <SmoothImage src={item.src} alt={`${product.name} ${i}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------ Content ------------------------------ */}
        <div className="w-full md:w-[35%] px-6 md:px-12 py-16 md:sticky md:top-0">
          <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
            {product.collection?.title || 'Stenna Collection'}
          </span>

          <h1 className="text-4xl font-serif mt-4">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">${product.price} / roll</p>

          <p className="mt-6 text-sm text-gray-500 italic">
            {product.description}
          </p>

          <div className="mt-10">
            <Accordion title="Editorial Commentary">
              {loadingAdvice ? 'Consulting stylist…' : advice}
            </Accordion>
          </div>

          <div className="mt-10">
            <Link
              to={`/visualizer?id=${product.id}`}
              className="block text-center border border-black py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
            >
              Virtual Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
