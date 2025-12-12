import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Map, Activity, BarChart3, Bell, Settings, 
  LogOut, ChevronRight, ChevronLeft 
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

  // Deteksi ukuran layar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false); // Mobile: default tertutup
      } else {
        setIsMobile(false);
        setSidebarOpen(true);  // Desktop: default terbuka
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Tambahkan logika hapus token di sini jika perlu
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* 1. OVERLAY (Hanya Muncul di Mobile saat sidebar terbuka) */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 2. SIDEBAR CONTAINER UTAMA */}
      <aside 
        className={`
          /* Posisi & Layout */
          fixed md:sticky top-0 left-0 h-[100dvh] z-50 flex flex-col
          
          /* Styling Visual */
          bg-gradient-to-b from-green-600 to-emerald-700 text-white shadow-2xl
          
          /* Transisi Animasi */
          transition-all duration-300 ease-in-out
          
          /* Lebar Dinamis */
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-20'}
          ${!sidebarOpen && isMobile ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* --- TOMBOL TOGGLE (TAB PANAH) --- */}
        {/* Logic: Tombol ini absolute terhadap sidebar, jadi dia ikut bergerak */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            absolute top-20 -right-6
            flex items-center justify-center
            w-6 h-12
            bg-emerald-700 text-white
            rounded-r-lg shadow-[2px_0_5px_rgba(0,0,0,0.1)]
            border-y border-r border-green-500/30
            cursor-pointer z-50
            hover:bg-emerald-600 hover:w-8 transition-all
            /* Sembunyikan tombol ini jika di desktop & sidebar tertutup (opsional, agar lebih rapi) */
            ${!sidebarOpen && !isMobile ? 'md:hidden' : ''}
          `}
          title="Toggle Sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* --- HEADER LOGO --- */}
        <div className={`flex items-center border-b border-green-500/30 flex-shrink-0 h-20 transition-all duration-300 ${sidebarOpen ? 'px-6' : 'px-0 justify-center'}`}>
           {/* Wrapper Logo - Hide jika mobile tertutup agar tidak bocor */}
          <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && isMobile ? 'hidden' : 'flex'}`}>
            <div className={`relative flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-10 h-10' : 'w-8 h-8'}`}>
               <Activity className="text-green-600" size={sidebarOpen ? 22 : 18} />
            </div>
            
            {/* Teks Logo (Hanya muncul jika sidebar buka) */}
            <div className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">Desaverse</span>
              <span className="text-[10px] text-green-100/80 whitespace-nowrap">Digital Twin</span>
            </div>
          </div>
        </div>

        {/* --- MENU LIST (Scrollable Area) --- */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id} className="px-3">
              <button
                onClick={() => {
                  setActiveMenu(item.id); 
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`
                  relative w-full flex items-center py-3 rounded-xl transition-all duration-200 group
                  ${activeMenu === item.id 
                    ? 'bg-white text-green-600 shadow-md' 
                    : 'text-green-50 hover:bg-green-500/20'
                  }
                  ${sidebarOpen ? 'px-4 gap-3' : 'justify-center px-0'}
                `}
              >
                <item.icon size={22} strokeWidth={2} className="flex-shrink-0 min-w-[22px]" />
                
                <span className={`whitespace-nowrap font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 w-0 hidden'}`}>
                  {item.label}
                </span>

                {/* Tooltip Hover saat Sidebar Tertutup (Desktop Only) */}
                {!sidebarOpen && !isMobile && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* --- FOOTER (LOGOUT) --- */}
        <div className="p-4 border-t border-green-500/30 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center py-3 rounded-xl text-green-50 hover:bg-green-500/20 transition-all group
              ${sidebarOpen ? 'px-4 gap-3' : 'justify-center px-0'}
            `}
          >
            <LogOut size={22} strokeWidth={2} className="flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Logout
            </span>
            
            {!sidebarOpen && !isMobile && (
              <div className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
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