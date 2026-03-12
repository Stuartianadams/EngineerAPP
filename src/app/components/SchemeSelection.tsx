import { useState, useMemo } from 'react';
import { Search, Building2, Home, Building, X, User, LogOut, Lock } from 'lucide-react';
import tunstallLogo from 'figma:asset/98cb252ed4c982b06d0f5e58a4b8933356bd7ed6.png';

interface SchemeSelectionProps {
  username: string;
  onSelectionComplete: (scheme: string | null, dwelling: string) => void;
  onLogout: () => void;
}

// Mock data for authorities, schemes and dwellings
const authorities = ['Authority 1', 'Authority 2', 'Authority 3'];

// Mock locked dwellings data - some dwellings are locked by other users
const lockedDwellings: Record<string, { lockedBy: string }> = {
  'Unit 1B': { lockedBy: 'Sarah Johnson' },
  'House 2': { lockedBy: 'Mike Thompson' },
  'Apt 201': { lockedBy: 'Emily Davis' },
  'Villa B': { lockedBy: 'James Wilson' },
};

const schemes = [
  { id: 1, name: 'Riverside Development', authority: 'Authority 1', dwellings: ['Unit 1A', 'Unit 1B', 'Unit 2A', 'Unit 2B', 'Unit 3A', 'Unit 3B'] },
  { id: 2, name: 'Oakwood Estate', authority: 'Authority 1', dwellings: ['House 1', 'House 2', 'House 3', 'House 4', 'House 5'] },
  { id: 3, name: 'Sunset Apartments', authority: 'Authority 2', dwellings: ['Apt 101', 'Apt 102', 'Apt 201', 'Apt 202', 'Apt 301', 'Apt 302'] },
  { id: 4, name: 'Green Valley Homes', authority: 'Authority 2', dwellings: ['Villa A', 'Villa B', 'Villa C', 'Villa D'] },
  { id: 5, name: 'Harbor View Complex', authority: 'Authority 3', dwellings: ['Block A-101', 'Block A-102', 'Block B-201', 'Block B-202'] },
];

export function SchemeSelection({ username, onSelectionComplete, onLogout }: SchemeSelectionProps) {
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);
  const [authoritySearch, setAuthoritySearch] = useState('');
  const [showAuthorityDropdown, setShowAuthorityDropdown] = useState(false);
  const [selectByScheme, setSelectByScheme] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [selectedDwelling, setSelectedDwelling] = useState<string>('');
  const [schemeSearch, setSchemeSearch] = useState('');
  const [dwellingSearch, setDwellingSearch] = useState('');
  const [showSchemeDropdown, setShowSchemeDropdown] = useState(false);
  const [showDwellingDropdown, setShowDwellingDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [selectedLockedDwelling, setSelectedLockedDwelling] = useState<{ dwelling: string; lockedBy: string } | null>(null);

  // Filter authorities based on search
  const filteredAuthorities = useMemo(() => {
    return authorities.filter(authority =>
      authority.toLowerCase().includes(authoritySearch.toLowerCase())
    );
  }, [authoritySearch]);

  // Get schemes for selected authorities
  const availableSchemes = useMemo(() => {
    if (selectedAuthorities.length === 0) return [];
    return schemes.filter(s => selectedAuthorities.includes(s.authority));
  }, [selectedAuthorities]);

  // Filter schemes based on search
  const filteredSchemes = useMemo(() => {
    return availableSchemes.map(scheme => scheme.name).filter(scheme =>
      scheme.toLowerCase().includes(schemeSearch.toLowerCase())
    );
  }, [availableSchemes, schemeSearch]);

  // Get all dwellings from schemes under selected authorities
  const allAuthorityDwellings = useMemo(() => {
    if (selectedAuthorities.length === 0) return [];
    return schemes
      .filter(s => selectedAuthorities.includes(s.authority))
      .flatMap(scheme => 
        scheme.dwellings.map(dwelling => ({ dwelling, scheme: scheme.name, authority: scheme.authority }))
      );
  }, [selectedAuthorities]);

  // Get dwellings based on whether scheme selection is enabled
  const availableDwellings = useMemo(() => {
    if (selectedAuthorities.length === 0) return [];
    
    if (selectByScheme) {
      // If using scheme selection, only show dwellings from selected scheme
      if (!selectedScheme) return [];
      const scheme = schemes.find(s => s.name === selectedScheme && selectedAuthorities.includes(s.authority));
      return scheme ? scheme.dwellings.map(d => ({ dwelling: d, scheme: scheme.name, authority: scheme.authority })) : [];
    } else {
      // If not using scheme selection, show all dwellings from selected authorities
      return allAuthorityDwellings;
    }
  }, [selectedAuthorities, selectedScheme, selectByScheme, allAuthorityDwellings]);

  // Filter dwellings based on search
  const filteredDwellings = useMemo(() => {
    return availableDwellings.filter(item =>
      item.dwelling.toLowerCase().includes(dwellingSearch.toLowerCase()) ||
      item.scheme.toLowerCase().includes(dwellingSearch.toLowerCase())
    );
  }, [availableDwellings, dwellingSearch]);

  const handleAuthorityToggle = (authority: string) => {
    setSelectedAuthorities(prev => {
      const isSelected = prev.includes(authority);
      const newSelection = isSelected
        ? prev.filter(a => a !== authority)
        : [...prev, authority];
      
      // If all authorities are removed, clear downstream selections
      if (newSelection.length === 0) {
        setSelectByScheme(false);
        setSelectedScheme(null);
        setSelectedDwelling('');
        setSchemeSearch('');
        setDwellingSearch('');
        setShowSchemeDropdown(false);
        setShowDwellingDropdown(false);
      } else {
        // Clear scheme and dwelling if the selected scheme's authority was removed
        if (selectedScheme) {
          const schemeObj = schemes.find(s => s.name === selectedScheme);
          if (schemeObj && !newSelection.includes(schemeObj.authority)) {
            setSelectedScheme(null);
            setSchemeSearch('');
          }
        }
        // Clear dwelling if its authority was removed
        if (selectedDwelling) {
          const dwellingObj = allAuthorityDwellings.find(d => d.dwelling === selectedDwelling);
          if (dwellingObj && !newSelection.includes(dwellingObj.authority)) {
            setSelectedDwelling('');
            setDwellingSearch('');
          }
        }
      }
      
      return newSelection;
    });
  };

  const handleRemoveAuthority = (authority: string) => {
    handleAuthorityToggle(authority);
  };

  const handleSchemeCheckboxChange = (checked: boolean) => {
    setSelectByScheme(checked);
    // Clear selections when toggling
    setSelectedScheme(null);
    setSelectedDwelling('');
    setSchemeSearch('');
    setDwellingSearch('');
    setShowSchemeDropdown(false);
    setShowDwellingDropdown(false);
  };

  const handleSchemeSelect = (schemeName: string) => {
    setSelectedScheme(schemeName);
    setSchemeSearch(schemeName);
    setShowSchemeDropdown(false);
    setSelectedDwelling('');
    setDwellingSearch('');
  };

  const handleDwellingSelect = (item: { dwelling: string; scheme: string; authority: string }) => {
    setSelectedDwelling(item.dwelling);
    setDwellingSearch(selectByScheme ? item.dwelling : `${item.dwelling} (${item.scheme})`);
    setShowDwellingDropdown(false);
    // If not using scheme selection, set the scheme from the selected dwelling
    if (!selectByScheme) {
      setSelectedScheme(item.scheme);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedScheme && selectedDwelling) {
      onSelectionComplete(selectedScheme, selectedDwelling);
    }
  };

  const isValid = selectedScheme && selectedDwelling;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-8">
            <img src={tunstallLogo} alt="Tunstall" className="h-10" />
            <div className="relative">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{username}</p>
              </div>
              <button
                onClick={() => {
                  setShowAccountMenu(!showAccountMenu);
                  setShowLogoutConfirm(false);
                }}
                className="mt-2 flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <User className="w-4 h-4" />
                My Account
              </button>
              
              {/* Account Dropdown Menu */}
              {showAccountMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowAccountMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                    <button
                      onClick={() => {
                        setShowAccountMenu(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-2 text-gray-700 hover:text-[#E31E24]"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Scheme & Dwelling</h1>
            <p className="text-gray-600">Choose your work location</p>
          </div>

          {/* Scope/Authority Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope (Select one or more)
            </label>
            
            {/* Selected Authorities Tags */}
            {selectedAuthorities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedAuthorities.map((authority) => (
                  <div
                    key={authority}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#E31E24] text-white rounded-lg text-sm"
                  >
                    <span>{authority}</span>
                    <button
                      onClick={() => handleRemoveAuthority(authority)}
                      className="hover:bg-[#C91A20] rounded-full p-0.5 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={authoritySearch}
                onChange={(e) => {
                  setAuthoritySearch(e.target.value);
                  setShowAuthorityDropdown(true);
                }}
                onFocus={() => setShowAuthorityDropdown(true)}
                placeholder="Search and select authorities..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none transition"
              />
            </div>

            {/* Authority Dropdown */}
            {showAuthorityDropdown && filteredAuthorities.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAuthorityDropdown(false)}
                />
                <div className="relative">
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredAuthorities.map((authority) => (
                      <button
                        key={authority}
                        onClick={() => {
                          handleAuthorityToggle(authority);
                          setAuthoritySearch('');
                        }}
                        className={`w-full px-4 py-3 text-left transition flex items-center gap-2 ${
                          selectedAuthorities.includes(authority)
                            ? 'bg-red-50 text-[#E31E24] font-medium'
                            : 'hover:bg-red-50'
                        }`}
                      >
                        {selectedAuthorities.includes(authority) && (
                          <span className="text-sm">✓</span>
                        )}
                        <span>{authority}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Only show the rest if at least one authority is selected */}
          {selectedAuthorities.length > 0 && (
            <>
              {/* Select by Scheme Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectByScheme}
                    onChange={(e) => handleSchemeCheckboxChange(e.target.checked)}
                    className="w-5 h-5 text-[#E31E24] border-gray-300 rounded focus:ring-[#E31E24] cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium">Select by Scheme</span>
                </label>
              </div>

              {/* Scheme Selection (only if checkbox is checked) */}
              {selectByScheme && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheme
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={schemeSearch}
                      onChange={(e) => {
                        setSchemeSearch(e.target.value);
                        setShowSchemeDropdown(true);
                      }}
                      onFocus={() => setShowSchemeDropdown(true)}
                      placeholder="Search schemes..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none transition"
                    />
                  </div>

                  {/* Scheme Dropdown */}
                  {showSchemeDropdown && filteredSchemes.length > 0 && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowSchemeDropdown(false)}
                      />
                      <div className="relative">
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {filteredSchemes.map((scheme) => (
                            <button
                              key={scheme}
                              onClick={() => handleSchemeSelect(scheme)}
                              className="w-full px-4 py-3 text-left hover:bg-red-50 transition"
                            >
                              {scheme}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Dwelling Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dwelling
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={dwellingSearch}
                    onChange={(e) => {
                      setDwellingSearch(e.target.value);
                      setShowDwellingDropdown(true);
                    }}
                    onFocus={() => setShowDwellingDropdown(true)}
                    placeholder={selectByScheme ? "Search dwellings in selected scheme..." : "Search all dwellings in selected authorities..."}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none transition"
                  />
                </div>

                {/* Dwelling Dropdown */}
                {showDwellingDropdown && filteredDwellings.length > 0 && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDwellingDropdown(false)}
                    />
                    <div className="relative">
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredDwellings.map((item) => {
                          const isLocked = !!lockedDwellings[item.dwelling];
                          const lockInfo = lockedDwellings[item.dwelling];
                          
                          return (
                            <div
                              key={`${item.scheme}-${item.dwelling}`}
                              className="relative"
                            >
                              <div className="w-full px-4 py-3 flex items-start gap-2">
                                {isLocked && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedLockedDwelling({ dwelling: item.dwelling, lockedBy: lockInfo.lockedBy });
                                      setShowLockDialog(true);
                                      setShowDwellingDropdown(false);
                                    }}
                                    className="flex-shrink-0 p-1 hover:bg-green-50 rounded transition"
                                    aria-label="View lock details"
                                  >
                                    <Lock className="w-5 h-5 text-green-600" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => !isLocked && handleDwellingSelect(item)}
                                  disabled={isLocked}
                                  className={`flex-1 text-left transition ${
                                    isLocked 
                                      ? 'cursor-not-allowed opacity-70' 
                                      : 'hover:text-[#E31E24] cursor-pointer'
                                  }`}
                                >
                                  <div className="font-medium text-gray-900">{item.dwelling}</div>
                                  {!selectByScheme && (
                                    <div className="text-sm text-gray-500">{item.scheme}</div>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Selected Info */}
              {(selectedAuthorities.length > 0 || selectedScheme || selectedDwelling) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Selected:</h3>
                  {selectedAuthorities.length > 0 && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Scope:</span> {selectedAuthorities.join(', ')}
                    </p>
                  )}
                  {selectedScheme && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Scheme:</span> {selectedScheme}
                    </p>
                  )}
                  {selectedDwelling && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Dwelling:</span> {selectedDwelling}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedDwelling}
                className="w-full py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowLogoutConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="flex-1 px-6 py-3 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition font-medium shadow-lg shadow-red-500/20"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Lock Dialog */}
      {showLockDialog && selectedLockedDwelling && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowLockDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dwelling Locked</h2>
              <p className="text-gray-600 mb-6">This dwelling is locked by {selectedLockedDwelling.lockedBy}.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLockDialog(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}