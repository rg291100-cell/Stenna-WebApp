import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        homepage_video_url: '',
        homepage_hero_image: '',
        homepage_transform_image: '',
        homepage_color_image: '',
        homepage_room_image: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const keys = [
                'homepage_video_url',
                'homepage_hero_image',
                'homepage_transform_image',
                'homepage_color_image',
                'homepage_room_image'
            ];

            const newSettings = { ...settings };

            await Promise.all(keys.map(async (key) => {
                const res = await api.get(`/api/settings/${key}`);
                if (res.data && res.data.value) {
                    // @ts-ignore
                    newSettings[key] = res.data.value;
                }
            }));

            setSettings(newSettings);
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await Promise.all(Object.entries(settings).map(([key, value]) =>
                api.put(`/api/settings/${key}`, { value })
            ));
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] uppercase tracking-widest text-gray-400">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-serif mb-8 italic">Site Settings</h1>

            <div className="bg-white p-8 shadow-sm border border-gray-100">

                <div className="mb-12">
                    <h3 className="text-lg font-serif mb-4">Homepage Configuration</h3>
                    <p className="text-xs text-gray-400 mb-6">Manage global content for the homepage.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Featured Video URL</label>
                            <input
                                type="text"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                value={settings.homepage_video_url}
                                onChange={(e) => setSettings({ ...settings, homepage_video_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Hero Fallback Image</label>
                            <input
                                type="text"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                value={settings.homepage_hero_image}
                                onChange={(e) => setSettings({ ...settings, homepage_hero_image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Transform Section Main Image</label>
                            <input
                                type="text"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                value={settings.homepage_transform_image}
                                onChange={(e) => setSettings({ ...settings, homepage_transform_image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Shop by Color Main Image</label>
                            <input
                                type="text"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                value={settings.homepage_color_image}
                                onChange={(e) => setSettings({ ...settings, homepage_color_image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Shop by Room Main Image</label>
                            <input
                                type="text"
                                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                                value={settings.homepage_room_image}
                                onChange={(e) => setSettings({ ...settings, homepage_room_image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button
                            onClick={handleSave}
                            className="bg-black text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
