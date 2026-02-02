
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { generateWeeklyInsights } from '../services/geminiService';
import { WeeklyInsight } from '../types';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Insights: React.FC = () => {
  const { logs, settings } = useApp();
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (logs.length < 3 || settings.quietMode) return;
      setLoading(true);
      const res = await generateWeeklyInsights(logs);
      setInsight(res);
      setLoading(false);
    };
    fetchInsights();
  }, [logs.length, settings.quietMode]);

  if (settings.quietMode) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-center">
        <div className="text-5xl mb-6">🧘</div>
        <h2 className="text-xl font-outfit font-bold text-slate-800 mb-2">Quiet Mode Active</h2>
        <p className="text-slate-500 leading-relaxed text-sm">
          No analysis today. Just observe and be. Insights will return when you're ready.
        </p>
      </div>
    );
  }

  if (logs.length < 3) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-center">
        <div className="text-5xl mb-6">🔭</div>
        <h2 className="text-xl font-outfit font-bold text-slate-800 mb-2">Patience, Explorer</h2>
        <p className="text-slate-500 leading-relaxed text-sm">
          Trace a few more threads (at least 3 logs) to reveal the hidden rhythms of your week.
        </p>
      </div>
    );
  }

  const chartData = logs.slice(0, 7).reverse().map(l => ({
    name: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: l.mood,
    stress: l.stress,
    energy: l.energy
  }));

  return (
    <div className="p-6 pt-10">
      <header className="mb-10">
        <h1 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-1">Insights</h1>
        <p className="text-2xl font-outfit font-bold text-slate-800">Weekly Reflection</p>
      </header>

      {/* Rhythm Chart */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Weekly Rhythm</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="mood" stroke="#6366f1" fillOpacity={1} fill="url(#colorMood)" strokeWidth={3} />
              <Area type="monotone" dataKey="energy" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mood</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 border-dashed" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Energy</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm italic">Tracing patterns...</p>
        </div>
      ) : insight ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Gentle Forecast */}
          <div className="bg-emerald-900 p-8 rounded-[40px] text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔮</span>
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Gentle Forecast</h3>
            </div>
            <p className="text-lg font-outfit leading-relaxed">
              {insight.forecast}
            </p>
            <p className="text-[10px] text-emerald-400/60 uppercase mt-4 font-bold tracking-widest">
              A soft bridge from past to future
            </p>
          </div>

          {/* Cause Effect Cards */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {insight.cards.map((card, idx) => (
              <div key={idx} className="min-w-[280px] bg-slate-900 p-6 rounded-[32px] text-white">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                  card.type === 'cause-effect' ? 'bg-amber-500' : 'bg-indigo-500'
                }`}>
                  {card.type.replace('-', ' ')}
                </span>
                <h4 className="font-outfit font-bold text-lg mb-2">{card.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Threads Analysis */}
          <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 text-center">Hidden Threads</h3>
            <div className="space-y-6">
              {insight.threadStatuses.map((t, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    t.status === 'Stable' ? 'bg-emerald-400' : t.status === 'Sensitive' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-indigo-900 text-sm">{t.type}</span>
                      <span className="text-[9px] font-bold uppercase text-indigo-400/60 bg-white/50 px-1.5 rounded-full">{t.status}</span>
                    </div>
                    <p className="text-indigo-800/70 text-xs leading-relaxed">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">
          We couldn't generate insights just yet. Try again tomorrow.
        </div>
      )}
    </div>
  );
};

export default Insights;
