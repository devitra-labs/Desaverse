import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, AlertTriangle, AlertCircle, CheckCircle, Cloud, Thermometer, 
  Zap, Settings, Filter, X, Search, Calendar, MapPin, Wind, Activity, Trash2, Download
} from 'lucide-react';

// --- PERBAIKAN PENTING DI SINI (Vite Compatible) ---
import jsPDF from 'jspdf'; // Gunakan default import
import autoTable from 'jspdf-autotable'; // Import autoTable sebagai fungsi terpisah

// IMPORT Context
import { useSensor } from '../context/SensorContext';

export default function Peringatan() {
  const { sensors, recentLogs } = useSensor(); 
  
  const [time, setTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Update jam
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGIKA ICON ---
  const getSensorIcon = (sensorId) => {
    if (sensorId.includes('TEMP')) return Thermometer;
    if (sensorId.includes('RAIN') || sensorId.includes('WLVL')) return Cloud;
    if (sensorId.includes('WIND')) return Wind;
    if (sensorId.includes('SOIL') || sensorId.includes('PH')) return Activity;
    if (sensorId.includes('NRGY') || sensorId.includes('LIGHT')) return Zap;
    if (sensorId.includes('WASTE')) return Trash2;
    return AlertCircle;
  };

  // --- GENERATE ALERTS ---
  const currentAlerts = useMemo(() => {
    let alerts = [];
    sensors.forEach((s) => {
      if (s.battery <= 20) {
        alerts.push({
          id: `${s.id}-bat-crit`, sensorId: s.id, level: 'critical',
          title: 'Baterai Kritis', desc: `Baterai ${s.name} sisa ${s.battery}%.`,
          time: s.lastUpdate, icon: Zap, location: s.location, sensorName: s.name, action: 'Ganti Baterai'
        });
      } else if (s.battery <= 50) {
        alerts.push({
          id: `${s.id}-bat-low`, sensorId: s.id, level: 'warning',
          title: 'Baterai Menipis', desc: `Baterai ${s.name} sisa ${s.battery}%.`,
          time: s.lastUpdate, icon: Zap, location: s.location, sensorName: s.name, action: 'Monitoring'
        });
      }
      if (s.status === 'offline') {
        alerts.push({
          id: `${s.id}-offline`, sensorId: s.id, level: 'critical',
          title: 'Sensor Offline', desc: `Sensor ${s.name} hilang sinyal.`,
          time: s.lastUpdate, icon: Settings, location: s.location, sensorName: s.name, action: 'Cek Koneksi'
        });
      } else if (s.status === 'warning') {
        alerts.push({
          id: `${s.id}-warn`, sensorId: s.id, level: 'warning',
          title: 'Status Warning', desc: `Sensor ${s.name} mendeteksi anomali.`,
          time: s.lastUpdate, icon: getSensorIcon(s.id), location: s.location, sensorName: s.name, action: 'Investigasi'
        });
      }
    });
    return alerts;
  }, [sensors]);

  // --- FILTERING ---
  const getFilteredAlerts = () => {
    let filtered = currentAlerts;
    if (activeFilter !== 'all') filtered = filtered.filter(alert => alert.level === activeFilter);
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(lowerQ) ||
        alert.desc.toLowerCase().includes(lowerQ) ||
        alert.sensorName.toLowerCase().includes(lowerQ) ||
        alert.location.toLowerCase().includes(lowerQ)
      );
    }
    return filtered;
  };

  // --- FUNGSI EXPORT (VERSI PERBAIKAN) ---
  const handleExportPDF = () => {
    try {
      const dataToExport = getFilteredAlerts();
      
      // Validasi data kosong
      if (dataToExport.length === 0) {
        alert("Tidak ada data peringatan untuk diexport saat ini.");
        return;
      }

      // 1. Inisialisasi PDF
      const doc = new jsPDF();

      // 2. Header
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Laporan Sistem Peringatan Dini", 14, 22);
      
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74); // Hijau
      doc.text("Desaverse Dashboard Monitoring", 14, 28);

      doc.setDrawColor(200, 200, 200);
      doc.line(14, 32, 196, 32);

      // 3. Metadata
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('id-ID');

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Tanggal Laporan: ${dateStr}, ${timeStr}`, 14, 40);
      doc.text(`Filter Aktif: ${activeFilter.toUpperCase()}`, 14, 45);
      doc.text(`Total Isu Ditemukan: ${dataToExport.length}`, 14, 50);

      // 4. Siapkan Data Tabel
      const tableColumn = ["Waktu", "Level", "Sensor", "Lokasi", "Masalah", "Rekomendasi"];
      const tableRows = dataToExport.map(alert => [
        alert.time,
        alert.level.toUpperCase(),
        alert.sensorName,
        alert.location,
        alert.title,
        alert.action
      ]);

      // --- PERBAIKAN UTAMA: CARA PANGGIL TABEL ---
      // Daripada doc.autoTable, kita panggil fungsi autoTable(doc, options)
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 1) {
            if (data.cell.raw === 'CRITICAL') {
              data.cell.styles.textColor = [220, 38, 38]; 
              data.cell.styles.fontStyle = 'bold';
            } else {
               data.cell.styles.textColor = [217, 119, 6]; 
            }
          }
        }
      });

      // 5. Footer Page Number
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`Halaman ${i} dari ${pageCount} - Dicetak oleh Admin Desaverse`, 14, doc.internal.pageSize.height - 10);
      }

      // 6. Save File
      doc.save(`Laporan_Peringatan_${dateStr.replace(/ /g, '_')}.pdf`);
      
    } catch (error) {
      // Log error biar ketahuan kalau ada masalah
      console.error("Gagal Export PDF:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  // --- STATS CONFIG ---
  const alertStats = [
    { label: 'Total Peringatan', value: currentAlerts.length, icon: Bell, bgColor: 'from-blue-500 to-cyan-600' },
    { label: 'Kritis', value: currentAlerts.filter(a => a.level === 'critical').length, icon: AlertTriangle, bgColor: 'from-red-500 to-rose-600' },
    { label: 'Peringatan', value: currentAlerts.filter(a => a.level === 'warning').length, icon: AlertCircle, bgColor: 'from-amber-500 to-orange-600' },
    { label: 'Log Aktivitas', value: recentLogs.length, icon: CheckCircle, bgColor: 'from-green-500 to-emerald-600' },
  ];

  const filterButtons = [
    { id: 'all', label: 'Semua', count: currentAlerts.length },
    { id: 'critical', label: 'Kritis', count: currentAlerts.filter(a => a.level === 'critical').length },
    { id: 'warning', label: 'Peringatan', count: currentAlerts.filter(a => a.level === 'warning').length },
    { id: 'info', label: 'Info', count: currentAlerts.filter(a => a.level === 'info').length },
  ];

  const getLevelStyles = (level) => {
    switch(level) {
      case 'critical': return { bg: 'bg-red-50', border: 'border-red-500', badge: 'bg-red-100 text-red-700', icon: 'text-red-600' };
      case 'warning': return { bg: 'bg-amber-50', border: 'border-amber-500', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-600' };
      case 'info': return { bg: 'bg-blue-50', border: 'border-blue-500', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-600' };
      default: return { bg: 'bg-slate-50', border: 'border-slate-500', badge: 'bg-slate-100 text-slate-700', icon: 'text-slate-600' };
    }
  };

  return (
    <div className="py-17 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="text-amber-600" size={28} />
              Sistem Peringatan Terpusat
            </h2>
            <p className="text-sm text-slate-600 mt-1">Memantau {sensors.length} sensor di seluruh desa secara real-time</p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-sm text-slate-500">Waktu Server</p>
            <p className="text-xl font-bold text-slate-800">{time.toLocaleTimeString()}</p>
            <p className="text-xs text-slate-500">{time.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {alertStats.map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 shadow-lg text-white transform hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={28} strokeWidth={2.5} />
              <span className="text-sm opacity-90">{stat.label}</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-90 mt-1">{idx === 3 ? 'Catatan 24 jam' : 'Isu aktif saat ini'}</p>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Filter className="text-slate-500 hidden sm:block" size={20} />
            {filterButtons.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                  activeFilter === filter.id ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeFilter === filter.id ? 'bg-white/20' : 'bg-slate-200'}`}>{filter.count}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari peringatan, lokasi, atau sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVE ALERTS LIST */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={24} />
            Daftar Isu Aktif
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-semibold">
              {getFilteredAlerts().length}
            </span>
          </h3>
          
          <button 
            onClick={handleExportPDF}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            <Download size={16} />
            Export Laporan PDF
          </button>
        </div>
        
        {getFilteredAlerts().length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <p className="text-slate-600 font-medium">Semua Sistem Normal</p>
            <p className="text-sm text-slate-500 mt-1">Tidak ada peringatan aktif atau sensor bermasalah saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {getFilteredAlerts().map((alert) => {
              const styles = getLevelStyles(alert.level);
              return (
                <div key={alert.id} className={`p-4 md:p-5 rounded-xl border-l-4 ${styles.bg} ${styles.border} hover:shadow-md transition-all mr-1`}>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className={`p-3 rounded-lg bg-white shadow-sm border border-slate-100`}>
                      <alert.icon className={styles.icon} size={24} />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 flex flex-wrap items-center gap-2 text-base md:text-lg">
                            {alert.title}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${styles.badge}`}>
                              {alert.level.toUpperCase()}
                            </span>
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600 mt-1">{alert.desc}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs md:text-sm">
                        <div className="flex items-center gap-1 text-slate-600"><MapPin size={14} /><span>{alert.location}</span></div>
                        <div className="flex items-center gap-1 text-slate-600"><Activity size={14} /><span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-slate-200">{alert.sensorName}</span></div>
                        <div className="flex items-center gap-1 text-slate-500"><Calendar size={14} /><span>{alert.time}</span></div>
                        <div className="w-full md:w-auto md:ml-auto mt-2 md:mt-0"><span className="inline-block px-3 py-1 bg-white rounded-lg text-slate-700 font-medium text-xs border border-slate-100 shadow-sm">🔧 {alert.action}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LOG HISTORY */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-600" size={24} />
          Riwayat Log Aktivitas
        </h3>
        
        {recentLogs.length === 0 ? (
          <p className="text-slate-500 text-sm">Belum ada log aktivitas yang tercatat.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group gap-3 border border-transparent hover:border-slate-200">
                <div className="flex items-start gap-3 w-full sm:w-auto">
                  <div className={`w-2 h-2 rounded-full mt-2 sm:mt-0 ${log.type === 'error' || log.type === 'critical' ? 'bg-red-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{log.event}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{log.time}</span>
                      <span className="hidden sm:inline text-xs text-slate-400">•</span>
                      <span className="text-xs font-mono bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200">{log.sensor}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">Muat Lebih Banyak Riwayat</button>
      </div>

    </div>
  );
}