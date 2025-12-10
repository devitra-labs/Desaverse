import React, { useState } from 'react';
import { 
  Settings, 
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  RefreshCw,
  User,
  Lock,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Save,
  Check,
  Eye,
  EyeOff,
  Clock,
  Shield,
  Bell,
  Database,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    autoRefresh: true,
    darkMode: false,
    language: 'id',
    timezone: 'Asia/Jakarta',
    tempThreshold: 30,
    humidityThreshold: 80,
    windThreshold: 20,
    rainThreshold: 50,
    refreshInterval: 60,
    dataRetention: 90,
    autoBackup: true,
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  return (
    // RESPONSIVE PADDING
    <div className="py-17 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen pb-24">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-green-600" size={28} />
          Pengaturan Sistem
        </h2>
        <p className="text-xs md:text-sm text-slate-600 mt-1">Kelola preferensi dan konfigurasi sistem secara menyeluruh</p>
      </div>

      {/* Grid Container untuk Layout Dashboard */}
      {/* RESPONSIVE GRID: 1 kolom di Mobile/Tablet, 2 kolom di Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* KOLOM KIRI */}
        <div className="space-y-6">
          
          {/* Section: General Settings */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="text-blue-600" size={20} /> Umum
            </h3>
            <div className="space-y-4">
              {/* Bahasa */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Bahasa</p>
                  <p className="text-xs text-slate-500">Interface language</p>
                </div>
                <select 
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Zona Waktu</p>
                  <p className="text-xs text-slate-500">Waktu lokal server</p>
                </div>
                <select 
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="Asia/Jakarta">WIB</option>
                  <option value="Asia/Makassar">WITA</option>
                </select>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Mode Gelap</p>
                  <p className="text-xs text-slate-500">Tema tampilan</p>
                </div>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="text-amber-500" size={20} /> Notifikasi
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={18} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm md:text-base">Email</p>
                    <p className="text-xs text-slate-500">Update via email</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('emailNotif')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotif ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.emailNotif ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-green-600" size={18} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm md:text-base">Push Notif</p>
                    <p className="text-xs text-slate-500">Browser notif</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('pushNotif')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.pushNotif ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.pushNotif ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: System */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="text-purple-600" size={20} /> Sistem
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Auto Refresh</p>
                  <p className="text-xs text-slate-500">Interval update data</p>
                </div>
                <select value={settings.refreshInterval} onChange={(e) => updateSetting('refreshInterval', e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm bg-white">
                  <option value="30">30s</option>
                  <option value="60">1m</option>
                  <option value="120">2m</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Auto Backup</p>
                  <p className="text-xs text-slate-500">Backup harian</p>
                </div>
                <button onClick={() => toggleSetting('autoBackup')} className={`w-12 h-6 rounded-full relative ${settings.autoBackup ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.autoBackup ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">

          {/* Section: Threshold Alerts */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} /> Batas Peringatan (Threshold)
            </h3>
            <div className="space-y-4 md:space-y-5">
              
              {/* Suhu */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="text-red-600" size={18} />
                    <span className="font-medium text-xs md:text-sm text-slate-700">Max Suhu</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm md:text-base">{settings.tempThreshold}°C</span>
                </div>
                <input type="range" min="25" max="40" value={settings.tempThreshold} onChange={(e) => updateSetting('tempThreshold', e.target.value)} className="w-full accent-red-500" />
              </div>

              {/* Kelembaban */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="text-cyan-600" size={18} />
                    <span className="font-medium text-xs md:text-sm text-slate-700">Max Kelembaban</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm md:text-base">{settings.humidityThreshold}%</span>
                </div>
                <input type="range" min="60" max="100" value={settings.humidityThreshold} onChange={(e) => updateSetting('humidityThreshold', e.target.value)} className="w-full accent-cyan-500" />
              </div>

              {/* Angin */}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="text-green-600" size={18} />
                    <span className="font-medium text-xs md:text-sm text-slate-700">Max Angin</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm md:text-base">{settings.windThreshold} km/h</span>
                </div>
                <input type="range" min="10" max="50" value={settings.windThreshold} onChange={(e) => updateSetting('windThreshold', e.target.value)} className="w-full accent-green-500" />
              </div>

               {/* Hujan */}
               <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="text-blue-600" size={18} />
                    <span className="font-medium text-xs md:text-sm text-slate-700">Max Curah Hujan</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm md:text-base">{settings.rainThreshold} mm</span>
                </div>
                <input type="range" min="20" max="100" value={settings.rainThreshold} onChange={(e) => updateSetting('rainThreshold', e.target.value)} className="w-full accent-blue-500" />
              </div>
            </div>
          </div>

          {/* Section: Account & Security */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="text-slate-700" size={20} /> Akun & Keamanan
            </h3>
            
            <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold flex-shrink-0">
                A
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">Admin Desaverse</p>
                <p className="text-xs text-slate-500 truncate">admin@desaverse.id</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ganti Password</label>
                <div className="relative mb-2">
                  <input type={showPassword ? "text" : "password"} placeholder="Password Baru" className="w-full px-3 py-2 border rounded-lg text-sm pr-10" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center justify-center gap-2 text-sm transition-colors font-medium">
                  <Lock size={16} />
                  Update Password
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
        <div className="max-w-7xl mx-auto flex justify-end gap-3">
          <button className="px-4 md:px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-xs md:text-sm">
            Reset Default
          </button>
          <button onClick={handleSave} className={`px-4 md:px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all text-xs md:text-sm ${
            saveStatus === 'success' ? 'bg-green-600 text-white' : 'bg-green-600 text-white hover:bg-green-700'
          }`}>
            {saveStatus === 'success' ? <Check size={16} /> : <Save size={16} />}
            {saveStatus === 'success' ? 'Tersimpan!' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}