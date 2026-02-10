import React, { useRef, useMemo } from "react";

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
        const base64ImageRegex =
            /!\[([^\]]*)\]\(data:image\/[^;]+;base64,([^)]+)\)/g;

        return text.replace(base64ImageRegex, (_match, alt, base64) => {
            const truncated = base64.substring(0, 50);
            const sizeKB = Math.floor(base64.length / 1024);
            return `![${alt}](data:image/...;base64,${truncated}... [${sizeKB}KB])`;
        });
    };

    const displayText = formatDisplayText(value);

    const lineCount = useMemo(() => {
        return displayText.split("\n").length;
    }, [displayText]);

    return (
        <div className="w-full h-full relative">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-50 border-r border-gray-100 flex flex-col items-end pr-2 pt-4 text-[10px] font-mono text-gray-300 leading-6 select-none overflow-hidden">
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>
            {/* Textarea */}
            <textarea
                ref={actualRef}
                value={displayText}
                onChange={(e) => {
                    const newDisplayText = e.target.value;

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

                    let restoredText = newDisplayText;
                    originalImages.forEach(({ placeholder, full }) => {
                        restoredText = restoredText.replace(placeholder, full);
                    });

                    onChange(restoredText);
                }}
                className="absolute inset-0 left-8 w-[calc(100%-2rem)] h-full p-4 text-sm font-mono leading-6 bg-white text-gray-800 resize-none focus:outline-none"
                spellCheck={false}
            />
        </div>
    );
};

export default MarkdownEditor;
