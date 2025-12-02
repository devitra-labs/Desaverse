import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import SideNav from './component/sidenav' 
import Home from './pages/Home'
import Map3D from './pages/Map3D'
import Monitoring from './pages/monitoring'

import './App.css'

function MainLayout() {
  const [activeMenu, setActiveMenu] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    
    switch(menuId) {
      case 'home': navigate('/'); break;
      case 'map': navigate('/map'); break; // 1. Navigasi ke '/map'
      case 'monitoring': navigate('/monitoring'); break; 
      case 'settings': navigate('/account'); break; 
      default: navigate('/');
    }
  };

  // Sinkronisasi URL agar saat direfresh menu tetap aktif
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveMenu('home');
    else if (path === '/map') setActiveMenu('map');
    else if (path === '/monitoring') setActiveMenu('monitoring')
    else if (path === '/account') setActiveMenu('settings');
  }, [location]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SideNav activeMenu={activeMenu} setActiveMenu={handleMenuChange} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* 3. PERBAIKAN DISINI: Ubah path="/Map3D" menjadi path="/map" */}
            <Route path="/map" element={<Map3D />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  )
}

export default App