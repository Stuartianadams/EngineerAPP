import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SchemeSelection } from './components/SchemeSelection';
import { DwellingDetails } from './components/DwellingDetails';
import { SelectPseudocodeOverride } from './components/SelectPseudocodeOverride';
import { PseudocodeOverrideStatus } from './components/PseudocodeOverrideStatus';
import { CallHistoryDetails } from './components/CallHistoryDetails';
import { ConfirmRemoveOverridesDialog } from './components/ConfirmRemoveOverridesDialog';
import { OverridesRemovedDialog } from './components/OverridesRemovedDialog';
import { DwellingUnlockedDialog } from './components/DwellingUnlockedDialog';
import { DwellingLockedDialog } from './components/DwellingLockedDialog';
import { ConfirmRemoveSingleDialog } from './components/ConfirmRemoveSingleDialog';
import { ConfirmRemoveAllDialog } from './components/ConfirmRemoveAllDialog';

type Screen = 
  | 'login' 
  | 'schemeSelection' 
  | 'dwellingDetails' 
  | 'selectPseudocode' 
  | 'overrideStatus' 
  | 'callHistory';

interface PseudocodeOverride {
  code: string;
  overrideTime: string;
}

// Mock dwelling data
const mockDwelling = {
  fullName: 'John Smith',
  fullAddress: '123 Oak Street, Riverside Development, Manchester, M1 1AA',
  equipmentId: '123456789',
  equipmentModel: 'Tunstall Connect+',
  isLocked: false,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [selectedDwelling, setSelectedDwelling] = useState<string>('');
  const [pseudocodeOverrides, setPseudocodeOverrides] = useState<PseudocodeOverride[]>([]);
  const [removedOverrides, setRemovedOverrides] = useState<PseudocodeOverride[]>([]);
  const [editingPseudocode, setEditingPseudocode] = useState<string | null>(null);
  const [isEditAllMode, setIsEditAllMode] = useState(false);
  
  // Dialog states
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [showOverridesRemoved, setShowOverridesRemoved] = useState(false);
  const [showDwellingUnlocked, setShowDwellingUnlocked] = useState(false);
  const [showDwellingLocked, setShowDwellingLocked] = useState(false);
  const [showConfirmRemoveSingle, setShowConfirmRemoveSingle] = useState(false);
  const [showConfirmRemoveAll, setShowConfirmRemoveAll] = useState(false);
  const [pendingRemoveCode, setPendingRemoveCode] = useState<string | null>(null);

  const handleLogin = (user: string, password: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    setCurrentScreen('schemeSelection');
  };

  const handleSelectionComplete = (scheme: string | null, dwelling: string) => {
    setSelectedScheme(scheme);
    setSelectedDwelling(dwelling);
    setCurrentScreen('dwellingDetails');
  };

  const handleOnsite = () => {
    setShowDwellingLocked(true);
  };

  const handleNotOnsite = () => {
    setCurrentScreen('schemeSelection');
  };

  const handlePseudocodeSubmit = (overrides: PseudocodeOverride[]) => {
    setPseudocodeOverrides(overrides);
    setEditingPseudocode(null); // Clear editing state
    setIsEditAllMode(false); // Clear edit all mode
    setCurrentScreen('overrideStatus');
  };

  const handleEditSingle = (code: string) => {
    // Navigate back to select screen with the selected override
    setEditingPseudocode(code);
    setCurrentScreen('selectPseudocode');
  };

  const handleEditAll = () => {
    setEditingPseudocode(null);
    setIsEditAllMode(true);
    setCurrentScreen('selectPseudocode');
  };

  const handleRemoveSingle = (code: string) => {
    setPendingRemoveCode(code);
    setShowConfirmRemoveSingle(true);
  };

  const handleRemoveAll = () => {
    setShowConfirmRemoveAll(true);
  };

  const handleViewCallHistory = () => {
    setCurrentScreen('callHistory');
  };

  const handleTestComplete = () => {
    setShowConfirmRemove(true);
  };

  const handleMoreTimeRequired = () => {
    setCurrentScreen('overrideStatus');
  };

  const handleConfirmRemoveOverrides = () => {
    setShowConfirmRemove(false);
    setRemovedOverrides(pseudocodeOverrides);
    setPseudocodeOverrides([]);
    setShowOverridesRemoved(true);
  };

  const handleCancelRemoveOverrides = () => {
    setShowConfirmRemove(false);
  };

  const handleAdditionalWorkYes = () => {
    setShowOverridesRemoved(false);
    setPseudocodeOverrides([]);
    setCurrentScreen('selectPseudocode');
  };

  const handleAdditionalWorkNo = () => {
    setShowOverridesRemoved(false);
    setShowDwellingUnlocked(true);
  };

  const handleDwellingUnlockedOk = () => {
    setShowDwellingUnlocked(false);
    setPseudocodeOverrides([]);
    setSelectedScheme(null);
    setSelectedDwelling('');
    setCurrentScreen('schemeSelection');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setSelectedScheme(null);
    setSelectedDwelling('');
    setPseudocodeOverrides([]);
    setCurrentScreen('login');
  };

  const handleBackFromPseudocode = () => {
    setCurrentScreen('dwellingDetails');
  };

  const handleBackFromStatus = () => {
    setCurrentScreen('selectPseudocode');
  };

  const handleBackFromCallHistory = () => {
    setCurrentScreen('overrideStatus');
  };

  const handleDwellingLockedOk = () => {
    setShowDwellingLocked(false);
    setCurrentScreen('selectPseudocode');
  };

  const handleConfirmRemoveSingleOverride = () => {
    if (pendingRemoveCode) {
      setPseudocodeOverrides(prev => prev.filter(o => o.code !== pendingRemoveCode));
      setRemovedOverrides(prev => [...prev, pseudocodeOverrides.find(o => o.code === pendingRemoveCode)!]);
    }
    setShowConfirmRemoveSingle(false);
  };

  const handleCancelRemoveSingleOverride = () => {
    setShowConfirmRemoveSingle(false);
  };

  const handleConfirmRemoveAllOverrides = () => {
    setRemovedOverrides(pseudocodeOverrides);
    setPseudocodeOverrides([]);
    setShowConfirmRemoveAll(false);
    setCurrentScreen('selectPseudocode');
  };

  const handleCancelRemoveAllOverrides = () => {
    setShowConfirmRemoveAll(false);
  };

  return (
    <div className="size-full">
      {currentScreen === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentScreen === 'schemeSelection' && (
        <SchemeSelection username={username} onSelectionComplete={handleSelectionComplete} onLogout={handleLogout} />
      )}

      {currentScreen === 'dwellingDetails' && (
        <DwellingDetails
          dwelling={mockDwelling}
          onOnsite={handleOnsite}
          onNotOnsite={handleNotOnsite}
        />
      )}

      {currentScreen === 'selectPseudocode' && (
        <SelectPseudocodeOverride
          onSubmit={handlePseudocodeSubmit}
          onBack={handleBackFromPseudocode}
          initialSelections={pseudocodeOverrides}
          editingPseudocode={editingPseudocode}
          isEditAllMode={isEditAllMode}
        />
      )}

      {currentScreen === 'overrideStatus' && (
        <PseudocodeOverrideStatus
          overrides={pseudocodeOverrides}
          onEditSingle={handleEditSingle}
          onEditAll={handleEditAll}
          onRemoveSingle={handleRemoveSingle}
          onRemoveAll={handleRemoveAll}
          onViewCallHistory={handleViewCallHistory}
          onBack={handleBackFromStatus}
        />
      )}

      {currentScreen === 'callHistory' && (
        <CallHistoryDetails
          onTestComplete={handleTestComplete}
          onMoreTimeRequired={handleMoreTimeRequired}
          onBack={handleBackFromCallHistory}
        />
      )}

      {/* Dialogs */}
      <ConfirmRemoveOverridesDialog
        isOpen={showConfirmRemove}
        onConfirm={handleConfirmRemoveOverrides}
        onCancel={handleCancelRemoveOverrides}
      />

      <OverridesRemovedDialog
        isOpen={showOverridesRemoved}
        removedOverrides={removedOverrides}
        onYes={handleAdditionalWorkYes}
        onNo={handleAdditionalWorkNo}
      />

      <DwellingUnlockedDialog
        isOpen={showDwellingUnlocked}
        onOk={handleDwellingUnlockedOk}
      />

      <DwellingLockedDialog
        isOpen={showDwellingLocked}
        onOk={handleDwellingLockedOk}
      />

      <ConfirmRemoveSingleDialog
        isOpen={showConfirmRemoveSingle}
        pseudocodeCode={pendingRemoveCode}
        onConfirm={handleConfirmRemoveSingleOverride}
        onCancel={handleCancelRemoveSingleOverride}
      />

      <ConfirmRemoveAllDialog
        isOpen={showConfirmRemoveAll}
        onConfirm={handleConfirmRemoveAllOverrides}
        onCancel={handleCancelRemoveAllOverrides}
      />
    </div>
  );
}