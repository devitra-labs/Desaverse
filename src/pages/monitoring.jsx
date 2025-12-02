import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cloud, 
  Droplets, 
  Wind, 
  Zap, 
  Thermometer,
  Gauge,
  CloudRain,
  Sun,
  Eye,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function Monitoring() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const weatherData = [
    { 
      icon: Thermometer, 
      label: 'Suhu', 
      value: '28°C', 
      min: '24°C',
      max: '32°C',
      color: 'text-red-600', 
      bgColor: 'from-red-100 to-red-200',
      progress: 70,
      trend: 'up',
      change: '+2°C'
    },
    { 
      icon: Droplets, 
      label: 'Kelembaban', 
      value: '75%', 
      min: '60%',
      max: '90%',
      color: 'text-cyan-600', 
      bgColor: 'from-cyan-100 to-cyan-200',
      progress: 75,
      trend: 'down',
      change: '-3%'
    },
    { 
      icon: Wind, 
      label: 'Kecepatan Angin', 
      value: '12 km/h', 
      min: '5 km/h',
      max: '25 km/h',
      color: 'text-green-600', 
      bgColor: 'from-green-100 to-green-200',
      progress: 48,
      trend: 'up',
      change: '+4 km/h'
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
      trend: 'stable',
      change: '0 hPa'
    },
    { 
      icon: Sun, 
      label: 'Intensitas Cahaya', 
      value: '850 lux', 
      min: '0 lux',
      max: '1000 lux',
      color: 'text-amber-600', 
      bgColor: 'from-amber-100 to-amber-200',
      progress: 85,
      trend: 'up',
      change: '+120 lux'
    },
    { 
      icon: Eye, 
      label: 'Visibilitas', 
      value: '8.5 km', 
      min: '2 km',
      max: '10 km',
      color: 'text-blue-600', 
      bgColor: 'from-blue-100 to-blue-200',
      progress: 85,
      trend: 'stable',
      change: '0 km'
    },
  ];

  const sensors = [
    { 
      id: 'TEMP-01', 
      name: 'Sensor Suhu Utara', 
      status: 'online', 
      lastUpdate: '30 detik lalu',
      location: 'Area Pemukiman A',
      battery: 95,
      signal: 'excellent'
    },
    { 
      id: 'HUMI-01', 
      name: 'Sensor Kelembaban Pusat', 
      status: 'online', 
      lastUpdate: '45 detik lalu',
      location: 'Area Pertanian B',
      battery: 87,
      signal: 'good'
    },
    { 
      id: 'WIND-01', 
      name: 'Sensor Angin Selatan', 
      status: 'online', 
      lastUpdate: '1 menit lalu',
      location: 'Area Terbuka C',
      battery: 92,
      signal: 'excellent'
    },
    { 
      id: 'RAIN-01', 
      name: 'Sensor Hujan Barat', 
      status: 'online', 
      lastUpdate: '2 menit lalu',
      location: 'Area Sawah D',
      battery: 78,
      signal: 'good'
    },
    { 
      id: 'PRES-01', 
      name: 'Sensor Tekanan Timur', 
      status: 'warning', 
      lastUpdate: '5 menit lalu',
      location: 'Area Perkebunan E',
      battery: 45,
      signal: 'fair'
    },
    { 
      id: 'LIGHT-01', 
      name: 'Sensor Cahaya Tengah', 
      status: 'online', 
      lastUpdate: '20 detik lalu',
      location: 'Area Pusat Desa',
      battery: 100,
      signal: 'excellent'
    },
  ];

  const activities = [
    { time: time.toLocaleTimeString(), event: 'Sensor suhu mendeteksi perubahan +2°C', type: 'info', sensor: 'TEMP-01' },
    { time: new Date(time.getTime() - 2 * 60000).toLocaleTimeString(), event: 'Data kelembaban terupdate: 75%', type: 'success', sensor: 'HUMI-01' },
    { time: new Date(time.getTime() - 5 * 60000).toLocaleTimeString(), event: 'Kecepatan angin meningkat: 12 km/h', type: 'warning', sensor: 'WIND-01' },
    { time: new Date(time.getTime() - 8 * 60000).toLocaleTimeString(), event: 'Battery sensor PRES-01 di bawah 50%', type: 'warning', sensor: 'PRES-01' },
    { time: new Date(time.getTime() - 12 * 60000).toLocaleTimeString(), event: 'Sistem backup data berhasil', type: 'success', sensor: 'SYSTEM' },
    { time: new Date(time.getTime() - 15 * 60000).toLocaleTimeString(), event: 'Visibilitas meningkat: 8.5 km', type: 'info', sensor: 'LIGHT-01' },
  ];

  const getSignalIcon = (signal) => {
    const bars = signal === 'excellent' ? 4 : signal === 'good' ? 3 : 2;
    return (
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 ${bar <= bars ? 'bg-green-500' : 'bg-slate-300'}`}
            style={{ height: `${bar * 3}px` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-green-600" size={28} />
              Monitoring Real-time
            </h2>
            <p className="text-sm text-slate-600 mt-1">Pantau kondisi lingkungan desa secara langsung</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Waktu Update Terakhir</p>
            <p className="text-xl font-bold text-slate-800">{time.toLocaleTimeString()}</p>
            <p className="text-xs text-slate-500">{time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Weather Parameters Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {weatherData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.bgColor}`}>
                <item.icon className={item.color} size={28} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1">
                {item.trend === 'up' && <TrendingUp className="text-green-600" size={16} />}
                {item.trend === 'down' && <TrendingDown className="text-red-600" size={16} />}
                <span className={`text-xs font-semibold ${
                  item.trend === 'up' ? 'text-green-600' : 
                  item.trend === 'down' ? 'text-red-600' : 
                  'text-slate-500'
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 mb-1">{item.label}</p>
            <p className="text-3xl font-bold text-slate-800 mb-3">{item.value}</p>
            
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${item.bgColor} transition-all duration-500`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>Min: {item.min}</span>
              <span>Max: {item.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Sensor Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="text-amber-600" size={22} />
            Status Sensor IoT
          </h3>
          <div className="space-y-3">
            {sensors.map((sensor, idx) => (
              <div key={idx} className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-100 hover:border-green-200 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      sensor.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{sensor.name}</p>
                      <p className="text-xs text-slate-500">ID: {sensor.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSignalIcon(sensor.signal)}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sensor.status === 'online' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {sensor.status === 'online' ? 'Online' : 'Warning'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    📍 {sensor.location}
                  </span>
                  <span>{sensor.lastUpdate}</span>
                </div>
                
                {/* Battery Indicator */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Battery</span>
                    <span className={`font-semibold ${
                      sensor.battery > 80 ? 'text-green-600' :
                      sensor.battery > 50 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {sensor.battery}%
                    </span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        sensor.battery > 80 ? 'bg-green-500' :
                        sensor.battery > 50 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${sensor.battery}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" size={22} />
            Aktivitas Terkini
          </h3>
          
          {/* Activity Timeline */}
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex gap-3 group">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  {idx !== activities.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 mt-1" />
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm text-slate-700 font-medium">{activity.event}</p>
                      {activity.type === 'success' && <CheckCircle className="text-green-600" size={16} />}
                      {activity.type === 'warning' && <AlertCircle className="text-amber-600" size={16} />}
                      {activity.type === 'info' && <Activity className="text-blue-600" size={16} />}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span className="px-2 py-1 bg-white rounded text-slate-600 font-mono">{activity.sensor}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} />
            <span className="text-sm opacity-90">Status</span>
          </div>
          <p className="text-3xl font-bold">Online</p>
          <p className="text-sm opacity-90 mt-1">5 dari 6 sensor aktif</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity size={24} />
            <span className="text-sm opacity-90">Data Points</span>
          </div>
          <p className="text-3xl font-bold">1,247</p>
          <p className="text-sm opacity-90 mt-1">Dikumpulkan hari ini</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Zap size={24} />
            <span className="text-sm opacity-90">Uptime</span>
          </div>
          <p className="text-3xl font-bold">99.8%</p>
          <p className="text-sm opacity-90 mt-1">30 hari terakhir</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} />
            <span className="text-sm opacity-90">Peringatan</span>
          </div>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm opacity-90 mt-1">Memerlukan perhatian</p>
        </div>
      </div>

    </div>
  );
}