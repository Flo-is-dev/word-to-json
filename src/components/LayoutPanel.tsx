import React from "react";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import type { LayoutPanelProps } from "src/types/index";

const LayoutPanel: React.FC<LayoutPanelProps> = ({
  isOpen,
  onClose,
  layouts,
  onLayoutSelect,
}) => {
  const { isDnd } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={`absolute left-20 top-1/2 -translate-y-1/2 w-64 ${isDnd
      ? "bg-parchment-100 rounded-sm shadow-rpg border-2 border-parchment-500"
      : "bg-white rounded-lg shadow-card border border-gray-200"
    } z-30 flex flex-col max-h-[80vh]`}>
      <div className={`px-3 py-2 ${isDnd ? "border-b-2 border-parchment-200 bg-parchment-100" : "border-b border-gray-100"} flex items-center justify-between`}>
        <h3 className={`${isDnd
          ? "text-sm uppercase tracking-wider text-parchment-600 font-normal"
          : "font-mono text-[10px] uppercase tracking-wider text-gray-500 font-medium"
        }`}>
          {isDnd ? "View Modes" : "Layouts"}
        </h3>
        <button
          onClick={onClose}
          className={`${isDnd ? "text-parchment-500 hover:text-parchment-800" : "text-gray-400 hover:text-gray-600"} transition-colors`}
          aria-label="Fermer le panneau"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-1 space-y-0.5 overflow-y-auto">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutSelect(layout)}
            className={`group flex items-center gap-3 w-full p-2 text-left ${isDnd
              ? "hover:bg-parchment-200 rounded-sm border border-transparent hover:border-parchment-300"
              : "hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200"
            } transition-all`}
          >
            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
              {layout.preview}
            </div>
            <span className={`${isDnd ? "text-lg text-parchment-800" : "text-xs text-gray-700 font-medium"}`}>
              {layout.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutPanel;
