import React, { useState, useEffect } from 'react';
// PERBAIKAN 1: Ganti 'ap3D' menjadi 'Map'
import { Home, Map, Activity, BarChart3, Bell, Settings, LogOut, Menu, X } from 'lucide-react';

// HAPUS import Map3D from '../pages/Map3D'; -> Tidak dibutuhkan di sini

const menuItems = [
  { id: 'home', icon: Home, label: 'Dashboard' },
  { id: 'map', icon: Map, label: 'Peta 3D' }, // Hapus properti 'element', cukup ID saja
  { id: 'monitoring', icon: Activity, label: 'Monitoring' },
  { id: 'analytics', icon: BarChart3, label: 'Analitik' },
  { id: 'alerts', icon: Bell, label: 'Peringatan' },
  { id: 'settings', icon: Settings, label: 'Pengaturan' },
];

function Sidenav({ activeMenu, setActiveMenu }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSize = sidebarOpen ? 'w-12 h-12 rounded-xl' : 'w-8 h-8 rounded-lg';
  const iconSize = sidebarOpen ? 28 : 18;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className={`fixed top-4 left-4 z-40 p-2 bg-green-600 text-white rounded-lg shadow-lg md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Menu size={24} />
      </button>

      {/* Overlay Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50
          bg-gradient-to-b from-green-600 to-emerald-700 text-white 
          transition-all duration-300 shadow-2xl 
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        {/* Logo Section */}
        <div className={`border-b border-green-500/30 flex items-center transition-all duration-300 ${sidebarOpen ? 'p-6 justify-between' : 'p-4 justify-center'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`relative flex-shrink-0 transition-all duration-300 ${logoSize}`}>
              <div className={`absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 transform rotate-12 shadow-lg transition-all duration-300 ${logoSize}`}></div>
              <div className={`absolute inset-0 bg-gradient-to-br from-green-300 to-emerald-400 absolute top-0 left-0 transform -rotate-6 shadow-lg transition-all duration-300 ${logoSize}`}></div>
              <div className={`absolute inset-0 bg-white absolute top-0 left-0 flex items-center justify-center shadow-xl z-10 transition-all duration-300 ${logoSize}`}>
                <Activity className="text-green-600 transition-all duration-300" size={iconSize} strokeWidth={2.5} />
              </div>
            </div>
            <div className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
              <span className="font-bold text-xl tracking-tight whitespace-nowrap">Desaverse</span>
              <span className="text-xs text-green-200 whitespace-nowrap">Digital Twin Desa</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:bg-green-500/30 p-1 rounded-full absolute right-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                // FUNGSI INI YANG MEMBUAT PINDAH HALAMAN
                // setActiveMenu dipanggil dari App.jsx
                setActiveMenu(item.id); 
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                activeMenu === item.id
                  ? 'bg-white text-green-600 shadow-lg scale-105'
                  : 'hover:bg-green-500/30 text-green-50'
              } ${!sidebarOpen && !isMobile ? 'justify-center' : 'gap-3'}`} 
            >
              <div className="flex-shrink-0">
                <item.icon size={22} strokeWidth={2} />
              </div>
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden hidden md:block'}`}>
                {item.label}
              </span>
              {!sidebarOpen && !isMobile && (
                <div className="absolute left-14 px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-lg">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
            <button className={`w-full flex items-center px-4 py-3 rounded-xl hover:bg-green-500/30 text-green-50 transition-all group ${!sidebarOpen ? 'justify-center' : 'gap-3'}`}>
            <LogOut size={22} strokeWidth={2} className="flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                Logout
            </span>
            </button>
        </div>

        {/* Toggle Button Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute -right-3 top-10 bg-white text-green-600 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform z-50 items-center justify-center border border-green-100"
        >
          {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>
    </>
  );
}

export default Sidenav;