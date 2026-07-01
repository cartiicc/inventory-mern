import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * Global confirmation dialog. Render once near the app root and drive it
 * with the `useConfirm` hook for any destructive action (delete product,
 * delete user, cancel order, etc).
 */
const ConfirmDialog = ({ state, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="card w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-danger-100 dark:bg-danger-500/10 text-danger-600">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-semibold text-lg">{state.title || 'Are you sure?'}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {state.message || 'This action cannot be undone.'}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm}>
                {state.confirmLabel || 'Delete'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
