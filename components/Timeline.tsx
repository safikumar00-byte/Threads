
import React, { useState } from 'react';
import { useApp } from '../store';
import { MOOD_EMOJIS, MOOD_LABELS } from '../constants';
import { DailyLog } from '../types';

const Timeline: React.FC = () => {
  const { logs } = useApp();
  const [selectedDay, setSelectedDay] = useState<DailyLog | null>(null);

  // Group logs by week? For now just simple list
  const getMoodColor = (mood: number) => {
    switch(mood) {
      case 5: return 'bg-emerald-400';
      case 4: return 'bg-emerald-200';
      case 3: return 'bg-slate-200';
      case 2: return 'bg-rose-200';
      case 1: return 'bg-rose-400';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="p-6 pt-10">
      <header className="mb-10">
        <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-1">Timeline</h1>
        <p className="text-2xl font-outfit font-bold text-slate-800">Your Pattern History</p>
      </header>

      {/* Grid of days */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Days</h3>
        <div className="grid grid-cols-7 gap-3">
          {logs.map((log) => (
            <button
              key={log.date}
              onClick={() => setSelectedDay(log)}
              className={`aspect-square rounded-full transition-all transform hover:scale-110 active:scale-90 flex items-center justify-center ${
                getMoodColor(log.mood)
              } ${selectedDay?.date === log.date ? 'ring-4 ring-indigo-100 ring-offset-2 scale-110' : ''}`}
            >
              <span className="text-[10px] font-bold text-slate-900/40">
                {new Date(log.date).getDate()}
              </span>
            </button>
          ))}
          {logs.length === 0 && (
            <div className="col-span-7 py-12 text-center text-slate-400 text-sm italic">
              No threads traced yet.
            </div>
          )}
        </div>
      </div>

      {/* Expanded Detail */}
      <div className="min-h-[300px]">
        {selectedDay ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-outfit font-bold text-slate-800 text-xl">
                    {new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </h4>
                  <p className="text-indigo-600 font-bold text-sm">{MOOD_LABELS[selectedDay.mood]}</p>
                </div>
                <div className="text-4xl">{MOOD_EMOJIS[selectedDay.mood]}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Energy / Stress</p>
                  <p className="text-slate-700 font-bold">{selectedDay.energy} / {selectedDay.stress}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Workload / Sleep</p>
                  <p className="text-slate-700 font-bold">{selectedDay.workload} / {selectedDay.sleepQuality}</p>
                </div>
              </div>

              {selectedDay.events.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Events</p>
                  <div className="space-y-3">
                    {selectedDay.events.map(ev => (
                      <div key={ev.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-bold ${ev.type === 'Argument' ? 'text-rose-500' : ev.type === 'Small Win' ? 'text-emerald-500' : 'text-indigo-500'}`}>
                            {ev.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">Impact {ev.intensity}/5</span>
                        </div>
                        {ev.note && <p className="text-sm text-slate-600 italic">"{ev.note}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 p-8 text-center">
            <p className="text-slate-400 text-sm font-medium">Tap a day above to see the threads that shaped it.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
