import React, { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import type { NotificationProps } from "src/types/index";

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const { isDnd } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2.5 ${isDnd ? "rounded-sm shadow-rpg" : "rounded-md shadow-card"} text-white transition-all z-50 animate-fade-in ${isDnd ? "text-base" : "text-xs font-medium"} border ${
        type === "success"
          ? isDnd
            ? "bg-parchment-800 border-parchment-900"
            : "bg-gray-900 border-gray-800"
          : isDnd
            ? "bg-dragon-red border-parchment-900"
            : "bg-red-600 border-red-700"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${
          type === "success"
            ? isDnd ? "bg-dragon-gold" : "bg-green-400"
            : isDnd ? "bg-parchment-300" : "bg-red-300"
        }`} />
        {message}
      </div>
    </div>
  );
};

export default Notification;
