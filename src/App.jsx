import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import SideNav from './component/sidenav' 
import Home from './pages/Home'
import Map3D from './pages/Map3D'
import Monitoring from './pages/monitoring'
import Peringatan from './pages/peringatan'
import Analitik from './pages/analitik'
import SettingsPage from './pages/settings'
import LoginPage from './pages/login'
import { SensorProvider } from './context/SensorContext'; // Sesuaikan path

import './App.css'

// 1. MainLayout HANYA menangani halaman Dashboard (yang butuh Sidebar)
function MainLayout() {
  const [activeMenu, setActiveMenu] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    
    switch(menuId) {
      // Ubah 'home' agar mengarah ke /dashboard (bukan /)
      case 'home': navigate('/dashboard'); break; 
      case 'map': navigate('/map'); break;
      case 'monitoring': navigate('/monitoring'); break;
      case 'peringatan': navigate('/peringatan'); break;
      case 'analitik': navigate('/analitik'); break; 
      case 'settings': navigate('/settings'); break;
      // Case Login dihapus dari sini karena tombol logout ada logic sendiri/terpisah
      default: navigate('/dashboard');
    }
  };

  // Sinkronisasi URL dengan Active Menu
  useEffect(() => {
    const path = location.pathname;
    // Sesuaikan path home ke /dashboard
    if (path === '/dashboard') setActiveMenu('home');
    else if (path === '/map') setActiveMenu('map');
    else if (path === '/monitoring') setActiveMenu('monitoring');
    else if (path === '/peringatan') setActiveMenu('peringatan');
    else if (path === '/analitik') setActiveMenu('analitik');
    else if (path === '/settings') setActiveMenu('settings');
  }, [location]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideNav activeMenu={activeMenu} setActiveMenu={handleMenuChange} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-1 relative">
          <SensorProvider>
            <Routes>
            {/* Halaman Home sekarang ada di /dashboard */}
            <Route path="/dashboard" element={<Home />} />
            <Route path="/map" element={<Map3D />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/peringatan" element={<Peringatan />}/>
            <Route path="/analitik" element={<Analitik />}/>
            <Route path="/settings" element={<SettingsPage />}/>
            
            {/* Jika url ngawur di dalam dashboard, kembalikan ke dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          </SensorProvider>
        </main>
      </div>
    </div>
  );
}

// 2. App menangani Routing Global (Pemisahan Login vs Dashboard)
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A. Route Login (BERDIRI SENDIRI, TANPA SIDEBAR) */}
        <Route path="/login" element={<LoginPage />} />

        {/* B. Redirect Root '/' langsung ke '/login' */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* C. Semua Route lain masuk ke MainLayout (Dashboard) */}
        {/* Tanda '/*' artinya semua sub-path akan ditangani oleh MainLayout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App