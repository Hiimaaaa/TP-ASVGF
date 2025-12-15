import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PromptInput } from './components/PromptInput';
import { AvatarDisplay } from './components/AvatarDisplay';
import { ActionButtons } from './components/ActionButtons';
import { AvatarGallery } from './components/AvatarGallery';
import { CommunityGallery } from './components/CommunityGallery';
import { AdminDashboard } from './components/AdminDashboard'; // Import
import { generateAvatarImage } from './services/openai';
import { uploadAvatarToGallery } from './services/gallery';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageContent, setImageContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // Admin toggle
  const [savedAvatars, setSavedAvatars] = useState<string[]>(() => {
    const saved = localStorage.getItem('avatars');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('avatars', JSON.stringify(savedAvatars));
  }, [savedAvatars]);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Universal prompt for consistent style
  const UNIVERSAL_PROMPT = "Generate an original avatar in a minimalist vector style, framed from the bust to the shoulders: character seen from the front (male or female) with a round head, very simple eyes and mouth, stylized hair in a few shapes, body reduced to the shoulders and upper torso, flat colors with a maximum of 3-4 colors, sharp outlines, plain colored background, no text or logo.";

  const handleGenerate = async () => {
    // No longer checking for prompt.trim() as we ignore user input

    setIsGenerating(true);
    setImageContent(null);
    setErrorString(null);
    setUploadStatus('idle');

    // Use UNIVERSAL_PROMPT instead of 'prompt' state
    const promptToUse = UNIVERSAL_PROMPT + ` (Seed: ${Date.now()})`; // Add seed to ensure variety if api caches

    try {
      // 1. Generate Raster Image
      const imageUrl = await generateAvatarImage(promptToUse);

      // 2. Vectorize Client-Side
      // We import dynamically to avoid loading if not needed, though here we need it every time
      const { vectorizeImage } = await import('./utils/vectorizer');
      const svgContent = await vectorizeImage(imageUrl);

      setImageContent(svgContent);

      // Auto-upload (We upload the SVG content as a base64 string or similar if needed, 
      // but the gallery service might expect a URL. 
      // For now, let's stick to uploading the original URL to the gallery for the raster preview,
      // OR we can try to upload the SVG if the backend supports it.
      // Given the existing gallery service likely expects a URL to an image, we'll keep uploading the imageUrl for the gallery thumbnail,
      // but the user sees the SVG locally.
      // ideally we would upload the SVG file itself.)

      setUploadStatus('uploading');
      // For the gallery, we keep using the original raster URL for simplicity unless we refactor the backend storage
      const saved = await uploadAvatarToGallery(imageUrl, "Universal Avatar");

      if (saved) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
        console.error("Upload failed (check console for details)");
      }

    } catch (error: any) {
      console.error("Generation failed", error);
      setErrorString(error.message || "An unexpected error occurred");
      setUploadStatus('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!imageContent) return;
    setIsSaving(true);

    // Simulate API save delay
    await new Promise(resolve => setTimeout(resolve, 600));

    setSavedAvatars(prev => [imageContent, ...prev]);
    setIsSaving(false);
  };

  const handleDownload = async () => {
    if (!imageContent) return;

    try {
      setIsSaving(true);

      // imageContent is now the raw SVG string
      const svgBlob = new Blob([imageContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const a = document.createElement('a');
      a.href = svgUrl;
      a.download = `avatar-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(svgUrl);
      setIsSaving(false);

    } catch (e) {
      console.error("Download failed:", e);
      setIsSaving(false);
    }
  };

  const handleDelete = (index: number) => {
    setSavedAvatars(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      {/* Admin Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="px-4 py-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-sm text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          {showAdmin ? 'Home' : 'Admin'}
        </button>
      </div>

      {showAdmin ? (
        <AdminDashboard />
      ) : (
        <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">

          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {errorString && (
            <div className="w-full max-w-md p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center text-sm font-medium animate-in fade-in">
              {errorString}
            </div>
          )}

          <div className="w-full flex flex-col items-center gap-6">
            <AvatarDisplay
              svgContent={imageContent}
              isGenerating={isGenerating}
            />

            <ActionButtons
              hasContent={!!imageContent}
              onSave={handleSave}
              onDownload={handleDownload}
              isSaving={isSaving}
            />

            {uploadStatus === 'uploading' && <p className="text-sm text-secondary animate-pulse">Sharing to community...</p>}
            {uploadStatus === 'success' && <p className="text-sm text-green-600 font-medium">✨ Shared to Community Gallery!</p>}
            {uploadStatus === 'error' && <p className="text-sm text-red-500">❌ Could not share to gallery. Check DB/RLS settings.</p>}
          </div>

          <AvatarGallery
            avatars={savedAvatars}
            onDelete={handleDelete}
          />

          <div className="w-full border-t border-secondary/10 my-8"></div>

          <CommunityGallery />

        </div>
      )}
    </Layout>
  );
}

export default App;
