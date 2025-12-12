import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Float, Environment, Grid } from '@react-three/drei';
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
  AlertCircle // Icon untuk pesan error
} from 'lucide-react';

// --- BAGIAN 1: KOMPONEN 3D SCENE ---
function LoginScene() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15; // Animasi rotasi pelan
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#10b981" />

      {/* Grid Lantai */}
      <Grid 
        position={[0, -0.5, 0]} 
        args={[20, 20]} 
        cellColor="#86efac" 
        sectionColor="#22c55e" 
        fadeDistance={25} 
      />

      {/* Objek Utama Tengah */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 3, 32]} />
        <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color="#34d399" 
          emissive="#10b981" 
          emissiveIntensity={0.4} 
          metalness={0.7} 
          roughness={0.2} 
        />
      </mesh>

      {/* Objek Melayang Kiri & Kanan */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[3, 2, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[-3, 2, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.3} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh position={[0, 3, -3]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>

      <Environment preset="sunset" />
    </group>
  );
}

// --- BAGIAN 2: HALAMAN UTAMA (LOGIC & UI) ---
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // State untuk error message
  
  const navigate = useNavigate();

  // --- LOGIC KONEKSI KE API (YANG SUDAH DIPERBAIKI) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. SIAPKAN DATA DALAM FORMAT FORM (Agar terbaca oleh $_POST PHP)
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      // 2. TEMBAK KE URL HOSTING ASLI (Bukan Localhost)
      // Ganti URL ini sesuai letak file index.php kamu di hosting
      const response = await fetch("https://desaverse.up.railway.app/index.php?action=login", {
        method: "POST",
        headers: {
          // Jangan pakai application/json, pakai ini:
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(), // Kirim sebagai string form
      });

      // 3. CEK APAKAH RESPONSENYA JSON ATAU HTML (PENTING!)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Jika server membalas dengan HTML (biasanya security check InfinityFree)
        const text = await response.text();
        console.error("Server Response (Not JSON):", text);
        throw new Error("Server memblokir akses API (CORS/Security Check). Cek Console.");
      }

      // 4. PARSE JSON
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
      // Tampilkan pesan error yang lebih jelas
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
    { icon: Activity, text: 'Real-time Monitoring', color: 'text-green-600' },
    { icon: Shield, text: 'Secure & Protected', color: 'text-blue-600' },
    { icon: Zap, text: 'Fast Performance', color: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen flex">
      
      {/* --- UI BAGIAN KIRI (3D & BRANDING) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <Canvas shadows camera={{ position: [8, 6, 8], fov: 45 }}>
            <color attach="background" args={['#059669']} />
            <fog attach="fog" args={['#047857', 10, 30]} />
            <LoginScene />
          </Canvas>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl transform rotate-12 shadow-lg"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-300 to-emerald-400 rounded-xl absolute top-0 left-0 transform -rotate-6 shadow-lg"></div>
                <div className="w-14 h-14 bg-white rounded-xl absolute top-0 left-0 flex items-center justify-center shadow-xl">
                  <Activity className="text-green-600" size={32} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-3xl tracking-tight">Desaverse</h1>
                <p className="text-sm text-green-200">Digital Twin Desa</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Pantau Kondisi<br />Desa Anda Secara<br />Real-time
            </h2>
            <p className="text-green-100 text-lg">
              Platform monitoring lingkungan berbasis IoT untuk pengelolaan desa yang lebih cerdas dan berkelanjutan.
            </p>

            <div className="space-y-4 pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="p-2 bg-white rounded-lg">
                    <feature.icon className={feature.color} size={24} />
                  </div>
                  <span className="font-medium text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-green-200 text-sm">
              © 2025 Desaverse. All rights reserved.
            </p>
          </div>
        </div>

        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* --- UI BAGIAN KANAN (FORM LOGIN) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          
          {/* Header Mobile Only */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl transform rotate-12 shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-emerald-400 rounded-xl absolute top-0 left-0 transform -rotate-6 shadow-lg"></div>
              <div className="w-12 h-12 bg-white rounded-xl absolute top-0 left-0 flex items-center justify-center shadow-xl">
                <Activity className="text-green-600" size={28} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-slate-800">Desaverse</h1>
              <p className="text-xs text-slate-500">Digital Twin Desa</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Selamat Datang! 👋
            </h2>
            <p className="text-slate-600">
              Masuk ke akun Anda untuk melanjutkan monitoring
            </p>
          </div>
          
          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-pulse">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@desaverse.id"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700">Ingat saya</span>
              </label>
              <button type="button" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                  
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-green-600" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-green-600" />
                <span>Verified System</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}