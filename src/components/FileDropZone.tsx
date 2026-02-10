import React, { useRef } from "react";
import { Upload } from "lucide-react";
import type { FileDropZoneProps } from "src/types/index";

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
      className={`group bg-white border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all w-56 relative overflow-hidden ${
        isDragOver
          ? "border-black bg-gray-50"
          : "border-gray-300 hover:border-black hover:bg-gray-50"
      }`}
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
        <Upload className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
      </div>
      <p className="text-xs text-gray-900 font-medium relative z-10">
        {isDragOver ? "Drop here" : "Import Document"}
      </p>
      <p className="text-[10px] text-gray-400 mt-1 relative z-10">
        .docx, .md supported
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileDropZone;
