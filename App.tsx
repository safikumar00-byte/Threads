
import React, { useState } from 'react';
import { AppProvider, useApp } from './store';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Home from './components/Home';
import DailyCheckIn from './components/DailyCheckIn';
import EventLogger from './components/EventLogger';
import Timeline from './components/Timeline';
import Insights from './components/Insights';
import Profile from './components/Profile';
import { ICONS } from './constants';

const AppContent: React.FC = () => {
  const { settings, user } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'timeline' | 'insights' | 'profile'>('home');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showEventLog, setShowEventLog] = useState(false);

  // New: Check for authentication first
  if (!user) {
    return <Login />;
  }

  if (!settings.onboardingCompleted) {
    return <Onboarding />;
  }

  if (showCheckIn) {
    return <DailyCheckIn onFinish={() => setShowCheckIn(false)} />;
  }

  if (showEventLog) {
    return <EventLogger onFinish={() => setShowEventLog(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onStartCheckIn={() => setShowCheckIn(true)} onStartEventLog={() => setShowEventLog(true)} />;
      case 'timeline': return <Timeline />;
      case 'insights': return <Insights />;
      case 'profile': return <Profile />;
      default: return <Home onStartCheckIn={() => setShowCheckIn(true)} onStartEventLog={() => setShowEventLog(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderContent()}
      </main>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ICONS.Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Today</span>
        </button>
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'timeline' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ICONS.History className="w-6 h-6" />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'insights' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ICONS.Insights className="w-6 h-6" />
          <span className="text-[10px] font-medium">Insights</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <ICONS.User className="w-6 h-6" />
          <span className="text-[10px] font-medium">You</span>
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
