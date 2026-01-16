import { SystemLayer, SimulationStep } from './types';

export const LAYERS: SystemLayer[] = [
  // --- INFRASTRUCTURE (Bottom) ---
  {
    id: 'layer1',
    type: 'foundation',
    layerNum: 1,
    layerSubtitle: 'FOUNDATION',
    label: 'Chips & Hardware',
    description: 'A base física (Silício). Margens altíssimas, monopólios globais.',
    margin: '60-70%',
    defense: 'Altíssima',
    access: 'Fechado',
    verdict: 'Fechada',
    icon: 'Cpu',
    position: { x: 500, y: 700 }, 
    connections: ['layer2'],
    color: '#94a3b8',
    mainPlayers: [{ title: 'NVIDIA', desc: 'H100 GPUs' }],
  },
  {
    id: 'layer2',
    type: 'compute',
    layerNum: 2,
    layerSubtitle: 'COMPUTE',
    label: 'Cloud Infra',
    description: 'Datacenters massivos que hospedam o hardware.',
    margin: '30-40%',
    defense: 'Alta',
    access: 'Oligopólio',
    verdict: 'Oligopólio',
    icon: 'Server',
    position: { x: 300, y: 600 },
    connections: ['layer3'],
    color: '#6366f1',
    mainPlayers: [{ title: 'AWS', desc: 'EC2 P5' }],
  },
  
  // --- INTELLIGENCE (Center) ---
  {
    id: 'layer3',
    type: 'intelligence',
    layerNum: 3,
    layerSubtitle: 'INTELLIGENCE',
    label: 'LLM Brain',
    description: 'O cérebro probabilístico (GPT/Claude).',
    margin: 'Em queda',
    defense: 'Média',
    access: 'API',
    verdict: 'Commodity',
    icon: 'Brain',
    position: { x: 500, y: 500 },
    connections: ['sub_summary'],
    color: '#d946ef',
    mainPlayers: [{ title: 'GPT-4', desc: 'OpenAI' }],
  },

  // --- ORCHESTRATION CLUSTER (Machines on the Right - Shifted Left for HUD) ---
  {
    id: 'sub_router',
    type: 'connection',
    layerNum: 4,
    layerSubtitle: 'ROUTER',
    label: 'Orchestrator',
    description: 'O porteiro. Decide para qual máquina enviar a tarefa.',
    margin: 'N/A',
    defense: 'Alta',
    access: 'Dev',
    verdict: 'SWEET SPOT',
    icon: 'Network',
    position: { x: 680, y: 400 }, // Moved from 700 to 680
    connections: ['sub_rag', 'layer3'],
    color: '#10b981',
  },
  {
    id: 'sub_rag',
    type: 'connection',
    layerNum: 4,
    layerSubtitle: 'MEMORY',
    label: 'RAG Machine',
    description: 'Busca dados proprietários (PDFs, BDs) para contextualizar.',
    margin: 'N/A',
    defense: 'Dados',
    access: 'Dev',
    verdict: 'SWEET SPOT',
    icon: 'Database', 
    position: { x: 780, y: 320 }, // Moved from 820 to 780
    connections: ['layer3'],
    color: '#059669',
  },
  {
    id: 'sub_summary',
    type: 'connection',
    layerNum: 4,
    layerSubtitle: 'OUTPUT',
    label: 'Refiner',
    description: 'Valida, formata e garante a segurança da resposta.',
    margin: 'N/A',
    defense: 'UX',
    access: 'Dev',
    verdict: 'SWEET SPOT',
    icon: 'Activity',
    position: { x: 350, y: 400 }, // Moved slightly left
    connections: ['layer5'],
    color: '#34d399',
  },

  // --- SURFACE & AGENTS (Top) ---
  {
    id: 'layer5',
    type: 'specialization',
    layerNum: 5,
    layerSubtitle: 'AGENTS',
    label: 'Agentes Verticais',
    description: 'Especialistas funcionais (Advogado IA, Médico IA, Coder IA).',
    margin: '40-60%',
    defense: 'Alta',
    access: 'SaaS',
    verdict: 'SWEET SPOT',
    icon: 'Bot',
    position: { x: 550, y: 220 }, // Slightly adjusted
    connections: ['sub_router'],
    color: '#06b6d4',
  },
  {
    id: 'layer6',
    type: 'surface',
    layerNum: 6,
    layerSubtitle: 'INTERFACE',
    label: 'Surface UI',
    description: 'O ponto de contato com o humano.',
    margin: '10-20%',
    defense: 'Baixa',
    access: 'Web',
    verdict: 'Cemitério',
    icon: 'Layout',
    position: { x: 500, y: 80 },
    connections: ['layer5'],
    color: '#ef4444',
  }
];

// --- MATRIX SIMULATION SEQUENCE ---

export const SIMULATION_SEQUENCE: SimulationStep[] = [
  // 1. INPUT FLASH
  {
    type: 'transfer',
    description: "1. INPUT DETECTADO",
    activeNodes: ['layer6'],
    packets: [], // Handled by Beam Animation
    duration: 1500,
    details: "O usuário enviou um comando. O sistema dispara um feixe ótico para a camada de Superfície."
  },
  // 2. SURFACE PROCESSING -> SEND TO AGENTS
  {
    type: 'transfer',
    description: "2. UI -> AGENTES",
    activeNodes: ['layer6', 'layer5'],
    packets: [{ from: 'layer6', to: 'layer5', label: 'Raw Prompt' }],
    duration: 1500,
    details: "A interface converte o clique em JSON e envia para a camada de Agentes Verticais."
  },
  // 3. AGENT SELECTION (GAMIFIED)
  {
    type: 'agent_selection',
    description: "3. SELEÇÃO DE ESPECIALISTA",
    activeNodes: ['layer5'],
    packets: [],
    duration: 3500, // Time for the "Roulette" animation
    details: "O sistema analisa a intenção e escolhe o melhor Agente Especialista (ex: Jurídico, Criativo ou Analítico) para a tarefa."
  },
  // 4. AGENT -> ROUTER
  {
    type: 'transfer',
    description: "4. AGENTE -> ORQUESTRADOR",
    activeNodes: ['layer5', 'sub_router'],
    packets: [{ from: 'layer5', to: 'sub_router', label: 'Plan' }],
    duration: 1500,
    details: "O Agente escolhido cria um plano de execução e o envia para o Orquestrador Central."
  },
  // 5. ROUTER -> RAG MACHINE
  {
    type: 'processing',
    description: "5. MÁQUINA DE MEMÓRIA (RAG)",
    activeNodes: ['sub_router', 'sub_rag'],
    packets: [{ from: 'sub_router', to: 'sub_rag', label: 'Query' }],
    duration: 2500,
    details: "A 'Máquina de Contexto' é ativada. Ela busca dados proprietários da empresa para enriquecer o prompt."
  },
  // 6. RAG -> INTELLIGENCE
  {
    type: 'processing',
    description: "6. EMPACOTAMENTO -> LLM",
    activeNodes: ['sub_rag', 'layer3'],
    packets: [{ from: 'sub_rag', to: 'layer3', label: 'Context + Prompt' }],
    duration: 2000,
    details: "O Orquestrador empacota o Prompt do usuário + Dados do RAG e despacha para o Cérebro (LLM)."
  },
  // 7. INTELLIGENCE -> INFRA (Back and Forth)
  {
    type: 'processing',
    description: "7. INFERÊNCIA PROFUNDA",
    activeNodes: ['layer3', 'layer2', 'layer1'],
    packets: [
      { from: 'layer3', to: 'layer2', label: 'Tensors' },
      { from: 'layer2', to: 'layer1', label: 'Ops' }
    ],
    duration: 2000,
    details: "Milhões de parâmetros são ativados no hardware físico. Calor é gerado. Inteligência emerge."
  },
  // 8. INTELLIGENCE -> REFINER
  {
    type: 'transfer',
    description: "8. REFINAMENTO & SEGURANÇA",
    activeNodes: ['layer3', 'sub_summary'],
    packets: [{ from: 'layer3', to: 'sub_summary', label: 'Raw Text' }],
    duration: 2000,
    details: "A resposta bruta passa pela máquina de Sumarização e Filtros de Segurança."
  },
  // 9. DELIVERY
  {
    type: 'transfer',
    description: "9. ENTREGA FINAL",
    activeNodes: ['sub_summary', 'layer6'],
    packets: [{ from: 'sub_summary', to: 'layer6', label: 'Final UX' }],
    duration: 1500,
    details: "O ciclo se fecha. O valor é entregue ao usuário na superfície."
  }
];