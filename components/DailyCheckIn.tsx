
import React, { useState } from 'react';
import { useApp } from '../store';
import { MOOD_EMOJIS, MOOD_LABELS, ICONS } from '../constants';
import { Mood, PhysicalActivity } from '../types';

interface DailyCheckInProps {
  onFinish: () => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const { addDailyLog, logs } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const existingLog = logs.find(l => l.date === today);

  const [mood, setMood] = useState<Mood>((existingLog?.mood as Mood) || 3);
  const [stress, setStress] = useState(existingLog?.stress || 0);
  const [energy, setEnergy] = useState(existingLog?.energy || 3);
  const [sleep, setSleep] = useState(existingLog?.sleepQuality || 3);
  const [workload, setWorkload] = useState(existingLog?.workload || 0);
  const [activity, setActivity] = useState<PhysicalActivity>(existingLog?.activity || 'None');

  const handleFinish = () => {
    addDailyLog({
      date: today,
      mood,
      stress,
      energy,
      sleepQuality: sleep,
      workload,
      activity
    });
    setStep(5); // Confirmation screen
  };

  const getSliderColor = (val: number, isStress: boolean = false) => {
    if (isStress) {
      if (val < 2) return 'accent-emerald-500';
      if (val < 4) return 'accent-amber-500';
      return 'accent-rose-500';
    }
    if (val < 2) return 'accent-rose-500';
    if (val < 4) return 'accent-amber-500';
    return 'accent-emerald-500';
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-slate-50">
        <button onClick={onFinish} className="p-2 text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Check-In</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-2">Overall Mood</h2>
            <p className="text-slate-400 mb-12">How would you sum up today?</p>
            
            <div className="flex flex-col items-center mb-16">
              <div className="text-[120px] mb-8 leading-none drop-shadow-md">
                {MOOD_EMOJIS[mood]}
              </div>
              <h3 className="text-2xl font-bold text-indigo-600">{MOOD_LABELS[mood]}</h3>
            </div>

            <input 
              type="range" min="1" max="5" step="1"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value) as Mood)}
              className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500 mb-12"
            />

            <button onClick={() => setStep(2)} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold shadow-lg shadow-indigo-100">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
            <div>
              <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-2">Stress & Energy</h2>
              <p className="text-slate-400 mb-12">Balance check.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-700">Stress Level</span>
                <span className="text-indigo-600 font-bold">{stress}/5</span>
              </div>
              <input 
                type="range" min="0" max="5" step="1"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className={`w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer ${getSliderColor(stress, true)}`}
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-300 font-bold uppercase">
                <span>Calm</span>
                <span>Peak</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-700">Energy Level</span>
                <span className="text-indigo-600 font-bold">{energy}/5</span>
              </div>
              <input 
                type="range" min="0" max="5" step="1"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className={`w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer ${getSliderColor(energy)}`}
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-300 font-bold uppercase">
                <span>Empty</span>
                <span>Full</span>
              </div>
            </div>

            <button onClick={() => setStep(3)} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold shadow-lg shadow-indigo-100">
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
            <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-8">Routine Metrics</h2>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-700">Sleep Quality</span>
                <span className="text-indigo-600 font-bold">{sleep}/5</span>
              </div>
              <input 
                type="range" min="0" max="5" step="1"
                value={sleep}
                onChange={(e) => setSleep(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-700">Workload</span>
                <span className="text-indigo-600 font-bold">{workload}/5</span>
              </div>
              <input 
                type="range" min="0" max="5" step="1"
                value={workload}
                onChange={(e) => setWorkload(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div>
              <span className="block font-bold text-slate-700 mb-4">Physical Activity</span>
              <div className="grid grid-cols-3 gap-3">
                {(['None', 'Light', 'Heavy'] as PhysicalActivity[]).map(act => (
                  <button
                    key={act}
                    onClick={() => setActivity(act)}
                    className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                      activity === act 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 bg-white text-slate-400'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleFinish} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold shadow-lg shadow-indigo-100">
              Finish Check-In
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-8">
              <ICONS.Check className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-4">All Set</h2>
            <p className="text-slate-500 mb-12">Your patterns are being traced quietly in the background.</p>
            <button 
              onClick={onFinish}
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold shadow-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCheckIn;
