
import React, { useState } from 'react';
import { useApp } from '../store';
import { MOOD_EMOJIS, ICONS } from '../constants';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const { completeOnboarding, updateSettings } = useApp();
  const [demoMood, setDemoMood] = useState(3);
  const [checkInTime, setCheckInTime] = useState('20:00');
  const [checkInDays, setCheckInDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const next = () => setStep(s => s + 1);

  const toggleDay = (day: number) => {
    setCheckInDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-8 text-center">
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <div className="w-10 h-10 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 mb-4">Welcome to Threads</h1>
          <p className="text-slate-600 mb-12 text-lg leading-relaxed">
            Understand your week, see patterns, gently notice what shapes your days.
          </p>
          <button 
            onClick={next}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            Start My Journey
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-outfit font-bold text-slate-800 mb-6">What Threads Is (and isn't)</h2>
          <div className="space-y-4 mb-12">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-sm">
                This is not therapy or a mood diary. It's a way to observe the <strong>patterns</strong> of your life without judgment.
              </p>
            </div>
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
              <p className="text-indigo-700 font-medium text-sm">
                Simple, fast, and entirely private to you.
              </p>
            </div>
          </div>
          <button 
            onClick={next}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100"
          >
            I Understand
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
          <h2 className="text-2xl font-outfit font-bold text-slate-800 mb-4">Check-in Schedule</h2>
          <p className="text-slate-500 mb-8 text-sm">When and which days should we nudge you?</p>
          
          <input 
            type="time" 
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="w-full text-4xl font-outfit font-bold text-center py-6 bg-white rounded-3xl border-2 border-slate-100 focus:border-indigo-400 focus:outline-none transition mb-8"
          />

          <div className="flex justify-between mb-12">
            {DAYS.map((day, idx) => (
              <button
                key={idx}
                onClick={() => toggleDay(idx)}
                className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  checkInDays.includes(idx) 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-slate-400 border border-slate-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              updateSettings({ preferredCheckInTime: checkInTime, checkInDays: checkInDays });
              next();
            }}
            disabled={checkInDays.length === 0}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Schedule
          </button>
          <button onClick={next} className="text-slate-400 text-sm font-medium">Skip for now</button>
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
          <h2 className="text-2xl font-outfit font-bold text-slate-800 mb-2">First Mood Check</h2>
          <p className="text-slate-500 mb-12 text-sm">Slide to choose your current mood</p>
          
          <div className="text-9xl mb-12 transform transition-transform duration-300 scale-110">
            {MOOD_EMOJIS[demoMood]}
          </div>

          <input 
            type="range" 
            min="1" 
            max="5" 
            step="1"
            value={demoMood}
            onChange={(e) => setDemoMood(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-16"
          />

          <button 
            onClick={next}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100"
          >
            Looks Good
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="animate-in zoom-in duration-500 flex flex-col items-center">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-8">
            <ICONS.Check className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-4">You're Ready</h2>
          <p className="text-slate-600 mb-12 leading-relaxed">
            Your journey starts today. We'll begin tracing the threads of your life.
          </p>
          <button 
            onClick={completeOnboarding}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-100"
          >
            Start Daily Check-In
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
