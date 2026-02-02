
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { AuthUser } from '../types';

const Login: React.FC = () => {
  const { login } = useApp();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Note: Replace this with your actual Client ID from Google Cloud Console.
  // See: https://console.cloud.google.com/
  const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  useEffect(() => {
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const google = (window as any).google;
      if (google?.accounts?.id) {
        setIsScriptLoaded(true);
        clearInterval(interval);
      }
      // If script doesn't load after 2 seconds, show a hint
      if (checkCount > 20) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
              const user: AuthUser = {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                id: payload.sub
              };
              login(user);
            } catch (e) {
              setAuthError("Failed to process login data.");
            }
          },
          auto_select: false,
        });

        google.accounts.id.renderButton(
          googleBtnRef.current,
          { 
            theme: "outline", 
            size: "large", 
            width: 320, 
            shape: "pill",
            text: "signin_with"
          }
        );
      } catch (err) {
        console.error("Google Auth Init Error:", err);
        setAuthError("Configuration needed for Google Login.");
      }
    }
  }, [isScriptLoaded, login]);

  const handleDemoLogin = () => {
    const demoUser: AuthUser = {
      name: "Explorer",
      email: "guest@threads.app",
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      id: "demo-" + Math.random().toString(36).substr(2, 9)
    };
    login(demoUser);
  };

  return (
    <div className="flex flex-col h-screen bg-soft-gradient items-center justify-center p-8 text-center animate-in fade-in duration-1000">
      <div className="mb-12">
        <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200/50 animate-pulse">
           <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <h1 className="text-4xl font-outfit font-bold text-slate-800 mb-3 tracking-tight">Threads</h1>
        <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          Understand your daily rhythms and trace the stories of your life.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-white shadow-2xl shadow-indigo-100/40 w-full max-w-sm flex flex-col items-center">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8">Secure Entry</p>
        
        {/* Google GSI Container */}
        <div ref={googleBtnRef} className="mb-4" />
        
        {(!isScriptLoaded && !authError) && (
          <div className="py-4 flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Waking Up...</p>
          </div>
        )}

        {authError && (
          <p className="text-[10px] text-rose-500 font-bold uppercase mb-4 px-4 bg-rose-50 py-2 rounded-lg">
            {authError}
          </p>
        )}

        <button 
          onClick={handleDemoLogin}
          className="w-full py-4 px-6 border border-slate-100 bg-slate-50/50 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group mt-2"
        >
          <span>Continue as Guest</span>
          <svg className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <p className="text-[10px] text-slate-400 mt-8 px-4 leading-relaxed italic">
          Your data is stored locally on this device and remains private to you.
        </p>
      </div>

      <div className="absolute bottom-12 left-0 right-0">
        <div className="flex justify-center gap-8 opacity-20 grayscale">
          <span className="text-2xl">🌱</span>
          <span className="text-2xl">🧵</span>
          <span className="text-2xl">🔮</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
