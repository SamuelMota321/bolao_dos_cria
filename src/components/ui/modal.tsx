import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6",
        className
      )}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'info'
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default:
        return 'bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611]';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#111611] mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
          {title}
        </h3>
        <p className="text-[#9eb79e] mb-6 [font-family:'Plus_Jakarta_Sans',Helvetica]">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={getButtonStyle()}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}: AlertModalProps) => {
  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {getIcon()}
        <h3 className="text-lg font-bold text-[#111611] mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
          {title}
        </h3>
        <p className="text-[#9eb79e] mb-6 [font-family:'Plus_Jakarta_Sans',Helvetica]">
          {message}
        </p>
        <Button
          onClick={onClose}
          className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] w-full"
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};