import { Lock } from 'lucide-react';

interface DwellingLockedDialogProps {
  isOpen: boolean;
  onOk: () => void;
}

export function DwellingLockedDialog({ isOpen, onOk }: DwellingLockedDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dwelling Locked</h2>
          <p className="text-gray-600">
            Dwelling is now locked and ready to add overrides.
          </p>
        </div>

        <button
          onClick={onOk}
          className="w-full px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
        >
          OK
        </button>
      </div>
    </div>
  );
}
