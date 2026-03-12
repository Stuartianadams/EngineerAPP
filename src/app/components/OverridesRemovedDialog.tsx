import { CheckCircle } from 'lucide-react';

interface PseudocodeOverride {
  code: string;
  overrideTime: string;
}

interface OverridesRemovedDialogProps {
  isOpen: boolean;
  removedOverrides: PseudocodeOverride[];
  onYes: () => void;
  onNo: () => void;
}

const timeOptions = [
  { value: '15m', label: '15 minutes', minutes: 15 },
  { value: '30m', label: '30 minutes', minutes: 30 },
  { value: '45m', label: '45 minutes', minutes: 45 },
  { value: '60m', label: '60 minutes', minutes: 60 },
];

export function OverridesRemovedDialog({ isOpen, removedOverrides, onYes, onNo }: OverridesRemovedDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Overrides Removed</h2>
          <p className="text-gray-600">
            Pseudocode override has been removed.
          </p>
        </div>

        {/* Removed Overrides List */}
        {removedOverrides.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Removed Overrides:</h3>
            <div className="space-y-2">
              {removedOverrides.map((override) => (
                <div
                  key={override.code}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{override.code}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Duration: {timeOptions.find(t => t.value === override.overrideTime)?.label || override.overrideTime}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-lg font-medium text-gray-900 mb-6">
          Any additional work required?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onNo}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            No
          </button>
          <button
            onClick={onYes}
            className="px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}