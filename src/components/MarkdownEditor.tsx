import React, { useRef } from "react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    textareaRef,
}) => {
    const localRef = useRef<HTMLTextAreaElement>(null);
    const actualRef = textareaRef || localRef;

    // Fonction pour formater le texte avec les base64 tronquées pour l'affichage
    const formatDisplayText = (text: string): string => {
        // Regex pour détecter les images avec base64
        const base64ImageRegex =
            /!\[([^\]]*)\]\(data:image\/[^;]+;base64,([^)]+)\)/g;

        return text.replace(base64ImageRegex, (_match, alt, base64) => {
            // Tronquer le base64 à ~50 caractères
            const truncated = base64.substring(0, 50);
            const sizeKB = Math.floor(base64.length / 1024);
            return `![${alt}](data:image/...;base64,${truncated}... [${sizeKB}KB])`;
        });
    };

    const displayText = formatDisplayText(value);

    return (
        <div className="w-full h-full">
            {/* Textarea simple avec texte tronqué */}
            <textarea
                ref={actualRef}
                value={displayText}
                onChange={(e) => {
                    // Restaurer les base64 complètes si elles existent dans value
                    const newDisplayText = e.target.value;
                    
                    // Récupérer les images originales avec base64 complètes
                    const originalImages: Array<{ placeholder: string; full: string }> = [];
                    const base64ImageRegex = /!\[([^\]]*)\]\(data:image\/[^;]+;base64,([^)]+)\)/g;
                    
                    let match;
                    while ((match = base64ImageRegex.exec(value)) !== null) {
                        const alt = match[1];
                        const base64 = match[2];
                        const truncated = base64.substring(0, 50);
                        const sizeKB = Math.floor(base64.length / 1024);
                        const placeholder = `![${alt}](data:image/...;base64,${truncated}... [${sizeKB}KB])`;
                        originalImages.push({ placeholder, full: match[0] });
                    }
                    
                    // Remplacer les placeholders par les images complètes
                    let restoredText = newDisplayText;
                    originalImages.forEach(({ placeholder, full }) => {
                        restoredText = restoredText.replace(placeholder, full);
                    });
                    
                    onChange(restoredText);
                }}
                className="w-full h-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm resize-none bg-slate-50 text-slate-800"
                spellCheck={false}
            />
        </div>
    );
};

export default MarkdownEditor;
