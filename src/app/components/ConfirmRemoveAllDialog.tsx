interface ConfirmRemoveAllDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmRemoveAllDialog({ isOpen, onConfirm, onCancel }: ConfirmRemoveAllDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Removal</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove all the pseudocode overrides?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
