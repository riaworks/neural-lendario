import React from 'react';
import { HashRouter } from 'react-router-dom';
import { SystemProvider } from './context/GameContext';
import { SystemGraph } from './components/RealmMap';
import { UIOverlay } from './components/Dashboard';

export default function App() {
  return (
    <SystemProvider>
      <HashRouter>
        <div className="relative w-full h-screen bg-[#030712] overflow-hidden font-sans select-none">
          
          {/* Background Ambient Effects */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Main Visualization Layer */}
          <SystemGraph />

          {/* UI Layer (HUD, Chat, Details) */}
          <UIOverlay />

          {/* Branding */}
          <div className="absolute top-6 left-8 z-20 pointer-events-none">
            <h1 className="text-2xl font-bold tracking-tighter text-white">
              LENDÁRIO<span className="text-blue-500">.AI</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] uppercase mt-1">
              Neural Architecture Viewer
            </p>
          </div>
          
        </div>
      </HashRouter>
    </SystemProvider>
  );
}