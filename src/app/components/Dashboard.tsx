import { useState } from 'react';
import {
  Wrench,
  ClipboardList,
  MapPin,
  Calendar,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Camera,
  Settings,
  Building2,
} from 'lucide-react';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock data for work orders
  const workOrders = [
    { id: 1, title: 'HVAC System Repair', location: 'Building A - Floor 3', status: 'in-progress', priority: 'high', time: '2h ago' },
    { id: 2, title: 'Electrical Panel Inspection', location: 'Building B - Basement', status: 'pending', priority: 'medium', time: '4h ago' },
    { id: 3, title: 'Plumbing Maintenance', location: 'Building C - Floor 1', status: 'completed', priority: 'low', time: '1d ago' },
    { id: 4, title: 'Fire Alarm Testing', location: 'Building A - All Floors', status: 'pending', priority: 'high', time: '3h ago' },
  ];

  const stats = [
    { label: 'Active Jobs', value: '12', icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Completed Today', value: '8', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending', value: '5', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Alerts', value: '2', icon: AlertCircle, color: 'bg-red-500' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Field Engineer Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {username}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <FileText className="w-5 h-5 inline mr-2" />
                Reports
              </button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Camera className="w-5 h-5 inline mr-2" />
                Photos
              </button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
              </button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Building2 className="w-5 h-5 inline mr-2" />
                Change Location
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-5 h-5 inline mr-2" />
                Logout
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2">
                <button className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <FileText className="w-5 h-5 inline mr-2" />
                  Reports
                </button>
                <button className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Camera className="w-5 h-5 inline mr-2" />
                  Photos
                </button>
                <button className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Settings className="w-5 h-5 inline mr-2" />
                  Settings
                </button>
                <button className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Building2 className="w-5 h-5 inline mr-2" />
                  Change Location
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-left bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut className="w-5 h-5 inline mr-2" />
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Work Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Work Orders</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                + New Work Order
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className={`p-6 hover:bg-gray-50 transition cursor-pointer border-l-4 ${getPriorityStyle(order.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{order.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {order.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">{order.priority} priority</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition text-left">
            <Calendar className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Schedule</h3>
            <p className="text-sm text-gray-600">View your upcoming appointments</p>
          </button>
          <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition text-left">
            <MapPin className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Locations</h3>
            <p className="text-sm text-gray-600">Navigate to job sites</p>
          </button>
          <button className="bg-white rounded-lg shadow p-6 hover:shadow-md transition text-left">
            <ClipboardList className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Inventory</h3>
            <p className="text-sm text-gray-600">Check parts and supplies</p>
          </button>
        </div>
      </main>
    </div>
  );
}