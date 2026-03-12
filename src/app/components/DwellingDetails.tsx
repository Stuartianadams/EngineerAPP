import { MapPin, ArrowLeft, Lock } from 'lucide-react';
import tunstallLogo from 'figma:asset/98cb252ed4c982b06d0f5e58a4b8933356bd7ed6.png';

interface DwellingDetailsProps {
  dwelling: {
    fullName: string;
    fullAddress: string;
    equipmentId: string;
    equipmentModel: string;
    isLocked?: boolean;
  };
  onOnsite: () => void;
  onNotOnsite: () => void;
}

export function DwellingDetails({ dwelling, onOnsite, onNotOnsite }: DwellingDetailsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={tunstallLogo} alt="Tunstall" className="h-10" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onNotOnsite}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dwelling Details</h1>
              <p className="text-sm text-gray-600">Review property information</p>
            </div>
          </div>

          {/* Locked Status */}
          {dwelling.isLocked && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#E31E24]" />
              <div>
                <p className="font-medium text-[#E31E24]">Dwelling Locked</p>
                <p className="text-sm text-gray-700">This dwelling is currently locked. You can only navigate back to search.</p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{dwelling.fullName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
              <div className="p-3 bg-gray-50 rounded-lg flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="text-gray-900">{dwelling.fullAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Equipment ID</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-mono">{dwelling.equipmentId}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Equipment Model</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{dwelling.equipmentModel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          {!dwelling.isLocked && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Are you onsite at this dwelling?</h2>
              <div className="flex gap-4">
                <button
                  onClick={onOnsite}
                  className="flex-1 px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
                >
                  Yes
                </button>
                <button
                  onClick={onNotOnsite}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* Locked Actions */}
          {dwelling.isLocked && (
            <div className="border-t pt-6">
              <button
                onClick={onNotOnsite}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Back to Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}