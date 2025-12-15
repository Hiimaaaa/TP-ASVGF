import { supabase } from '../lib/supabase';

// Define the Avatar interface matching the DB table
export interface Avatar {
    id: number;
    image_url: string;
    prompt: string;
    created_at: string;
}

const STORAGE_BUCKET = 'avatars';
const TABLE_NAME = 'avatars';

export const uploadAvatarToGallery = async (imageUrl: string, prompt: string): Promise<Avatar | null> => {
    // If Supabase is not configured, return null (silent fail or handle in UI)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log("Supabase not configured, skipping upload");
        return null;
    }

    try {
        // 1. Fetch the image content from the generated URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // 2. Upload to Supabase Storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, blob, {
                contentType: blob.type,
            });

        if (uploadError) throw uploadError;

        // 3. Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        // 4. Insert into Database
        const { data: insertData, error: insertError } = await supabase
            .from(TABLE_NAME)
            .insert([
                { image_url: publicUrl, prompt: prompt }
            ])
            .select()
            .single();

        if (insertError) throw insertError;

        return insertData;

    } catch (error) {
        console.error("Gallery upload failed:", error);
        return null;
    }
};

export const getCommunityAvatars = async (): Promise<Avatar[]> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // Return some mock data for preview if no DB
        return [
            { id: 1, image_url: 'https://ui-avatars.com/api/?name=Mock+1&background=random', prompt: 'Mock Avatar 1', created_at: new Date().toISOString() },
            { id: 2, image_url: 'https://ui-avatars.com/api/?name=Mock+2&background=random', prompt: 'Mock Avatar 2', created_at: new Date().toISOString() },
        ];
    }

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching gallery:", error);
        return [];
    }

    return data || [];
};

export const deleteCommunityAvatar = async (id: number, imageUrl: string): Promise<boolean> => {
    // Check if configured using the proper way to access client configuration or env vars
    // Since we initialized the client with placeholders if missing, we can check env vars directly here for safety
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return false;

    try {
        // 1. Delete from Storage
        // Extract filename from URL (e.g., ".../avatars/filename.png")
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([fileName]);

            if (storageError) console.error("Storage delete error:", storageError);
        }

        // 2. Delete from Database
        const { error: dbError } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        return true;
    } catch (error) {
        console.error("Delete failed:", error);
        return false;
    }
};
