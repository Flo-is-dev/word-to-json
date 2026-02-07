// src/utils/i18n.ts

export type Language = "fr" | "en";

export interface Translations {
  // Header
  title: string;
  subtitle: string;

  // Navigation
  markdown: string;
  html: string;
  json: string;

  // Buttons
  uploadWord: string;
  clearAll: string;
  downloadMarkdown: string;
  downloadHtml: string;
  downloadJson: string;

  // Placeholders
  markdownPlaceholder: string;

  // File upload
  uploadSuccess: string;
  uploadError: string;
  fileNotSupported: string;

  // Copy actions
  copySuccess: string;
  copyError: string;

  // Examples
  exampleTitle: string;
  exampleContent: string;
  flexExample: string;
  flexItem1: string;
  flexItem2: string;

  // Tooltips/Help
  markdownHelp: string;
  htmlHelp: string;
  jsonHelp: string;
  flexHelp: string;

  // Image path prefix
  imagePathPrefix: string;
  imagePathPrefixPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    // Header
    title: "Convertisseur Markdown",
    subtitle:
      "Convertissez vos documents Word et Markdown en HTML/JSON avec mise en page flexible",

    // Navigation
    markdown: "Markdown",
    html: "HTML",
    json: "JSON",

    // Buttons
    uploadWord: "📄 Importer Word",
    clearAll: "🗑️ Effacer",
    downloadMarkdown: "⬇️ Télécharger MD",
    downloadHtml: "⬇️ Télécharger HTML",
    downloadJson: "⬇️ Télécharger JSON",

    // Placeholders
    markdownPlaceholder: `# Mon Document

Voici un exemple de contenu...

## Colonnes flexibles

::: flex
::: flex-item
Contenu principal (70%)
:::
::: flex-item
Contenu secondaire (30%)
:::
:::

**Texte en gras** et *italique*

- Liste à puces
- Deuxième élément

![Image exemple](https://picsum.photos/300/200)`,

    // File upload
    uploadSuccess: "Document Word importé avec succès !",
    uploadError: "Erreur lors de l'import du document",
    fileNotSupported: "Type de fichier non supporté. Utilisez un fichier .docx",

    // Copy actions
    copySuccess: "HTML copié dans le presse-papiers !",
    copyError: "Erreur lors de la copie",

    // Examples
    exampleTitle: "Titre d'exemple",
    exampleContent: "Contenu d'exemple avec du **texte en gras**",
    flexExample: "Exemple de colonnes flexibles",
    flexItem1: "Première colonne avec du contenu",
    flexItem2: "Deuxième colonne avec du contenu",

    // Tooltips/Help
    markdownHelp:
      "Écrivez votre contenu en Markdown ou importez un document Word",
    htmlHelp: "Aperçu HTML avec mise en forme et colonnes flexibles",
    jsonHelp: "Version minifiée pour intégration web",
    flexHelp: "Utilisez ::: flex et ::: flex-item pour créer des colonnes",

    // Image path prefix
    imagePathPrefix: "Préfixe chemin images",
    imagePathPrefixPlaceholder: "ex: /documents/news/news",
  },

  en: {
    // Header
    title: "Markdown Converter",
    subtitle:
      "Convert your Word documents and Markdown to HTML/JSON with flexible layouts",

    // Navigation
    markdown: "Markdown",
    html: "HTML",
    json: "JSON",

    // Buttons
    uploadWord: "📄 Import Word",
    clearAll: "🗑️ Clear",
    downloadMarkdown: "⬇️ Download MD",
    downloadHtml: "⬇️ Download HTML",
    downloadJson: "⬇️ Download JSON",

    // Placeholders
    markdownPlaceholder: `# My Document

Here's some example content...

## Flexible Columns

::: flex
::: flex-item
Main content (70%)
:::
::: flex-item
Secondary content (30%)
:::
:::

**Bold text** and *italic*

- Bullet list
- Second item

![Example image](https://picsum.photos/300/200)`,

    // File upload
    uploadSuccess: "Word document imported successfully!",
    uploadError: "Error importing document",
    fileNotSupported: "File type not supported. Please use a .docx file",

    // Copy actions
    copySuccess: "HTML copied to clipboard!",
    copyError: "Error copying to clipboard",

    // Examples
    exampleTitle: "Example Title",
    exampleContent: "Example content with **bold text**",
    flexExample: "Flexible columns example",
    flexItem1: "First column with content",
    flexItem2: "Second column with content",

    // Tooltips/Help
    markdownHelp: "Write your content in Markdown or import a Word document",
    htmlHelp: "HTML preview with formatting and flexible columns",
    jsonHelp: "Minified version for web integration",
    flexHelp: "Use ::: flex and ::: flex-item to create columns",

    // Image path prefix
    imagePathPrefix: "Image path prefix",
    imagePathPrefixPlaceholder: "e.g. /documents/news/news",
  },
};

// Hook pour gérer la langue
export const useTranslation = (language: Language) => {
  return translations[language];
};
