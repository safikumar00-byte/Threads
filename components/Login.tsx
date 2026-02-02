
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { AuthUser } from '../types';

const Login: React.FC = () => {
  const { login } = useApp();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'config_needed'>('loading');

  // ACTION REQUIRED: Replace with your Client ID from https://console.cloud.google.com/
  const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  useEffect(() => {
    const checkGoogleScript = setInterval(() => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        setIsScriptLoaded(true);
        clearInterval(checkGoogleScript);
      }
    }, 100);

    // Timeout after 3s to show fallback options
    const timeout = setTimeout(() => {
      if (status === 'loading') setStatus('config_needed');
      clearInterval(checkGoogleScript);
    }, 3000);

    return () => {
      clearInterval(checkGoogleScript);
      clearTimeout(timeout);
    };
  }, [status]);

  useEffect(() => {
    if (isScriptLoaded && googleBtnRef.current) {
      const google = (window as any).google;
      
      try {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response: any) => {
            try {
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));

              const payload = JSON.parse(jsonPayload);
              login({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                id: payload.sub
              });
            } catch (e) {
              console.error("Payload parse error", e);
            }
          },
        });

        google.accounts.id.renderButton(googleBtnRef.current, { 
          theme: "outline", 
          size: "large", 
          width: 320, 
          shape: "pill",
          text: "continue_with"
        });
        setStatus('ready');
      } catch (err) {
        console.warn("Google GSI initialization failed - usually due to invalid Client ID");
        setStatus('config_needed');
      }
    }
  }, [isScriptLoaded, login]);

  const handleDemoLogin = () => {
    login({
      name: "Explorer",
      email: "guest@threads.app",
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      id: "demo-" + Math.random().toString(36).substr(2, 9)
    });
  };

  return (
    <div className="flex flex-col h-screen bg-soft-gradient items-center justify-center p-8 text-center animate-in fade-in duration-1000">
      <div className="mb-12">
        <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200/50 animate-pulse">
           <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <h1 className="text-4xl font-outfit font-bold text-slate-800 mb-3 tracking-tight">Threads</h1>
        <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          Trace your patterns. Understand your story.
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[48px] border border-white shadow-2xl shadow-indigo-100/40 w-full max-w-sm flex flex-col items-center">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-10">Secure Gateway</p>
        
        {/* Official Google Button Container */}
        <div ref={googleBtnRef} className={`mb-4 transition-all duration-500 ${status === 'ready' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`} />
        
        {status === 'loading' && (
          <div className="py-4 flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preparing Session...</p>
          </div>
        )}

        {status === 'config_needed' && (
          <div className="mb-6 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
             <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Note: Google Auth needs configuration</p>
          </div>
        )}

        <button 
          onClick={handleDemoLogin}
          className="w-full py-4 px-6 bg-white border border-slate-100 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 shadow-sm transition-all flex items-center justify-center gap-3 group"
        >
          <span className="bg-slate-100 p-1.5 rounded-full group-hover:bg-indigo-100 transition-colors">
            <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <span>Continue as Guest</span>
        </button>

        <p className="text-[10px] text-slate-400 mt-10 px-4 leading-relaxed font-medium">
          Threads is a private-first application. Your logs never leave your device.
        </p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-10 opacity-20 grayscale pointer-events-none">
        <span className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🌱</span>
        <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🧵</span>
        <span className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🔮</span>
      </div>
    </div>
  );
};

export default Login;
