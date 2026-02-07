import { marked } from "marked";

// Types
export interface ConversionResult {
  html: string;
  json: string;
}

// Configuration de marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Nettoie la syntaxe du gras en supprimant les espaces internes
 * ** texte ** → **texte**
 */
const cleanBoldSyntax = (markdown: string): string => {
  return markdown
    .replace(/\*\* +([^*]+?) +\*\*/g, "**$1**")
    .replace(/\*\* +([^*]+?)\*\*/g, "**$1**")
    .replace(/\*\*([^*]+?) +\*\*/g, "**$1**");
};

/**
 * Résultat du traitement des blocs personnalisés
 */
interface BlockProcessingResult {
  markdown: string;
  blockHtmlMap: Map<string, string>;
}

/**
 * Traite les blocs personnalisés (flex et float) avec une approche ligne par ligne
 * Utilise une Map locale au lieu de globalThis pour stocker les blocs HTML
 */
const processCustomBlocks = (markdown: string): BlockProcessingResult => {
  const lines = markdown.split("\n");
  const result: string[] = [];
  const blockHtmlMap = new Map<string, string>();
  let i = 0;
  let blockCounter = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Détecter le début d'un bloc flex
    if (line === "::: flex") {
      const flexItems: { content: string; percentage?: number }[] = [];
      i++;

      while (i < lines.length) {
        const currentLine = lines[i].trim();

        if (currentLine === ":::") break;

        if (currentLine === "::: flex-item") {
          const itemContent: string[] = [];
          i++;

          while (i < lines.length) {
            const itemLine = lines[i].trim();
            if (itemLine === ":::") break;
            itemContent.push(lines[i]);
            i++;
          }

          const content = itemContent.join("\n").trim();
          if (content) {
            const percentageMatch = content.match(/\((\d+)%\)/);
            const percentage = percentageMatch
              ? parseInt(percentageMatch[1])
              : undefined;

            flexItems.push({ content, percentage });
          }
        }

        i++;
      }

      if (flexItems.length > 0) {
        const htmlItems = flexItems
          .map((item) => {
            let flexStyle = "flex: 1";

            if (item.percentage) {
              const adjustedPercentage = item.percentage - 1;
              flexStyle = `flex: 0 0 ${adjustedPercentage}%`;
            } else if (flexItems.some((fi) => fi.percentage)) {
              const usedPercentage = flexItems
                .filter((fi) => fi.percentage)
                .reduce((sum, fi) => sum + (fi.percentage || 0), 0);
              const remainingItems = flexItems.filter(
                (fi) => !fi.percentage
              ).length;
              const remainingPercentage = Math.max(
                100 - usedPercentage - flexItems.length,
                0
              );
              const itemPercentage =
                remainingItems > 0 ? remainingPercentage / remainingItems : 0;

              if (itemPercentage > 0) {
                flexStyle = `flex: 0 0 ${itemPercentage}%`;
              }
            }

            const itemHtml = (marked.parse(item.content) as string).trim();
            return `<div class='flex-item' style='${flexStyle}; min-width: 200px; padding: 1rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem;'>${itemHtml}</div>`;
          })
          .join("");

        const flexHtml = `<div class='flex-container' style='display: flex; gap: 2%; margin: 1rem 0; flex-wrap: wrap;'>${htmlItems}</div>`;

        const marker = `CUSTOM_BLOCK_${blockCounter}`;
        blockHtmlMap.set(marker, flexHtml);
        result.push(marker);
        blockCounter++;
      }
    }
    // Détecter les blocs float (image flottante gauche ou droite)
    else if (line === "::: float-left" || line === "::: float-right") {
      const floatDirection = line === "::: float-left" ? "left" : "right";
      const marginStyle =
        floatDirection === "left"
          ? "margin: 0 1.5rem 1rem 0;"
          : "margin: 0 0 1rem 1.5rem;";

      i++;
      const itemContent: string[] = [];

      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine === ":::") break;
        itemContent.push(lines[i]);
        i++;
      }

      const content = itemContent.join("\n").trim();
      if (content) {
        const itemHtml = (marked.parse(content) as string).trim();
        const floatHtml = `<div class='float-${floatDirection}' style='float: ${floatDirection}; ${marginStyle} max-width: 50%;'>${itemHtml}</div>`;

        const marker = `CUSTOM_BLOCK_${blockCounter}`;
        blockHtmlMap.set(marker, floatHtml);
        result.push(marker);
        blockCounter++;
      }
    } else {
      result.push(lines[i]);
    }

    i++;
  }

  return { markdown: result.join("\n"), blockHtmlMap };
};

/**
 * Traite les images pour le JSON avec le préfixe de chemin optionnel
 * Si un préfixe est fourni, les images sont renommées séquentiellement (prefix1.webp, prefix2.webp, etc.)
 * Si le préfixe est vide, l'attribut src reste vide
 */
const processImagesForJson = (
  html: string,
  imagePathPrefix: string
): string => {
  let imageCounter = 0;
  return html.replace(
    /<img([^>]*)\ssrc=['"]([^'"]*)['"]/g,
    (_, otherAttribs) => {
      imageCounter++;

      if (imagePathPrefix.trim()) {
        const imageName = `${imagePathPrefix.trim()}${imageCounter}.webp`;
        return `<img${otherAttribs} src='${imageName}'`;
      }

      return `<img${otherAttribs} src=''`;
    }
  );
};

/**
 * Convertit le Markdown en HTML et JSON
 */
export const convertMarkdownToHtmlAndJson = (
  markdown: string,
  imagePathPrefix: string = ""
): ConversionResult => {
  // Étape 0: Nettoyer la syntaxe du gras (** texte ** → **texte**)
  const cleanedMarkdown = cleanBoldSyntax(markdown);

  // Étape 1: Traiter les blocs personnalisés (flex, float) AVANT marked
  const { markdown: processedMarkdown, blockHtmlMap } =
    processCustomBlocks(cleanedMarkdown);

  // Étape 2: Convertir le markdown normal avec marked
  let html = marked.parse(processedMarkdown) as string;

  // Étape 3: Remplacer les marqueurs par le HTML généré
  blockHtmlMap.forEach((blockHtml, marker) => {
    html = html.replace(`<p>${marker}</p>`, blockHtml);
    html = html.replace(marker, blockHtml);
  });

  // Étape 4: Post-traitement
  // Remplacer les <p> contenant des <img> par des <div>
  html = html.replace(/<p>(\s*<img[^>]*>\s*)<\/p>/gi, "<div>$1</div>");

  // Ajouter target="_blank" aux liens
  html = html.replace(
    /<a\s+(?![^>]*target=)([^>]*)>/gi,
    '<a target="_blank" $1>'
  );

  // Remplacer les guillemets doubles par des simples
  html = html.replace(/="([^"]*)"/g, "='$1'");

  // Étape 5: Créer le JSON avec gestion du préfixe d'images
  const jsonHtml = processImagesForJson(html, imagePathPrefix);

  // Minification
  const minifiedHtml = jsonHtml
    .replace(/\n/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();

  return {
    html,
    json: minifiedHtml,
  };
};
