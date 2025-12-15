import React, { useEffect, useState } from 'react';
import { getCommunityAvatars } from '../services/gallery';
import type { Avatar } from '../services/gallery';
import { Loader2 } from 'lucide-react';

export const CommunityGallery: React.FC = () => {
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await getCommunityAvatars();
                setAvatars(data);
            } catch (error) {
                console.error("Failed to load galaxy:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();

        // Optional: Polling for updates every 30s
        const interval = setInterval(fetchGallery, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mt-20 animate-in fade-in duration-700">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary">
                Community Gallery
            </h2>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                </div>
            ) : avatars.length === 0 ? (
                <p className="text-center text-secondary">No community avatars yet. Be the first!</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
                    {avatars.map((avatar) => (
                        <div key={avatar.id} className="group relative aspect-square bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
                            <img
                                src={avatar.image_url}
                                alt={avatar.prompt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-white text-xs line-clamp-2 font-medium">
                                    {avatar.prompt}
                                </p>
                                <p className="text-secondary/80 text-[10px] mt-1">
                                    {new Date(avatar.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
