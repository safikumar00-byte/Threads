
import React, { useState } from 'react';
import { useApp } from '../store';
import { EventLog } from '../types';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const Profile: React.FC = () => {
  const { settings, updateSettings, resetData, logs, addReminder, removeReminder, toggleReminder, user, logout } = useApp();
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<EventLog['type'] | 'Any'>('Any');
  const [showAddForm, setShowAddForm] = useState(false);

  const eventTypes: (EventLog['type'] | 'Any')[] = ['Any', 'Argument', 'Small Win', 'Feedback', 'Unexpected'];

  const handleAddReminder = () => {
    if (!newLabel.trim()) return;
    addReminder({ label: newLabel, targetEventType: newType, isActive: true });
    setNewLabel('');
    setShowAddForm(false);
  };

  const toggleCheckInDay = (day: number) => {
    const current = settings.checkInDays || [];
    const updated = current.includes(day) ? current.filter(d => d !== day) : [...current, day].sort();
    updateSettings({ checkInDays: updated });
  };

  const reflectionMilestones = [
    { count: 10, label: 'Observer', icon: '🌱' },
    { count: 50, label: 'Pattern Finder', icon: '🔍' },
    { count: 100, label: 'Thread Seeker', icon: '🧵' },
    { count: 250, label: 'Rhythm Master', icon: '🌊' },
    { count: 500, label: 'Zenith', icon: '🏔️' },
  ];

  const totalAwareness = settings.milestones.totalAwareness || 0;

  return (
    <div className="p-6 pt-10">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-1">Profile</h1>
          <p className="text-2xl font-outfit font-bold text-slate-800">Your Journey</p>
        </div>
        <button 
          onClick={() => { if(confirm('Logout of Threads?')) logout(); }}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          title="Sign Out"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm mb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative shadow-lg ring-4 ring-indigo-50">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-4xl font-outfit font-bold">
              {user?.name?.[0] || 'T'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-white border border-slate-100 rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-sm">
            🥇
          </div>
        </div>
        <h2 className="text-xl font-outfit font-bold text-slate-800">{user?.name || 'Thread Seeker'}</h2>
        <p className="text-slate-400 text-sm mb-4">{user?.email}</p>
        <div className="bg-indigo-50 px-4 py-1.5 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          {totalAwareness} moments of awareness
        </div>
      </div>

      {/* Reflection Milestones Gallery */}
      <section className="mb-10 space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Reflection Milestones</h3>
        <div className="grid grid-cols-2 gap-3">
          {reflectionMilestones.map((m) => {
            const isAchieved = totalAwareness >= m.count;
            return (
              <div 
                key={m.count}
                className={`p-4 rounded-[24px] border transition-all ${
                  isAchieved 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-100 opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isAchieved ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {m.count} Moments
                </p>
                <p className="font-outfit font-bold text-sm leading-tight">{m.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="space-y-6">
        {/* Quiet Mode Toggle */}
        <div className={`p-6 rounded-[32px] border transition-all shadow-sm ${settings.quietMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <div className="pr-4">
              <p className="font-bold text-sm">Quiet Mode</p>
              <p className={`text-[10px] ${settings.quietMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Disables AI analysis and active nudges. Just observe today.
              </p>
            </div>
            <button 
              onClick={() => updateSettings({ quietMode: !settings.quietMode })}
              className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                settings.quietMode ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                settings.quietMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Mindfulness Reminders Section */}
        <section className={`space-y-4 transition-opacity ${settings.quietMode ? 'opacity-40 grayscale' : ''}`}>
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mindfulness Intentions</h3>
            {!showAddForm && !settings.quietMode && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                New Intention
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="bg-white p-6 rounded-[32px] border-2 border-indigo-100 shadow-lg animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800">New Intention</h4>
                <button onClick={() => setShowAddForm(false)} className="text-slate-300 hover:text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">What to notice?</label>
                  <input type="text" placeholder="e.g. Pause before reacting" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" autoFocus />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Trigger Event</label>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.map(t => (
                      <button key={t} onClick={() => setNewType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${newType === t ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 text-slate-500 text-sm font-bold rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button onClick={handleAddReminder} disabled={!newLabel.trim()} className="flex-[2] py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none transition-all">Save Intention</button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {settings.mindfulnessReminders.length === 0 && !showAddForm ? (
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 border-dashed text-center">
                <p className="text-sm text-slate-400 font-medium">No intentions set yet.</p>
              </div>
            ) : (
              settings.mindfulnessReminders.map(reminder => (
                <div key={reminder.id} className={`group relative flex items-center justify-between p-4 rounded-3xl border transition-all ${reminder.isActive ? 'bg-white border-indigo-50 shadow-sm' : 'bg-slate-50/50 border-transparent opacity-60'}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      disabled={settings.quietMode}
                      onClick={() => toggleReminder(reminder.id)} 
                      className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${reminder.isActive ? 'bg-indigo-600' : 'bg-slate-300'} ${settings.quietMode ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${reminder.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${reminder.isActive ? 'text-slate-800' : 'text-slate-400'}`}>{reminder.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${reminder.isActive ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>{reminder.targetEventType}</span>
                      </div>
                    </div>
                  </div>
                  {!settings.quietMode && (
                    <button onClick={() => removeReminder(reminder.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all active:scale-95">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* General Settings */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Check-in Schedule</h3>
          <div className="flex justify-between items-center mb-8 bg-slate-50 p-4 rounded-2xl">
            <div>
              <p className="font-bold text-slate-700 text-sm">Nudge Time</p>
              <p className="text-[10px] text-slate-400">Time for daily check-in</p>
            </div>
            <input type="time" value={settings.preferredCheckInTime} onChange={(e) => updateSettings({ preferredCheckInTime: e.target.value })} className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <p className="font-bold text-slate-700 text-sm mb-4 px-1">Recurring Days</p>
            <div className="flex justify-between">
              {DAYS.map((day, idx) => (
                <button key={idx} onClick={() => toggleCheckInDay(idx)} className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all ${(settings.checkInDays || []).includes(idx) ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-white text-slate-300 border border-slate-100 hover:border-slate-200'}`}>{day}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Storage & Privacy</h3>
          <button onClick={() => { if (confirm('Are you sure you want to clear all data? This cannot be undone.')) resetData(); }} className="w-full py-4 bg-white text-rose-500 border border-rose-100 font-bold text-sm rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95">Reset All Application Data</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
