import React, { useState } from 'react';
import { 
  Settings, Mail, Smartphone, Globe, Moon, Database, Thermometer, Droplets, Wind, 
  Save, Check, Bell, AlertTriangle, HelpCircle, FileText, Phone, Info
} from 'lucide-react';

// IMPORT LIBRARY PDF
import { jsPDF } from 'jspdf';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    language: 'id',
    darkMode: false,
    emailNotif: true,
    pushNotif: true,
    refreshInterval: 60,
    tempThreshold: 30,
    humidityThreshold: 80,
    windThreshold: 20,
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const toggleSetting = (key) => setSettings({ ...settings, [key]: !settings[key] });
  const updateSetting = (key, value) => setSettings({ ...settings, [key]: value });

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  // --- 1. FUNGSI GENERATOR GAMBAR (BACKGROUND PROCESS) ---
  // Fungsi ini membuat "Screenshot Tiruan" menggunakan Canvas HTML
  // Pengguna tidak melihat ini, proses terjadi di memori (Backend style)
  const createDummyScreenshot = (title, color = '#f8fafc') => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450; // Rasio 16:9
    const ctx = canvas.getContext('2d');

    // 1. Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Header Browser Mockup
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, canvas.width, 40);
    // Tombol close/min/max
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(40, 20, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(60, 20, 6, 0, Math.PI * 2); ctx.fill();

    // 3. UI Placeholder (Sidebar)
    ctx.fillStyle = '#16a34a'; // Desaverse Green
    ctx.fillRect(0, 40, 150, canvas.height - 40);

    // 4. Content Area Text
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("TAMPILAN UI", canvas.width / 2 + 75, canvas.height / 2 - 20);
    
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(title.toUpperCase(), canvas.width / 2 + 75, canvas.height / 2 + 30);

    // 5. Watermark
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.font = '20px Arial';
    ctx.fillText("Desaverse Auto-Generated Screenshot", canvas.width / 2 + 75, canvas.height - 20);

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // --- 2. LOGIKA PDF GENERATOR ---
  const handleDownloadManual = () => {
    setGeneratingPdf(true);
    
    // Gunakan Timeout agar UI sempat update status "Sedang Membuat..."
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;

        // Helper Layout
        const addHeader = () => {
          doc.setFontSize(16);
          doc.setTextColor(34, 197, 94);
          doc.text("Desaverse", margin, 15);
          doc.setDrawColor(200); 
          doc.line(margin, 18, pageWidth - margin, 18);
        };

        const addFooter = (pageNo) => {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`Desaverse User Manual - v2.4`, margin, pageHeight - 10);
          doc.text(`Halaman ${pageNo}`, pageWidth - margin - 10, pageHeight - 10);
        };

        // --- HALAMAN 1: COVER ---
        doc.setFillColor(34, 197, 94);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setTextColor(255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.text("BUKU PANDUAN", pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text("OPERATOR DASHBOARD", pageWidth / 2, pageHeight / 2, { align: 'center' });
        doc.setFontSize(12);
        doc.text("Edisi Lengkap - 2025", pageWidth / 2, pageHeight - 30, { align: 'center' });

        // --- HALAMAN 2: DAFTAR ISI ---
        doc.addPage();
        addHeader();
        doc.setTextColor(0);
        doc.setFontSize(18); doc.setFont("helvetica", "bold");
        doc.text("Daftar Isi", margin, 40);
        
        const contentList = [
          "1. Halaman Login & Akses",
          "2. Dashboard Utama (Home)",
          "3. Fitur Peta 3D Interaktif",
          "4. Monitoring Sensor",
          "5. Analitik Data",
          "6. Sistem Peringatan Dini",
          "7. Kontak & Bantuan"
        ];
        
        doc.setFontSize(12); doc.setFont("helvetica", "normal");
        let yTOC = 60;
        contentList.forEach((item, i) => {
          doc.text(`${item} ................................................. ${(i*2)+3}`, margin, yTOC);
          yTOC += 12;
        });
        addFooter(2);

        // --- DATA HALAMAN (BESERTA GAMBAR OTOMATIS) ---
        const chapters = [
          { 
            title: "1. Halaman Login", 
            imageTitle: "Halaman Login",
            body: "Halaman Login adalah gerbang utama keamanan. Masukkan username dan password yang telah didaftarkan. Sistem dilengkapi enkripsi SSL untuk keamanan data. Jika lupa password, hubungi admin pusat.",
            bgColor: '#eff6ff' // Biru muda
          },
          { 
            title: "2. Dashboard Utama (Home)", 
            imageTitle: "Dashboard Home",
            body: "Dashboard memberikan ringkasan eksekutif. Widget cuaca menampilkan kondisi real-time dari Sensor Kami. Ringkasan status sensor menunjukkan berapa banyak perangkat yang aktif, warning, atau offline.",
            bgColor: '#f0fdf4' // Hijau muda
          },
          { 
            title: "3. Peta 3D Interaktif", 
            imageTitle: "Peta Digital 3D",
            body: "Fitur unggulan Desaverse. Peta 3D memvisualisasikan kontur tanah dan lokasi persis sensor. Anda dapat memutar (rotate), zoom, dan klik pin sensor untuk melihat data telemetri langsung dari lokasi.",
            bgColor: '#fafafa' // Abu muda
          },
          { 
            title: "4. Monitoring Sensor", 
            imageTitle: "List Monitoring",
            body: "Halaman ini menampilkan grid kartu dari seluruh sensor (Suhu, Tanah, Air, dll). Indikator baterai dan sinyal membantu teknisi memantau kesehatan perangkat keras di lapangan.",
            bgColor: '#fff7ed' // Orange muda
          },
          { 
            title: "5. Analitik Data", 
            imageTitle: "Grafik Analitik",
            body: "Gunakan halaman ini untuk melihat tren historis. Grafik garis memudahkan Anda melihat pola kenaikan suhu atau curah hujan dalam 24 jam atau 7 hari terakhir. Data bisa diekspor ke CSV.",
            bgColor: '#f8fafc' // Slate muda
          },
          { 
            title: "6. Peringatan Dini", 
            imageTitle: "Menu Peringatan",
            body: "Pusat notifikasi bahaya. Tabel ini mencatat semua insiden (Baterai low, Suhu ekstrem). Anda dapat memfilter berdasarkan tingkat urgensi (Critical, Warning, Info) dan mencetak laporannya.",
            bgColor: '#fef2f2' // Merah muda
          }
        ];

        // --- LOOPING PEMBUATAN HALAMAN ---
        chapters.forEach((chap, idx) => {
          doc.addPage();
          addHeader();
          
          // Judul
          doc.setTextColor(0);
          doc.setFontSize(16); doc.setFont("helvetica", "bold");
          doc.text(chap.title, margin, 40);

          // Teks Penjelasan
          doc.setFontSize(11); doc.setFont("helvetica", "normal");
          const splitBody = doc.splitTextToSize(chap.body, pageWidth - (margin * 2));
          doc.text(splitBody, margin, 55);

          // GENERATE SCREENSHOT OTOMATIS (BACKEND STYLE)
          const imgData = createDummyScreenshot(chap.imageTitle, chap.bgColor);
          
          // Masukkan Gambar ke PDF
          // Format: (image, type, x, y, width, height)
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = 90; // Rasio disesuaikan
          doc.addImage(imgData, 'JPEG', margin, 85, imgWidth, imgHeight);

          // Caption Gambar
          doc.setFontSize(9); doc.setTextColor(100); doc.setFont("helvetica", "italic");
          doc.text(`Gambar ${idx + 1}: Tampilan Antarmuka ${chap.imageTitle}`, pageWidth/2, 182, { align: 'center' });

          addFooter(idx + 3);
        });

        // --- HALAMAN TERAKHIR: KONTAK ---
        doc.addPage();
        addHeader();
        doc.setFontSize(16); doc.setTextColor(0); doc.setFont("helvetica", "bold");
        doc.text("7. Kontak & Bantuan", margin, 40);
        
        doc.setFontSize(12); doc.setFont("helvetica", "normal");
        doc.text("Jika Anda mengalami kendala teknis, silakan hubungi:", margin, 60);
        
        doc.setDrawColor(34, 197, 94); doc.setLineWidth(1);
        doc.rect(margin, 70, pageWidth - (margin * 2), 40);
        
        doc.text("WhatsApp Admin: +62 814-5607-0180", margin + 10, 85);
        doc.text("Email Support: devitra@gmail.com", margin + 10, 95);
        
        addFooter(chapters.length + 3);

        // SAVE
        doc.save("Buku_Panduan_Lengkap_Desaverse.pdf");
        setGeneratingPdf(false);

      } catch (error) {
        console.error("PDF Error:", error);
        alert("Gagal membuat PDF. Coba lagi.");
        setGeneratingPdf(false);
      }
    }, 1500); // Delay sedikit lebih lama untuk sensasi "Generating..."
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-green-600" size={28} />
          Pengaturan Sistem
        </h2>
        <p className="text-xs md:text-sm text-slate-600 mt-1">Kelola preferensi dashboard dan konfigurasi alat</p>
      </div>

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          {/* KARTU UMUM */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="text-blue-600" size={20} /> Umum
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Bahasa Aplikasi</p>
                  <p className="text-xs text-slate-500">Pilih bahasa antarmuka</p>
                </div>
                <select value={settings.language} onChange={(e) => updateSetting('language', e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white">
                  <option value="id">Indonesia</option>
                </select>
              </div>
            </div>
          </div>

          {/* KARTU NOTIFIKASI */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="text-amber-500" size={20} /> Notifikasi
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={18} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm md:text-base">Alert via Email</p>
                    <p className="text-xs text-slate-500">Kirim laporan bahaya ke email</p>
                  </div>
                </div>
                <button onClick={() => toggleSetting('emailNotif')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotif ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.emailNotif ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-green-600" size={18} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm md:text-base">Notifikasi HP</p>
                    <p className="text-xs text-slate-500">Muncul di layar perangkat</p>
                  </div>
                </div>
                <button onClick={() => toggleSetting('pushNotif')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.pushNotif ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.pushNotif ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* KARTU SISTEM */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="text-purple-600" size={20} /> Sistem & Data
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 text-sm md:text-base">Kecepatan Update</p>
                  <p className="text-xs text-slate-500">Seberapa sering data diperbarui</p>
                </div>
                <select value={settings.refreshInterval} onChange={(e) => updateSetting('refreshInterval', e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm bg-white">
                  <option value="30">Cepat (30s)</option>
                  <option value="60">Normal (1m)</option>
                  <option value="120">Hemat Data (2m)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
    
          {/* KARTU BANTUAN */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HelpCircle className="text-blue-600" size={20} /> Pusat Bantuan
            </h3>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Butuh Panduan?</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    Jika Anda bingung cara menggunakan dashboard atau sensor bermasalah, silakan unduh buku panduan di bawah ini.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleDownloadManual}
                disabled={generatingPdf}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors group text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {generatingPdf ? 'Sedang Membuat PDF...' : 'Download Manual PDF'}
                    </p>
                    <p className="text-xs text-slate-500">Panduan lengkap operator (10+ Halaman)</p>
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors group text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Hubungi Admin Pusat</p>
                    <p className="text-xs text-slate-500">Jika ada kendala teknis/akun</p>
                  </div>
                </div>
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">Versi Aplikasi v2.4 (Desaverse Stable)</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER STATIS */}
      <div className="bg-white border-t border-slate-200 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          Pastikan menekan simpan setelah mengubah konfigurasi.
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
            Reset Default
          </button>
          <button 
            onClick={handleSave} 
            className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm ${
              saveStatus === 'success' ? 'bg-green-600 text-white' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {saveStatus === 'success' ? <Check size={16} /> : <Save size={16} />}
            {saveStatus === 'success' ? 'Tersimpan!' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}