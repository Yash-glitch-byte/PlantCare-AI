import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Plant, SensorReading, Recommendation, NotificationLog, IoTDevice, TelegramConfig, MLPrediction, SimulationScenario } from '../types';
import { INITIAL_PLANTS, INITIAL_DEVICES, INITIAL_RECOMMENDATIONS, INITIAL_NOTIFICATIONS, INITIAL_TELEGRAM_CONFIG, INITIAL_ML_PREDICTION, generateHistoricalReadings } from '../services/mockData';

export type NavSection = 
  | 'overview' 
  | 'plants' 
  | 'monitoring' 
  | 'analytics' 
  | 'intelligence' 
  | 'recommendations' 
  | 'notifications' 
  | 'telegram' 
  | 'devices' 
  | 'settings';

interface AppContextType {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  plants: Plant[];
  selectedPlant: Plant;
  selectedPlantId: string;
  setSelectedPlantId: (id: string) => void;
  addPlant: (plant: Omit<Plant, 'id' | 'healthScore' | 'status' | 'currentStress'>) => void;
  updatePlant: (plant: Plant) => void;
  deletePlant: (id: string) => void;
  devices: IoTDevice[];
  addDevice: (device: Omit<IoTDevice, 'id' | 'lastHeartbeat' | 'readingsCount'>) => void;
  deleteDevice: (id: string) => void;
  recommendations: Recommendation[];
  resolveRecommendation: (id: string) => void;
  notifications: NotificationLog[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  telegramConfig: TelegramConfig;
  updateTelegramConfig: (config: Partial<TelegramConfig>) => void;
  sendTestTelegramAlert: () => boolean;
  simulationScenario: SimulationScenario;
  setSimulationScenario: (scenario: SimulationScenario) => void;
  currentReading: SensorReading;
  historyReadings: SensorReading[];
  mlPrediction: MLPrediction;
  triggerManualReading: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('plantcare_theme') === 'dark';
  });

  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState<string>(INITIAL_PLANTS[0].id);
  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_DEVICES);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>(INITIAL_TELEGRAM_CONFIG);
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('normal');
  const [mlPrediction] = useState<MLPrediction>(INITIAL_ML_PREDICTION);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const [historyReadings, setHistoryReadings] = useState<SensorReading[]>(() => 
    generateHistoricalReadings(selectedPlant, simulationScenario)
  );

  const [currentReading, setCurrentReading] = useState<SensorReading>(() => {
    const list = generateHistoricalReadings(selectedPlant, simulationScenario);
    return list[list.length - 1];
  });

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('plantcare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('plantcare_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Re-generate history and current readings when plant or scenario changes
  useEffect(() => {
    const newHistory = generateHistoricalReadings(selectedPlant, simulationScenario);
    setHistoryReadings(newHistory);
    setCurrentReading(newHistory[newHistory.length - 1]);
  }, [selectedPlantId, simulationScenario]);

  // Live simulation ticker (every 6 seconds, adds slight noise or updates live reading)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReading((prev) => {
        const noise = (Math.random() - 0.5) * 0.4;
        const tempNoise = (Math.random() - 0.5) * 0.2;
        let newMoisture = Math.max(10, Math.min(100, prev.soilMoisture + noise));
        let newTemp = Math.max(12, Math.min(45, prev.temperature + tempNoise));
        let newHumidity = Math.max(20, Math.min(95, prev.humidity - noise * 0.5));

        if (simulationScenario === 'drought') {
          newMoisture = Math.max(12, newMoisture - 0.15);
        } else if (simulationScenario === 'overwatering') {
          newMoisture = Math.min(98, newMoisture + 0.15);
        }

        const updated: SensorReading = {
          ...prev,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          soilMoisture: Number(newMoisture.toFixed(1)),
          temperature: Number(newTemp.toFixed(1)),
          humidity: Number(newHumidity.toFixed(1)),
        };

        // Add to history tail, maintain 25 items
        setHistoryReadings((hist) => [...hist.slice(1), updated]);
        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [simulationScenario]);

  const triggerManualReading = () => {
    const newHistory = generateHistoricalReadings(selectedPlant, simulationScenario);
    setHistoryReadings(newHistory);
    setCurrentReading(newHistory[newHistory.length - 1]);
  };

  const addPlant = (newPlantData: Omit<Plant, 'id' | 'healthScore' | 'status' | 'currentStress'>) => {
    const newPlant: Plant = {
      ...newPlantData,
      id: `plant-${Date.now()}`,
      healthScore: 90,
      status: 'optimal',
      currentStress: 'none',
    };
    setPlants((prev) => [...prev, newPlant]);
    setSelectedPlantId(newPlant.id);
  };

  const updatePlant = (updatedPlant: Plant) => {
    setPlants((prev) => prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p)));
  };

  const deletePlant = (id: string) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlantId === id && plants.length > 1) {
      setSelectedPlantId(plants.find((p) => p.id !== id)?.id || '');
    }
  };

  const addDevice = (newDevData: Omit<IoTDevice, 'id' | 'lastHeartbeat' | 'readingsCount'>) => {
    const newDev: IoTDevice = {
      ...newDevData,
      id: `dev-${Date.now()}`,
      lastHeartbeat: 'Just now',
      readingsCount: 0,
    };
    setDevices((prev) => [...prev, newDev]);
  };

  const deleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const resolveRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isResolved: true, resolvedAt: 'Just now' } : r
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateTelegramConfig = (config: Partial<TelegramConfig>) => {
    setTelegramConfig((prev) => ({ ...prev, ...config }));
  };

  const sendTestTelegramAlert = () => {
    const testNotif: NotificationLog = {
      id: `notif-${Date.now()}`,
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      title: '🤖 Telegram Test Dispatch',
      message: `Diagnostic alert verified for ${selectedPlant.name}. Moisture: ${currentReading.soilMoisture}%, Temp: ${currentReading.temperature}°C.`,
      severity: 'info',
      channel: 'both',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [testNotif, ...prev]);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        isDarkMode,
        toggleDarkMode,
        plants,
        selectedPlant,
        selectedPlantId,
        setSelectedPlantId,
        addPlant,
        updatePlant,
        deletePlant,
        devices,
        addDevice,
        deleteDevice,
        recommendations,
        resolveRecommendation,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        telegramConfig,
        updateTelegramConfig,
        sendTestTelegramAlert,
        simulationScenario,
        setSimulationScenario,
        currentReading,
        historyReadings,
        mlPrediction,
        triggerManualReading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
