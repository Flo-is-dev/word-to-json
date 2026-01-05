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
                    "p[style-name='Heading 4'] => h4",
                ],
                convertImage: mammoth.images.imgElement(function (image) {
                    // Convertir l'image en base64 pour l'inclure directement
                    return image.read("base64").then(function (imageBuffer) {
                        return {
                            src: `data:${image.contentType};base64,${imageBuffer}`,
                            alt: `image`,
                        };
                    });
                }),
            }
        );

        // Parser le HTML pour convertir en Markdown
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlResult.value, "text/html");

        let markdown = "";
        let hasTitle = false;

        // Fonction récursive pour traiter les nœuds et préserver le formatage
        const processNode = (node: Node): string => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent || "";
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();
                let content = "";
                
                element.childNodes.forEach((child) => {
                    content += processNode(child);
                });

                switch (tagName) {
                    case "strong":
                    case "b":
                        if (!content.trim()) return content;
                        return `**${content}**`;
                    case "em":
                    case "i":
                        if (!content.trim()) return content;
                        return `*${content}*`;
                    case "s":
                    case "del":
                    case "strike":
                        if (!content.trim()) return content;
                        return `~~${content}~~`;
                    case "a":
                        const href = element.getAttribute("href");
                        // Si le lien a un href, on formate, sinon juste le texte
                        return href ? `[${content}](${href})` : content;
                    case "img":
                        const src = element.getAttribute("src") || "";
                        const alt = element.getAttribute("alt") || "image";
                        return `![${alt}](${src})`;
                    case "br":
                        return "\n";
                    case "sub":
                        return `<sub>${content}</sub>`;
                    case "sup":
                        return `<sup>${content}</sup>`;
                    case "span":
                        return content;
                    case "p":
                        return content + " "; // Espace pour séparer les paragraphes inline
                    default:
                        return content;
                }
            }
            return "";
        };

        // Gestion récursive des listes pour supporter l'imbrication
        const processList = (list: Element, level: number = 0): string => {
            const tagName = list.tagName.toLowerCase();
            const isOrdered = tagName === 'ol';
            let listMarkdown = "";
            
            const items = Array.from(list.children).filter(child => child.tagName.toLowerCase() === 'li');
            
            items.forEach((li, index) => {
                const prefix = isOrdered ? `${index + 1}. ` : "- ";
                const indent = "    ".repeat(level);
                
                let liContent = "";
                let nestedListsContent = "";
                
                li.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        const childEl = child as Element;
                        const childTag = childEl.tagName.toLowerCase();
                        if (childTag === 'ul' || childTag === 'ol') {
                            nestedListsContent += processList(childEl, level + 1);
                            return;
                        }
                    }
                    liContent += processNode(child);
                });
                
                liContent = liContent.trim();
                
                listMarkdown += `${indent}${prefix}${liContent}\n`;
                if (nestedListsContent) {
                    listMarkdown += nestedListsContent;
                }
            });
            
            return listMarkdown;
        };

        // Gestion des tableaux simples
        const processTable = (table: Element): string => {
            let tableMarkdown = "";
            const rows = Array.from(table.querySelectorAll('tr'));
            
            if (rows.length === 0) return "";
            
            const processRow = (row: Element, isHeader: boolean = false) => {
                const cells = Array.from(row.querySelectorAll(isHeader ? 'th' : 'td, th'));
                const cellContents = cells.map(cell => {
                    let content = "";
                    cell.childNodes.forEach(child => content += processNode(child));
                    // Échapper les pipes | et remplacer les retours à la ligne par <br>
                    return content.trim().replace(/\|/g, '\\|').replace(/\n/g, '<br>');
                });
                return `| ${cellContents.join(' | ')} |`;
            };

            const headerRow = table.querySelector('thead tr') || rows[0];
            const headerMarkdown = processRow(headerRow, true);
            
            tableMarkdown += headerMarkdown + "\n";
            
            const colCount = (headerMarkdown.match(/\|/g) || []).length - 1;
            tableMarkdown += `| ${Array(colCount).fill('---').join(' | ')} |\n`;
            
            const bodyRows = table.querySelector('tbody') 
                ? Array.from(table.querySelectorAll('tbody tr')) 
                : rows.slice(table.querySelector('thead') ? 0 : 1);

            bodyRows.forEach(row => {
                tableMarkdown += processRow(row) + "\n";
            });
            
            return tableMarkdown + "\n";
        };

        // Parcourir tous les éléments blocs du body
        doc.body.childNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();
                
                const getProcessedContent = () => {
                    let c = "";
                    element.childNodes.forEach(child => c += processNode(child));
                    return c;
                };

                switch (tagName) {
                    case "h1":
                        const h1Content = getProcessedContent().trim();
                        if (!hasTitle) {
                            markdown += `# ${h1Content}\n\n`;
                            hasTitle = true;
                        } else {
                            markdown += `## ${h1Content}\n\n`;
                        }
                        break;
                    case "h2":
                        markdown += `## ${getProcessedContent().trim()}\n\n`;
                        break;
                    case "h3":
                        markdown += `### ${getProcessedContent().trim()}\n\n`;
                        break;
                    case "h4":
                        markdown += `#### ${getProcessedContent().trim()}\n\n`;
                        break;
                    case "p":
                        const pContent = getProcessedContent().trim();
                        if (pContent) {
                            markdown += `${pContent}\n\n`;
                        }
                        break;
                    case "ul":
                    case "ol":
                        markdown += processList(element) + "\n";
                        break;
                    case "table":
                        markdown += processTable(element) + "\n";
                        break;
                    case "blockquote":
                        markdown += `> ${getProcessedContent().trim()}\n\n`;
                        break;
                    case "pre":
                        markdown += `\`\`\`\n${element.textContent || ""}\n\`\`\`\n\n`;
                        break;
                    case "img":
                        const src = element.getAttribute("src") || "";
                        const alt = element.getAttribute("alt") || "image";
                        markdown += `![${alt}](${src})\n\n`;
                        break;
                    case "div":
                        const divContent = getProcessedContent().trim();
                        if (divContent) markdown += `${divContent}\n\n`;
                        break;
                }
            }
        });

        if (!hasTitle) {
            const lines = markdown.split("\n");
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (
                    line &&
                    line === line.toUpperCase() &&
                    line.length > 3 &&
                    !line.startsWith("![") &&
                    !line.startsWith("#") && 
                    !line.startsWith("[") &&
                    !line.startsWith("|")
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
        const fileName = file.name.replace(".docx", "");
        return `# ${fileName}\n\nErreur lors de la conversion du document Word.\nVeuillez vérifier que le fichier n'est pas corrompu.\n\n![Image non disponible]()`;
    }
};
