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
 * Traite les blocs flex avec une approche ligne par ligne
 */
const processFlexBlocks = (markdown: string): string => {
  const lines = markdown.split("\n");
  const result: string[] = [];
  let i = 0;
  let flexBlockCounter = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Détecter le début d'un bloc flex
    if (line === "::: flex") {
      const flexItems: { content: string; percentage?: number }[] = [];
      i++; // Passer à la ligne suivante

      // Parcourir le contenu du bloc flex
      while (i < lines.length) {
        const currentLine = lines[i].trim();

        // Fin du bloc flex
        if (currentLine === ":::") {
          break;
        }

        // Début d'un flex-item
        if (currentLine === "::: flex-item") {
          const itemContent: string[] = [];
          i++; // Passer à la ligne suivante

          // Collecter le contenu du flex-item
          while (i < lines.length) {
            const itemLine = lines[i].trim();

            // Fin du flex-item
            if (itemLine === ":::") {
              break;
            }

            itemContent.push(lines[i]); // Garder l'indentation originale
            i++;
          }

          // Ajouter le contenu de l'item (si non vide)
          const content = itemContent.join("\n").trim();
          if (content) {
            // Extraire le pourcentage du contenu s'il y en a un
            const percentageMatch = content.match(/\((\d+)%\)/);
            const percentage = percentageMatch
              ? parseInt(percentageMatch[1])
              : undefined;

            flexItems.push({
              content: content,
              percentage: percentage,
            });
          }
        }

        i++;
      }

      // Générer le HTML du bloc flex
      if (flexItems.length > 0) {
        const htmlItems = flexItems
          .map((item) => {
            let flexStyle = "flex: 1"; // Par défaut 50/50

            // Si on a des pourcentages, les utiliser avec ajustement pour le gap
            if (item.percentage) {
              const adjustedPercentage = item.percentage - 1; // Enlever 1% pour le gap
              flexStyle = `flex: 0 0 ${adjustedPercentage}%`;
            } else if (flexItems.some((i) => i.percentage)) {
              // Si certains items ont des pourcentages mais pas celui-ci
              // Calculer le pourcentage restant
              const usedPercentage = flexItems
                .filter((i) => i.percentage)
                .reduce((sum, i) => sum + (i.percentage || 0), 0);
              const remainingItems = flexItems.filter(
                (i) => !i.percentage
              ).length;
              const remainingPercentage = Math.max(
                100 - usedPercentage - flexItems.length,
                0
              ); // Enlever 1% par élément
              const itemPercentage =
                remainingItems > 0 ? remainingPercentage / remainingItems : 0;

              if (itemPercentage > 0) {
                flexStyle = `flex: 0 0 ${itemPercentage}%`;
              }
            }

            const itemHtml = marked.parse(item.content).trim();
            return `<div class='flex-item' style='${flexStyle}; min-width: 200px; padding: 1rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem;'>${itemHtml}</div>`;
          })
          .join("");

        const flexHtml = `<div class='flex-container' style='display: flex; gap: 2%; margin: 1rem 0; flex-wrap: wrap;'>${htmlItems}</div>`;

        // Utiliser un marqueur unique
        result.push(`FLEX_BLOCK_${flexBlockCounter}`);
        // Stocker le HTML généré globalement
        (globalThis as any)[`FLEX_HTML_${flexBlockCounter}`] = flexHtml;
        flexBlockCounter++;
      }
    } else {
      // Ligne normale, la conserver
      result.push(lines[i]);
    }

    i++;
  }

  return result.join("\n");
};

/**
 * Simplifie les URLs d'images pour le JSON
 */
const simplifyImagesForJson = (html: string): string => {
  return html.replace(
    /<img([^>]*)\ssrc=['"]([^'"]*)['"]/g,
    (_, otherAttribs, src) => {
      let imageName = "";

      // Si c'est une image base64
      if (src.startsWith("data:image/")) {
        // Extraire le type d'image
        const typeMatch = src.match(/data:image\/([^;]+)/);
        const imageType = typeMatch ? typeMatch[1] : "png";
        imageName = `image.${imageType}`;
      }
      // Si c'est une URL
      else if (src.includes("/")) {
        // Extraire le nom du fichier depuis l'URL
        const urlParts = src.split("/");
        imageName = urlParts[urlParts.length - 1] || "image.jpg";
      }
      // Si c'est juste un nom de fichier
      else {
        imageName = src || "image.jpg";
      }

      return `<img${otherAttribs} src='${imageName}'`;
    }
  );
};

/**
 * Convertit le Markdown en HTML et JSON
 */
export const convertMarkdownToHtmlAndJson = (
  markdown: string
): ConversionResult => {
  // Étape 1: Traiter les blocs flex AVANT marked
  const processedMarkdown = processFlexBlocks(markdown);

  // Étape 2: Convertir le markdown normal avec marked
  let html = marked.parse(processedMarkdown);

  // Étape 3: Remplacer les marqueurs flex par le HTML généré
  let flexCounter = 0;
  while (true) {
    const marker = `FLEX_BLOCK_${flexCounter}`;
    const flexHtml = (globalThis as any)[`FLEX_HTML_${flexCounter}`];

    if (!flexHtml) break;

    // Remplacer le marqueur (dans un paragraphe ou seul)
    html = html.replace(`<p>${marker}</p>`, flexHtml);
    html = html.replace(marker, flexHtml);

    // Nettoyer la variable globale
    delete (globalThis as any)[`FLEX_HTML_${flexCounter}`];

    flexCounter++;
  }

  // Étape 4: Post-traitement
  // Remplacer les <p> contenant des <img> par des <div>
  html = html.replace(/<p>(\s*<img[^>]*>\s*)<\/p>/gi, '<div>$1</div>');
  
  // Ajouter target="_blank" aux liens
  html = html.replace(
    /<a\s+(?![^>]*target=)([^>]*)>/gi,
    '<a target="_blank" $1>'
  );

  // Remplacer les guillemets doubles par des simples
  html = html.replace(/="([^"]*)"/g, "='$1'");

  // Étape 5: Créer le JSON avec images simplifiées
  let jsonHtml = simplifyImagesForJson(html);

  // Minification
  const minifiedHtml = jsonHtml
    .replace(/\n/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();

  return {
    html: html, // HTML complet avec vraies images
    json: minifiedHtml, // JSON avec noms d'images simplifiés
  };
};
