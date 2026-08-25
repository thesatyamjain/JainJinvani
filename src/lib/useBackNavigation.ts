import { useEffect, useRef } from 'react';

/**
 * Custom hook to intercept mobile hardware/gesture back buttons for modals, dialogs, drawers, and overlays.
 *
 * When `isOpen` becomes true, it pushes a history state tag.
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

      const handlePopState = (e: PopStateEvent) => {
        if (isPushedRef.current) {
          isPushedRef.current = false;
          isClosingViaBackRef.current = true;
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
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
