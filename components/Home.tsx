
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { MOOD_EMOJIS, MOOD_LABELS, ICONS } from '../constants';
import { WeeklyInsight } from '../types';
import { generateWeeklyInsights } from '../services/geminiService';

interface HomeProps {
  onStartCheckIn: () => void;
  onStartEventLog: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartCheckIn, onStartEventLog }) => {
  const { logs, threads, settings } = useApp();
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  
  // Nudges are silenced in Quiet Mode
  const activeReminders = settings.quietMode 
    ? [] 
    : settings.mindfulnessReminders.filter(r => r.isActive);

  useEffect(() => {
    const fetchStory = async () => {
      // No analysis calls during Quiet Mode
      if (logs.length >= 3 && !settings.quietMode) {
        const res = await generateWeeklyInsights(logs);
        if (res) setInsight(res);
      }
    };
    fetchStory();
  }, [logs.length, settings.quietMode]);

  const getThreadColor = (level: number) => {
    if (level < 3) return 'bg-emerald-400';
    if (level < 7) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const getThreadClass = (level: number) => {
    if (level >= 7) return 'animate-thread-volatile';
    if (level <= 3) return 'animate-thread-stable';
    return '';
  };

  const milestones = [
    { count: 10, label: 'Observer', icon: '🌱' },
    { count: 50, label: 'Pattern Finder', icon: '🔍' },
    { count: 100, label: 'Thread Seeker', icon: '🧵' },
    { count: 250, label: 'Rhythm Master', icon: '🌊' },
    { count: 500, label: 'Zenith', icon: '🏔️' },
  ];

  const currentMilestone = milestones.reverse().find(m => settings.milestones.totalAwareness >= m.count);

  return (
    <div className="p-6 pt-10">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-1">
            {settings.quietMode ? 'Observing' : 'Today'}
          </h1>
          <p className="text-2xl font-outfit font-bold text-slate-800">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {settings.quietMode && (
          <div className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-sm">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
            Quiet Mode
          </div>
        )}
      </header>

      {/* Narrative & Forecast Section - Hidden in Quiet Mode */}
      {!settings.quietMode && insight && (
        <div className="mb-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-indigo-900 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-100/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">A Weekly Story</span>
              <div className="flex-1 h-px bg-indigo-800" />
            </div>
            <p className="text-sm font-outfit leading-relaxed italic opacity-90">
              "{insight.story}"
            </p>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-indigo-50 shadow-sm border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔮</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bridge to Tomorrow</span>
            </div>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {insight.forecast}
            </p>
          </div>
        </div>
      )}

      {/* Milestone Moment - Very subtle in Quiet Mode */}
      {currentMilestone && (
        <div className={`mb-10 animate-in zoom-in-95 duration-500 ${settings.quietMode ? 'opacity-50 grayscale' : ''}`}>
          <div className="bg-amber-50 border border-amber-200/50 p-6 rounded-[32px] flex items-center gap-5 relative overflow-hidden shadow-sm shadow-amber-100">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-6xl">{currentMilestone.icon}</span>
            </div>
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-amber-200 shrink-0">
              {currentMilestone.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Milestone Reached</p>
              <h3 className="text-lg font-outfit font-bold text-amber-900">
                Level: {currentMilestone.label}
              </h3>
              <p className="text-amber-800/60 text-xs font-medium">
                {settings.milestones.totalAwareness} moments of reflection logged
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mindfulness Intentions - Only shown if NOT in Quiet Mode */}
      {activeReminders.length > 0 && (
        <div className="mb-8 space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Mindful Intentions</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {activeReminders.map(reminder => (
              <div key={reminder.id} className="min-w-[200px] bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 text-sm">✨</div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">{reminder.label}</p>
                  <p className="text-[9px] text-indigo-400 font-medium uppercase mt-0.5">{reminder.targetEventType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Mood Snapshot */}
      <div className={`p-8 rounded-[40px] mb-8 flex flex-col items-center shadow-sm border border-slate-100 transition-all ${settings.quietMode ? 'bg-slate-50' : 'bg-soft-gradient'}`}>
        <div className="text-8xl mb-4 drop-shadow-sm transition-transform hover:scale-110 cursor-default">
          {todayLog ? MOOD_EMOJIS[todayLog.mood] : '✨'}
        </div>
        <h2 className="text-xl font-outfit font-bold text-slate-800 mb-1">
          {todayLog ? MOOD_LABELS[todayLog.mood] : (settings.quietMode ? 'Just observing' : 'How are you feeling?')}
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          {todayLog ? 'Observation recorded' : (settings.quietMode ? 'Reflect silently when ready' : 'Start your daily reflection')}
        </p>
        
        <button 
          onClick={onStartCheckIn}
          className={`px-8 py-3 rounded-2xl font-semibold transition shadow-md active:scale-95 ${
            todayLog 
              ? 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {todayLog ? 'Update Reflection' : 'Record Reflection'}
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="bg-indigo-50 w-8 h-8 rounded-lg flex items-center justify-center text-indigo-600">
            <ICONS.Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-outfit font-bold text-slate-800">{todayLog?.events.length || 0}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Moments Logged</p>
          </div>
        </div>
        <button 
          onClick={onStartEventLog}
          className="bg-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-indigo-100 flex flex-col justify-center items-center h-32 hover:bg-indigo-700 transition active:scale-95"
        >
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <ICONS.Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold text-sm">Trace Moment</span>
        </button>
      </div>

      {/* Active Threads Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Current Threads</h3>
        <div className="space-y-6">
          {threads.map((thread) => (
            <div key={thread.type} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-visible">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700">{thread.type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-all ${
                  thread.level < 3 ? 'text-emerald-600 bg-emerald-50' : 
                  thread.level < 7 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50 animate-pulse'
                }`}>
                  {thread.level < 3 ? 'Stable' : thread.level < 7 ? 'Sensitive' : 'Volatile'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full relative">
                {/* Note: overflow-hidden is removed from track to allow glow to be visible */}
                <div 
                  className={`h-full rounded-full thread-stretch ${getThreadColor(thread.level)} ${getThreadClass(thread.level)}`}
                  style={{ width: `${Math.max(4, (thread.level / 10) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
