import React from 'react';
import { Loader2 } from 'lucide-react';

interface AvatarDisplayProps {
    svgContent: string | null;
    isGenerating: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ svgContent, isGenerating }) => {
    return (
        <div className="w-full aspect-square max-w-md bg-white rounded-2xl shadow-inner border-4 border-white flex items-center justify-center overflow-hidden relative">
            {isGenerating ? (
                <div className="flex flex-col items-center gap-4 text-secondary animate-pulse">
                    <Loader2 className="w-12 h-12 animate-spin text-accent" />
                    <p className="font-medium">Dreaming up your avatar...</p>
                </div>
            ) : svgContent ? (
                svgContent.startsWith('<svg') ? (
                    <div
                        className="w-full h-full flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                ) : (
                    <img
                        src={svgContent}
                        alt="Generated Avatar"
                        className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
                    />
                )
            ) : (
                <div className="text-center p-8 text-secondary/50">
                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p>Your avatar will appear here</p>
                </div>
            )}
        </div>
    );
};
