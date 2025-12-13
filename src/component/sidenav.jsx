import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Map, Activity, BarChart3, Bell, Settings, 
  LogOut, ChevronRight, ChevronLeft, X 
} from 'lucide-react';

const menuItems = [
  { id: 'home', icon: Home, label: 'Dashboard' },
  { id: 'map', icon: Map, label: 'Peta 3D' },
  { id: 'monitoring', icon: Activity, label: 'Monitoring' },
  { id: 'analitik', icon: BarChart3, label: 'Analitik' },
  { id: 'peringatan', icon: Bell, label: 'Peringatan' },
  { id: 'settings', icon: Settings, label: 'Pengaturan' },
];

function Sidenav({ activeMenu, setActiveMenu }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Deteksi Mobile vs Desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false); // Mobile: Default tutup
      } else {
        setIsMobile(false);
        setSidebarOpen(true);  // Desktop: Default buka
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* 1. OVERLAY GELAP (Hanya di Mobile saat Sidebar Terbuka) */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 2. TOMBOL TOGGLE EKSTERNAL (PANAH HIJAU) */}
      {/* Tombol ini HANYA muncul jika sidebar TERTUTUP */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`
            fixed top-24 left-0 z-50
            flex items-center justify-center
            w-8 h-12
            bg-emerald-700 text-white
            rounded-r-lg shadow-lg border-y border-r border-green-400/50
            cursor-pointer hover:w-10 transition-all duration-200
            /* Pastikan tombol ini tidak tertutup elemen lain */
          `}
          title="Buka Menu"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* 3. CONTAINER SIDEBAR UTAMA */}
      <aside 
        className={`
          /* Layout Dasar */
          fixed md:sticky top-0 left-0 h-[100dvh] z-50 flex flex-col
          bg-gradient-to-b from-green-600 to-emerald-800 text-white shadow-2xl
          
          /* FIX UTAMA: overflow-hidden 
             Ini wajib ada agar padding tombol Logout tidak 'bocor' saat width = 0 */
          overflow-hidden
          
          /* Animasi */
          transition-all duration-300 ease-in-out
          
          /* Logika Lebar & Posisi */
          /* Mobile: Jika tutup width 0 (hilang total). Jika buka width 64 */
          /* Desktop: Jika tutup width 20 (mini). Jika buka width 64 */
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-20'}
        `}
      >
        
        {/* --- HEADER --- */}
        <div className={`
          flex items-center h-20 flex-shrink-0 border-b border-green-500/30 
          transition-all duration-300 whitespace-nowrap
          ${sidebarOpen ? 'px-6 justify-between' : 'justify-center px-0'}
        `}>
          
          {/* Logo Wrapper */}
          <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && isMobile ? 'hidden' : 'flex'}`}>
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm flex-shrink-0">
               <Activity className="text-white" size={24} />
            </div>
            <div className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              <span className="font-bold text-lg">Desaverse</span>
              <span className="text-[10px] text-green-200">Digital Twin</span>
            </div>
          </div>

          {/* Tombol X (Tutup) - Mobile Only */}
          {isMobile && sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}

          {/* Tombol Panah Kiri (Tutup) - Desktop Only */}
          {!isMobile && sidebarOpen && (
             <button onClick={() => setSidebarOpen(false)} className="text-green-200 hover:text-white">
                <ChevronLeft size={20}/>
             </button>
          )}
        </div>

        {/* --- MENU LIST --- */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 overflow-x-hidden">
          {menuItems.map((item) => (
            <div key={item.id} className="px-3">
              <button
                onClick={() => {
                  setActiveMenu(item.id); 
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center py-3 rounded-xl transition-all duration-200 group relative whitespace-nowrap
                  ${activeMenu === item.id 
                    ? 'bg-white text-green-700 shadow-md font-semibold' 
                    : 'text-green-50 hover:bg-white/10 hover:text-white'
                  }
                  ${sidebarOpen ? 'px-4 gap-3' : 'justify-center px-0'}
                `}
              >
                <item.icon size={22} className="flex-shrink-0 min-w-[22px]" />
                
                <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                  {item.label}
                </span>

                {/* Tooltip Desktop */}
                {!sidebarOpen && !isMobile && (
                  <div className="absolute left-14 z-50 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* --- FOOTER (LOGOUT) --- */}
        <div className="p-4 border-t border-green-500/30 flex-shrink-0 overflow-hidden">
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center py-3 rounded-xl text-red-100 hover:bg-red-500/20 hover:text-white transition-all group whitespace-nowrap
              ${sidebarOpen ? 'px-4 gap-3' : 'justify-center px-0'}
            `}
          >
            <LogOut size={22} className="flex-shrink-0 min-w-[22px]" />
            <span className={`font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Logout
            </span>
            
            {/* Tooltip Logout Desktop */}
            {!sidebarOpen && !isMobile && (
              <div className="absolute left-14 z-50 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidenav; 