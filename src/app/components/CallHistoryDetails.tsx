import { useState } from 'react';
import { RefreshCw, Clock, ArrowLeft, FileText, Plus, X } from 'lucide-react';
import tunstallLogo from 'figma:asset/98cb252ed4c982b06d0f5e58a4b8933356bd7ed6.png';

interface CallHistoryEntry {
  id: number;
  dateTime: string;
  reason: string;
  callCode: string;
  protocol: string;
  pseudoCode: string;
  note?: string;
}

interface CallHistoryDetailsProps {
  onTestComplete: () => void;
  onMoreTimeRequired: () => void;
  onBack: () => void;
}

// Mock call history data
const initialCallHistory: CallHistoryEntry[] = [
  {
    id: 1,
    dateTime: '11/03/2026 14:23',
    reason: 'Test Alert',
    callCode: 'HA',
    protocol: 'TT21',
    pseudoCode: 'PC_TestMode',
  },
  {
    id: 2,
    dateTime: '11/03/2026 14:25',
    reason: 'Sensor Check',
    callCode: 'BC',
    protocol: 'TT21',
    pseudoCode: 'PC_TestMode',
  },
  {
    id: 3,
    dateTime: '11/03/2026 14:28',
    reason: 'Fire Alarm Test',
    callCode: 'FA',
    protocol: 'TT21',
    pseudoCode: 'PC_TestMode',
  },
];

export function CallHistoryDetails({ onTestComplete, onMoreTimeRequired, onBack }: CallHistoryDetailsProps) {
  const [callHistory, setCallHistory] = useState<CallHistoryEntry[]>(initialCallHistory);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // Add a new mock entry
      const newEntry: CallHistoryEntry = {
        id: callHistory.length + 1,
        dateTime: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        reason: 'Test Update',
        callCode: 'HA',
        protocol: 'TT21',
        pseudoCode: 'PC_TestMode',
      };
      setCallHistory([...callHistory, newEntry]);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleAddNote = (entryId: number) => {
    setEditingNoteId(entryId);
    const entry = callHistory.find(e => e.id === entryId);
    setNoteText(entry?.note || '');
  };

  const handleSaveNote = (entryId: number) => {
    setCallHistory(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, note: noteText.trim() || undefined }
          : entry
      )
    );
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleCancelNote = () => {
    setEditingNoteId(null);
    setNoteText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={tunstallLogo} alt="Tunstall" className="h-10" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Call History Details</h1>
                <p className="text-sm text-gray-600">View recent activity</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#C91A20] transition disabled:opacity-50 shadow-lg shadow-red-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Call History Grid */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date/Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Call Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Protocol</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PseudoCode</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {callHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {entry.dateTime}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{entry.reason}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs">
                        {entry.callCode}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-mono text-xs">
                        {entry.protocol}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-xs">
                        {entry.pseudoCode}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {editingNoteId === entry.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Enter note..."
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNote(entry.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelNote}
                            className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {entry.note ? (
                            <>
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded flex-1">
                                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <span className="text-sm text-gray-900 truncate">{entry.note}</span>
                              </div>
                              <button
                                onClick={() => handleAddNote(entry.id)}
                                className="px-3 py-1.5 text-[#E31E24] hover:bg-red-50 rounded transition text-xs font-medium"
                              >
                                Edit
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleAddNote(entry.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition text-sm"
                            >
                              <Plus className="w-4 h-4" />
                              Add Note
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onTestComplete}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg shadow-green-500/20"
            >
              Done
            </button>
            <button
              onClick={onMoreTimeRequired}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium shadow-lg shadow-yellow-500/20"
            >
              Back To Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}