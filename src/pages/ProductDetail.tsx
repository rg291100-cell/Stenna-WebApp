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
  const images: string[] =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop',
      ];

  const mainImage = images[0];
  const galleryImages = images.slice(1);

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

  /* ----------------------------- Add to cart ---------------------------- */
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: 1,
    });
  };

  /* ------------------------------- Render ------------------------------ */
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">

        {/* -------------------------- Images -------------------------- */}
        <div className="w-full md:w-[65%]">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-auto object-cover"
          />

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 mt-1">
              {galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* -------------------------- Content -------------------------- */}
        <div className="w-full md:w-[35%] px-6 md:px-12 py-12 md:sticky md:top-0 h-fit">

          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
            {product.collection?.title || 'Stenna Collection'}
          </span>

          <h1 className="text-4xl md:text-5xl font-serif mt-4">
            {product.name}
          </h1>

          <p className="text-xl text-gray-600 mt-2">
            ${product.price} / roll
          </p>

          <p className="mt-6 text-sm text-gray-500 italic">
            {product.description}
          </p>

          {/* ------------------------ Specs ------------------------ */}
          <div className="mt-8 space-y-3">
            {product.rollLength && (
              <Spec label="Length" value={product.rollLength} />
            )}
            {product.rollWidth && (
              <Spec label="Width" value={product.rollWidth} />
            )}
            {product.designStyle && (
              <Spec label="Design Style" value={product.designStyle} />
            )}
            {product.color && <Spec label="Color" value={product.color} />}
            {product.material && (
              <Spec label="Material" value={product.material} />
            )}
            {product.weight && <Spec label="Weight" value={product.weight} />}
          </div>

          {/* ---------------------- Actions ---------------------- */}
          <div className="mt-10 space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full border border-black py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition"
            >
              Add to Cart
            </button>

            <Link
              to={`/visualizer?id=${product.id}`}
              className="block w-full text-center border py-4 text-[10px] uppercase tracking-[0.2em]"
            >
              Virtual Preview
            </Link>
          </div>

          {/* ---------------------- Accordions ---------------------- */}
          <div className="mt-12">
            <Accordion title="The Build">
              Digitally mastered textures on premium non-woven stock. Durable,
              breathable, and PVC-free.
            </Accordion>
            <Accordion title="Care & Maintenance">
              Wipe clean with a damp cloth. High resistance to fading.
            </Accordion>
          </div>

          {/* ------------------ Prev / Next ------------------ */}
          <div className="mt-12 flex justify-between text-sm">
            {prevProduct && (
              <button onClick={() => navigate(`/product/${prevProduct.id}`)}>
                ← Previous
              </button>
            )}
            {nextProduct && (
              <button onClick={() => navigate(`/product/${nextProduct.id}`)}>
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Helpers ------------------------------ */
const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-[10px] uppercase tracking-widest border-b pb-2">
    <span className="text-gray-400">{label}</span>
    <span>{value}</span>
  </div>
);
