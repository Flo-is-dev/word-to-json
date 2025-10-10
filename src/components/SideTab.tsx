import React from "react";
import type { SideTabProps } from "src/types/index";

const SideTab: React.FC<SideTabProps> = ({
  label,
  onClick,
  bgColor = "bg-orange-500 hover:bg-orange-600",
  position,
}) => {
  const topPosition = `${30 + position * 15}%`;

  return (
    <button
      onClick={onClick}
      className={`fixed left-0 z-10 ${bgColor} text-white px-4 py-3 text-sm font-medium transition-all duration-300 transform hover:translate-x-1`}
      style={{
        top: topPosition,
        transform: "translateY(-50%)",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}
    >
      {label}
    </button>
  );
};

export default SideTab;
