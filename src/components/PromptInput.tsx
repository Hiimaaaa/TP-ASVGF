import React from 'react';
import { Send } from 'lucide-react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
    return (
        <div className="w-full relative max-w-lg mx-auto">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-accent rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className={`relative w-full py-6 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${isGenerating
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-opacity-90 hover:-translate-y-1 active:scale-95'
                        }`}
                >
                    <span className="text-xl font-bold tracking-wide">
                        {isGenerating ? 'Designing...' : 'GENERATE AVATAR'}
                    </span>
                    <Send className={`w-6 h-6 ${isGenerating ? 'animate-pulse' : ''}`} />
                </button>
            </div>
            <p className="text-center text-sm text-secondary/60 mt-4">
                Click to generate a unique avatar with our universal style.
            </p>
        </div>
    );
};
