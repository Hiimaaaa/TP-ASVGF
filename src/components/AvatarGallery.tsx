import React from 'react';
import { Trash2 } from 'lucide-react';

interface AvatarGalleryProps {
    avatars: string[];
    onDelete: (index: number) => void;
}

export const AvatarGallery: React.FC<AvatarGalleryProps> = ({ avatars, onDelete }) => {
    if (avatars.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mt-12 animate-in fade-in duration-700">
            <h2 className="text-2xl font-bold mb-6 text-primary border-b-2 border-secondary/10 pb-2">
                My Avatars
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {avatars.map((svg, index) => (
                    <div key={index} className="group relative aspect-square bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/50">
                        {svg.startsWith('<svg') ? (
                            <div
                                className="w-full h-full p-2"
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        ) : (
                            <img
                                src={svg}
                                alt={`Avatar ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                                onClick={() => onDelete(index)}
                                className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
