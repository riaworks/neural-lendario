export type LayerType = 
  | 'foundation' 
  | 'compute' 
  | 'intelligence' 
  | 'connection' 
  | 'specialization' 
  | 'surface';

export interface NodePosition {
  x: number;
  y: number;
}

export interface Player {
  title: string;
  desc: string;
}

export interface SystemLayer {
  id: string;
  type: LayerType;
  layerNum: number;
  layerSubtitle: string;
  label: string;
  description: string;
  margin: string;
  defense: string;
  access: string;
  verdict: string;
  mainPlayers?: Player[];
  dos?: string[];
  donts?: string[];
  
  icon: string;
  position: NodePosition;
  connections: string[]; 
  color: string;
}

export interface DataPacket {
  id: string;
  fromId: string;
  toId: string;
  progress: number; 
  label?: string; 
  color: string;
  isComplete: boolean;
}

export type StepType = 'transfer' | 'agent_selection' | 'processing';

export interface SimulationStep {
  type: StepType;
  activeNodes: string[];
  packets: { from: string; to: string; label: string }[];
  description: string;
  duration: number; 
  details?: string;
}

export interface SystemState {
  isSimulating: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  packets: DataPacket[];
  activeNodeId: string | null; 
  inputMessage: string;
  chatHistory: { role: 'user' | 'ai'; text: string }[];
  beamActive: boolean;
  
  // Visual states for specific steps
  showAgentSelector: boolean;
  selectedAgentIndex: number | null; // 0, 1, or 2
}