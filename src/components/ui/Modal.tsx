import { X } from 'lucide-react';

import type { ModalProps } from '../../types';
import Button from './Button';

function Modal({ children, title, open, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-pink-100 px-5 py-4">
          <h2 className="text-base font-semibold text-[#5b3e45]">{title}</h2>
          <Button
            aria-label="Close modal"
            className="h-9 w-9 p-0"
            onClick={onClose}
            variant="ghost"
          >
            <X size={18} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
