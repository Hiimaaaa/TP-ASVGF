import React, { useState } from 'react';
import { getCommunityAvatars, deleteCommunityAvatar } from '../services/gallery';
import type { Avatar } from '../services/gallery';
import { Trash2, Lock, LogOut, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Hardcoded credentials for simplicity as requested (normally use proper auth)
    const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin';
    const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'password123';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            setIsAuthenticated(true);
            loadAvatars();
        } else {
            alert("Invalid credentials");
        }
    };

    const loadAvatars = async () => {
        setIsLoading(true);
        const data = await getCommunityAvatars();
        setAvatars(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: number, imageUrl: string) => {
        if (!confirm("Are you sure you want to delete this avatar from the community?")) return;

        const success = await deleteCommunityAvatar(id, imageUrl);
        if (success) {
            setAvatars(prev => prev.filter(a => a.id !== id));
        } else {
            alert("Failed to delete. Check Supabase 'Delete' policies.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Admin Login</h2>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-0 outline-none"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl border border-secondary/20 focus:border-primary focus:ring-0 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mt-12 animate-in fade-in">
            <div className="flex justify-between items-center mb-8 px-4">
                <h2 className="text-3xl font-bold text-primary">Admin Dashboard</h2>
                <div className="flex gap-4">
                    <button
                        onClick={loadAvatars}
                        className="p-2 text-secondary hover:text-primary transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pb-20">
                {avatars.map((avatar) => (
                    <div key={avatar.id} className="relative group aspect-square bg-white rounded-xl shadow-md overflow-hidden border border-secondary/10">
                        <img
                            src={avatar.image_url}
                            alt={avatar.prompt}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center flex-col gap-2 p-4 text-center">
                            <p className="text-white text-xs line-clamp-2">{avatar.prompt}</p>
                            <button
                                onClick={() => handleDelete(avatar.id, avatar.image_url)}
                                className="mt-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                            ID: {avatar.id}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
