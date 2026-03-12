import { useState, useMemo } from 'react';
import { Search, ChevronDown, Check, X, ArrowLeft } from 'lucide-react';
import tunstallLogo from 'figma:asset/98cb252ed4c982b06d0f5e58a4b8933356bd7ed6.png';

interface PseudocodeOverride {
  code: string;
  overrideTime: string;
}

interface SelectPseudocodeOverrideProps {
  onSubmit: (overrides: PseudocodeOverride[]) => void;
  onBack: () => void;
  initialSelections?: PseudocodeOverride[];
  editingPseudocode?: string | null;
  isEditAllMode?: boolean;
}

// Available pseudocodes
const availablePseudocodes = [
  'pc_FireAlarm',
  'pc_SmokeDetector',
  'pc_IntegralAlarm',
  'pc_BedSensor',
  'pc_CarbonMonoxide',
  'pc_FloodDetector',
  'pc_DoorSensor',
  'pc_MotionDetector',
];

const timeOptions = [
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '45m', label: '45 minutes' },
  { value: '60m', label: '60 minutes' },
];

export function SelectPseudocodeOverride({ onSubmit, onBack, initialSelections = [], editingPseudocode = null, isEditAllMode = false }: SelectPseudocodeOverrideProps) {
  // Determine if we're in edit mode
  const isEditMode = editingPseudocode !== null;
  
  // Get the override being edited
  const editingOverride = useMemo(() => {
    if (!isEditMode) return null;
    return initialSelections.find(o => o.code === editingPseudocode);
  }, [isEditMode, editingPseudocode, initialSelections]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPseudocodes, setSelectedPseudocodes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>(editingOverride?.overrideTime || '15m');
  
  // For Edit All mode, pre-populate with all existing overrides but reset the time to default
  const [addedOverrides, setAddedOverrides] = useState<PseudocodeOverride[]>(
    isEditAllMode 
      ? initialSelections.map(o => ({ ...o, overrideTime: '15m' })) 
      : initialSelections
  );

  // Get list of pseudocodes that are already added to avoid duplicates
  const addedCodes = useMemo(() => {
    return addedOverrides.map(o => o.code);
  }, [addedOverrides]);

  // Filter out already added pseudocodes from available list
  const availablePseudocodesForSelection = useMemo(() => {
    return availablePseudocodes.filter(code => !addedCodes.includes(code));
  }, [addedCodes]);

  const filteredPseudocodes = useMemo(() => {
    return availablePseudocodesForSelection.filter(code =>
      code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availablePseudocodesForSelection]);

  const handlePseudocodeToggle = (code: string) => {
    setSelectedPseudocodes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleAddOverrides = () => {
    // Create new overrides from currently selected pseudocodes
    const newOverrides = selectedPseudocodes.map(code => ({
      code,
      overrideTime: selectedTime,
    }));
    
    // Add them to the existing overrides list
    setAddedOverrides(prev => [...prev, ...newOverrides]);
    
    // Clear the current selection and search to allow new selections
    setSelectedPseudocodes([]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveOverride = (code: string) => {
    setAddedOverrides(prev => prev.filter(o => o.code !== code));
  };

  const handleSubmit = () => {
    if (isEditMode && editingOverride) {
      // Update the time for the editing override
      const updatedOverrides = addedOverrides.map(override =>
        override.code === editingPseudocode
          ? { ...override, overrideTime: selectedTime }
          : override
      );
      onSubmit(updatedOverrides);
    } else if (isEditAllMode) {
      // In Edit All mode, update all overrides with the new time window
      const updatedOverrides = addedOverrides.map(override => ({
        ...override,
        overrideTime: selectedTime
      }));
      onSubmit(updatedOverrides);
    } else if (addedOverrides.length > 0) {
      onSubmit(addedOverrides);
    }
  };

  // In edit mode, render a simplified view showing only the selected pseudocode
  if (isEditMode && editingOverride) {
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Pseudocode Override</h1>
                <p className="text-sm text-gray-600">Update override time window</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Field 1: Selected Pseudocode (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Pseudocode
                </label>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-gray-900">{editingOverride.code}</p>
                </div>
              </div>

              {/* Field 2: PseudoCode Override (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PseudoCode Override
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-mono">PC_TestMode</p>
                </div>
              </div>

              {/* Field 3: Override Time Window */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Override Time Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedTime(option.value)}
                      className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                        selectedTime === option.value
                          ? 'border-[#E31E24] bg-red-50 text-[#E31E24]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg shadow-green-500/20"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Select Pseudocode Override</h1>
              <p className="text-sm text-gray-600">Configure test mode settings</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Field 1: Available Pseudocodes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Pseudocodes
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search pseudocodes..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none transition"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredPseudocodes.length > 0 ? (
                        filteredPseudocodes.map((code) => (
                          <label
                            key={code}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPseudocodes.includes(code)}
                              onChange={() => handlePseudocodeToggle(code)}
                              className="w-5 h-5 text-[#E31E24] border-gray-300 rounded focus:ring-[#E31E24] cursor-pointer"
                            />
                            <span className="text-gray-900">{code}</span>
                            {selectedPseudocodes.includes(code) && (
                              <Check className="ml-auto h-5 w-5 text-[#E31E24]" />
                            )}
                          </label>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">No pseudocodes found</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Field 2: PseudoCode Override (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PseudoCode Override
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-mono">PC_TestMode</p>
              </div>
            </div>

            {/* Field 3: Override Time Window */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Override Time Window
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedTime(option.value)}
                    className={`px-4 py-3 rounded-lg border-2 transition font-medium ${
                      selectedTime === option.value
                        ? 'border-[#E31E24] bg-red-50 text-[#E31E24]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Button */}
            {selectedPseudocodes.length > 0 && (
              <button
                onClick={handleAddOverrides}
                className="w-full px-4 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
              >
                Add Selected Overrides
              </button>
            )}

            {/* Field 4: PseudoCodes Selected */}
            {addedOverrides.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PseudoCodes Selected
                </label>
                <div className="space-y-2">
                  {addedOverrides.map((override) => (
                    <div
                      key={override.code}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{override.code}</p>
                        <p className="text-sm text-gray-600">
                          Override Time: {timeOptions.find(t => t.value === override.overrideTime)?.label}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveOverride(override.code)}
                        className="p-2 text-[#E31E24] hover:bg-red-100 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={addedOverrides.length === 0}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}