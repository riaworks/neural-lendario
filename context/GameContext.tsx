import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { SystemState, DataPacket } from '../types';
import { LAYERS, SIMULATION_SEQUENCE } from '../constants';
import { playSound } from '../utils/audio';

interface SystemContextType {
  state: SystemState;
  startSimulation: (message: string) => void;
  togglePause: () => void;
  resetSimulation: () => void;
  setActiveNode: (id: string | null) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SystemState>({
    isSimulating: false,
    isPaused: false,
    currentStepIndex: -1,
    packets: [],
    activeNodeId: null,
    inputMessage: '',
    chatHistory: [
      { role: 'ai', text: 'Olá! Eu sou sua Mente Digital. Diga algo, e eu te mostro como eu penso.' }
    ],
    beamActive: false,
    showAgentSelector: false,
    selectedAgentIndex: null
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const packetIdCounter = useRef(0);

  // Packet Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setState(prev => {
        if (prev.isPaused || prev.packets.length === 0) return prev; // Pause animation too

        const updatedPackets = prev.packets
          .map(p => ({
            ...p,
            progress: p.progress + 2.0 // Faster, laser-like speed
          }))
          .filter(p => p.progress <= 100);

        return { ...prev, packets: updatedPackets };
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const runStep = (stepIndex: number) => {
    // Check pause in state via a ref wrapper or just check inside the timer? 
    // Since we use setTimeout, we need to be careful.
    // The visual UI will handle the pause click by clearing timeout.
    
    if (stepIndex >= SIMULATION_SEQUENCE.length) {
      setState(prev => ({ 
        ...prev, 
        isSimulating: false, 
        currentStepIndex: -1,
        chatHistory: [...prev.chatHistory, { role: 'ai', text: 'Simulação concluída.' }] 
      }));
      playSound('success');
      return;
    }

    const step = SIMULATION_SEQUENCE[stepIndex];
    
    // SOUND & VISUAL EFFECTS
    playSound('blip');

    // Handle Agent Selection Special Step
    if (step.type === 'agent_selection') {
        setState(prev => ({
            ...prev,
            currentStepIndex: stepIndex,
            showAgentSelector: true,
            selectedAgentIndex: null, // Reset
            activeNodeId: step.activeNodes[0]
        }));

        // Trigger the selection logic after a delay
        setTimeout(() => {
             setState(prev => ({ ...prev, selectedAgentIndex: Math.floor(Math.random() * 3) })); // 0, 1 or 2
             playSound('success');
        }, 1500);

    } else {
        // Normal Step or Processing
        setState(prev => ({
            ...prev,
            showAgentSelector: false,
            currentStepIndex: stepIndex,
            activeNodeId: step.activeNodes[step.activeNodes.length - 1] 
        }));

        // Spawn packets if Transfer
        if (step.packets.length > 0) {
            const newPackets: DataPacket[] = step.packets.map(p => {
                const sourceLayer = LAYERS.find(l => l.id === p.from);
                return {
                    id: `pkt-${packetIdCounter.current++}`,
                    fromId: p.from,
                    toId: p.to,
                    progress: 0,
                    label: p.label,
                    color: '#22c55e', // MATRIX GREEN for flow
                    isComplete: false
                };
            });
            setState(prev => ({ ...prev, packets: [...prev.packets, ...newPackets] }));
        }
    }

    // Schedule next step
    timerRef.current = setTimeout(() => {
      runStep(stepIndex + 1);
    }, step.duration);
  };

  const startSimulation = (message: string) => {
    if (state.isSimulating) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    playSound('beam');

    setState(prev => ({
      ...prev,
      isSimulating: true,
      isPaused: false,
      inputMessage: message,
      chatHistory: [...prev.chatHistory, { role: 'user', text: message }],
      packets: [],
      beamActive: true,
      currentStepIndex: -1,
      activeNodeId: null,
      showAgentSelector: false
    }));

    // Wait for Input Beam
    setTimeout(() => {
        setState(prev => ({ ...prev, beamActive: false }));
        runStep(0);
    }, 1000);
  };

  const togglePause = () => {
    setState(prev => {
        const nextPaused = !prev.isPaused;
        if (nextPaused) {
            // PAUSE: Clear the timer so next step doesn't run
            if (timerRef.current) clearTimeout(timerRef.current);
        } else {
            // RESUME: Call runStep with current index immediately
            if (prev.currentStepIndex !== -1) {
                runStep(prev.currentStepIndex + 1); // Resume next step
            }
        }
        return { ...prev, isPaused: nextPaused };
    });
  };

  const resetSimulation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState(prev => ({
      ...prev,
      isSimulating: false,
      isPaused: false,
      currentStepIndex: -1,
      packets: [],
      activeNodeId: null,
      beamActive: false,
      showAgentSelector: false
    }));
  };

  const setActiveNode = (id: string | null) => {
    setState(prev => ({ ...prev, activeNodeId: id }));
  };

  return (
    <SystemContext.Provider value={{ state, startSimulation, togglePause, resetSimulation, setActiveNode }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};