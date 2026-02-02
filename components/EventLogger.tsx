
import React, { useState } from 'react';
import { useApp } from '../store';
import { ICONS } from '../constants';
import { EventLog } from '../types';

interface EventLoggerProps {
  onFinish: () => void;
}

const EventLogger: React.FC<EventLoggerProps> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const { addEventLog } = useApp();

  const [type, setType] = useState<EventLog['type']>('Small Win');
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');

  const types: EventLog['type'][] = ['Argument', 'Small Win', 'Feedback', 'Unexpected'];

  const handleSave = () => {
    addEventLog({
      type,
      intensity,
      note
    });
    onFinish();
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-6 flex justify-between items-center border-b border-slate-50">
        <button onClick={onFinish} className="p-2 text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Log Event</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-8">What happened?</h2>
            <div className="grid grid-cols-1 gap-3 mb-12">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => { setType(t); setStep(2); }}
                  className="p-5 rounded-3xl border-2 border-slate-100 flex justify-between items-center hover:border-indigo-400 transition group"
                >
                  <span className="font-bold text-slate-700">{t}</span>
                  <ICONS.ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
            <div>
              <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-2">Details</h2>
              <p className="text-slate-400">Captured: <span className="text-indigo-600 font-bold">{type}</span></p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-700">Intensity Impact</span>
                <span className="text-indigo-600 font-bold">{intensity}/5</span>
              </div>
              <input 
                type="range" min="1" max="5" step="1"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <span className="block font-bold text-slate-700 mb-4">Quick Note (Optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A small hint of context..."
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition min-h-[120px]"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-3xl font-bold">
                Back
              </button>
              <button onClick={handleSave} className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-bold shadow-lg shadow-indigo-100">
                Save Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLogger;
