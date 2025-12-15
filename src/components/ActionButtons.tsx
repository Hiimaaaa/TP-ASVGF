import React from 'react';
import { Download, Save } from 'lucide-react';

interface ActionButtonsProps {
    onSave: () => void;
    onDownload: () => void;
    hasContent: boolean;
    isSaving: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onDownload, hasContent, isSaving }) => {
    if (!hasContent) return null;

    return (
        <div className="flex gap-4 w-full max-w-md animate-in slide-in-from-bottom duration-500">
            <button
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-secondary border-2 border-secondary/20 rounded-xl hover:bg-light hover:border-secondary hover:text-primary transition-all duration-300 font-medium disabled:opacity-50"
            >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save to Gallery'}
            </button>
            <button
                onClick={onDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-primary transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
                <Download className="w-5 h-5" />
                Download
            </button>
        </div>
    );
};
