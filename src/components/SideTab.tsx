import React from "react";
import type { SideTabProps } from "src/types/index";

const SideTab: React.FC<SideTabProps> = ({
  label,
  onClick,
  position,
}) => {
  // Icons SVG inline pour chaque position
  const getIcon = () => {
    switch (position) {
      case 0: // Markdown
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        );
      case 1: // Bulma
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 2: // Layouts
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const isActive = position === 2; // Layouts tab highlighted as in mockup

  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-md transition-all group relative ${
        isActive
          ? "bg-gray-100 text-gray-900 border border-gray-200 shadow-sm"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`}
      title={label}
    >
      {getIcon()}
      <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
};

export default SideTab;
