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
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all z-50 animate-fade-in ${
        type === "success" ? "bg-emerald-500" : "bg-rose-500"
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
