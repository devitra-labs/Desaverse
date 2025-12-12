// File: src/context/SensorContext.jsx

import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';

// PENTING: Import wadah Context dari file definisi
import { SensorContext } from './SensorContextDefinition'; 

export const useSensor = () => useContext(SensorContext);

export const SensorProvider = ({ children }) => {
  // --- 1. DATA AWAL: DENGAN DRAIN RATE BERBEDA ---
  // drainRate: Berapa menit sekali baterai berkurang 1%
  const initialSensors = [
    // --- GROUP 1: MONITORING PERTANIAN & SAWAH ---
    { id: 'SOIL-01', name: 'Kelembaban Tanah Padi', status: 'online', lastUpdate: '10 menit lalu', location: 'Sawah Blok A (Timur)', battery: 85, signal: 'excellent', drainRate: 5 },
    { id: 'SOIL-02', name: 'Kelembaban Tanah Jagung', status: 'online', lastUpdate: '15 menit lalu', location: 'Ladang Kelompok Tani 1', battery: 90, signal: 'good', drainRate: 8 },
    { id: 'PH-01', name: 'Kadar pH Tanah', status: 'online', lastUpdate: '1 jam lalu', location: 'Kebun Cabai Pak Budi', battery: 78, signal: 'good', drainRate: 15 },
    { id: 'TEMP-AGRI', name: 'Suhu Greenhouse', status: 'online', lastUpdate: '5 detik lalu', location: 'Greenhouse Hidroponik', battery: 95, signal: 'excellent', drainRate: 3 },
    { id: 'PEST-01', name: 'Perangkap Hama Otomatis', status: 'warning', lastUpdate: '30 menit lalu', location: 'Sawah Blok B (Barat)', battery: 35, signal: 'fair', drainRate: 10 },

    // --- GROUP 2: MANAJEMEN AIR & IRIGASI ---
    { id: 'WLVL-01', name: 'Level Air Sungai Utama', status: 'online', lastUpdate: 'Realtime', location: 'Jembatan Gantung Desa', battery: 98, signal: 'excellent', drainRate: 4 },
    { id: 'WLVL-02', name: 'Level Pintu Air Irigasi', status: 'warning', lastUpdate: '5 menit lalu', location: 'Pintu Air Sekunder', battery: 20, signal: 'good', drainRate: 6 },
    { id: 'WQ-01', name: 'Kualitas Air (Kekeruhan)', status: 'online', lastUpdate: '10 menit lalu', location: 'Kolam Ikan BUMDes', battery: 88, signal: 'excellent', drainRate: 12 },
    { id: 'FLOW-01', name: 'Debit Air Masuk', status: 'online', lastUpdate: '2 menit lalu', location: 'Saluran Irigasi Utama', battery: 72, signal: 'good', drainRate: 5 },
    
    // --- GROUP 3: CUACA & IKLIM MIKRO ---
    { id: 'RAIN-01', name: 'Curah Hujan Pos 1', status: 'online', lastUpdate: '1 menit lalu', location: 'Atap Balai Desa', battery: 100, signal: 'excellent', drainRate: 20 },
    { id: 'WIND-01', name: 'Kecepatan Angin', status: 'online', lastUpdate: 'Realtime', location: 'Lapangan Terbuka', battery: 92, signal: 'excellent', drainRate: 2 }, // Cepat habis karena realtime
    { id: 'UV-01', name: 'Indeks Sinar UV', status: 'online', lastUpdate: '10 menit lalu', location: 'Area Jemur Padi', battery: 80, signal: 'good', drainRate: 30 },
    
    // --- GROUP 4: KEAMANAN & LINGKUNGAN ---
    { id: 'AQI-01', name: 'Kualitas Udara (Debu)', status: 'online', lastUpdate: '5 menit lalu', location: 'Jalan Poros Desa', battery: 65, signal: 'good', drainRate: 10 },
    { id: 'LAND-01', name: 'Deteksi Pergeseran Tanah', status: 'online', lastUpdate: '1 jam lalu', location: 'Lereng Bukit Utara', battery: 90, signal: 'weak', drainRate: 60 }, 
    { id: 'FIRE-01', name: 'Detektor Titik Api', status: 'online', lastUpdate: '2 menit lalu', location: 'Hutan Batas Desa', battery: 96, signal: 'fair', drainRate: 45 },
    { id: 'GATE-01', name: 'Sensor Portal Masuk', status: 'online', lastUpdate: 'Realtime', location: 'Gerbang Utama Desa', battery: 85, signal: 'excellent', drainRate: 5 },
    
    // --- GROUP 5: FASILITAS UMUM & ENERGI ---
    { id: 'LIGHT-01', name: 'Lampu Jalan Otomatis 1', status: 'online', lastUpdate: '1 menit lalu', location: 'Perempatan Pasar', battery: 45, signal: 'good', drainRate: 10 }, 
    { id: 'LIGHT-02', name: 'Lampu Jalan Otomatis 2', status: 'offline', lastUpdate: '1 hari lalu', location: 'Jalan Menuju Makam', battery: 0, signal: 'no-signal', drainRate: 999 }, // Mati
    { id: 'NRGY-01', name: 'Produksi Panel Surya', status: 'online', lastUpdate: '10 detik lalu', location: 'Atap Posyandu', battery: 100, signal: 'excellent', drainRate: 15 },
    { id: 'WASTE-01', name: 'Kapasitas Bak Sampah', status: 'warning', lastUpdate: '30 menit lalu', location: 'TPS Pasar Desa', battery: 40, signal: 'good', drainRate: 25 }, 

    // --- GROUP 6: PETERNAKAN ---
    { id: 'COW-01', name: 'Pelacak Ternak (GPS)', status: 'online', lastUpdate: '5 menit lalu', location: 'Padang Rumput', battery: 55, signal: 'fair', drainRate: 3 }, // GPS boros baterai
    { id: 'TEMP-COOP', name: 'Suhu Kandang Ayam', status: 'online', lastUpdate: '1 menit lalu', location: 'Kandang Kelompok 2', battery: 82, signal: 'good', drainRate: 8 },
    { id: 'FEED-01', name: 'Stok Pakan Otomatis', status: 'warning', lastUpdate: '2 jam lalu', location: 'Gudang Pakan', battery: 15, signal: 'good', drainRate: 12 }, 
    { id: 'AMMO-01', name: 'Kadar Gas Amonia', status: 'online', lastUpdate: '10 menit lalu', location: 'Area Kandang Sapi', battery: 77, signal: 'excellent', drainRate: 10 }
  ];

  // State Utama
  const [sensors, setSensors] = useState(initialSensors);
  const [recentLogs, setRecentLogs] = useState([
     { time: new Date().toLocaleTimeString('id-ID'), event: 'Sistem monitoring aktif', type: 'success', sensor: 'SYSTEM' }
  ]);
  
  // Refs
  const lastCheckDate = useRef(new Date().getDate());
  const minuteTick = useRef(0); // Menghitung menit berlalu sejak app dibuka
  const lastLoggedBattery = useRef({}); 

  // --- 2. LOGIKA SIMULASI BATERAI (Background) ---
  useEffect(() => {
    const BATTERY_INTERVAL = 60000; // 1 Menit

    const batteryTimer = setInterval(() => {
      const now = new Date();
      const currentDate = now.getDate();
      const isNewDay = currentDate !== lastCheckDate.current;
      
      // Increment counter menit global
      minuteTick.current += 1;

      setSensors(prevSensors => {
        // A. RESET HARIAN
        if (isNewDay) {
          lastCheckDate.current = currentDate;
          minuteTick.current = 0; // Reset tick
          lastLoggedBattery.current = {}; 
          
          setRecentLogs(prev => [{
            time: now.toLocaleTimeString('id-ID'), event: 'Maintenance Harian: Baterai Reset', type: 'success', sensor: 'SYSTEM'
          }, ...prev]);
          
          return prevSensors.map(s => ({ ...s, battery: 100, lastUpdate: 'Baru saja' }));
        }

        // B. LOGIKA PENGURANGAN BATERAI BERDASARKAN WAKTU
        const logsToAdd = [];

        const updatedSensors = prevSensors.map(sensor => {
            // Cek apakah sensor mati atau offline
            if (sensor.battery <= 0 || sensor.status === 'offline') return sensor;

            // LOGIKA UTAMA: Cek apakah menit sekarang adalah kelipatan drainRate sensor
            // Contoh: Jika drainRate 5, maka akan berkurang di menit ke-5, 10, 15...
            const shouldDrain = (minuteTick.current % sensor.drainRate === 0);

            if (!shouldDrain) return sensor; 

            // Kurangi 1%
            const newBattery = Math.max(0, sensor.battery - 1);
            
            // UPDATE LAST UPDATE KARENA ADA PERUBAHAN
            // Format waktu: "10:30"
            const newLastUpdate = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            // C. CEK WARNING & LOGS
            if (newBattery < 50) {
                const lastVal = lastLoggedBattery.current[sensor.id] || 100;
                
                if ((lastVal - newBattery >= 10) || (newBattery <= 5 && lastVal !== newBattery)) {
                    lastLoggedBattery.current[sensor.id] = newBattery;
                    
                    let msgType = 'warning';
                    let msgText = `Peringatan: Baterai ${sensor.name} tersisa ${newBattery}%`;
                    
                    if (newBattery <= 5) {
                        msgText = `KRITIS: Baterai ${sensor.name} hampir habis (${newBattery}%)`;
                        msgType = 'error'; 
                    }

                    logsToAdd.push({
                        time: now.toLocaleTimeString('id-ID'),
                        event: msgText,
                        type: msgType === 'error' ? 'warning' : 'warning',
                        sensor: sensor.id
                    });
                }
            }
            
            // Return sensor dengan Baterai baru DAN Waktu Update baru
            return { 
                ...sensor, 
                battery: newBattery, 
                lastUpdate: newLastUpdate 
            };
        });

        if (logsToAdd.length > 0) {
            setRecentLogs(prev => [...logsToAdd, ...prev].slice(0, 20));
        }

        return updatedSensors;
      });
    }, BATTERY_INTERVAL);

    return () => clearInterval(batteryTimer);
  }, []);

  const addLog = (log) => {
    setRecentLogs(prev => [log, ...prev].slice(0, 20));
  };

  const contextValue = useMemo(() => ({
    sensors,
    recentLogs,
    addLog
  }), [sensors, recentLogs]);

  return (
    <SensorContext.Provider value={contextValue}>
      {children}
    </SensorContext.Provider>
  );
};