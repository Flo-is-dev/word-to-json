export interface LayoutType {
  id: string;
  name: string;
  preview: React.ReactNode;
  template: string;
}

export interface ConversionResult {
  html: string;
  json: string;
}

export interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  bgColor?: string;
}

export interface SideTabProps {
  label: string;
  onClick: () => void;
  bgColor?: string;
  position: number;
}

export interface LayoutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  layouts: LayoutType[];
  onLayoutSelect: (layout: LayoutType) => void;
}

export interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}
