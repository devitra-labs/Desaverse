import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  Wind, 
  Zap, 
  Thermometer,
  Gauge,
  Sun,
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// 1. IMPORT HOOK DARI CONTEXT
import { useSensor } from '../context/SensorContext'; 

export default function Monitoring() {
  // 2. AMBIL DATA DARI PUSAT (CONTEXT)
  const { sensors, recentLogs, addLog } = useSensor(); 

  const [time, setTime] = useState(new Date());
  
  // State lokal untuk Cuaca
  const [apiWeather, setApiWeather] = useState({
    t: '-',   
    hu: '-',  
    ws: '-',
    vs_text: '-',
    tcc: '-'
  });

  // --- 3. HELPER FUNCTIONS ---

  // A. Progress Bar (Logika Visual Bar)
  const calculateProgress = (value, maxScale) => {
    if (!value || value === '-') return 0;
    const cleanString = value.toString().replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanString);
    if (isNaN(num)) return 0; 
    const percentage = (num / maxScale) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  // B. Trend Analyzer (LOGIKA BARU: Bandingkan Nilai vs Min/Max)
  const analyzeTrend = (currentVal, min, max, unit) => {
    // 1. Bersihkan angka dari string (misal "24°C" -> 24)
    const parse = (v) => parseFloat(v?.toString().replace(/[^0-9.-]/g, '') || 0);

    const val = parse(currentVal);
    
    // Jika data API belum ada ('-'), kembalikan default
    if (!currentVal || currentVal === '-') return { trend: 'stable', change: '-' };

    // 2. Logika Perbandingan
    // KASUS 1: Di bawah batas MIN (Trend DOWN)
    if (val < min) {
      const diff = (val - min).toFixed(1).replace('.0', '');
      return { trend: 'down', change: `${diff} ${unit}` }; // Contoh: -4 °C
    }
    
    // KASUS 2: Di atas batas MAX (Trend UP)
    if (val > max) {
      const diff = (val - max).toFixed(1).replace('.0', '');
      return { trend: 'up', change: `+${diff} ${unit}` }; // Contoh: +3 °C
    }

    // KASUS 3: Di tengah-tengah (STABLE)
    return { trend: 'stable', change: `0 ${unit}` };
  };

  // --- 4. FETCH DATA API CUACA ---
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('https://desaverse.up.railway.app/index.php?action=bmkg_prakiraan&adm4=35.07.26.2003');
        const json = await response.json();
        
        if (json.data && json.data.length > 0 && json.data[0].cuaca) {
          const allForecasts = json.data[0].cuaca.flat();
          const currentData = allForecasts[0];

          if (currentData) {
            setApiWeather({
              t: currentData.t,
              hu: currentData.hu,
              ws: currentData.ws,
              vs_text: currentData.vs_text,
              tcc: currentData.tcc
            });

            addLog({ 
              time: new Date().toLocaleTimeString(), 
              event: `Update Cuaca: Suhu ${currentData.t}°C, Angin ${currentData.ws} km/h`, 
              type: 'info', 
              sensor: 'Sensor System' 
            });
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
      }
    };

    fetchWeatherData(); 

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []); 


  // --- 5. DATA WEATHER UNTUK UI (Dengan Logika Trend Baru) ---
  const weatherData = [
    { 
      icon: Thermometer, 
      label: 'Suhu', 
      value: `${apiWeather.t}°C`, 
      min: '24°C', 
      max: '32°C', 
      color: 'text-red-600', 
      bgColor: 'from-red-100 to-red-200',
      progress: calculateProgress(apiWeather.t, 40), 
      // Logika: Jika < 24 (Down), > 32 (Up), else (Stable)
      ...analyzeTrend(apiWeather.t, 24, 32, '°C') 
    },
    { 
      icon: Droplets, 
      label: 'Kelembaban', 
      value: `${apiWeather.hu}%`, 
      min: '60%', 
      max: '90%', 
      color: 'text-cyan-600', 
      bgColor: 'from-cyan-100 to-cyan-200',
      progress: calculateProgress(apiWeather.hu, 100),
      ...analyzeTrend(apiWeather.hu, 60, 90, '%')
    },
    { 
      icon: Wind, 
      label: 'Kecepatan Angin', 
      value: `${apiWeather.ws} km/h`, 
      min: '0 km/h', 
      max: '20 km/h', // Anggap di atas 20km/h itu kencang (Up)
      color: 'text-green-600', 
      bgColor: 'from-green-100 to-green-200',
      progress: calculateProgress(apiWeather.ws, 40),
      ...analyzeTrend(apiWeather.ws, 0, 20, 'km/h')
    },
    { 
      icon: Gauge, 
      label: 'Tekanan Udara', 
      value: '1013 hPa', 
      min: '1000 hPa', 
      max: '1020 hPa', 
      color: 'text-purple-600', 
      bgColor: 'from-purple-100 to-purple-200',
      progress: 65, 
      // Analisa nilai statis
      ...analyzeTrend('1013', 1000, 1020, 'hPa')
    },
    { 
      icon: Sun, 
      label: 'Intensitas Cahaya', 
      value: `${apiWeather.tcc}%`, 
      min: '0 %', 
      max: '80 %', 
      color: 'text-amber-600', 
      bgColor: 'from-amber-100 to-amber-200',
      progress: calculateProgress(apiWeather.tcc, 100), 
      ...analyzeTrend(apiWeather.tcc, 0, 80, '%')
    },
    { 
      icon: Eye, 
      label: 'Visibilitas', 
      value: `${apiWeather.vs_text}`, 
      min: '2 km', 
      max: '9 km', // Jika > 9km (biasanya 10km), akan dianggap UP (Bagus)
      color: 'text-blue-600', 
      bgColor: 'from-blue-100 to-blue-200',
      progress: calculateProgress(apiWeather.vs_text, 12),
      ...analyzeTrend(apiWeather.vs_text, 2, 9, 'km')
    },
  ];

  const getSignalIcon = (signal) => {
    const bars = signal === 'excellent' ? 4 : signal === 'good' ? 3 : 2;
    return (
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div key={bar} className={`w-1 ${bar <= bars ? 'bg-green-500' : 'bg-slate-300'}`} style={{ height: `${bar * 3}px` }} />
        ))}
      </div>
    );
  };

  return (
    <div className="py-17 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-green-600" size={28} />
              Monitoring Real-time
            </h2>
            <p className="text-sm text-slate-600 mt-1">Pantau kondisi lingkungan desa secara langsung</p>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-sm text-slate-500">Waktu Update Terakhir</p>
            <p className="text-xl font-bold text-slate-800">{time.toLocaleTimeString()}</p>
            <p className="text-xs text-slate-500">{time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {weatherData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.bgColor}`}>
                <item.icon className={item.color} size={28} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1">
                {item.trend === 'up' && <TrendingUp className="text-green-600" size={16} />}
                {item.trend === 'down' && <TrendingDown className="text-red-600" size={16} />}
                <span className={`text-xs font-semibold ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                  {item.change}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{item.label}</p>
            <p className="text-3xl font-bold text-slate-800 mb-3">{item.value}</p>
            <div className="mb-2">
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full bg-gradient-to-r ${item.bgColor} transition-all duration-500`} style={{ width: `${item.progress}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Min: {item.min}</span>
              <span>Max: {item.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sensors & Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sensor Status List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="text-amber-600" size={22} />
            Status Sensor IoT
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {sensors.map((sensor, idx) => (
              <div key={idx} className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-100 hover:border-green-200 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${sensor.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{sensor.name}</p>
                      <p className="text-xs text-slate-500">ID: {sensor.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getSignalIcon(sensor.signal)}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sensor.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {sensor.status === 'online' ? 'Online' : 'Warn'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mt-3 gap-1">
                  <span className="flex items-center gap-1">📍 {sensor.location}</span>
                  <span>{sensor.lastUpdate}</span>
                </div>
                
                {/* Battery Indicator (Dynamic) */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Battery</span>
                    <span className={`font-semibold ${sensor.battery > 80 ? 'text-green-600' : sensor.battery > 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sensor.battery}%
                    </span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${sensor.battery > 80 ? 'bg-green-500' : sensor.battery > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sensor.battery}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed (Dynamic Logs) */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" size={22} />
            Aktivitas Terkini
          </h3>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="flex gap-3 group animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  
                  {idx !== recentLogs.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 mt-1" />
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <p className="text-sm text-slate-700 font-medium">{log.event}</p>
                      <div className="flex-shrink-0">
                        {log.type === 'success' && <CheckCircle className="text-green-600" size={16} />}
                        {log.type === 'warning' && <AlertCircle className="text-amber-600" size={16} />}
                        {log.type === 'info' && <Activity className="text-blue-600" size={16} />}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mt-2 gap-1">
                      <span className="px-2 py-1 bg-white rounded text-slate-600 font-mono w-fit">{log.sensor}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mt-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2"><CheckCircle size={24} /><span className="text-sm opacity-90">Status</span></div>
          <p className="text-3xl font-bold">Online</p>
          <p className="text-sm opacity-90 mt-1">Semua sistem normal</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2"><Activity size={24} /><span className="text-sm opacity-90">Data Points</span></div>
          <p className="text-3xl font-bold">1,247</p>
          <p className="text-sm opacity-90 mt-1">Dikumpulkan hari ini</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2"><Zap size={24} /><span className="text-sm opacity-90">Uptime</span></div>
          <p className="text-3xl font-bold">99.8%</p>
          <p className="text-sm opacity-90 mt-1">30 hari terakhir</p>
        </div>
        {/* Peringatan Baterai (Dinamis dari Context) */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} />
            <span className="text-sm opacity-90">Peringatan Baterai</span>
          </div>
          
          <p className="text-3xl font-bold">
            {sensors.filter(s => s.battery < 50).length}
          </p>
          
          <p className="text-sm opacity-90 mt-1">
            {sensors.filter(s => s.battery < 50).length > 0 
              ? 'Sensor Low Battery (< 50%)' 
              : 'Semua baterai aman'}
          </p>
        </div>
      </div>

    </div>
  );
}