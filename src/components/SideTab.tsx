import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import type { SideTabProps } from "src/types/index";

const SideTab: React.FC<SideTabProps> = ({
  label,
  onClick,
  position,
}) => {
  const { isDnd } = useTheme();

  const getIcon = () => {
    const size = isDnd ? 24 : 20;
    switch (position) {
      case 0: // Markdown / Quill
        return isDnd ? (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        );
      case 1: // Magic / Code
        return isDnd ? (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8L19 13" /><path d="M15 9h0" /><path d="M17.8 6.2L19 5" /><path d="M3 21l9-9" /><path d="M12.2 6.2L11 5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 2: // Layouts
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const isActive = position === 2;

  return (
    <button
      onClick={onClick}
      className={`${isDnd ? "w-10 h-10" : "w-9 h-9"} flex items-center justify-center ${isDnd ? "rounded-sm" : "rounded-md"} transition-all group relative ${
        isActive
          ? isDnd
            ? "bg-parchment-200 text-parchment-900 border-2 border-parchment-400 shadow-sm"
            : "bg-gray-100 text-gray-900 border border-gray-200 shadow-sm"
          : isDnd
            ? "text-parchment-600 hover:text-parchment-900 hover:bg-parchment-200 border border-transparent hover:border-parchment-400"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`}
      title={label}
    >
      {getIcon()}
      <div className={`absolute left-full ml-2 px-2 py-1 ${isDnd
        ? "bg-parchment-800 text-parchment-50 text-base rounded-sm border border-parchment-900 shadow-rpg"
        : "bg-black text-white text-[10px] rounded"
      } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50`}>
        {label}
      </div>
    </button>
  );
};

export default SideTab;
