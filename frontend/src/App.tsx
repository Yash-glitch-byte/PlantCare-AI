import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { MyPlantsPage } from './pages/MyPlantsPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { PlantAnalyticsPage } from './pages/PlantAnalyticsPage';
import { PlantIntelligencePage } from './pages/PlantIntelligencePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { NotificationHistoryPage } from './pages/NotificationHistoryPage';
import { TelegramIntegrationPage } from './pages/TelegramIntegrationPage';
import { DeviceManagementPage } from './pages/DeviceManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { 
  LayoutDashboard, 
  Sprout, 
  Activity, 
  BarChart3, 
  Lightbulb, 
  Settings as SettingsIcon 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeSection, setActiveSection } = useApp();

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewPage />;
      case 'plants':
        return <MyPlantsPage />;
      case 'monitoring':
        return <LiveMonitoringPage />;
      case 'analytics':
        return <PlantAnalyticsPage />;
      case 'intelligence':
        return <PlantIntelligencePage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'notifications':
        return <NotificationHistoryPage />;
      case 'telegram':
        return <TelegramIntegrationPage />;
      case 'devices':
        return <DeviceManagementPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
          {renderSection()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around py-2 px-1">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeSection === 'overview' ? 'text-botanical-600 dark:text-botanical-400' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveSection('plants')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeSection === 'plants' ? 'text-botanical-600 dark:text-botanical-400' : 'text-slate-500'
          }`}
        >
          <Sprout className="h-5 w-5" />
          <span>Plants</span>
        </button>
        <button
          onClick={() => setActiveSection('monitoring')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeSection === 'monitoring' ? 'text-botanical-600 dark:text-botanical-400' : 'text-slate-500'
          }`}
        >
          <Activity className="h-5 w-5" />
          <span>Live</span>
        </button>
        <button
          onClick={() => setActiveSection('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeSection === 'analytics' ? 'text-botanical-600 dark:text-botanical-400' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Charts</span>
        </button>
        <button
          onClick={() => setActiveSection('recommendations')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeSection === 'recommendations' ? 'text-botanical-600 dark:text-botanical-400' : 'text-slate-500'
          }`}
        >
          <Lightbulb className="h-5 w-5" />
          <span>Advice</span>
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeSection === 'settings' ? 'text-botanical-600 dark:text-botanical-400' : 'text-slate-500'
          }`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
