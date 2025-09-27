import mammoth from "mammoth";

/**
 * Traite un fichier Word et le convertit en Markdown
 */
export const processWordFile = async (file: File): Promise<string> => {
  if (!file.name.endsWith(".docx")) {
    throw new Error("Veuillez sélectionner un fichier .docx");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    // Utiliser mammoth pour obtenir la structure HTML complète avec extraction d'images
    const htmlResult = await mammoth.convertToHtml(
      { arrayBuffer: arrayBuffer },
      {
        styleMap: [
          "p[style-name='Title'] => h1",
          "p[style-name='Heading 1'] => h1",
          "p[style-name='Heading 2'] => h2",
          "p[style-name='Heading 3'] => h3",
        ],
        convertImage: mammoth.images.imgElement(function (image) {
          // Convertir l'image en base64 pour l'inclure directement
          return image.read("base64").then(function (imageBuffer) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // const extension = image.contentType.split("/")[1] || "png";
            return {
              src: `data:${image.contentType};base64,${imageBuffer}`,
              alt: `Image extraite du document Word`,
            };
          });
        }),
      }
    );

    // Parser le HTML pour convertir en Markdown
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlResult.value;

    let markdown = "";
    let hasTitle = false;
    let imageCounter = 1;

    // Parcourir tous les éléments
    tempDiv.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const text = element.textContent?.trim() || "";

        switch (tagName) {
          case "h1":
            // Si c'est le premier h1 et qu'on n'a pas encore de titre
            if (!hasTitle) {
              markdown += `# ${text}\n\n`;
              hasTitle = true;
            } else {
              markdown += `## ${text}\n\n`;
            }
            break;
          case "h2":
            markdown += `## ${text}\n\n`;
            break;
          case "h3":
            markdown += `### ${text}\n\n`;
            break;
          case "a":
            // NOUVEAU : Gérer les liens
            const linkElement = element as HTMLAnchorElement;
            const href = linkElement.href || "";
            const linkText = linkElement.textContent?.trim() || "";

            if (href && linkText) {
              markdown += `[${linkText}](${href})`;
            } else if (linkText) {
              markdown += linkText; // Si pas d'href, juste le texte
            }
            break;
          case "img":
            // Gérer les images
            const imgElement = element as HTMLImageElement;
            const src = imgElement.src || "";
            const alt = imgElement.alt || `Image ${imageCounter}`;

            if (src) {
              markdown += `![${alt}](${src})\n\n`;
            } else {
              markdown += `![${alt}]()\n\n`;
            }
            imageCounter++;
            break;
          case "p":
            // Vérifier s'il y a des images dans le paragraphe
            const images = element.querySelectorAll("img");
            if (images.length > 0) {
              images.forEach((img) => {
                const src = img.getAttribute("src") || "";
                const alt = img.getAttribute("alt") || `Image ${imageCounter}`;

                if (src) {
                  markdown += `![${alt}](${src})\n\n`;
                } else {
                  markdown += `![${alt}]()\n\n`;
                }
                imageCounter++;
              });
            }

            // Traiter le texte du paragraphe (sans les images)
            const textContent = element.cloneNode(true) as Element;
            textContent.querySelectorAll("img").forEach((img) => img.remove());
            const cleanText = textContent.textContent?.trim() || "";

            if (cleanText) {
              let processedText = cleanText;

              // NOUVEAU : Gérer les liens dans les paragraphes
              const linkElements = element.querySelectorAll("a");
              linkElements.forEach((link) => {
                const href = link.getAttribute("href") || "";
                const linkText = link.textContent || "";

                if (href && linkText && processedText.includes(linkText)) {
                  processedText = processedText.replace(
                    linkText,
                    `[${linkText}](${href})`
                  );
                }
              });

              // Gérer le texte en gras
              const strongElements = element.querySelectorAll("strong, b");
              strongElements.forEach((el) => {
                const strongText = el.textContent || "";
                if (strongText && processedText.includes(strongText)) {
                  processedText = processedText.replace(
                    strongText,
                    `**${strongText}**`
                  );
                }
              });

              // Gérer le texte en italique
              const emElements = element.querySelectorAll("em, i");
              emElements.forEach((el) => {
                const emText = el.textContent || "";
                if (emText && processedText.includes(emText)) {
                  processedText = processedText.replace(emText, `*${emText}*`);
                }
              });

              markdown += `${processedText}\n\n`;
            }
            break;
          case "ul":
            element.querySelectorAll("li").forEach((li) => {
              markdown += `- ${li.textContent?.trim() || ""}\n`;
            });
            markdown += "\n";
            break;
          case "ol":
            let index = 1;
            element.querySelectorAll("li").forEach((li) => {
              markdown += `${index}. ${li.textContent?.trim() || ""}\n`;
              index++;
            });
            markdown += "\n";
            break;
        }
      }
    });

    // Si le document n'a pas de titre mais a des paragraphes en majuscules
    if (!hasTitle) {
      const lines = markdown.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Si c'est une ligne en majuscules (probable titre)
        if (
          line &&
          line === line.toUpperCase() &&
          line.length > 3 &&
          !line.startsWith("![")
        ) {
          lines[i] = `# ${line}`;
          hasTitle = true;
          break;
        }
      }
      markdown = lines.join("\n");
    }

    return markdown.trim();
  } catch (error) {
    console.error("Erreur mammoth:", error);
    // Fallback en cas d'erreur
    const fileName = file.name.replace(".docx", "");
    return `# ${fileName}\n\nErreur lors de la conversion du document Word.\nVeuillez vérifier que le fichier n'est pas corrompu.\n\n![Image non disponible]()`;
  }
};
