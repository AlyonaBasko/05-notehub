import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './NoteModal.module.css';

interface NoteModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root')!;

export default function NoteModal({ children, onClose }: NoteModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
