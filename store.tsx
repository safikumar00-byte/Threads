
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DailyLog, EventLog, UserSettings, ThreadState, MindfulnessReminder, AuthUser } from './types';

interface AppState {
  logs: DailyLog[];
  settings: UserSettings;
  threads: ThreadState[];
  user: AuthUser | null;
  addDailyLog: (log: Omit<DailyLog, 'events'>) => void;
  addEventLog: (event: Omit<EventLog, 'id' | 'timestamp'>) => void;
  completeOnboarding: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addReminder: (reminder: Omit<MindfulnessReminder, 'id'>) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  resetData: () => void;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const INITIAL_SETTINGS: UserSettings = {
  preferredCheckInTime: '20:00',
  checkInDays: [0, 1, 2, 3, 4, 5, 6],
  onboardingCompleted: false,
  theme: 'light',
  mindfulnessReminders: [],
  quietMode: false,
  milestones: { totalAwareness: 0 }
};

const INITIAL_THREADS: ThreadState[] = [
  { type: 'Stress', level: 0 },
  { type: 'Fatigue', level: 0 },
  { type: 'Conflict', level: 0 },
  { type: 'Success', level: 0 }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [threads, setThreads] = useState<ThreadState[]>(INITIAL_THREADS);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('threads_logs');
    const savedSettings = localStorage.getItem('threads_settings');
    const savedThreads = localStorage.getItem('threads_threads');
    const savedUser = localStorage.getItem('threads_user');

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (!parsed.mindfulnessReminders) parsed.mindfulnessReminders = [];
      if (!parsed.checkInDays) parsed.checkInDays = [0, 1, 2, 3, 4, 5, 6];
      if (parsed.quietMode === undefined) parsed.quietMode = false;
      if (!parsed.milestones) parsed.milestones = { totalAwareness: 0 };
      setSettings(parsed);
    }
    if (savedThreads) setThreads(JSON.parse(savedThreads));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('threads_logs', JSON.stringify(logs));
    localStorage.setItem('threads_settings', JSON.stringify(settings));
    localStorage.setItem('threads_threads', JSON.stringify(threads));
    if (user) {
      localStorage.setItem('threads_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('threads_user');
    }
  }, [logs, settings, threads, user]);

  const updateThreads = useCallback((newLog?: DailyLog, newEvent?: EventLog) => {
    setThreads(prev => {
      const updated = prev.map(t => {
        let level = t.level;
        level = Math.max(0, level - 0.5);
        if (newLog) {
          if (t.type === 'Stress') level += (newLog.stress / 3);
          if (t.type === 'Fatigue') {
            if (newLog.sleepQuality < 3) level += 1.5;
            if (newLog.workload > 4) level += 1;
          }
        }
        if (newEvent) {
          if (t.type === 'Conflict' && newEvent.type === 'Argument') level += newEvent.intensity;
          if (t.type === 'Success' && newEvent.type === 'Small Win') level += 1.5;
          if (t.type === 'Stress' && newEvent.type === 'Feedback') level += (newEvent.intensity * 0.5);
        }
        return { ...t, level: Math.min(10, level) };
      });
      return updated;
    });
  }, []);

  const incrementAwareness = () => {
    setSettings(prev => ({
      ...prev,
      milestones: { totalAwareness: prev.milestones.totalAwareness + 1 }
    }));
  };

  const addDailyLog = (logData: Omit<DailyLog, 'events'>) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLogIndex = logs.findIndex(l => l.date === today);
    const newLog: DailyLog = {
      ...logData,
      events: existingLogIndex >= 0 ? logs[existingLogIndex].events : []
    };
    if (existingLogIndex >= 0) {
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = newLog;
      setLogs(updatedLogs);
    } else {
      setLogs(prev => [newLog, ...prev]);
      incrementAwareness();
    }
    updateThreads(newLog);
  };

  const addEventLog = (eventData: Omit<EventLog, 'id' | 'timestamp'>) => {
    const today = new Date().toISOString().split('T')[0];
    const event: EventLog = {
      ...eventData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setLogs(prev => {
      const existingLogIndex = prev.findIndex(l => l.date === today);
      if (existingLogIndex >= 0) {
        const updatedLogs = [...prev];
        updatedLogs[existingLogIndex].events.push(event);
        return updatedLogs;
      } else {
        const emptyLog: DailyLog = {
          date: today,
          mood: 3,
          stress: 0,
          energy: 3,
          sleepQuality: 3,
          workload: 0,
          activity: 'None',
          events: [event]
        };
        return [emptyLog, ...prev];
      }
    });
    incrementAwareness();
    updateThreads(undefined, event);
  };

  const completeOnboarding = () => {
    setSettings(prev => ({ ...prev, onboardingCompleted: true }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addReminder = (reminder: Omit<MindfulnessReminder, 'id'>) => {
    const newReminder: MindfulnessReminder = { ...reminder, id: crypto.randomUUID() };
    setSettings(prev => ({ ...prev, mindfulnessReminders: [...prev.mindfulnessReminders, newReminder] }));
  };

  const removeReminder = (id: string) => {
    setSettings(prev => ({ ...prev, mindfulnessReminders: prev.mindfulnessReminders.filter(r => r.id !== id) }));
  };

  const toggleReminder = (id: string) => {
    setSettings(prev => ({
      ...prev,
      mindfulnessReminders: prev.mindfulnessReminders.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    }));
  };

  const resetData = () => {
    setLogs([]);
    setSettings(INITIAL_SETTINGS);
    setThreads(INITIAL_THREADS);
    localStorage.clear();
  };

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ 
      logs, settings, threads, user, addDailyLog, addEventLog, 
      completeOnboarding, updateSettings, addReminder, removeReminder, 
      toggleReminder, resetData, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
