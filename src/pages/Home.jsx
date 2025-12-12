import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  Grid
} from '@react-three/drei';
import { Cloud, Droplets, Wind, Activity, Bell, Zap, Play, AlertTriangle, X } from 'lucide-react';

// --- KOMPONEN 3D SCENE (Tidak berubah) ---
function VillageScene() {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
       groupRef.current.rotation.y += delta * 0.1; 
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#10b981" />
      <Grid position={[0, -0.5, 0]} args={[20, 20]} cellColor="#86efac" sectionColor="#22c55e" fadeDistance={30} />
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ec4899" metalness={0.3} roughness={0.4} />
      </mesh>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[4, 1.5, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[-4, 1.5, 0]}>
           <torusGeometry args={[0.7, 0.3, 16, 100]} />
           <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
        </mesh>
      </Float>
      <Environment preset="city" />
    </group>
  );
} 

// --- KOMPONEN UTAMA HOME ---
export default function Home() {
  const [mobileMapActive, setMobileMapActive] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // State untuk menyimpan data cuaca
  const [apiWeather, setApiWeather] = useState({
    t: '-',   
    hu: '-',  
    ws: '-'   
  });

  // --- PERBAIKAN LOGIKA FETCH DATA ---
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('https://desaverse.up.railway.app/index.php?action=bmkg_prakiraan&adm4=35.07.26.2003');
        const json = await response.json();
        
        // Debugging: Cek data di console browser
        console.log("Response API:", json);

        // Validasi struktur data sebelum mengambil nilai
        if (json.data && json.data.length > 0 && json.data[0].cuaca) {
          
          // Kita gunakan .flat() untuk menjadikannya satu list panjang,
          // lalu ambil index [0] untuk mendapatkan data cuaca terdekat/terbaru.
          const allForecasts = json.data[0].cuaca.flat();
          const currentData = allForecasts[0];

          if (currentData) {
            setApiWeather({
              t: currentData.t,    // Suhu
              hu: currentData.hu,  // Kelembaban
              ws: currentData.ws   // Kecepatan Angin
            });
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
      }
    };

    fetchWeatherData();
  }, []);

  const weatherData = [
    { 
      icon: Cloud, 
      label: 'Suhu', 
      value: `${apiWeather.t}°C`, 
      color: 'text-blue-600', 
      bgColor: 'from-blue-100 to-blue-200' 
    },
    { 
      icon: Droplets, 
      label: 'Kelembaban', 
      value: `${apiWeather.hu}%`, 
      color: 'text-cyan-600', 
      bgColor: 'from-cyan-100 to-cyan-200' 
    },
    { 
      icon: Wind, 
      label: 'Angin', 
      value: `${apiWeather.ws} km/h`, 
      color: 'text-green-600', 
      bgColor: 'from-green-100 to-green-200' 
    },
  ];

  const monitoringStats = [
    { label: 'Sensor Aktif', value: '24/24', status: 'online', color: 'green' },
    { label: 'Area Terpantau', value: '3,30 km²', status: 'normal', color: 'blue' },
    { label: 'Populasi', value: '4.449', status: 'stable', color: 'purple' },
    { label: 'Peringatan Aktif', value: '2', status: 'warning', color: 'amber' },
  ];

  const alerts = [
    { type: 'info', message: 'Sistem berjalan normal', time: '5 menit lalu', icon: Activity },
    { type: 'warning', message: 'Potensi hujan sore ini', time: '15 menit lalu', icon: Cloud },
    { type: 'success', message: 'Data sensor terupdate', time: '1 menit lalu', icon: Zap },
  ];

  const getStatusColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      amber: 'bg-amber-100 text-amber-700'
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="py-17 flex-1 p-3 md:p-8 bg-slate-50 min-h-screen pb-24 md:pb-8 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
              Halo, Admin! 👋
            </h1>
            <p className="text-sm md:text-base text-slate-600 mt-1">
              Digital Twin <span className="font-semibold text-green-600">Desa Pujon Kidul</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200 w-full md:w-auto">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm font-semibold text-green-700">Sistem Online</span>
          </div>
        </div>
      </div>

      {/* WEATHER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
        {weatherData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-slate-500 mb-1">{item.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">{item.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br ${item.bgColor}`}>
              <item.icon className={item.color} size={24} strokeWidth={2} /> 
            </div>
          </div>
        ))}
      </div>

      {/* MONITORING STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
        {monitoringStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-green-200 transition-colors">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
              <p className="text-xs md:text-sm font-medium text-slate-500">{stat.label}</p>
              <span className={`self-start px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${getStatusColor(stat.color)}`}>
                {stat.status}
              </span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- 3D MAP SECTION --- */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 mb-4 md:mb-6 relative">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-base md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-green-600" size={20} />
              Peta 3D
            </h2>
          </div>
          {mobileMapActive && (
             <button 
               onClick={() => { setMobileMapActive(false); setShowAlert(true); }}
               className="md:hidden px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
             >
               Tutup
             </button>
          )}
        </div>
        
        <div className="relative w-full transition-all duration-300 ease-in-out">
          <div className={`${mobileMapActive ? 'h-[350px]' : 'h-[250px]'} md:h-[400px] bg-slate-100 w-full`}>
            
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center md:hidden bg-gradient-to-b from-white to-slate-50 ${mobileMapActive ? 'hidden' : 'flex'}`}>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <Activity className="text-green-600" size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Tampilkan Visualisasi 3D?</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-[220px] leading-relaxed">
                Mode ini membutuhkan performa lebih tinggi pada perangkat Anda.
              </p>
              <button 
                onClick={() => setMobileMapActive(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-green-700 active:scale-95 transition-all w-full max-w-[200px] justify-center"
              >
                <Play size={16} fill="currentColor" />
                Muat Peta
              </button>
            </div>

            <div className={`h-full w-full ${mobileMapActive ? 'block' : 'hidden md:block'}`}>
              <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
                <color attach="background" args={['#f0fdf4']} /> 
                <fog attach="fog" args={['#f0fdf4', 10, 40]} />
                <VillageScene />
                <OrbitControls 
                  makeDefault 
                  autoRotate 
                  autoRotateSpeed={0.5}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 2.2}
                  maxDistance={25}
                  minDistance={5}
                />
              </Canvas>

              {mobileMapActive && showAlert && (
                <div className="absolute top-4 left-4 right-4 md:hidden z-30 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-amber-50/90 backdrop-blur-sm border border-amber-200 text-amber-800 p-3 rounded-xl shadow-lg flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">Mode Interaktif Aktif</p>
                      <p className="text-[10px] opacity-80 mt-0.5">
                        Gunakan 1 jari untuk putar, 2 jari untuk geser.
                      </p>
                    </div>
                    <button onClick={() => setShowAlert(false)} className="text-amber-500 hover:text-amber-700 p-1">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS SECTION */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="text-amber-500" size={20} />
          Notifikasi Terkini
        </h3>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`p-3 md:p-4 rounded-xl border-l-4 flex items-start gap-3 ${
              alert.type === 'warning' ? 'bg-amber-50 border-amber-500' : 
              alert.type === 'success' ? 'bg-green-50 border-green-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <alert.icon className={`flex-shrink-0 mt-0.5 ${
                alert.type === 'warning' ? 'text-amber-600' :
                alert.type === 'success' ? 'text-green-600' :
                'text-blue-600'
              }`} size={18} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800 leading-snug">{alert.message}</p>
                <p className="text-[10px] md:text-xs text-slate-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}