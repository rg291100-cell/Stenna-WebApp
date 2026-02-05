import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import api from '../services/api'; // Import API service
import { analyzeRoomPhoto } from '../services/geminiService';

const ROOM_TEMPLATES = [
  { id: 'living', name: 'Living Room', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200' },
  { id: 'bedroom', name: 'Master Suite', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200' },
  { id: 'office', name: 'Executive Office', url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1200' }
];

export const Visualizer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id');

  // Fetch products from backend
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/api/products');
      return res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.images?.[0] || p.image, // Use first image as thumbnail
        texture: p.images?.[0] || p.image // Use first image as texture for now
      }));
    }
  });

  const [selectedWallpaper, setSelectedWallpaper] = useState<any>(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((w: any) => w.id === initialId);
      setSelectedWallpaper(found || products[0]);
    }
  }, [products, initialId]);

  const [selectedRoom, setSelectedRoom] = useState(ROOM_TEMPLATES[0].url);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0.85);
  const [scale, setScale] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStart = useRef<number | null>(null);

  const categoryWallpapers = selectedWallpaper ? products.filter((w: any) => w.category === selectedWallpaper.category) : [];

  const cycleWallpaper = (direction: 'next' | 'prev') => {
    if (!selectedWallpaper || categoryWallpapers.length === 0) return;
    setIsTransitioning(true);
    const currentIndex = categoryWallpapers.findIndex((w: any) => w.id === selectedWallpaper.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % categoryWallpapers.length
      : (currentIndex - 1 + categoryWallpapers.length) % categoryWallpapers.length;

    setTimeout(() => {
      setSelectedWallpaper(categoryWallpapers[newIndex]);
      setIsTransitioning(false);
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setCustomImage(base64);
        setSelectedRoom(base64);

        // AI Analysis
        setIsAnalyzing(true);
        const result = await analyzeRoomPhoto(base64.split(',')[1]);
        setAnalysis(result);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback or alert
      alert("Could not access camera. Please allow camera permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');

        setCustomImage(base64);
        setSelectedRoom(base64);
        stopCamera();

        // AI Analysis
        setIsAnalyzing(true);
        analyzeRoomPhoto(base64.split(',')[1]).then(result => {
          setAnalysis(result);
          setIsAnalyzing(false);
        });
      }
    }
  };

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current !== null) {
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart.current - touchEnd;
      if (Math.abs(diff) > 50) {
        cycleWallpaper(diff > 0 ? 'next' : 'prev');
      }
      touchStart.current = null;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row">
      {/* Viewport */}
      <div
        className="w-full md:w-3/4 h-[60vh] md:h-[calc(100vh-6rem)] relative bg-black overflow-hidden flex items-center justify-center p-4 md:p-12"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative max-w-full max-h-full aspect-video md:aspect-[4/3] w-full shadow-2xl overflow-hidden rounded-sm bg-white group">
          {/* Base Room Image */}
          <img
            src={selectedRoom}
            alt="Room"
            className="w-full h-full object-cover"
          />

          {/* Wallpaper Overlay */}
          {selectedWallpaper && (
            <div
              className={`absolute inset-0 mask-room pointer-events-none transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              style={{
                backgroundImage: `url(${selectedWallpaper.texture})`,
                backgroundSize: `${200 / scale}px`,
                opacity: intensity,
                mixBlendMode: 'multiply'
              }}
            />
          )}

          {/* Navigation Arrows - Extremely Minimal */}
          <button
            onClick={() => cycleWallpaper('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => cycleWallpaper('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* AI Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] tracking-widest uppercase font-bold">Analyzing space aesthetics...</p>
            </div>
          )}

          {analysis && (
            <div className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md text-[10px] tracking-widest uppercase max-w-[200px] border border-black/10 animate-in slide-in-from-right-4">
              <p className="font-bold mb-2">Room Profile</p>
              <p className="mb-1 text-gray-500">Style: {analysis.style}</p>
              <p className="mb-3 text-gray-500">Rec: {analysis.recommendation}</p>
              <button
                onClick={() => setAnalysis(null)}
                className="text-black border-b border-black font-bold"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-1/4 h-full bg-white p-6 md:p-10 flex flex-col gap-10 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-serif mb-2">Visualizer</h2>
          <p className="text-[10px] tracking-widest uppercase text-gray-400">Atmosphere Preview</p>
        </div>



        <div>
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-4 border border-dashed border-gray-300 text-[10px] tracking-widest uppercase hover:border-black transition-colors"
            >
              {customImage ? 'Change Photo' : 'Upload Photo'}
            </button>
            <button
              onClick={startCamera}
              className="flex-1 py-4 bg-black text-white text-[10px] tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Camera
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          <input type="file" ref={cameraInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" capture="environment" />
        </div>

        <div>
          <span className="text-[10px] tracking-widest uppercase block mb-4 font-bold">1. Choose Wallpaper</span>
          <div className="grid grid-cols-3 gap-2">
            {products.map((wp: any) => (
              <button
                key={wp.id}
                onClick={() => setSelectedWallpaper(wp)}
                className={`aspect-square overflow-hidden border-2 transition-all ${selectedWallpaper?.id === wp.id ? 'border-black' : 'border-transparent'}`}
              >
                <img src={wp.texture} className="w-full h-full object-cover" alt={wp.name} />
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs uppercase tracking-wider font-light text-center">{selectedWallpaper?.name}</p>
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-[10px] tracking-widest uppercase block font-bold">2. Adjust Finish</span>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] tracking-widest uppercase">
              <span>Intensity</span>
              <span>{Math.round(intensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full h-px bg-gray-200 appearance-none cursor-pointer accent-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] tracking-widest uppercase">
              <span>Texture Scale</span>
              <span>{scale}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-px bg-gray-200 appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-auto">
          {selectedWallpaper && (
            <Link to={`/product/${selectedWallpaper.id}`} className="block w-full text-center bg-black text-white text-xs uppercase tracking-widest py-5 hover:bg-gray-800 transition-colors">
              View Product
            </Link>
          )}
        </div>
      </div>
      {/* Live Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg aspect-[3/4] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 items-center">
              <button
                onClick={stopCamera}
                className="text-white text-xs uppercase tracking-widest border border-white/50 px-6 py-3 rounded-full backdrop-blur-md"
              >
                Cancel
              </button>
              <button
                onClick={captureImage}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
