import { Unlock } from 'lucide-react';

interface DwellingUnlockedDialogProps {
  isOpen: boolean;
  onOk: () => void;
}

export function DwellingUnlockedDialog({ isOpen, onOk }: DwellingUnlockedDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Unlock className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dwelling Unlocked</h2>
          <p className="text-gray-600">
            The dwelling is now unlocked and ready for selection.
          </p>
        </div>

        <button
          onClick={onOk}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
