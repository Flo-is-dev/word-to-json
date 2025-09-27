import React from "react";

const MarkdownHelp: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          Formatage de base
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              **gras**
            </code>
            {" → "}
            <strong>gras</strong>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              *italique*
            </code>
            {" → "}
            <em>italique</em>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              ~~barré~~
            </code>
            {" → "}
            <del>barré</del>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              `code`
            </code>
            {" → "}
            <code>code</code>
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">Titres</h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              # Titre 1
            </code>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              ## Titre 2
            </code>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              ### Titre 3
            </code>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              #### Titre 4
            </code>
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">Listes</h3>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Liste non ordonnée:</p>
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`- Élément 1
- Élément 2
  - Sous-élément`}
          </pre>
          <p className="font-medium mt-3">Liste ordonnée:</p>
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`1. Premier
2. Deuxième
3. Troisième`}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          Liens et images
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              [texte du lien](https://url.com)
            </code>
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-violet-600">
              ![alt text](image.jpg)
            </code>
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">Citations</h3>
        <div className="space-y-2 text-sm">
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`> Ceci est une citation
> Sur plusieurs lignes`}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">Code</h3>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Bloc de code:</p>
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`\`\`\`javascript
const hello = "world";
\`\`\``}
          </pre>
        </div>
      </div>

      <div className="col-span-2">
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          Layouts personnalisés
        </h3>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Syntaxe pour les layouts flexbox:</p>
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`::: flex
::: flex-item
Contenu colonne 1
:::
::: flex-item
Contenu colonne 2
:::
:::`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MarkdownHelp;
