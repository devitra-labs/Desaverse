import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { 
  Float, 
  Grid, 
  useGLTF, 
  Stage, 
  OrbitControls, 
  Html,
  useProgress,
  ContactShadows,
  // IMPORT BARU UNTUK DEKORASI
  Stars,
  Cloud,
  Sparkles
} from '@react-three/drei';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Activity,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

// --- KOMPONEN 1: LOADING INDICATOR ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white font-bold bg-green-800/80 px-4 py-2 rounded-lg backdrop-blur-md whitespace-nowrap">
        Memuat Peta... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// --- KOMPONEN 2: MODEL 3D ---
function ModelPujon() {
  const { scene } = useGLTF('/3dmap-pujon-v1.glb');
  return <primitive object={scene} />;
}

// Preload
useGLTF.preload('/3dmap-pujon.glb');

// --- KOMPONEN UTAMA: LOGIN PAGE ---
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  // --- LOGIC LOGIN (TETAP SAMA) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch("https://desaverse.up.railway.app/index.php?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Server Response (Not JSON):", text);
        throw new Error("Server memblokir akses API (CORS/Security Check). Cek Console.");
      }

      const result = await response.json(); 
      console.log('Response API:', result);

      if (response.ok && (result.status === 'success' || result.message === 'Login Berhasil.' || result.token)) {
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        navigate('/dashboard'); 
      } else {
        throw new Error(result.message || 'Email atau password salah.');
      }

    } catch (error) {
      console.error("Login Error:", error);
      if (error.message.includes("Unexpected token")) {
        setErrorMsg("Server Error: Menerima HTML bukan JSON.");
      } else {
        setErrorMsg(error.message || "Gagal terhubung ke server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Activity, text: 'Real-time Monitoring', color: 'text-green-400' },
    { icon: Shield, text: 'Secure & Protected', color: 'text-blue-400' },
    { icon: Zap, text: 'Fast Performance', color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* --- BAGIAN KIRI: 3D VISUALIZATION --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 to-emerald-900 relative overflow-hidden">
        
        {/* 3D Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 3, 5], fov: 50 }} gl={{ alpha: true }}>
            
            {/* --- DEKORASI LINGKUNGAN --- */}
            {/* 1. Bintang di Latar Belakang */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            {/* 2. Partikel Melayang (Efek Data/IoT) */}
            <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.4} color="#6ee7b7" />

            {/* 3. Awan Tipis (Posisi agak tinggi) */}
            <Cloud opacity={0.5} segments={20} bounds={[10, 2, 2]} volume={6} color="white" position={[0, 4, -5]} />

            {/* Pencahayaan */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#34d399" />

            <Suspense fallback={<Loader />}>
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                 <Stage environment="city" intensity={0.5} adjustCamera={1.2} shadows={false}>
                    <ModelPujon />
                 </Stage>
              </Float>
            </Suspense>

            {/* Grid Lantai */}
            <Grid 
              position={[0, -0.2, 0]}
              args={[100, 100]}
              cellSize={0.5}
              sectionSize={2.5}
              cellColor="#4ade80"
              sectionColor="#22c55e"
              fadeDistance={30}
              cellThickness={1.5}
              sectionThickness={2.5}
              infiniteGrid
            />

            {/* Bayangan halus */}
            <ContactShadows position={[0, -0.19, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#064e3b" />

            {/* Kontrol Kamera */}
            <OrbitControls autoRotate autoRotateSpeed={0.8} enableZoom={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
          </Canvas>
        </div>

        {/* Text Overlay Layer (Desain Tetap) */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full pointer-events-none">
          
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl">
                 <Activity className="text-white" size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-bold text-3xl tracking-tight text-white">Desaverse</h1>
                <p className="text-sm text-green-200">Digital Twin Desa</p>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-8 mb-10">
            <h2 className="text-4xl font-bold leading-tight drop-shadow-lg">
              Pantau Kondisi<br />Desa Anda Secara<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                Real-time
              </span>
            </h2>
            
            <div className="space-y-4 pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <feature.icon className={feature.color} size={24} />
                  </div>
                  <span className="font-medium text-lg text-green-50">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Copyright */}
          <div>
            <p className="text-green-300/60 text-sm">
              © 2025 Desaverse. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* --- BAGIAN KANAN: LOGIN FORM (TETAP SAMA) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-2xl lg:shadow-none">
          
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg">
              <Activity size={28} strokeWidth={2.5} />
            </div>
            <h1 className="font-bold text-2xl text-slate-800">Desaverse</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang! 👋</h2>
            <p className="text-slate-500">Masuk ke akun administrator Anda.</p>
          </div>
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 animate-pulse">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@desaverse.id"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm text-slate-600 font-medium">Ingat saya</span>
              </label>
              <button type="button" className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Masuk Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-green-600" />
              <span>Enkripsi SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-600" />
              <span>Sistem Terverifikasi</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}