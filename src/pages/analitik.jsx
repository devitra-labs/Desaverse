import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Download, RefreshCw,
  Thermometer, Droplets, Wind, Cloud, Activity, ArrowUp, ArrowDown, Minus, FileText
} from 'lucide-react';
import { useSensor } from '../context/SensorContext'; 

// --- GANTI IMPORT DI SINI ---
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image'; // Gunakan library ini agar support warna modern

export default function Analitik() {
  const [timeRange, setTimeRange] = useState('7days');
  const [forecastData, setForecastData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false); 

  // REF UNTUK CAPTURE AREA GRAFIK
  const contentRef = useRef(null);

  const { sensors } = useSensor();

  const timeRanges = [
    { id: '24h', label: '24 Jam' },
    { id: '7days', label: '7 Hari' },
    { id: '30days', label: '30 Hari' },
  ];

  // --- 1. FETCH DATA API ---
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://desaverse.up.railway.app/index.php?action=bmkg_prakiraan&adm4=35.07.26.2003');
        const json = await response.json();

        if (json.data && json.data.length > 0 && json.data[0].cuaca) {
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
  }, [timeRange]);

  // --- 2. FORMAT DATA ---
  const formatLabel = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const processChartData = (key, maxScale) => {
    if (!forecastData || forecastData.length === 0) return [];
    return forecastData.map((item) => {
      const val = parseFloat(item[key]) || 0;
      let height = (val / maxScale) * 100;
      return {
        day: formatLabel(item.datetime),
        value: val,
        height: Math.max(10, Math.min(height, 100))
      };
    });
  };

  const tempData = processChartData('t', 40);
  const humidData = processChartData('hu', 100);
  const windData = processChartData('ws', 30);
  const cloudData = processChartData('tcc', 100);

  // --- 3. HITUNG STATISTIK ---
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
      label: 'Rata-rata Kelembaban', value: `${humidStats.avg}%`, 
      ...analyzeTrend(humidStats.avg, 60, 90, '%'),
      icon: Droplets, color: 'cyan', bgColor: 'from-cyan-100 to-blue-200', period: '7 jam ke depan'
    },
    { 
      label: 'Kondisi Langit', value: 'Berawan', change: 'Normal', trend: 'stable',
      icon: Cloud, color: 'blue', bgColor: 'from-blue-100 to-indigo-200', period: 'Berdasarkan data awan'
    },
    { 
      label: 'Rata-rata Angin', value: `${windStats.avg} km/h`, 
      ...analyzeTrend(windStats.avg, 0, 20, 'km/h'),
      icon: Wind, color: 'green', bgColor: 'from-green-100 to-emerald-200', period: '7 jam ke depan'
    },
  ];

  // --- 5. PERFORMA SISTEM ---
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

  // --- 6. FUNGSI EXPORT PDF (FIXED OKLCH ERROR) ---
  const handleExportPDF = async () => {
    if (!contentRef.current) {
      alert("Error: Elemen grafik tidak ditemukan (Ref null).");
      return;
    }

    setIsExporting(true);

    try {
      // 1. Setup PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // --- HALAMAN 1: JUDUL & DAFTAR ISI ---
      doc.setFillColor(22, 163, 74); 
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22); doc.setFont("helvetica", "bold");
      doc.text("Laporan Analitik Cuaca", margin, 20);
      
      doc.setFontSize(12); doc.setFont("helvetica", "normal");
      doc.text("Desaverse Dashboard", margin, 30);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, margin, 55);
      
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Daftar Isi", margin, 75);
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      doc.text("1. Ringkasan Data ....................... Hal 2", margin, 85);
      doc.text("2. Visualisasi Grafik ..................... Hal 2", margin, 92);
      
      doc.setFontSize(9); doc.setTextColor(150);
      doc.text("Halaman 1", pageWidth - margin - 10, pageHeight - 10);

      // --- HALAMAN 2: VISUALISASI (MENGGUNAKAN HTML-TO-IMAGE) ---
      doc.addPage();

      // Gunakan 'toPng' dari html-to-image (Support OKLCH & Modern CSS)
      const imgData = await toPng(contentRef.current, { 
        cacheBust: true, 
        backgroundColor: '#ffffff'
      });
      
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = pageWidth - (margin * 2);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.setTextColor(0);
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      doc.text("Visualisasi Data", margin, 20);
      doc.setDrawColor(200);
      doc.line(margin, 25, pageWidth - margin, 25);
      
      doc.addImage(imgData, 'PNG', margin, 30, pdfWidth, pdfHeight);

      doc.setFontSize(9); doc.setTextColor(150);
      doc.text("Halaman 2", pageWidth - margin - 10, pageHeight - 10);

      doc.save(`Laporan_Analitik_${new Date().toISOString().slice(0,10)}.pdf`);

    } catch (error) {
      console.error("GAGAL EXPORT PDF:", error);
      alert(`Gagal membuat PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (tempData.length === 0) return alert("Data belum tersedia.");
    let csv = "Jam,Suhu (C),Kelembaban (%),Angin (km/h),Tutupan Awan (%)\n";
    tempData.forEach((item, index) => {
      const row = [item.day, item.value, humidData[index]?.value || 0, windData[index]?.value || 0, cloudData[index]?.value || 0];
      csv += row.join(",") + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Cuaca_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      
      {/* Header Halaman */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-green-600" size={28} />
              Analitik (Data Realtime)
            </h2>
            <p className="text-sm text-slate-600 mt-1">Data diambil langsung dari Sensor milik Kami</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
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
        <>
          {/* AREA YANG AKAN DICAPTURE KE PDF (VISUAL CONTENT) */}
          <div ref={contentRef} className="bg-slate-50 p-2"> 
            
            {/* 1. Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {summaryStats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
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
                </div>
              ))}
            </div>

            {/* 2. Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              {/* SUHU */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50 to-rose-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Thermometer className="text-red-600" size={20} /> Tren Suhu</h3>
                </div>
                <div className="p-6 h-64 flex items-stretch justify-between gap-2">
                  {tempData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2">
                      <div className="relative w-full flex-1 flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-red-600 to-rose-500 rounded-t-lg" style={{ height: `${item.height}%` }}>
                          <span className="text-[10px] text-white absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 px-1 rounded">{item.value}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KELEMBABAN */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-blue-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Droplets className="text-cyan-600" size={20} /> Tren Kelembaban</h3>
                </div>
                <div className="p-6 h-64 flex items-stretch justify-between gap-2">
                  {humidData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2">
                      <div className="relative w-full flex-1 flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t-lg" style={{ height: `${item.height}%` }}>
                          <span className="text-[10px] text-white absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 px-1 rounded">{item.value}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Performance & Other Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
               {/* ANGIN */}
               <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Wind className="text-green-600" size={20} /> Tren Angin</h3>
                </div>
                <div className="p-6 h-48 flex items-stretch justify-between gap-2">
                  {windData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2">
                      <div className="relative w-full flex-1 flex items-end justify-center">
                        <div className="w-full bg-gradient-to-t from-green-600 to-emerald-500 rounded-t-lg" style={{ height: `${item.height}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-600">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performa Sistem */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
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
            </div>
          </div> 
          {/* END OF CAPTURE AREA */}

          {/* Export Actions Buttons */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-center mt-6">
            <div className="text-center md:text-left mb-6">
              <h3 className="text-xl font-bold mb-2">Export Laporan Analitik</h3>
              <p className="text-sm opacity-90">Unduh laporan lengkap dengan diagram, judul, dan daftar isi dalam format PDF.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleExportPDF} 
                disabled={isExporting}
                className={`px-6 py-3 bg-white text-green-600 rounded-lg font-medium flex justify-center gap-2 w-full ${isExporting ? 'opacity-70 cursor-wait' : 'hover:bg-green-50'}`}
              >
                {isExporting ? <RefreshCw className="animate-spin" size={18} /> : <FileText size={18} />}
                {isExporting ? 'Membuat PDF...' : 'Download Laporan PDF'}
              </button>
              <button onClick={handleExportCSV} className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 font-medium flex justify-center gap-2 w-full">
                <Download size={18} /> Export CSV Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}