import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

// --- Sortable Item Component ---
const SortableItem = ({ id, product }: { id: string; product: any }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 mb-3 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-black transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-16 bg-gray-100 overflow-hidden">
                    <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="text-sm font-serif">{product.name}</h4>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.collection?.title}</span>
                </div>
            </div>
            <div className="text-[10px] text-gray-300 uppercase tracking-widest group-hover:text-black">
                Drag
            </div>
        </div>
    );
};

// --- Main Component ---
export const AssortmentPlanner: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [assortmentItems, setAssortmentItems] = useState<any[]>([]);
    const [assortmentName, setAssortmentName] = useState('New Assortment');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch Products (Draggable Source) - Simplified for demo: Click to add
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/api/products');
            return res.data;
        }
    });

    // Save Mutation
    const saveMutation = useMutation({
        mutationFn: async (data: { name: string, productIds: string[] }) => {
            return api.post('/api/assortments', data);
        },
        onSuccess: () => {
            setNotification({ message: 'Assortment saved successfully!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['assortments'] });
        },
        onError: () => {
            setNotification({ message: 'Failed to save assortment.', type: 'error' });
        }
    });

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setAssortmentItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    const addToAssortment = (product: any) => {
        // Prevent duplicates for simplicity if needed, or allow them
        if (!assortmentItems.find(i => i.id === product.id)) {
            setAssortmentItems([...assortmentItems, product]);
        }
    };

    const removeFromAssortment = (id: string) => {
        setAssortmentItems(assortmentItems.filter(i => i.id !== id));
    };

    const handleSave = () => {
        if (assortmentItems.length === 0) return;
        saveMutation.mutate({
            name: assortmentName,
            productIds: assortmentItems.map(i => i.id)
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 px-6 md:px-12 pb-12 flex flex-col md:flex-row gap-8">
            {/* Sidebar: Product Picker */}
            <div className="w-full md:w-1/3 bg-white p-6 h-[calc(100vh-160px)] overflow-y-auto sticky top-32 shadow-sm border border-gray-100">
                <h3 className="text-lg font-serif italic mb-6">Product Library</h3>
                <div className="flex flex-col gap-3">
                    {products?.map((product: any) => (
                        <div key={product.id} className="flex justify-between items-center p-3 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer" onClick={() => addToAssortment(product)}>
                            <div className="flex items-center gap-3">
                                <img src={product.images?.[0] || product.image} className="w-10 h-10 object-cover rounded-full" alt="" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide">{product.name}</p>
                                    <p className="text-[10px] text-gray-400">{product.collection?.title}</p>
                                </div>
                            </div>
                            <span className="text-xl font-light text-gray-300 hover:text-black">+</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Board: Assortment */}
            <div className="w-full md:w-2/3">
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        value={assortmentName}
                        onChange={(e) => setAssortmentName(e.target.value)}
                        className="text-3xl font-serif italic bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 w-full"
                    />
                    <div className="flex gap-4">
                        <button
                            className="bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending ? 'Saving...' : 'Save Assortment'}
                        </button>
                    </div>
                </div>

                <div className="bg-white min-h-[500px] border-2 border-dashed border-gray-200 p-8">
                    {assortmentItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                            <p className="text-xl font-serif italic mb-2">Your canvas is empty</p>
                            <p className="text-xs uppercase tracking-widest">Select products from the library to begin</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={assortmentItems.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {assortmentItems.map((item) => (
                                    <div key={item.id} className="relative group">
                                        <SortableItem id={item.id} product={item} />
                                        <button
                                            onClick={() => removeFromAssortment(item.id)}
                                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </SortableContext>
                            <DragOverlay>
                                {activeId ? (
                                    <div className="bg-white p-4 shadow-xl border border-black opacity-90 scale-105">
                                        Dragging Item...
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            </div>

            <Snackbar open={!!notification} autoHideDuration={4000} onClose={() => setNotification(null)}>
                <Alert severity={notification?.type as any} sx={{ width: '100%' }}>
                    {notification?.message}
                </Alert>
            </Snackbar>
        </div>
    );
};
