import React, { useState, useEffect, useCallback, useRef } from "react";
import { Edit3, Eye, Copy, Globe, Image } from "lucide-react";

// Components
import Modal from "@components/Modal";
import Notification from "@components/Notification";
import SideTab from "@components/SideTab";
import LayoutPanel from "@components/LayoutPanel";
import FileDropZone from "@components/FileDropZone";
import MarkdownHelp from "@components/MarkdownHelp";
import BulmaHelp from "@components/BulmaHelp";
import MarkdownEditor from "@components/MarkdownEditor";

// Utils
import { convertMarkdownToHtmlAndJson } from "@utils/markdownConverter";
import { processWordFile } from "@utils/fileProcessor";
import { layouts } from "@utils/layouts";
import { useTranslation, type Language } from "@utils/i18n";

// Hooks
import { useDebounce } from "@hooks/useDebounce";

// Types
import type { LayoutType } from "src/types/index";

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>("fr");
  const t = useTranslation(language);

  const getDefaultMarkdown = (lang: Language) => {
    if (lang === "fr") {
      return `# Introduction

Ceci est un exemple d'article rédigé en **Markdown**.

## Points principaux

- Plus facile à rédiger que HTML
- Formatage automatique
- Prévisualisation en temps réel

## Conclusion

Markdown simplifie vraiment la rédaction d'articles !`;
    } else {
      return `# Introduction

This is an example article written in **Markdown**.

## Main Points

- Easier to write than HTML
- Automatic formatting
- Real-time preview

## Conclusion

Markdown really simplifies article writing!`;
    }
  };

  const [markdown, setMarkdown] = useState(getDefaultMarkdown(language));

  const [htmlPreview, setHtmlPreview] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isMarkdownHelpOpen, setIsMarkdownHelpOpen] = useState(false);
  const [isBulmaHelpOpen, setIsBulmaHelpOpen] = useState(false);
  const [isLayoutPanelOpen, setIsLayoutPanelOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePathPrefix, setImagePathPrefix] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [topPanelRatio, setTopPanelRatio] = useState(0.35);
  const isDraggingRef = useRef(false);

  // Debouncer le markdown pour éviter trop de re-rendus
  const debouncedMarkdown = useDebounce(markdown, 300);

  // Gestion du changement de langue
  const toggleLanguage = () => {
    const newLang = language === "fr" ? "en" : "fr";
    setLanguage(newLang);
    // Mettre à jour le markdown exemple si c'est toujours le contenu par défaut
    if (markdown === getDefaultMarkdown(language)) {
      setMarkdown(getDefaultMarkdown(newLang));
    }
  };

  // Mettre à jour l'aperçu quand le markdown change
  const updatePreview = useCallback(() => {
    const result = convertMarkdownToHtmlAndJson(debouncedMarkdown, imagePathPrefix);
    setHtmlPreview(result.html);
    setJsonOutput(result.json);
  }, [debouncedMarkdown, imagePathPrefix]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Gestion du resize vertical
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = moveEvent.clientY - rect.top;
      const ratio = Math.max(0.15, Math.min(0.85, y / rect.height));
      setTopPanelRatio(ratio);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Copier le JSON
  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setNotification({
        message: t.copySuccess || "HTML copié dans le presse-papiers !",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: t.copyError || "Erreur lors de la copie",
        type: "error",
      });
    }
  };

  // Insérer un layout
  const insertLayout = (layout: LayoutType) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText =
      text.substring(0, start) + layout.template + text.substring(end);
    setMarkdown(newText);

    // Repositionner le curseur
    setTimeout(() => {
      if (textarea) {
        textarea.selectionStart = start + layout.template.length;
        textarea.selectionEnd = start + layout.template.length;
        textarea.focus();
      }
    }, 0);

    setIsLayoutPanelOpen(false);
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Traitement des fichiers
  const handleFileSelect = async (file: File) => {
    try {
      const markdownContent = await processWordFile(file);
      setMarkdown(markdownContent);
      setNotification({
        message: t.uploadSuccess || "Document importé avec succès !",
        type: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t.uploadError || "Erreur lors de l'importation du document";
      setNotification({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="bg-slate-50 h-screen flex flex-col">
      {/* En-tête */}
      <header className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light text-slate-800">
                {language === "fr" ? "HTML to JSON" : "HTML to JSON"}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {language === "fr"
                  ? "Écrivez en markdown, visualisez le résultat en HTML et copiez le JSON"
                  : "Write in markdown, view HTML result and copy JSON"}
              </p>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              title={
                language === "fr" ? "Switch to English" : "Passer en français"
              }
            >
              <Globe size={16} />
              {language === "fr" ? "EN" : "FR"}
            </button>
          </div>
        </div>
      </header>

      {/* Conteneur principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="w-full h-full px-6 py-4 flex flex-col flex-1">
          {/* Languettes latérales */}
          <SideTab
            label="Markdown"
            onClick={() => setIsMarkdownHelpOpen(true)}
            position={0}
            bgColor="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500"
          />
          <SideTab
            label="Bulma"
            onClick={() => setIsBulmaHelpOpen(true)}
            bgColor="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500"
            position={1}
          />
          <SideTab
            label="Layouts"
            onClick={() => setIsLayoutPanelOpen(!isLayoutPanelOpen)}
            bgColor="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500"
            position={2}
          />

          {/* Panneau de layouts */}
          <LayoutPanel
            isOpen={isLayoutPanelOpen}
            onClose={() => setIsLayoutPanelOpen(false)}
            layouts={layouts}
            onLayoutSelect={insertLayout}
          />

          {/* Layout principal */}
          <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden w-full ml-5 mr-5" style={{ paddingInline: '4rem' }}>
            {/* Partie haute avec drag & drop, chemin images et JSON */}
            <div className="flex flex-col md:flex-row gap-4 overflow-auto" style={{ height: `calc(${topPanelRatio * 100}% - 6px)`, minHeight: 0 }}>
              {/* Zone de drag & drop */}
              <FileDropZone
                onFileSelect={handleFileSelect}
                isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />

              {/* Préfixe chemin images */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-col justify-center min-w-[200px]">
                <label className="text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" />
                  {t.imagePathPrefix}
                </label>
                <input
                  type="text"
                  value={imagePathPrefix}
                  onChange={(e) => setImagePathPrefix(e.target.value)}
                  placeholder={t.imagePathPrefixPlaceholder}
                  className="w-full text-xs font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {imagePathPrefix.trim() && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    → {imagePathPrefix.trim()}1.webp, {imagePathPrefix.trim()}2.webp…
                  </p>
                )}
              </div>

              {/* Sortie JSON */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-600">
                      {language === "fr" ? "Sortie JSON" : "JSON Output"}
                    </h3>
                    <button
                      onClick={copyJson}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {language === "fr" ? "Copier JSON" : "Copy JSON"}
                    </button>
                  </div>
                  <textarea
                    value={jsonOutput}
                    onChange={(e) => setJsonOutput(e.target.value)}
                    className="w-full h-40 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 resize-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {/* Séparateur draggable */}
            <div
              onMouseDown={handleResizeStart}
              className="flex-shrink-0 flex items-center justify-center cursor-row-resize group py-1"
              style={{ height: '12px' }}
            >
              <div className="w-16 h-1 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
            </div>

            {/* Grille des 2 colonnes principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden" style={{ height: `calc(${(1 - topPanelRatio) * 100}% - 6px)`, minHeight: 0 }}>
              {/* Colonne 1: Éditeur Markdown */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center flex-shrink-0">
                  <Edit3 className="w-4 h-4 text-slate-500 mr-2" />
                  <h3 className="font-medium text-slate-700 text-sm">
                    {language === "fr" ? "Éditeur Markdown" : "Markdown Editor"}
                  </h3>
                </div>
                <div className="p-3 flex-1 overflow-hidden">
                  <MarkdownEditor
                    value={markdown}
                    onChange={setMarkdown}
                    textareaRef={textareaRef}
                  />
                </div>
              </div>

              {/* Colonne 2: Aperçu HTML */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-slate-500 mr-2" />
                  <h3 className="font-medium text-slate-700 text-sm">
                    {language === "fr" ? "Aperçu HTML" : "HTML Preview"}
                  </h3>
                </div>
                <div
                  className="p-6 overflow-y-auto flex-1 text-slate-800 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: htmlPreview,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-sm text-slate-600">
        <p>
          {language === "fr" ? "Avec" : "Made with"} 💜 by{" "}
          <a
            href="https://www.linkedin.com/in/florent-jcg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 underline"
          >
            Florent Gironde
          </a>{" "}
          —{" "}
          {language === "fr"
            ? "Je compile, tu compiles, nous compilons! ☕"
            : "I compile, you compile, we compile! ☕"}
        </p>
      </footer>

      {/* Modales */}
      <Modal
        isOpen={isMarkdownHelpOpen}
        onClose={() => setIsMarkdownHelpOpen(false)}
        title={
          language === "fr" ? "Aide-mémoire Markdown" : "Markdown Cheat Sheet"
        }
        bgColor="bg-orange-600"
      >
        <MarkdownHelp language={language} />
      </Modal>

      <Modal
        isOpen={isBulmaHelpOpen}
        onClose={() => setIsBulmaHelpOpen(false)}
        title={
          language === "fr" ? "Aide-mémoire Bulma CSS" : "Bulma CSS Cheat Sheet"
        }
        bgColor="bg-rose-600"
      >
        <BulmaHelp language={language} />
      </Modal>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default App;
