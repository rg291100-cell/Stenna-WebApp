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
      if (!Array.isArray(res.data)) return [];
      return res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.images?.[0] || p.image,
        texture: p.images?.[0] || p.image
      }));
    }
  });

  const [selectedWallpaper, setSelectedWallpaper] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TEMPLATES[0].url);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0.85);
  const [scale, setScale] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((w: any) => w.id === initialId);
      setSelectedWallpaper(found || products[0]);
    }
  }, [products, initialId]);

  // Trigger analysis for templates if not done
  useEffect(() => {
    if (!analysis && selectedRoom) {
      const analyzeTemplate = async () => {
        setIsAnalyzing(true);
        try {
          // Note: analyzeRoomPhoto might need the image to be converted to base64 if it's a URL
          // For simplicity in this demo, we'll assume the service can handle it or just provide 
          // a fallback poly for templates.
          const result = await analyzeRoomPhoto(selectedRoom);
          if (result && result.wallPolygon) {
            setAnalysis(result);
          }
        } catch (e) {
          console.error("Template analysis failed", e);
        } finally {
          setIsAnalyzing(false);
        }
      };

      // We only analyze if it's one of the templates to save calls, 
      // or we can use pre-set polygons for templates.
      const isTemplate = ROOM_TEMPLATES.some(t => t.url === selectedRoom);
      if (isTemplate) {
        // Fallback polygons for templates if analysis fails or for speed
        const templatePolys: Record<string, any> = {
          [ROOM_TEMPLATES[0].url]: { wallPolygon: [[0, 0], [100, 0], [100, 75], [0, 75]], style: 'Modern Living', recommendation: 'Textured' },
          [ROOM_TEMPLATES[1].url]: { wallPolygon: [[10, 0], [90, 0], [90, 80], [10, 80]], style: 'Master Suite', recommendation: 'Nature' },
          [ROOM_TEMPLATES[2].url]: { wallPolygon: [[0, 0], [100, 0], [100, 65], [0, 65]], style: 'Executive Office', recommendation: 'Modern' }
        };
        setAnalysis(templatePolys[selectedRoom] || null);
      }
    }
  }, [selectedRoom]);

  const categoryWallpapers = selectedWallpaper ? products.filter((w: any) => w.category === selectedWallpaper.category) : [];

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
        setAnalysis(null); // Clear old analysis

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Could not access camera.");
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
        setAnalysis(null);
        stopCamera();
        setIsAnalyzing(true);
        analyzeRoomPhoto(base64.split(',')[1]).then(result => {
          setAnalysis(result);
          setIsAnalyzing(false);
        });
      }
    }
  };

  // Create clip-path from wallPolygon
  const getClipPath = () => {
    if (!analysis || !analysis.wallPolygon || analysis.wallPolygon.length === 0) return 'none';
    const points = analysis.wallPolygon.map((p: number[]) => `${p[0]}% ${p[1]}%`).join(', ');
    return `polygon(${points})`;
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F5F5F5] flex flex-col md:flex-row">
      {/* Viewport */}
      <div className="w-full md:w-3/4 h-[60vh] md:h-[calc(100vh-6rem)] relative bg-black overflow-hidden flex items-center justify-center p-4 md:p-12">
        <div className="relative max-w-full max-h-full aspect-[4/3] w-full shadow-2xl overflow-hidden rounded-sm bg-white group">
          <img src={selectedRoom} alt="Room" className="w-full h-full object-cover" />

          {selectedWallpaper && (
            <div
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
              style={{
                backgroundImage: `url(${selectedWallpaper.texture})`,
                backgroundSize: `${400 / scale}px`,
                opacity: intensity,
                mixBlendMode: 'multiply',
                clipPath: getClipPath(),
                WebkitClipPath: getClipPath()
              }}
            />
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] tracking-widest uppercase font-bold">Mapping your walls...</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-1/4 bg-white p-6 h-screen overflow-y-auto border-l border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-serif mb-1">Visualizer</h2>
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400">Precision Atmosphere Preview</p>
        </div>

        {/* Room Templates */}
        <div className="mb-8">
          <span className="text-[10px] tracking-widest uppercase block mb-3 font-bold">Try our spaces</span>
          <div className="flex gap-2 h-16">
            {ROOM_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => { setSelectedRoom(t.url); setCustomImage(null); setAnalysis(null); }}
                className={`flex-1 overflow-hidden border-2 transition-all ${selectedRoom === t.url ? 'border-black' : 'border-transparent'}`}
              >
                <img src={t.url} className="w-full h-full object-cover" alt={t.name} title={t.name} />
              </button>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 border border-gray-200 text-[9px] tracking-widest uppercase hover:border-black transition-colors">
            {customImage ? 'New Photo' : 'Upload'}
          </button>
          <button onClick={startCamera} className="flex-1 py-3 bg-black text-white text-[9px] tracking-widest uppercase flex items-center justify-center gap-2">
            Camera
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
        </div>

        {/* Wallpapers with Pagination */}
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-[10px] tracking-widest uppercase font-bold">1. Select Texture</span>
            <span className="text-[9px] text-gray-400">Page {currentPage} of {totalPages}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {paginatedProducts.map((wp: any) => (
              <div key={wp.id} className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedWallpaper(wp)}
                  className={`aspect-[3/4] overflow-hidden border transition-all ${selectedWallpaper?.id === wp.id ? 'border-black border-2' : 'border-gray-100'}`}
                >
                  <img src={wp.texture} className="w-full h-full object-cover" alt={wp.name} />
                </button>
                <Link to={`/product/${wp.id}`} className="text-[8px] tracking-widest uppercase text-center border-b border-gray-100 pb-1 hover:border-black transition-colors">
                  View {wp.name.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="text-[9px] uppercase tracking-widest disabled:opacity-30"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="text-[9px] uppercase tracking-widest disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>

        {/* Finish Controls */}
        <div className="flex flex-col gap-6 pt-6 border-t border-gray-50">
          <div className="flex justify-between text-[9px] tracking-widest uppercase font-bold">
            <span>Blend Intensity</span>
            <span>{Math.round(intensity * 100)}%</span>
          </div>
          <input type="range" min="0.1" max="1" step="0.01" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} className="w-full h-px bg-gray-200 appearance-none cursor-pointer accent-black" />

          <div className="flex justify-between text-[9px] tracking-widest uppercase font-bold">
            <span>Texture Scale</span>
            <span>{scale}x</span>
          </div>
          <input type="range" min="0.4" max="2.5" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-px bg-gray-200 appearance-none cursor-pointer accent-black" />
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg aspect-[3/4] bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 items-center">
              <button onClick={stopCamera} className="text-white text-[10px] uppercase tracking-widest border border-white/50 px-6 py-3 rounded-full">Cancel</button>
              <button onClick={captureImage} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20"><div className="w-12 h-12 bg-white rounded-full" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
