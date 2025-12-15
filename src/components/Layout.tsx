import React from 'react';
import { Sparkles } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-light text-primary flex flex-col items-center py-10 px-4 font-sans">
            <header className="w-full max-w-4xl mb-12 text-center">
                <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                    <Sparkles className="w-10 h-10 text-secondary" />
                    <span className="text-primary">AI Avatar Generator</span>
                </h1>
                <p className="text-secondary text-lg">Generate unique avatars (Free & Unlimited)</p>
            </header>

            <main className="w-full max-w-4xl">
                {children}
            </main>

            <footer className="mt-20 text-secondary text-sm">
                Powered by Pollinations.ai & Supabase
            </footer>
        </div>
    );
};
