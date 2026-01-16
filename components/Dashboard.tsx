import React, { useState } from 'react';
import { useSystem } from '../context/GameContext';
import { LAYERS, SIMULATION_SEQUENCE } from '../constants';
import { X, Play, Pause, RefreshCw, Layers, Shield, DollarSign, AlertTriangle, Check, Info, Maximize2 } from 'lucide-react';

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">{children}</div>
);

const Value = ({ children, color = 'text-white' }: { children: React.ReactNode, color?: string }) => (
  <div className={`text-base font-bold font-sans ${color}`}>{children}</div>
);

const StatBlock = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-black/20 border border-white/5 p-2 rounded flex items-center space-x-3 hover:bg-white/5 transition">
    <div className={`p-1.5 rounded bg-black/40 text-${color}-400`}>
      <Icon size={14} />
    </div>
    <div>
      <Label>{label}</Label>
      <Value color={color ? `text-${color}-400` : undefined}>{value}</Value>
    </div>
  </div>
);

const StepExplanationCard = ({ step, currentStepIndex, totalSteps }: { step: any, currentStepIndex: number, totalSteps: number }) => {
    if (!step) return null;

    return (
        <div className="absolute top-24 left-8 z-50 animate-float pointer-events-none w-[350px]">
            <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.1)] overflow-hidden">
                <div className="h-0.5 bg-slate-800 w-full">
                    <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                    />
                </div>
                
                <div className="p-5 flex items-start space-x-3">
                    <div className="bg-green-500/10 p-2 rounded-full border border-green-500/30 mt-1">
                        <Info className="text-green-400" size={18} />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[9px] font-mono text-green-400 uppercase tracking-[0.2em]">
                                SEQUENCE {currentStepIndex + 1}/{totalSteps}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{step.description}</h3>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans border-l border-green-500/30 pl-3">
                            {step.details}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const UIOverlay: React.FC = () => {
  const { state, startSimulation, setActiveNode, togglePause } = useSystem();
  const [inputText, setInputText] = useState('');
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || state.isSimulating) return;
    startSimulation(inputText);
    setInputText('');
  };

  const activeLayer = LAYERS.find(l => l.id === state.activeNodeId);
  const currentStep = state.currentStepIndex !== -1 ? SIMULATION_SEQUENCE[state.currentStepIndex] : null;

  return (
    <>
      {/* EDUCATIONAL POPUP (Left Side - Simulating) */}
      {state.isSimulating && currentStep && (
          <StepExplanationCard 
            step={currentStep} 
            currentStepIndex={state.currentStepIndex}
            totalSteps={SIMULATION_SEQUENCE.length}
          />
      )}

      {/* RIGHT FLOATING HUD (Glass Effect) */}
      {activeLayer && (
        <div className={`
          absolute right-6 top-[15%] bottom-[20%] w-[340px] z-40
          bg-slate-950/40 backdrop-blur-2xl border border-white/10
          rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          flex flex-col animate-in slide-in-from-right-10 fade-in duration-500
        `}>
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-start bg-gradient-to-r from-white/5 to-transparent rounded-t-2xl">
              <div>
                <div className="text-[9px] font-mono text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                    DATA INSPECTOR
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{activeLayer.label}</h2>
              </div>
              <button 
                onClick={() => setActiveNode(null)} 
                className="text-slate-500 hover:text-white transition p-1 hover:bg-white/10 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              
              {/* Verdict Badge */}
              <div className={`
                px-3 py-2 rounded border flex items-center justify-between
                ${activeLayer.verdict === 'Cemitério' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 
                  activeLayer.verdict.includes('SWEET') ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-slate-800/50 border-slate-600/50 text-slate-300'}
              `}>
                <span className="font-mono text-[9px] uppercase tracking-widest opacity-80">VERDICT</span>
                <span className="font-bold text-sm">{activeLayer.verdict}</span>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                {activeLayer.description}
              </p>

              {/* Stats Grid */}
              <div className="space-y-2">
                <StatBlock icon={DollarSign} label="Margem" value={activeLayer.margin} color="green" />
                <StatBlock icon={Shield} label="Defesa" value={activeLayer.defense} color="blue" />
                <StatBlock icon={Layers} label="Acesso" value={activeLayer.access} color="purple" />
              </div>

              {/* Key Players */}
              {activeLayer.mainPlayers && (
                <div className="pt-2 border-t border-white/5">
                   <Label>Market Leaders</Label>
                   <div className="space-y-2 mt-2">
                     {activeLayer.mainPlayers.map((p, i) => (
                       <div key={i} className="flex justify-between items-center p-2.5 bg-white/5 rounded hover:bg-white/10 transition border border-transparent hover:border-white/10">
                          <span className="text-sm font-bold text-slate-200">{p.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{p.desc}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
            
            {/* Decorative Footer Line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-b-2xl opacity-50" />
        </div>
      )}

      {/* INPUT CONTROLS (Floating Bottom) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-30 flex flex-col items-center">
         <div className="w-full pointer-events-auto flex items-center gap-3 px-4">
            
            {/* Play/Pause Control */}
            {state.isSimulating && (
                <button 
                    onClick={togglePause}
                    className="w-12 h-12 shrink-0 rounded-full bg-black/60 backdrop-blur border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition text-white shadow-lg"
                >
                    {state.isPaused ? <Play fill="white" size={18} /> : <Pause fill="white" size={18} />}
                </button>
            )}

            <form onSubmit={handleSend} className="relative group flex-1">
               <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700" />
               <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Injetar prompt no sistema..."
                  disabled={state.isSimulating}
                  className="w-full bg-black/60 text-white border border-slate-700 rounded-full py-3.5 pl-6 pr-14 
                             focus:outline-none focus:border-blue-500 shadow-2xl backdrop-blur-md font-mono text-sm
                             disabled:opacity-50 transition-all placeholder:text-slate-500"
               />
               <button 
                  type="submit" 
                  disabled={state.isSimulating || !inputText.trim()}
                  className="absolute right-1.5 top-1.5 w-9 h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition disabled:opacity-0 disabled:scale-75"
               >
                  {state.isSimulating ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
               </button>
            </form>
         </div>
      </div>
    </>
  );
};