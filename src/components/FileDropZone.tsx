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
      className={`bg-white border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors w-56 ${
        isDragOver
          ? "border-orange-400 bg-orange-50"
          : "border-slate-300 hover:border-orange-400"
      }`}
    >
      <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
      <p className="text-xs text-slate-500">
        {isDragOver ? "Déposez le fichier ici" : "Glissez un .docx ici"}
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
