import { AlertTriangle } from 'lucide-react';

interface ConfirmRemoveOverridesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmRemoveOverridesDialog({ isOpen, onConfirm, onCancel }: ConfirmRemoveOverridesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Remove Overrides?</h2>
          <p className="text-gray-600">
            All pseudocode overrides will now be removed.
          </p>
        </div>

        <p className="text-center text-lg font-medium text-gray-900 mb-6">
          Are you sure you want to remove the overrides?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
