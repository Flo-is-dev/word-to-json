import React, { useState, useEffect, useCallback, useRef } from "react";
import { Edit3, Eye, Copy, Globe } from "lucide-react";

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
    <div className="bg-gray-50 h-screen flex flex-col font-sans text-gray-900 antialiased overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-30">
        <div className="w-full px-5 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                  <span>florentg</span>
                  <span className="text-gray-300">/</span>
                  <span>html2json</span>
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-gray-500 text-[11px] font-mono">v2.0.4 stable</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-600 text-xs font-medium rounded-md hover:bg-gray-50 border border-gray-200 transition-all shadow-subtle hover:border-gray-300"
                title={
                  language === "fr" ? "Switch to English" : "Passer en français"
                }
              >
                <Globe size={14} />
                {language === "fr" ? "EN" : "FR"}
              </button>
              {/* Copy JSON button */}
              <button
                onClick={copyJson}
                className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-all shadow-subtle border border-transparent"
              >
                <Copy size={14} />
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Floating Sidebar Toolbelt */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-none">
          <div className="pointer-events-auto bg-white border border-gray-200 shadow-card p-1 rounded-lg flex flex-col gap-1">
            <SideTab
              label="Markdown"
              onClick={() => setIsMarkdownHelpOpen(true)}
              position={0}
              bgColor=""
            />
            <SideTab
              label="Bulma"
              onClick={() => setIsBulmaHelpOpen(true)}
              bgColor=""
              position={1}
            />
            <div className="h-px w-5 mx-auto bg-gray-200 my-1" />
            <SideTab
              label="Layouts"
              onClick={() => setIsLayoutPanelOpen(!isLayoutPanelOpen)}
              bgColor=""
              position={2}
            />
          </div>
        </div>

        {/* Layout Panel */}
        <LayoutPanel
          isOpen={isLayoutPanelOpen}
          onClose={() => setIsLayoutPanelOpen(false)}
          layouts={layouts}
          onLayoutSelect={insertLayout}
        />

        {/* Content Area */}
        <div ref={containerRef} className="flex-1 flex flex-col w-full h-full pl-24 pr-5 py-5 gap-4">

          {/* Top Section: Inputs */}
          <div className="flex flex-col lg:flex-row gap-4 overflow-auto" style={{ height: `calc(${topPanelRatio * 100}% - 6px)`, minHeight: 0 }}>

            {/* File Upload */}
            <FileDropZone
              onFileSelect={handleFileSelect}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />

            {/* Settings & JSON Output */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Path Prefix */}
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 whitespace-nowrap">
                  {t.imagePathPrefix}
                </label>
                <div className="h-4 w-px bg-gray-200" />
                <input
                  type="text"
                  value={imagePathPrefix}
                  onChange={(e) => setImagePathPrefix(e.target.value)}
                  placeholder={t.imagePathPrefixPlaceholder}
                  className="w-full text-xs font-mono bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                {imagePathPrefix.trim() && (
                  <p className="text-[10px] text-gray-400 whitespace-nowrap font-mono">
                    {imagePathPrefix.trim()}1.webp
                  </p>
                )}
              </div>

              {/* JSON Output */}
              <div className="flex-1 bg-white rounded-lg shadow-card border border-gray-200 flex flex-col overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h3 className="text-[11px] font-mono text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    output.json
                  </h3>
                  <button
                    onClick={copyJson}
                    className="text-gray-400 hover:text-black transition-colors"
                    title={language === "fr" ? "Copier" : "Copy"}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative flex-1 bg-gray-50/50">
                  <textarea
                    value={jsonOutput}
                    onChange={(e) => setJsonOutput(e.target.value)}
                    className="absolute inset-0 w-full h-full p-4 text-xs font-mono bg-transparent resize-none text-gray-600 focus:outline-none leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resizer Handle */}
          <div
            onMouseDown={handleResizeStart}
            className="flex-shrink-0 flex items-center justify-center cursor-row-resize group py-1"
          >
            <div className="w-8 h-1 rounded-full bg-gray-200 group-hover:bg-gray-400 transition-all" />
          </div>

          {/* Bottom Section: Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden" style={{ height: `calc(${(1 - topPanelRatio) * 100}% - 6px)`, minHeight: 0 }}>

            {/* Markdown Editor */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 flex flex-col overflow-hidden relative">
              <div className="bg-white px-3 py-2 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">
                    {language === "fr" ? "Editeur" : "Editor"}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                  MARKDOWN
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <MarkdownEditor
                  value={markdown}
                  onChange={setMarkdown}
                  textareaRef={textareaRef}
                />
              </div>
            </div>

            {/* HTML Preview */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 flex flex-col overflow-hidden">
              <div className="bg-white px-3 py-2 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">
                    {language === "fr" ? "Aperçu" : "Preview"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-200" />
                  <span className="w-2 h-2 rounded-full bg-gray-200" />
                  <span className="w-2 h-2 rounded-full bg-gray-900" />
                </div>
              </div>
              <div
                className="p-8 overflow-y-auto flex-1 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: htmlPreview,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar Footer */}
      <footer className="bg-white border-t border-gray-200 py-1.5 px-4 text-center z-10 flex justify-between items-center text-[10px] font-mono text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 hover:text-gray-600 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="3" x2="6" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
            main
          </span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">300ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/florent-jcg/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Florent Gironde
            </a>
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-green-600">All systems normal</span>
        </div>
      </footer>

      {/* Modals */}
      <Modal
        isOpen={isMarkdownHelpOpen}
        onClose={() => setIsMarkdownHelpOpen(false)}
        title={
          language === "fr" ? "Aide-mémoire Markdown" : "Markdown Cheat Sheet"
        }
        bgColor="bg-gray-900"
      >
        <MarkdownHelp language={language} />
      </Modal>

      <Modal
        isOpen={isBulmaHelpOpen}
        onClose={() => setIsBulmaHelpOpen(false)}
        title={
          language === "fr" ? "Aide-mémoire Bulma CSS" : "Bulma CSS Cheat Sheet"
        }
        bgColor="bg-gray-900"
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
