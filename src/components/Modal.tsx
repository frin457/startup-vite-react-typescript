import { ReactNode } from 'react';
import Button from './Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-md ${className}`}>
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-4"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
