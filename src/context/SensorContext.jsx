// File: src/context/SensorContext.jsx

import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';

// PENTING: Import wadah Context dari file definisi yang sudah kamu buat
import { SensorContext } from './SensorContextDefinition'; 

// Export Hook agar bisa digunakan di Monitoring.jsx dan Home.jsx
export const useSensor = () => useContext(SensorContext);

export const SensorProvider = ({ children }) => {
  // --- 1. DATA AWAL: 24 SENSOR (LENGKAP) ---
  const initialSensors = [
    // --- GROUP 1: MONITORING PERTANIAN & SAWAH ---
    { id: 'SOIL-01', name: 'Kelembaban Tanah Padi', status: 'online', lastUpdate: '10 menit lalu', location: 'Sawah Blok A (Timur)', battery: 85, signal: 'excellent' },
    { id: 'SOIL-02', name: 'Kelembaban Tanah Jagung', status: 'online', lastUpdate: '15 menit lalu', location: 'Ladang Kelompok Tani 1', battery: 90, signal: 'good' },
    { id: 'PH-01', name: 'Kadar pH Tanah', status: 'online', lastUpdate: '1 jam lalu', location: 'Kebun Cabai Pak Budi', battery: 78, signal: 'good' },
    { id: 'TEMP-AGRI', name: 'Suhu Greenhouse', status: 'online', lastUpdate: '5 detik lalu', location: 'Greenhouse Hidroponik', battery: 95, signal: 'excellent' },
    { id: 'PEST-01', name: 'Perangkap Hama Otomatis', status: 'warning', lastUpdate: '30 menit lalu', location: 'Sawah Blok B (Barat)', battery: 35, signal: 'fair' }, // Low Battery

    // --- GROUP 2: MANAJEMEN AIR & IRIGASI ---
    { id: 'WLVL-01', name: 'Level Air Sungai Utama', status: 'online', lastUpdate: 'Realtime', location: 'Jembatan Gantung Desa', battery: 98, signal: 'excellent' },
    { id: 'WLVL-02', name: 'Level Pintu Air Irigasi', status: 'warning', lastUpdate: '5 menit lalu', location: 'Pintu Air Sekunder', battery: 20, signal: 'good' }, // Critical Battery
    { id: 'WQ-01', name: 'Kualitas Air (Kekeruhan)', status: 'online', lastUpdate: '10 menit lalu', location: 'Kolam Ikan BUMDes', battery: 88, signal: 'excellent' },
    { id: 'FLOW-01', name: 'Debit Air Masuk', status: 'online', lastUpdate: '2 menit lalu', location: 'Saluran Irigasi Utama', battery: 72, signal: 'good' },
    
    // --- GROUP 3: CUACA & IKLIM MIKRO ---
    { id: 'RAIN-01', name: 'Curah Hujan Pos 1', status: 'online', lastUpdate: '1 menit lalu', location: 'Atap Balai Desa', battery: 100, signal: 'excellent' },
    { id: 'WIND-01', name: 'Kecepatan Angin', status: 'online', lastUpdate: 'Realtime', location: 'Lapangan Terbuka', battery: 92, signal: 'excellent' },
    { id: 'UV-01', name: 'Indeks Sinar UV', status: 'online', lastUpdate: '10 menit lalu', location: 'Area Jemur Padi', battery: 80, signal: 'good' },
    
    // --- GROUP 4: KEAMANAN & LINGKUNGAN ---
    { id: 'AQI-01', name: 'Kualitas Udara (Debu)', status: 'online', lastUpdate: '5 menit lalu', location: 'Jalan Poros Desa', battery: 65, signal: 'good' },
    { id: 'LAND-01', name: 'Deteksi Pergeseran Tanah', status: 'online', lastUpdate: '1 jam lalu', location: 'Lereng Bukit Utara', battery: 90, signal: 'weak' }, 
    { id: 'FIRE-01', name: 'Detektor Titik Api', status: 'online', lastUpdate: '2 menit lalu', location: 'Hutan Batas Desa', battery: 96, signal: 'fair' },
    { id: 'GATE-01', name: 'Sensor Portal Masuk', status: 'online', lastUpdate: 'Realtime', location: 'Gerbang Utama Desa', battery: 85, signal: 'excellent' },
    
    // --- GROUP 5: FASILITAS UMUM & ENERGI ---
    { id: 'LIGHT-01', name: 'Lampu Jalan Otomatis 1', status: 'online', lastUpdate: '1 menit lalu', location: 'Perempatan Pasar', battery: 45, signal: 'good' }, // Low Battery
    { id: 'LIGHT-02', name: 'Lampu Jalan Otomatis 2', status: 'offline', lastUpdate: '1 hari lalu', location: 'Jalan Menuju Makam', battery: 0, signal: 'no-signal' }, // Mati
    { id: 'NRGY-01', name: 'Produksi Panel Surya', status: 'online', lastUpdate: '10 detik lalu', location: 'Atap Posyandu', battery: 100, signal: 'excellent' },
    { id: 'WASTE-01', name: 'Kapasitas Bak Sampah', status: 'warning', lastUpdate: '30 menit lalu', location: 'TPS Pasar Desa', battery: 40, signal: 'good' }, 

    // --- GROUP 6: PETERNAKAN ---
    { id: 'COW-01', name: 'Pelacak Ternak (GPS)', status: 'online', lastUpdate: '5 menit lalu', location: 'Padang Rumput', battery: 55, signal: 'fair' },
    { id: 'TEMP-COOP', name: 'Suhu Kandang Ayam', status: 'online', lastUpdate: '1 menit lalu', location: 'Kandang Kelompok 2', battery: 82, signal: 'good' },
    { id: 'FEED-01', name: 'Stok Pakan Otomatis', status: 'warning', lastUpdate: '2 jam lalu', location: 'Gudang Pakan', battery: 15, signal: 'good' }, // Critical
    { id: 'AMMO-01', name: 'Kadar Gas Amonia', status: 'online', lastUpdate: '10 menit lalu', location: 'Area Kandang Sapi', battery: 77, signal: 'excellent' }
  ];

  // State Utama
  const [sensors, setSensors] = useState(initialSensors);
  const [recentLogs, setRecentLogs] = useState([
     { time: new Date().toLocaleTimeString(), event: 'Sistem monitoring aktif', type: 'success', sensor: 'SYSTEM' }
  ]);
  
  // Refs untuk logika background
  const lastCheckDate = useRef(new Date().getDate());
  const lastLoggedBattery = useRef({}); 

  // --- 2. LOGIKA SIMULASI BATERAI (Background) ---
  useEffect(() => {
    // Interval 1 Menit (60000ms) agar performa lancar
    const BATTERY_INTERVAL = 60000; 

    const batteryTimer = setInterval(() => {
      const now = new Date();
      const currentDate = now.getDate();
      const isNewDay = currentDate !== lastCheckDate.current;

      setSensors(prevSensors => {
        // A. RESET HARIAN (Jika ganti hari -> Baterai 100%)
        if (isNewDay) {
          lastCheckDate.current = currentDate;
          lastLoggedBattery.current = {}; 
          
          // Tambah log reset
          setRecentLogs(prev => [{
            time: now.toLocaleTimeString(), event: 'Maintenance Harian: Baterai Reset', type: 'success', sensor: 'SYSTEM'
          }, ...prev]);
          
          return prevSensors.map(s => ({ ...s, battery: 100 }));
        }

        // B. KURANGI BATERAI
        // Kita tampung log baru di sini agar state log update sekali jalan
        const logsToAdd = [];

        const updatedSensors = prevSensors.map(sensor => {
            // Hanya kurangi baterai secara acak (50% peluang) agar ringan
            const shouldDrain = Math.random() > 0.5; 
            if (!shouldDrain) return sensor; 

            // Kurangi 1%
            const newBattery = Math.max(0, sensor.battery - 1);

            // C. CEK WARNING & LOGS
            if (newBattery < 50) {
                const lastVal = lastLoggedBattery.current[sensor.id] || 100;
                
                // Log hanya jika turun kelipatan 10% ATAU masuk fase kritis (<= 5%)
                if ((lastVal - newBattery >= 10) || (newBattery <= 5 && lastVal !== newBattery)) {
                    lastLoggedBattery.current[sensor.id] = newBattery;
                    
                    let msgType = 'warning';
                    let msgText = `Peringatan: Baterai ${sensor.name} tersisa ${newBattery}%`;
                    
                    if (newBattery <= 5) {
                        msgText = `KRITIS: Baterai ${sensor.name} hampir habis (${newBattery}%)`;
                        msgType = 'error'; // Nanti di UI akan jadi warning merah
                    }

                    logsToAdd.push({
                        time: now.toLocaleTimeString(),
                        event: msgText,
                        type: msgType === 'error' ? 'warning' : 'warning',
                        sensor: sensor.id
                    });
                }
            }
            return { ...sensor, battery: newBattery };
        });

        // Update Logs jika ada yang baru
        if (logsToAdd.length > 0) {
            setRecentLogs(prev => [...logsToAdd, ...prev].slice(0, 20));
        }

        return updatedSensors;
      });
    }, BATTERY_INTERVAL);

    return () => clearInterval(batteryTimer);
  }, []);

  // --- 3. FUNGSI TAMBAH LOG (Untuk Monitoring.jsx) ---
  const addLog = (log) => {
    setRecentLogs(prev => [log, ...prev].slice(0, 20));
  };

  // --- 4. BUNGKUS VALUE DENGAN USEMEMO (PENTING) ---
  // Ini mencegah "Blank Screen" dan meningkatkan performa
  const contextValue = useMemo(() => ({
    sensors,
    recentLogs,
    addLog
  }), [sensors, recentLogs]);

  // --- 5. RENDER PROVIDER ---
  return (
    <SensorContext.Provider value={contextValue}>
      {children}
    </SensorContext.Provider>
  );
};