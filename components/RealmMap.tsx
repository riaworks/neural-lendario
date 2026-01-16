import React from 'react';
import { useSystem } from '../context/GameContext';
import { LAYERS, SIMULATION_SEQUENCE } from '../constants';
import { SystemLayer } from '../types';
import { 
  Cpu, Server, Brain, Network, Bot, Layout, Activity, Database, Zap, User, Briefcase, FileText
} from 'lucide-react';

const icons: Record<string, any> = {
  Cpu, Server, Brain, Network, Bot, Layout, Activity, Database
};

// --- AGENT SELECTOR POPUP ---
const AgentSelector = ({ selectedIndex }: { selectedIndex: number | null }) => {
    const agents = [
        { name: "Agente Jurídico", icon: Briefcase, color: "text-blue-400" },
        { name: "Agente Criativo", icon: Zap, color: "text-purple-400" },
        { name: "Agente Analítico", icon: FileText, color: "text-green-400" }
    ];

    return (
        <div className="absolute top-[120px] left-[680px] z-50 flex gap-4 pointer-events-none">
            {agents.map((agent, idx) => {
                const isSelected = selectedIndex === idx;
                const isFaded = selectedIndex !== null && !isSelected;
                
                return (
                    <div 
                        key={idx}
                        className={`
                            w-24 h-32 bg-black/90 border-2 rounded-xl flex flex-col items-center justify-center p-2
                            transition-all duration-500 transform
                            ${isSelected ? 'border-green-500 scale-125 shadow-[0_0_30px_#22c55e]' : 'border-slate-700 scale-100'}
                            ${isFaded ? 'opacity-20 blur-sm' : 'opacity-100'}
                            ${selectedIndex === null ? 'animate-float' : ''}
                        `}
                        style={{ animationDelay: `${idx * 0.2}s` }}
                    >
                        <agent.icon className={`${agent.color} mb-2`} size={24} />
                        <div className="text-[10px] text-center font-bold text-white leading-tight">{agent.name}</div>
                        {isSelected && (
                            <div className="mt-2 text-[8px] bg-green-500 text-black px-2 py-0.5 rounded font-bold animate-pulse">
                                SELECTED
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// --- VISUAL ATOMS ---

const LaserPacket = ({ start, end, progress }: { start: {x: number, y: number}, end: {x: number, y: number}, progress: number }) => {
  const t = progress / 100;
  const x = start.x + (end.x - start.x) * t;
  const y = start.y + (end.y - start.y) * t;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow */}
      <circle r="6" fill="#22c55e" className="blur-[4px] opacity-80" />
      {/* Core */}
      <circle r="3" fill="#fff" />
      {/* Trail effect handled by SVG line dashing in ConnectionLine usually, but here just a head */}
    </g>
  );
};

const InputBeam = ({ target }: { target: {x: number, y: number} }) => {
    return (
        <g>
            <line 
                x1="50%" y1="100%" 
                x2={target.x} y2={target.y} 
                stroke="#22c55e" 
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="filter drop-shadow-[0_0_10px_#22c55e]"
            >
                <animate 
                    attributeName="stroke-dashoffset" 
                    from="1000" to="0" 
                    dur="0.4s" 
                    fill="freeze" 
                    calcMode="spline" 
                    keySplines="0.4 0 0.2 1"
                />
                 <animate 
                    attributeName="opacity" 
                    values="1;0" 
                    dur="0.6s" 
                    fill="freeze"
                />
            </line>
        </g>
    )
}

const ConnectionLine = ({ start, end, color, isActive }: { start: {x: number, y: number}, end: {x: number, y: number}, color: string, isActive: boolean }) => {
  return (
    <g>
      <line 
        x1={start.x} y1={start.y} 
        x2={end.x} y2={end.y} 
        stroke="#1e293b" 
        strokeWidth="1" 
      />
      {/* Matrix Flow Line */}
      <line 
        x1={start.x} y1={start.y} 
        x2={end.x} y2={end.y} 
        stroke={isActive ? "#22c55e" : color} 
        strokeWidth={isActive ? "3" : "2"} 
        strokeDasharray="4,8"
        strokeOpacity={isActive ? "1" : "0.2"}
        className={isActive ? "animate-dash" : ""}
      />
    </g>
  );
};

const NeuralNode = ({ 
  layer, 
  isActive, 
  isProcessing, 
  onClick 
}: { 
  layer: SystemLayer, 
  isActive: boolean, 
  isProcessing: boolean, 
  onClick: () => void 
}) => {
  const Icon = icons[layer.icon] || Layout;
  const isSubLayer = layer.id.startsWith('sub_');
  const size = isSubLayer ? 12 : 16;
  
  // Matrix style activation
  const activeColor = isActive ? '#22c55e' : layer.color;
  const activeGlow = isActive ? 'shadow-[0_0_40px_#22c55e]' : 'shadow-[0_0_30px_rgba(0,0,0,0.5)]';

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute flex flex-col items-center justify-center cursor-pointer group"
      style={{
        left: layer.position.x,
        top: layer.position.y,
        transform: 'translate(-50%, -50%)', 
      }}
    >
      {/* 1. Tech Ring */}
      <div className={`
        absolute rounded-full border border-dashed 
        transition-all duration-500
        ${isActive ? `w-32 h-32 border-green-500 animate-spin-slow border-2 opacity-100` : `w-24 h-24 border-slate-700 opacity-50 group-hover:border-slate-500`}
      `} />

      {/* 2. Core Card/Circle */}
      <div 
        className={`
          relative rounded-full flex items-center justify-center
          backdrop-blur-md transition-all duration-300
          ${isSubLayer ? 'w-14 h-14' : 'w-20 h-20'}
          ${isActive ? 'scale-110' : 'group-hover:scale-105'}
          ${activeGlow}
        `}
        style={{
          backgroundColor: '#0f1115',
          border: `2px solid ${activeColor}`
        }}
      >
        <Icon 
          size={isSubLayer ? 20 : 28} 
          color={activeColor} 
          className="transition-colors duration-300" 
        />
        
        {/* Machine Processing Pulse */}
        {isProcessing && (
           <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-50" />
        )}
      </div>

      {/* 3. Label */}
      <div className={`
        mt-4 px-3 py-1.5 rounded bg-black/80 border 
        transition-all duration-300 text-center min-w-[100px] backdrop-blur
        ${isActive 
          ? 'border-green-500 text-green-400 transform translate-y-1' 
          : 'border-slate-800 text-slate-400 group-hover:border-slate-600'}
      `}>
        <div className="text-[9px] font-mono uppercase tracking-widest opacity-80">
          {layer.layerSubtitle}
        </div>
        <div className={`font-bold font-sans ${isSubLayer ? 'text-xs' : 'text-sm'}`}>
          {layer.label}
        </div>
      </div>

    </div>
  );
};

export const SystemGraph: React.FC = () => {
  const { state, setActiveNode } = useSystem();
  const surfaceLayer = LAYERS.find(l => l.id === 'layer6');

  return (
    <div className="absolute inset-0 z-10 overflow-hidden bg-neural" onClick={() => setActiveNode(null)}>
      
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        
        {/* Input Beam */}
        {state.beamActive && surfaceLayer && (
            <InputBeam target={surfaceLayer.position} />
        )}

        {/* Lines */}
        {LAYERS.map(layer => 
          layer.connections.map(targetId => {
            const target = LAYERS.find(l => l.id === targetId);
            if (!target) return null;
            
            // Check if this connection is currently carrying data
            const isProcessing = state.packets.some(p => p.fromId === layer.id && p.toId === targetId);

            return (
              <ConnectionLine 
                key={`${layer.id}-${targetId}`}
                start={layer.position}
                end={target.position}
                color={layer.color}
                isActive={isProcessing}
              />
            );
          })
        )}
        
        {/* Packets */}
        {state.packets.map(pkt => {
           const fromLayer = LAYERS.find(l => l.id === pkt.fromId);
           const toLayer = LAYERS.find(l => l.id === pkt.toId);
           if (!fromLayer || !toLayer) return null;

           return (
             <LaserPacket 
                key={pkt.id}
                start={fromLayer.position}
                end={toLayer.position}
                progress={pkt.progress}
             />
           );
        })}
      </svg>

      {/* Nodes */}
      {LAYERS.map(layer => {
         const isProcessing = state.currentStepIndex !== -1 && 
                              SIMULATION_SEQUENCE[state.currentStepIndex]?.activeNodes.includes(layer.id);
         return (
           <NeuralNode 
              key={layer.id}
              layer={layer}
              isActive={state.activeNodeId === layer.id}
              isProcessing={!!isProcessing}
              onClick={() => setActiveNode(layer.id)}
           />
         );
      })}

      {/* Popups Overlays */}
      {state.showAgentSelector && (
          <AgentSelector selectedIndex={state.selectedAgentIndex} />
      )}

    </div>
  );
};