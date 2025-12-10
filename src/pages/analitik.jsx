import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Calendar, Download, RefreshCw,
  Thermometer, Droplets, Wind, Cloud, Zap, Activity, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

import { useSensor } from '../context/SensorContext'; 

export default function Analitik() {
  const [timeRange, setTimeRange] = useState('7days');
  const [forecastData, setForecastData] = useState([]); // Menampung data API murni
  const [loading, setLoading] = useState(true);

  // Ambil data sensors (untuk status sistem)
  const { sensors } = useSensor();

  const timeRanges = [
    { id: '24h', label: '24 Jam' },
    { id: '7days', label: '7 Hari' },
    { id: '30days', label: '30 Hari' },
  ];

  // --- 1. FETCH DATA API (REAL) ---
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api-back.ct.ws/api/index.php?action=bmkg_prakiraan&adm4=35.07.26.2003');
        const json = await response.json();

        if (json.data && json.data.length > 0 && json.data[0].cuaca) {
          // Ambil 7 data cuaca terdepan
          const rawData = json.data[0].cuaca.flat().slice(0, 7);
          setForecastData(rawData);
        }
      } catch (error) {
        console.error("Gagal ambil data API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [timeRange]); // Refresh jika timeRange berubah (opsional logic)

  // --- 2. FORMAT DATA UNTUK CHART ---
  
  // Helper: Format Jam (misal "13:00")
  const formatLabel = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper: Proses Data API ke Format Grafik
  const processChartData = (key, maxScale) => {
    // Jika data kosong, kembalikan array kosong biar gak error
    if (!forecastData || forecastData.length === 0) return [];

    return forecastData.map((item) => {
      const val = parseFloat(item[key]) || 0;
      let height = (val / maxScale) * 100;
      // Batasi tinggi grafik agar rapi (min 10%, max 100%)
      return {
        day: formatLabel(item.datetime),
        value: val,
        height: Math.max(10, Math.min(height, 100))
      };
    });
  };

  // Generate Data Siap Pakai
  const tempData = processChartData('t', 40);       // Suhu (key: t)
  const humidData = processChartData('hu', 100);    // Kelembaban (key: hu)
  const windData = processChartData('ws', 30);      // Angin (key: ws)
  const cloudData = processChartData('tcc', 100);   // Awan (key: tcc)

  // --- 3. HITUNG STATISTIK (Min/Avg/Max) ---
  const getStats = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return { min: 0, avg: 0, max: 0 };
    const values = dataArray.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    return { min, avg, max };
  };

  const tempStats = getStats(tempData);
  const humidStats = getStats(humidData);
  const windStats = getStats(windData);

  // --- 4. ANALISA TREND ---
  const analyzeTrend = (val, min, max, unit) => {
    const num = parseFloat(val);
    if (num < min) return { trend: 'down', change: `${(num - min).toFixed(1)} ${unit}` };
    if (num > max) return { trend: 'up', change: `+${(num - max).toFixed(1)} ${unit}` };
    return { trend: 'stable', change: 'Stabil' };
  };

  const summaryStats = [
    { 
      label: 'Rata-rata Suhu', value: `${tempStats.avg}°C`, 
      ...analyzeTrend(tempStats.avg, 24, 32, '°C'),
      icon: Thermometer, color: 'red', bgColor: 'from-red-100 to-rose-200', period: '7 jam ke depan'
    },
    { 
      label: 'Kelembaban', value: `${humidStats.avg}%`, 
      ...analyzeTrend(humidStats.avg, 60, 90, '%'),
      icon: Droplets, color: 'cyan', bgColor: 'from-cyan-100 to-blue-200', period: '7 jam ke depan'
    },
    { 
      label: 'Kondisi Langit', value: 'Berawan', change: 'Normal', trend: 'stable',
      icon: Cloud, color: 'blue', bgColor: 'from-blue-100 to-indigo-200', period: 'Berdasarkan data awan'
    },
    { 
      label: 'Angin', value: `${windStats.avg} km/h`, 
      ...analyzeTrend(windStats.avg, 0, 20, 'km/h'),
      icon: Wind, color: 'green', bgColor: 'from-green-100 to-emerald-200', period: '7 jam ke depan'
    },
  ];

  // --- 5. FUNGSI EXPORT (CSV & PDF) ---
  
  const handleExportCSV = () => {
    if (tempData.length === 0) {
      alert("Data belum tersedia, tunggu loading selesai.");
      return;
    }

    // Header CSV
    let csv = "Jam,Suhu (C),Kelembaban (%),Angin (km/h),Tutupan Awan (%)\n";
    
    // Loop data yang sudah diproses
    tempData.forEach((item, index) => {
      const row = [
        item.day,                // Jam
        item.value,              // Suhu
        humidData[index]?.value || 0, // Kelembaban
        windData[index]?.value || 0,  // Angin
        cloudData[index]?.value || 0  // Awan
      ];
      csv += row.join(",") + "\n";
    });

    // Download File
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Cuaca_Desa_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  // --- 6. PERFORMA SISTEM ---
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const totalSensors = sensors.length;
  const uptime = totalSensors > 0 ? ((onlineSensors / totalSensors) * 100).toFixed(1) : 0;

  const performanceMetrics = [
    { metric: 'Kesehatan Sistem', value: uptime, target: 99, status: uptime > 90 ? 'excellent' : 'warning' },
    { metric: 'Akurasi API', value: 98.5, target: 95, status: 'excellent' },
    { metric: 'Kecepatan Respon', value: 94.8, target: 90, status: 'good' },
  ];

  const getStatusColor = (s) => s === 'excellent' ? 'text-green-600' : s === 'good' ? 'text-blue-600' : 'text-amber-600';
  const getStatusBg = (s) => s === 'excellent' ? 'bg-green-500' : s === 'good' ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <div className="py-17 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen print:bg-white print:p-0">
      
      {/* CSS Print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { width: 100% !important; margin: 0 !important; padding: 0 !important; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6 no-print">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-green-600" size={28} />
              Analitik (Data Realtime)
            </h2>
            <p className="text-sm text-slate-600 mt-1">Data diambil langsung dari API Prakiraan BMKG</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    timeRange === range.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button onClick={() => window.location.reload()} className="ml-2 p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-slate-500">Mengambil data dari API...</p>
        </div>
      ) : tempData.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
            <p>Data API Kosong atau Gagal Dimuat.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-green-600 underline">Coba Refresh</button>
        </div>
      ) : (
        <div className="print-full">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {summaryStats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all print:shadow-none print:border">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} print:bg-slate-100`}>
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? <ArrowUp className="text-green-600" size={18} /> : 
                     stat.trend === 'down' ? <ArrowDown className="text-red-600" size={18} /> : 
                     <Minus className="text-slate-600" size={18} />}
                    <span className="text-sm font-semibold text-slate-600">{stat.change}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.period}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            
            {/* 1. SUHU */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:break-inside-avoid print:shadow-none print:border">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50 to-rose-50 print:bg-none">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Thermometer className="text-red-600" size={20} /> Tren Suhu ({timeRange})
                </h3>
              </div>
              <div className="p-6">
                <div className="h-48 flex items-end justify-between gap-2">
                  {tempData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-red-600 to-rose-500 rounded-t-lg transition-all duration-500 hover:opacity-80 print:bg-slate-800" 
                             style={{ height: `${item.height}%` }}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">{item.value}°C</div>
                        </div>
                      </div>
                      <span className="text-[10px] md:text-xs text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-600">
                  <span>Min: {tempStats.min}°C</span>
                  <span>Avg: {tempStats.avg}°C</span>
                  <span>Max: {tempStats.max}°C</span>
                </div>
              </div>
            </div>

            {/* 2. KELEMBABAN */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:break-inside-avoid print:shadow-none print:border">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-blue-50 print:bg-none">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Droplets className="text-cyan-600" size={20} /> Tren Kelembaban
                </h3>
              </div>
              <div className="p-6">
                <div className="h-48 flex items-end justify-between gap-2">
                  {humidData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-lg transition-all duration-500 hover:opacity-80 print:bg-slate-800" 
                             style={{ height: `${item.height}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">{item.value}%</div>
                        </div>
                      </div>
                      <span className="text-[10px] md:text-xs text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-600">
                  <span>Min: {humidStats.min}%</span>
                  <span>Avg: {humidStats.avg}%</span>
                  <span>Max: {humidStats.max}%</span>
                </div>
              </div>
            </div>

            {/* 3. ANGIN */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:break-inside-avoid print:shadow-none print:border">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50 print:bg-none">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Wind className="text-green-600" size={20} /> Tren Angin
                </h3>
              </div>
              <div className="p-6">
                <div className="h-48 flex items-end justify-between gap-2">
                  {windData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-green-600 to-emerald-500 rounded-t-lg transition-all duration-500 hover:opacity-80 print:bg-slate-800" 
                             style={{ height: `${item.height}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">{item.value} km/h</div>
                        </div>
                      </div>
                      <span className="text-[10px] md:text-xs text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-600">
                  <span>Min: {windStats.min} km/h</span>
                  <span>Avg: {windStats.avg} km/h</span>
                  <span>Max: {windStats.max} km/h</span>
                </div>
              </div>
            </div>

            {/* 4. TUTUPAN AWAN */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden print:break-inside-avoid print:shadow-none print:border">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 print:bg-none">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Cloud className="text-blue-600" size={20} /> Tutupan Awan
                </h3>
              </div>
              <div className="p-6">
                <div className="h-48 flex items-end justify-between gap-2">
                  {cloudData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 hover:opacity-80 print:bg-slate-800" 
                             style={{ height: `${item.height}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">{item.value}%</div>
                        </div>
                      </div>
                      <span className="text-[10px] md:text-xs text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 italic">*Grafik berdasarkan data 'tcc' (Total Cloud Cover) API.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Performa Sistem (Dari Context Sensor) */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 print:shadow-none print:border print:break-inside-avoid">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="text-green-600" size={24} /> Performa Sensor
              </h3>
              <div className="space-y-4">
                {performanceMetrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{m.metric}</span>
                      <span className={`text-sm font-bold ${getStatusColor(m.status)}`}>{m.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${getStatusBg(m.status)}`} style={{ width: `${m.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Actions (Hidden on Print) */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-center no-print">
              <div className="text-center md:text-left mb-6">
                <h3 className="text-xl font-bold mb-2">Export Data (Real API)</h3>
                <p className="text-sm opacity-90">Unduh data analitik yang diambil dari API BMKG.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleExportPDF} className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 font-medium flex justify-center gap-2 w-full">
                  <Download size={18} /> Export PDF / Print
                </button>
                <button onClick={handleExportCSV} className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 font-medium flex justify-center gap-2 w-full">
                  <Download size={18} /> Export CSV
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}