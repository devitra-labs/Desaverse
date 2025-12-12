import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  Grid
} from '@react-three/drei';
// Menambahkan ikon Layers dan Info untuk tombol toggle di mobile
import { Map, Home, Leaf, Zap, RefreshCw, Maximize2, Minimize2, Layers, Info } from 'lucide-react';

// --- KOMPONEN 3D SCENE (TIDAK DIUBAH SAMA SEKALI) ---
function VillageScene() {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05; 
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[15, 20, 10]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-15, 10, -10]} intensity={1.2} color="#10b981" />
      <Grid position={[0, -0.01, 0]} args={[50, 50]} cellColor="#86efac" sectionColor="#22c55e" fadeDistance={50} cellSize={1} sectionSize={5} />

      {/* Area Pemukiman */}
      <group position={[-8, 0, -5]}>
        <mesh position={[0, 0.75, 0]} castShadow><boxGeometry args={[2, 1.5, 2]} /><meshStandardMaterial color="#3b82f6" /></mesh>
        <mesh position={[0, 1.8, 0]} castShadow><coneGeometry args={[1.5, 1, 4]} /><meshStandardMaterial color="#dc2626" /></mesh>
        <mesh position={[3.5, 0.75, 1]} castShadow><boxGeometry args={[1.8, 1.5, 1.8]} /><meshStandardMaterial color="#3b82f6" /></mesh>
        <mesh position={[3.5, 1.8, 1]} castShadow><coneGeometry args={[1.4, 1, 4]} /><meshStandardMaterial color="#dc2626" /></mesh>
        <mesh position={[1.5, 0.75, -2.5]} castShadow><boxGeometry args={[2, 1.5, 2]} /><meshStandardMaterial color="#3b82f6" /></mesh>
        <mesh position={[1.5, 1.8, -2.5]} castShadow><coneGeometry args={[1.5, 1, 4]} /><meshStandardMaterial color="#dc2626" /></mesh>
      </group>

      {/* Area Pertanian */}
      <group position={[8, 0, 5]}>
        <mesh position={[0, 0.1, 0]} receiveShadow><boxGeometry args={[6, 0.2, 4]} /><meshStandardMaterial color="#22c55e" /></mesh>
        <mesh position={[0, 0.1, -5]} receiveShadow><boxGeometry args={[6, 0.2, 4]} /><meshStandardMaterial color="#16a34a" /></mesh>
        <mesh position={[-7, 0.1, 0]} receiveShadow><boxGeometry args={[5, 0.2, 4]} /><meshStandardMaterial color="#22c55e" /></mesh>
      </group>

      {/* Sensor Floating */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[5, 2.5, 0]}><sphereGeometry args={[0.4, 32, 32]} /><meshStandardMaterial color="#f59e0b" emissive="#f59e0b" /></mesh>
        <pointLight position={[5, 2.5, 0]} intensity={2} distance={5} color="#f59e0b" />
      </Float>
      
      {/* Landmark */}
      <mesh position={[0, 2, 0]} castShadow><cylinderGeometry args={[0.5, 0.8, 4, 32]} /><meshStandardMaterial color="#8b5cf6" /></mesh>
      <mesh position={[0, 4.5, 0]} castShadow><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" /></mesh>

      <Environment preset="sunset" />
    </group>
  );
} 

// --- KOMPONEN UTAMA MAP 3D ---
export default function Map3D() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLegend, setShowLegend] = useState(true); // State untuk mobile legend
  const controlsRef = useRef();

  // FIX: Menambahkan kembali fungsi toggleFullscreen yang hilang
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    // Responsive Padding: p-4 di HP, p-8 di Desktop
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 p-0' : 'p-4 md:p-8'}`}>
      
      {/* 3D Map Section */}
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col ${isFullscreen ? 'h-full rounded-none border-none' : ''}`}>
        
        {/* Header Peta (Disembunyikan saat Fullscreen) */}
        {!isFullscreen && (
          <div className="p-4 md:p-6 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Map className="text-green-600" size={24} />
                  Peta Digital Twin 3D
                </h2>
                <p className="text-xs md:text-sm text-slate-600 mt-1">Eksplorasi peta desa dalam 3 dimensi.</p>
              </div>
              
              {/* Stats Mini - Responsive Grid */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="bg-white px-3 py-2 md:px-4 md:py-2 rounded-lg border border-slate-200">
                  <p className="text-[10px] md:text-xs text-slate-500">Area</p>
                  <p className="text-sm md:text-lg font-bold text-slate-800">3,30 km²</p>
                </div>
                <div className="bg-white px-3 py-2 md:px-4 md:py-2 rounded-lg border border-slate-200">
                  <p className="text-[10px] md:text-xs text-slate-500">Sensor</p>
                  <p className="text-sm md:text-lg font-bold text-green-600">24/24</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Canvas Wrapper - Responsive Height */}
        {/* Mobile: 400px, Desktop: 600px, Fullscreen: Flex-1 */}
        <div className={`relative w-full ${isFullscreen ? 'flex-1' : 'h-[400px] md:h-[600px]'}`}>
          <Canvas shadows camera={{ position: [15, 12, 15], fov: 50 }}>
            <color attach="background" args={['#f0fdf4']} /> 
            <fog attach="fog" args={['#dcfce7', 20, 60]} />
            <VillageScene />
            <OrbitControls 
              ref={controlsRef}
              makeDefault 
              autoRotate={autoRotate}
              autoRotateSpeed={0.3}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2.1}
              maxDistance={40}
              minDistance={8}
            />
          </Canvas>

          {/* --- OVERLAYS (RESPONSIVE) --- */}

          {/* Control Panel - Kanan Atas */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-2 md:p-4 space-y-2">
                {/* Reset Button */}
                <button 
                  onClick={handleReset}
                  className="w-full p-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  title="Reset View"
                >
                  <RefreshCw size={16} />
                  {/* Teks hanya muncul di Desktop (md:inline) */}
                  <span className="hidden md:inline">Reset View</span>
                </button>

                {/* Rotate Button */}
                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`w-full p-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                    autoRotate ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}
                  title="Auto Rotate"
                >
                  <Zap size={16} className={autoRotate ? 'fill-current' : ''} />
                  <span className="hidden md:inline">{autoRotate ? 'Stop Rotate' : 'Auto Rotate'}</span>
                </button>

                {/* Fullscreen Button */}
                <button 
                  onClick={toggleFullscreen}
                  className="w-full p-2 md:px-4 md:py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                </button>

                {/* Toggle Legend (Mobile Only) */}
                <button 
                  onClick={() => setShowLegend(!showLegend)}
                  className="md:hidden w-full p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                >
                  <Layers size={16} />
                </button>
            </div>
          </div>

          {/* Legend - Kiri Bawah (Bisa di-toggle di Mobile) */}
          <div className={`absolute bottom-6 left-6 max-w-[200px] transition-all duration-300 transform ${showLegend ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto'}`}>
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-lg border border-slate-200 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-slate-500">LEGENDA</p>
                {/* Tombol close kecil untuk mobile */}
                <button onClick={() => setShowLegend(false)} className="md:hidden text-slate-400"><Layers size={14}/></button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3"><div className="w-5 h-5 bg-blue-500 rounded shadow-sm"></div><span className="text-sm text-slate-700">Pemukiman</span></div>
                <div className="flex items-center gap-3"><div className="w-5 h-5 bg-green-500 rounded shadow-sm"></div><span className="text-sm text-slate-700">Pertanian</span></div>
                <div className="flex items-center gap-3"><div className="w-5 h-5 bg-purple-500 rounded-full shadow-sm"></div><span className="text-sm text-slate-700">Landmark</span></div>
              </div>
            </div>
          </div>

          {/* Info Panel - Tengah Bawah (Disembunyikan di Mobile jika sempit) */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg border border-slate-200 w-max max-w-[90%]">
            <p className="text-xs md:text-sm text-slate-600 flex items-center gap-2 truncate">
              <Map className="text-green-600 flex-shrink-0" size={16} />
              <span className="font-medium">Desa Pujon Kidul</span>
              <span className="hidden md:inline text-slate-400">•</span>
              <span className="hidden md:inline">Real-time Monitoring</span>
            </p>
          </div>

          {/* Instructions - Kiri Atas */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-xl shadow-lg border border-slate-200">
               <div className="flex items-center gap-2 md:block">
                  <Info className="text-green-600 md:hidden" size={20} />
                  <div className="hidden md:block space-y-1">
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Zap className="text-green-600" size={14} /> Kontrol
                    </p>
                    <p className="text-[10px] text-slate-500">🖱️ Drag Putar • Scroll Zoom</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Cards - RESPONSIVE GRID */}
      {/* Mengubah grid-cols-3 menjadi grid-cols-1 di mobile */}
      {!isFullscreen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
          <StatCard icon={Home} color="blue" label="Total Bangunan" value="1.250" />
          <StatCard icon={Leaf} color="green" label="Lahan Hijau" value="3,04 km²" />
          <StatCard icon={Zap} color="amber" label="Data Points" value="1,247" />
        </div>
      )}

    </div>
  );
}

// Komponen Helper agar kode lebih rapi
function StatCard({ icon: Icon, color, label, value }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
  };
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-slate-100">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}