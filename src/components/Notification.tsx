import React, { useEffect } from "react";
import type { NotificationProps } from "src/types/index";

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2.5 rounded-md shadow-card text-white transition-all z-50 animate-fade-in text-xs font-medium border ${
        type === "success"
          ? "bg-gray-900 border-gray-800"
          : "bg-red-600 border-red-700"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${type === "success" ? "bg-green-400" : "bg-red-300"}`} />
        {message}
      </div>
    </div>
  );
};

export default Notification;
