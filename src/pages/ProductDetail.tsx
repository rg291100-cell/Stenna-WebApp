import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { CircularProgress } from '@mui/material';
import { generateDesignAdvice } from '../services/geminiService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop';

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-xs tracking-widest uppercase"
      >
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="mt-6 text-sm text-gray-500">{children}</div>}
    </div>
  );
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // --- PRODUCT QUERY ---
  const { data: rawProduct, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/api/products/${id}`)).data,
    enabled: !!id
  });

  // --- NORMALIZE PRODUCT (CRITICAL) ---
  const product = useMemo(() => {
    if (!rawProduct) return null;
    return {
      ...rawProduct,
      images: rawProduct.images?.length ? rawProduct.images : [FALLBACK_IMAGE],
      videos: rawProduct.videos ?? []
    };
  }, [rawProduct]);

  // --- SAFE CLIENT-ONLY EFFECTS ---
  useEffect(() => {
    if (!product) return;

    // Scroll (safe)
    window.scrollTo(0, 0);

    // sessionStorage (SSR safe)
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('stenna_nav_hint')) {
        sessionStorage.setItem('stenna_nav_hint', 'true');
      }
    }

    // Gemini AI (guarded)
    setLoadingAdvice(true);
    generateDesignAdvice('minimalist living room', product.name)
      .then(res => setAdvice(res || null))
      .catch(() => setAdvice(null))
      .finally(() => setLoadingAdvice(false));
  }, [product]);

  // --- LOADING ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (error || !product) {
    return <div className="min-h-screen pt-40 text-center">Product not found.</div>;
  }

  const mainImage = product.images[0];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">

      {/* IMAGES */}
      <div className="w-full md:w-[65%]">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="w-full md:w-[35%] px-8 py-12 space-y-8">
        <span className="text-xs tracking-widest uppercase text-gray-400">
          {product.collection?.title || 'Stenna Collection'}
        </span>

        <h1 className="text-4xl font-serif">{product.name}</h1>

        <p className="text-xl text-gray-600">${product.price} / roll</p>

        <p className="text-sm text-gray-500 italic">
          {product.description}
        </p>

        <Accordion title="Editorial Commentary">
          {loadingAdvice ? 'Consulting AI Stylist…' : advice || '—'}
        </Accordion>

        <Accordion title="Care & Maintenance">
          Wipe clean with a damp cloth. Light-fast pigments. Residential safe.
        </Accordion>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/login', { state: { from: location } });
              return;
            }
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: mainImage,
              quantity: 1
            });
          }}
          className="w-full border border-black py-4 uppercase tracking-widest text-xs hover:bg-black hover:text-white transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
