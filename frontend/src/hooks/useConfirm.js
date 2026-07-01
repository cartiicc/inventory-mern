import { useState, useCallback } from 'react';

/**
 * Imperative confirmation-dialog hook.
 * Usage:
 *   const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
 *   const ok = await confirm({ title, message });
 */
export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState(null);
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((options) => {
    setConfirmState(options);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    resolver?.(true);
    setConfirmState(null);
  };

  const handleCancel = () => {
    resolver?.(false);
    setConfirmState(null);
  };

  return { confirm, confirmState, handleConfirm, handleCancel };
};
