// Free Image Generation Service using Pollinations.ai
// No API Key required.

export const generateAvatarImage = async (prompt: string): Promise<string> => {
    try {
        // Pollinations.ai URL structure: https://image.pollinations.ai/prompt/{prompt}
        // We add seed to ensure non-cached results if needed, and styling keywords
        const enhancedPrompt = `${prompt} avatar, flat vector art, minimalist, professional, vibrant colors`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);

        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&model=flux&enhance=true`;

        // We can return the URL directly as it serves the image
        // Verifying reachability is good practice
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Generation failed: ${response.statusText}`);
        }

        return response.url;

    } catch (error: any) {
        console.error("Pollinations Generation failed:", error);
        throw new Error("Free generation service is temporarily unavailable. Please try again.");
    }
};
