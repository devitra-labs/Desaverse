import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Cloud,
  Thermometer,
  Zap,
  Settings,
  Filter,
  X,
  Search,
  Calendar,
  MapPin
} from 'lucide-react';

export default function Peringatan() {
  const [time, setTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = [
    { 
      id: 1,
      level: 'critical', 
      title: 'Battery Sensor Kritis', 
      desc: 'Sensor PRES-01 memiliki battery 15%. Segera lakukan penggantian battery untuk menghindari kehilangan data.',
      time: '5 menit lalu',
      timestamp: new Date(time.getTime() - 5 * 60000),
      icon: Zap,
      location: 'Area Perkebunan E',
      sensor: 'PRES-01',
      action: 'Penggantian Battery'
    },
    { 
      id: 2,
      level: 'warning', 
      title: 'Potensi Hujan Lebat', 
      desc: 'Prediksi hujan lebat dalam 2 jam ke depan. Siaga banjir untuk area rendah dan pastikan drainase lancar.',
      time: '15 menit lalu',
      timestamp: new Date(time.getTime() - 15 * 60000),
      icon: Cloud,
      location: 'Seluruh Area Desa',
      sensor: 'RAIN-01',
      action: 'Siaga Banjir'
    },
    { 
      id: 3,
      level: 'warning', 
      title: 'Suhu Tinggi Terdeteksi', 
      desc: 'Suhu mencapai 34°C di area pemukiman. Warga diimbau untuk mengurangi aktivitas outdoor dan menjaga hidrasi.',
      time: '30 menit lalu',
      timestamp: new Date(time.getTime() - 30 * 60000),
      icon: Thermometer,
      location: 'Area Pemukiman A',
      sensor: 'TEMP-01',
      action: 'Peringatan Cuaca'
    },
    { 
      id: 4,
      level: 'info', 
      title: 'Maintenance Terjadwal', 
      desc: 'Sensor area utara akan dimatikan untuk maintenance rutin. Estimasi downtime 30 menit mulai pukul 14:00.',
      time: '1 jam lalu',
      timestamp: new Date(time.getTime() - 60 * 60000),
      icon: Settings,
      location: 'Area Utara',
      sensor: 'TEMP-01, HUMI-01',
      action: 'Maintenance'
    },
  ];

  const alertHistory = [
    { 
      id: 5,
      title: 'Sensor offline terdeteksi', 
      time: '3 jam lalu',
      resolvedBy: 'Admin',
      level: 'warning',
      sensor: 'WIND-01'
    },
    { 
      id: 6,
      title: 'Suhu mencapai 32°C', 
      time: '5 jam lalu',
      resolvedBy: 'System',
      level: 'info',
      sensor: 'TEMP-01'
    },
    { 
      id: 7,
      title: 'Angin kencang terdeteksi (25 km/h)', 
      time: '8 jam lalu',
      resolvedBy: 'Admin',
      level: 'warning',
      sensor: 'WIND-01'
    },
    { 
      id: 8,
      title: 'Kelembaban tinggi (90%)', 
      time: '12 jam lalu',
      resolvedBy: 'System',
      level: 'info',
      sensor: 'HUMI-01'
    },
    { 
      id: 9,
      title: 'Koneksi sensor terputus', 
      time: '1 hari lalu',
      resolvedBy: 'Admin',
      level: 'critical',
      sensor: 'PRES-01'
    },
  ];

  const alertStats = [
    { label: 'Total Peringatan', value: activeAlerts.length, icon: Bell, color: 'blue', bgColor: 'from-blue-500 to-cyan-600' },
    { label: 'Kritis', value: activeAlerts.filter(a => a.level === 'critical').length, icon: AlertTriangle, color: 'red', bgColor: 'from-red-500 to-rose-600' },
    { label: 'Peringatan', value: activeAlerts.filter(a => a.level === 'warning').length, icon: AlertCircle, color: 'amber', bgColor: 'from-amber-500 to-orange-600' },
    { label: 'Terselesaikan', value: alertHistory.length, icon: CheckCircle, color: 'green', bgColor: 'from-green-500 to-emerald-600' },
  ];

  const filterButtons = [
    { id: 'all', label: 'Semua', count: activeAlerts.length },
    { id: 'critical', label: 'Kritis', count: activeAlerts.filter(a => a.level === 'critical').length },
    { id: 'warning', label: 'Peringatan', count: activeAlerts.filter(a => a.level === 'warning').length },
    { id: 'info', label: 'Info', count: activeAlerts.filter(a => a.level === 'info').length },
  ];

  const getFilteredAlerts = () => {
    let filtered = activeAlerts;
    if (activeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.level === activeFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.sensor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const getLevelStyles = (level) => {
    switch(level) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-700',
          icon: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-500',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-700',
          icon: 'text-amber-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700',
          icon: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-500',
          text: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-700',
          icon: 'text-slate-600'
        };
    }
  };

  return (
    // RESPONSIVE PADDING
    <div className="py-17 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        {/* RESPONSIVE FLEX: Column on Mobile, Row on Desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="text-amber-600" size={28} />
              Sistem Peringatan
            </h2>
            <p className="text-sm text-slate-600 mt-1">Kelola dan pantau semua peringatan sistem secara terpusat</p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-sm text-slate-500">Waktu Real-time</p>
            <p className="text-xl font-bold text-slate-800">{time.toLocaleTimeString()}</p>
            <p className="text-xs text-slate-500">{time.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Alert Statistics Grid */}
      {/* RESPONSIVE GRID: 1 Col (Mobile) -> 2 Col (Tablet) -> 4 Col (Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {alertStats.map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 shadow-lg text-white transform hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={28} strokeWidth={2.5} />
              <span className="text-sm opacity-90">{stat.label}</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-90 mt-1">Aktif saat ini</p>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 mb-6">
        {/* RESPONSIVE FLEX: Column on Mobile, Row on Desktop */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Filter Buttons - Horizontal Scroll on Mobile if needed or Wrap */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Filter className="text-slate-500 hidden sm:block" size={20} />
            {filterButtons.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                  activeFilter === filter.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeFilter === filter.id
                    ? 'bg-white/20'
                    : 'bg-slate-200'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar - Full width on mobile */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari peringatan atau sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={24} />
            Peringatan Aktif
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-semibold">
              {getFilteredAlerts().length}
            </span>
          </h3>
          <button className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Calendar size={16} />
            Export Report
          </button>
        </div>
        
        {getFilteredAlerts().length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <p className="text-slate-600 font-medium">Tidak ada peringatan ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">Semua sistem berjalan normal</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredAlerts().map((alert) => {
              const styles = getLevelStyles(alert.level);
              return (
                <div key={alert.id} className={`p-4 md:p-5 rounded-xl border-l-4 ${styles.bg} ${styles.border} hover:shadow-md transition-all`}>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${alert.level === 'critical' ? 'bg-red-100' : alert.level === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                      <alert.icon className={styles.icon} size={24} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 flex flex-wrap items-center gap-2 text-base md:text-lg">
                            {alert.title}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${styles.badge}`}>
                              {alert.level === 'critical' ? 'KRITIS' : alert.level === 'warning' ? 'PERINGATAN' : 'INFO'}
                            </span>
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600 mt-1">{alert.desc}</p>
                        </div>
                      </div>
                      
                      {/* Meta Info - Responsive Grid/Flex */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs md:text-sm">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin size={14} />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <Zap size={14} />
                          <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-slate-200">{alert.sensor}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar size={14} />
                          <span>{alert.time}</span>
                        </div>
                        <div className="w-full md:w-auto md:ml-auto mt-2 md:mt-0">
                          <span className="inline-block px-3 py-1 bg-white rounded-lg text-slate-700 font-medium text-xs border border-slate-100">
                            🔧 {alert.action}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Stack on mobile, row on desktop */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          Tandai Selesai
                        </button>
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                          Detail
                        </button>
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert History */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-600" size={24} />
          Riwayat Peringatan
        </h3>
        <div className="space-y-2">
          {alertHistory.map((history) => (
            <div key={history.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group gap-3">
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 sm:mt-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{history.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{history.time}</span>
                    <span className="hidden sm:inline text-xs text-slate-400">•</span>
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200">{history.sensor}</span>
                    <span className="hidden sm:inline text-xs text-slate-400">•</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Resolved by {history.resolvedBy}</span>
                  </div>
                </div>
              </div>
              <button className="w-full sm:w-auto sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded text-xs font-medium hover:bg-slate-50">
                View Details
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
          Load More History
        </button>
      </div>

    </div>
  );
}