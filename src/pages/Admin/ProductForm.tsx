import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { CircularProgress } from '@mui/material';

export const ProductForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;
    const [isAddingColor, setIsAddingColor] = useState(false);
    const [newColorName, setNewColorName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        description: '',
        category: 'MODERN',
        room: 'Living',
        color: 'Neutral',
        theme: 'Modern',
        quantity: 0,
        weight: '',
        rollLength: '',
        rollWidth: '',
        designStyle: '',
        material: '',
        collectionId: '',
        images: [''], // Array of image URLs
        videos: ['']  // Array of video URLs
    });

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/api/products/${id}`);
            return res.data;
        },
        enabled: isEdit
    });

    const { data: colors } = useQuery({
        queryKey: ['colors'],
        queryFn: async () => {
            const res = await api.get('/api/colors');
            return res.data;
        }
    });

    const addColorMutation = useMutation({
        mutationFn: async (name: string) => {
            const res = await api.post('/api/colors', { name });
            return res.data;
        },
        onSuccess: (newColor) => {
            queryClient.invalidateQueries({ queryKey: ['colors'] });
            setFormData({ ...formData, color: newColor.name });
            setIsAddingColor(false);
            setNewColorName('');
        }
    });

    const handleAddColor = () => {
        if (newColorName.trim()) {
            addColorMutation.mutate(newColorName);
        }
    };

    useEffect(() => {
        if (product) {
            const parseArray = (val: any) => {
                if (Array.isArray(val)) return val;
                if (typeof val === 'string' && val.trim() !== '') {
                    try {
                        const parsed = JSON.parse(val);
                        return Array.isArray(parsed) ? parsed : [val];
                    } catch {
                        return [val];
                    }
                }
                return [];
            };

            const images = parseArray(product.images);
            const videos = parseArray(product.videos);

            setFormData({
                name: product.name,
                sku: product.sku,
                price: product.price.toString(),
                description: product.description,
                category: product.category,
                room: product.room || 'Living',
                color: product.color || 'Neutral',
                theme: product.theme || 'Modern',
                quantity: product.quantity || 0,
                weight: product.weight || '',
                rollLength: product.rollLength || '',
                rollWidth: product.rollWidth || '',
                designStyle: product.designStyle || '',
                material: product.material || '',
                collectionId: product.collectionId || '',
                images: images.length > 0 ? images : [product.image || ''],
                videos: videos.length > 0 ? videos : ['']
            });
        }
    }, [product]);

    const mutation = useMutation({
        mutationFn: (data: any) => {
            const payload = {
                ...data,
                price: parseFloat(data.price),
                // Filter out empty strings
                images: data.images.filter((img: string) => img.trim() !== ''),
                videos: data.videos.filter((vid: string) => vid.trim() !== '')
            };

            if (isEdit) {
                return api.put(`/api/products/${id}`, payload);
            } else {
                return api.post('/api/products', payload);
            }
        },
        onSuccess: () => {
            // Invalidate all product related queries
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            navigate('/admin/products');
        },
        onError: (error: any) => {
            console.error('Save failed:', error);
            alert('Failed to save product. Please check console for details.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isEdit && isLoading) return <div className="p-12"><CircularProgress color="inherit" /></div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif italic mb-8">{isEdit ? 'Edit Product' : 'New Product'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Name</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors font-serif"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">SKU</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.sku}
                            onChange={e => setFormData({ ...formData, sku: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea
                        className="w-full border border-gray-200 p-3 h-32 focus:outline-none focus:border-black transition-colors"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Price</label>
                        <input
                            type="number"
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Category</label>
                        <select
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-white"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="MODERN">Modern</option>
                            <option value="CLASSIC">Classic</option>
                            <option value="TEXTURED">Textured</option>
                            <option value="NATURE">Nature</option>
                        </select>
                    </div>
                </div>

                {/* Product Attributes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-50">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Quantity</label>
                        <input
                            type="number"
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.quantity}
                            onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Weight</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.weight}
                            onChange={e => setFormData({ ...formData, weight: e.target.value })}
                            placeholder="e.g. 180gsm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Roll Length</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.rollLength}
                            onChange={e => setFormData({ ...formData, rollLength: e.target.value })}
                            placeholder="e.g. 10m"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Roll Width</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.rollWidth}
                            onChange={e => setFormData({ ...formData, rollWidth: e.target.value })}
                            placeholder="e.g. 52cm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Material</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.material}
                            onChange={e => setFormData({ ...formData, material: e.target.value })}
                            placeholder="e.g. Non-woven"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Design Style</label>
                        <input
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                            value={formData.designStyle}
                            onChange={e => setFormData({ ...formData, designStyle: e.target.value })}
                            placeholder="e.g. Botanical"
                        />
                    </div>
                </div>

                {/* Filter Attributes */}
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Room Type</label>
                        <select
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-white text-sm"
                            value={formData.room}
                            onChange={e => setFormData({ ...formData, room: e.target.value })}
                        >
                            <option value="Living">Living</option>
                            <option value="Bedroom">Bedroom</option>
                            <option value="Dining">Dining</option>
                            <option value="Office">Office</option>
                            <option value="Kids Room">Kids Room</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Color</label>
                        <div className="flex gap-2">
                            <select
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-white text-sm"
                                value={formData.color}
                                onChange={e => {
                                    if (e.target.value === 'NEW') {
                                        setIsAddingColor(true);
                                    } else {
                                        setFormData({ ...formData, color: e.target.value });
                                    }
                                }}
                            >
                                <option value="">Select Color</option>
                                {colors?.map((c: any) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                                <option value="NEW">+ Add New Color</option>
                            </select>
                        </div>
                        {isAddingColor && (
                            <div className="mt-2 flex gap-2">
                                <input
                                    className="flex-1 border-b border-black py-1 text-sm focus:outline-none"
                                    placeholder="New Color Name"
                                    value={newColorName}
                                    onChange={e => setNewColorName(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddColor}
                                    className="text-[10px] uppercase bg-black text-white px-3 py-1"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingColor(false)}
                                    className="text-[10px] uppercase text-gray-500 px-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Theme</label>
                        <select
                            className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-white text-sm"
                            value={formData.theme}
                            onChange={e => setFormData({ ...formData, theme: e.target.value })}
                        >
                            <option value="Minimalist">Minimalist</option>
                            <option value="Nature">Nature</option>
                            <option value="Modern">Modern</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Industrial">Industrial</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4">Product Images (Max 8)</label>
                    <div className="space-y-4">
                        {Array.isArray(formData.images) && formData.images.map((img, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <span className="text-xs text-gray-400 pt-3">{index + 1}.</span>
                                <input
                                    className="flex-1 border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                    value={img}
                                    onChange={e => {
                                        const newImages = [...formData.images];
                                        newImages[index] = e.target.value;
                                        setFormData({ ...formData, images: newImages });
                                    }}
                                    placeholder="https://..."
                                />
                                {img && (
                                    <img src={img} alt={`Preview ${index}`} className="w-12 h-12 object-cover border border-gray-100" />
                                )}
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = formData.images.filter((_, i) => i !== index);
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="text-xs uppercase text-red-400 hover:text-red-600 pt-3"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {formData.images.length < 8 && (
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                            className="mt-4 text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-50"
                        >
                            + Add Another Image
                        </button>
                    )}
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4">Product Videos (Max 2)</label>
                    <div className="space-y-4">
                        {Array.isArray(formData.videos) && formData.videos.map((vid, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <span className="text-xs text-gray-400 pt-3">{index + 1}.</span>
                                <input
                                    className="flex-1 border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                    value={vid}
                                    onChange={e => {
                                        const newVideos = [...formData.videos];
                                        newVideos[index] = e.target.value;
                                        setFormData({ ...formData, videos: newVideos });
                                    }}
                                    placeholder="https://..."
                                />
                                {formData.videos.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newVideos = formData.videos.filter((_, i) => i !== index);
                                            setFormData({ ...formData, videos: newVideos });
                                        }}
                                        className="text-xs uppercase text-red-400 hover:text-red-600 pt-3"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {formData.videos.length < 2 && (
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, videos: [...formData.videos, ''] })}
                            className="mt-4 text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-50"
                        >
                            + Add Another Video
                        </button>
                    )}
                </div>

                <div className="pt-8 flex justify-end gap-6">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="text-xs uppercase tracking-widest text-gray-400 hover:text-black"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-black text-white text-xs uppercase tracking-widest px-8 py-3 hover:opacity-80 transition-opacity"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};
