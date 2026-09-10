import { useState, useEffect, useRef } from 'react';

let activeModalCount = 0;

function updateModalState(delta: number, modalId?: string) {
  activeModalCount = Math.max(0, activeModalCount + delta);
  if (typeof document !== 'undefined') {
    if (activeModalCount > 0) {
      document.body.classList.add('has-modal-open');
      document.body.setAttribute('data-modal-open', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('has-modal-open');
      document.body.removeAttribute('data-modal-open');
      document.body.style.overflow = '';
    }
    window.dispatchEvent(
      new CustomEvent('jinvani:modal-change', {
        detail: {
          isOpen: activeModalCount > 0,
          count: activeModalCount,
          modalId,
        },
      })
    );
  }
}

/**
 * Check if any modal is currently open in the application
 */
export function isAnyModalOpen(): boolean {
  return activeModalCount > 0;
}

/**
 * React hook to observe if any modal/dialog is currently active
 */
export function useIsModalOpen(): boolean {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.body.classList.contains('has-modal-open') || activeModalCount > 0;
  });

  useEffect(() => {
    const handleModalChange = (e: any) => {
      setIsOpen(Boolean(e.detail?.isOpen));
    };

    window.addEventListener('jinvani:modal-change', handleModalChange);
    return () => {
      window.removeEventListener('jinvani:modal-change', handleModalChange);
    };
  }, []);

  return isOpen;
}

/**
 * Custom hook to intercept mobile hardware/gesture back buttons for modals, dialogs, drawers, and overlays.
 *
 * When `isOpen` becomes true, it pushes a history state tag, locks background scroll, and marks global modal state.
 * When the user presses the mobile back button, `popstate` is intercepted and `onClose()` is invoked
 * without navigating away from the current page or closing the website.
 * If closed via UI (e.g. close button or backdrop click), it safely reverts the history state.
 */
export function useModalBackHandler(
  isOpen: boolean,
  onClose: () => void,
  modalId: string = 'modal'
) {
  const isPushedRef = useRef(false);
  const isClosingViaBackRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      updateModalState(1, modalId);

      // Push history state to capture back button
      const currentState = window.history.state || {};
      window.history.pushState(
        {
          ...currentState,
          modalOpen: modalId,
          _modalTimestamp: Date.now(),
        },
        ''
      );
      isPushedRef.current = true;
      isClosingViaBackRef.current = false;

      const handlePopState = () => {
        if (isPushedRef.current) {
          isPushedRef.current = false;
          isClosingViaBackRef.current = true;
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        updateModalState(-1, modalId);

        // If closed via UI (not by browser back button)
        if (isPushedRef.current && !isClosingViaBackRef.current) {
          isPushedRef.current = false;
          if (window.history.state?.modalOpen === modalId) {
            window.history.back();
          }
        }
      };
    } else {
      isPushedRef.current = false;
      isClosingViaBackRef.current = false;
    }
  }, [isOpen, onClose, modalId]);
}

