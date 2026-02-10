import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import type { ModalProps } from "src/types/index";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  bgColor = "bg-black",
}) => {
  const { isDnd } = useTheme();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className={`${isDnd ? "bg-parchment-50 rounded-sm border-2 border-parchment-400" : "bg-white rounded-lg border border-gray-200"} shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-in`}>
          <div
            className={`${bgColor} text-white px-5 py-3 flex justify-between items-center`}
          >
            <h2 className={`${isDnd ? "text-lg font-normal tracking-wide" : "text-sm font-semibold tracking-tight"}`}>{title}</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-56px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
