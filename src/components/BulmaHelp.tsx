import React from "react";
import type { Language } from "@utils/i18n";

interface BulmaHelpProps {
  language?: Language;
}

const BulmaHelp: React.FC<BulmaHelpProps> = ({ language = "fr" }) => {
  const isFr = language === "fr";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          {isFr ? "Classes de base" : "Basic Classes"}
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .button
            </code>
            {" - Bouton standard"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .box
            </code>
            {" - Conteneur avec ombre"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .content
            </code>
            {" - Zone de contenu"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .title
            </code>
            {" - Titre principal"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .subtitle
            </code>
            {" - Sous-titre"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">Colonnes</h3>
        <div className="space-y-2 text-sm">
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`<div class="columns">
  <div class="column">1</div>
  <div class="column">2</div>
</div>`}
          </pre>
          <p className="mt-2">
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-half
            </code>
            {" - 50% largeur"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-one-third
            </code>
            {" - 33% largeur"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">Couleurs</h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-primary
            </code>
            {" - Couleur primaire"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-info
            </code>
            {" - Bleu info"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-success
            </code>
            {" - Vert succès"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-warning
            </code>
            {" - Jaune attention"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .is-danger
            </code>
            {" - Rouge danger"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          Formulaires
        </h3>
        <div className="space-y-2 text-sm">
          <pre className="bg-slate-100 p-2 rounded text-slate-700">
            {`<div class="field">
  <label class="label">Nom</label>
  <div class="control">
    <input class="input" type="text">
  </div>
</div>`}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          Navigation
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .navbar
            </code>
            {" - Barre de navigation"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .navbar-brand
            </code>
            {" - Logo/marque"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .navbar-menu
            </code>
            {" - Menu principal"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3 text-slate-800">
          Composants
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .card
            </code>
            {" - Carte de contenu"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .modal
            </code>
            {" - Fenêtre modale"}
          </p>
          <p>
            <code className="bg-slate-100 px-2 py-1 rounded text-rose-600">
              .notification
            </code>
            {" - Notification"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulmaHelp;
