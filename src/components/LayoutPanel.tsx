import React from "react";
import { X } from "lucide-react";
import type { LayoutPanelProps } from "src/types/index";

const LayoutPanel: React.FC<LayoutPanelProps> = ({
  isOpen,
  onClose,
  layouts,
  onLayoutSelect,
}) => {
  return (
    <div
      className={`fixed left-0 top-1/2 transform -translate-y-1/2 w-80 bg-white rounded-r-xl shadow-2xl transition-transform duration-300 z-15 max-h-[80vh] overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Insérer un layout</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fermer le panneau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-2">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutSelect(layout)}
            className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-slate-100 last:border-b-0"
          >
            {layout.preview}
            <span className="text-sm text-slate-700">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutPanel;
