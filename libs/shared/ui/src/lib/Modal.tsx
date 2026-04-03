import clsx from 'clsx';
import { useEffect } from 'react';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  isOpen: boolean;
  header?: React.ReactNode;
}

export function Modal({ onClose, isOpen, children, className, header }: ModalProps) {
  useEffect(() => {

    if (!isOpen) {
      return;
    }

    const handlePressKeyboard = (event: KeyboardEvent) => {
      if (event.key.toUpperCase() === 'ESCAPE') {
        onClose();
        return;
      }
    };

    window.addEventListener('keydown', handlePressKeyboard);

    return () => {
      window.removeEventListener('keydown', handlePressKeyboard);
    };
  }, [isOpen, onClose]);

  return (
    <div className={clsx('modal-container inset-0 fixed z-50', className)} onClick={onClose}>
      <div className="overlay absolute inset-0 bg-[rgba(0,0,0,0.5)]"></div>
      <div className="modal-content relative h-full flex justify-center items-center">
        <div className="w-1/3 h-3/5 rounded-lg bg-white p-5" onClick={(event) => event.stopPropagation()}>
          {header}
          {children}
        </div>
      </div>
    </div>
  );
}
