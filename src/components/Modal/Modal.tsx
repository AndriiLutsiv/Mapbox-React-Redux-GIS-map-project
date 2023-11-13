import { createPortal } from 'react-dom';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

interface ModalProps {
  children?: ReactNode;
  className?: string;
  onClose: () => void;
}

const Modal = (props: ModalProps) => {
  const { children, onClose, className } = props;
  const modalRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => (e.key === 'Escape') && onClose();

    setIsOpen(true);
    disableBodyScroll(modalRef.current!);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      setIsOpen(false);
      clearAllBodyScrollLocks()
      window.removeEventListener('keydown', onKeyDown);
    }
  }, []);

  return (
    createPortal(
      <div ref={modalRef} className={classNames(styles.modal, { [styles.opened]: isOpen })}>
        <div data-testid='modal-backdrop' className={styles.backdrop} onClick={() => onClose()} />
        <div className={classNames(styles.contentContainer, className)}>
          {children}
        </div>
      </div>,
      document.body
    )
  );
};
export default Modal;
