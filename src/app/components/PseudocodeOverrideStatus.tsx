import { CheckCircle, Edit, ArrowLeft, Trash2 } from 'lucide-react';
import tunstallLogo from 'figma:asset/98cb252ed4c982b06d0f5e58a4b8933356bd7ed6.png';

interface PseudocodeOverride {
  code: string;
  overrideTime: string;
}

interface PseudocodeOverrideStatusProps {
  overrides: PseudocodeOverride[];
  onEditSingle: (code: string) => void;
  onEditAll: () => void;
  onRemoveSingle: (code: string) => void;
  onRemoveAll: () => void;
  onViewCallHistory: () => void;
  onBack: () => void;
}

const timeOptions = [
  { value: '15m', label: '15 minutes', minutes: 15 },
  { value: '30m', label: '30 minutes', minutes: 30 },
  { value: '45m', label: '45 minutes', minutes: 45 },
  { value: '60m', label: '60 minutes', minutes: 60 },
];

function calculateExpiryTime(overrideTime: string): string {
  const now = new Date();
  const minutes = timeOptions.find(t => t.value === overrideTime)?.minutes || 15;
  const expiry = new Date(now.getTime() + minutes * 60000);
  return expiry.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function PseudocodeOverrideStatus({
  overrides,
  onEditSingle,
  onEditAll,
  onRemoveSingle,
  onRemoveAll,
  onViewCallHistory,
  onBack,
}: PseudocodeOverrideStatusProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={tunstallLogo} alt="Tunstall" className="h-10" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PseudoCode Override Status</h1>
              <p className="text-sm text-gray-600">Test mode configuration active</p>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Success</p>
              <p className="text-sm text-green-700">
                Pseudocode Overrides have been applied and Test Mode is enabled.
              </p>
            </div>
          </div>

          {/* Override List */}
          <div className="space-y-4 mb-6">
            {overrides.map((override) => (
              <div
                key={override.code}
                className="p-5 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{override.code}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditSingle(override.code)}
                      className="flex items-center gap-2 px-3 py-2 text-[#E31E24] hover:bg-red-50 rounded-lg transition text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onRemoveSingle(override.code)}
                      className="flex items-center gap-2 px-3 py-2 text-[#E31E24] hover:bg-red-50 rounded-lg transition text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Override Status</p>
                    <p className="font-medium text-green-600">Applied</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Override Expiry Time</p>
                    <p className="font-medium text-gray-900">{calculateExpiryTime(override.overrideTime)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onViewCallHistory}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg shadow-green-500/20"
            >
              View Call History
            </button>
            <button
              onClick={onEditAll}
              className="w-full px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
            >
              Edit All
            </button>
            <button
              onClick={onRemoveAll}
              className="w-full px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
            >
              Remove All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}