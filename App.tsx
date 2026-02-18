import React, { useState, useCallback, useEffect, useRef } from 'react';
import PipelineVisualizer from './components/PipelineVisualizer';
import DetailPanel from './components/DetailPanel';
import DataInspector from './components/DataInspector';
import { generateRAGResponse, generateVeoVideo } from './services/geminiService';
import { NodeType, SimulationStepDef } from './types';
import { Play, RotateCcw, ChevronRight, Terminal, MapPin, Zap, TrendingUp, Info, GripVertical } from 'lucide-react';

// --- iFood Simulation Definitions ---

const getOrderLifecycleSteps = (region: string): SimulationStepDef[] => [
  // --- PHASE 1: DISCOVERY (Conversion Focus) ---
  { 
    stepId: 0, node: 'consumer_app', log: `Usuário abre App em ${region}`,
    inspectorData: { 
      title: 'Inicialização de Sessão', 
      description: 'Usuário inicia o app. Sinais contextuais (Hora: Almoço, Clima: Chovendo) são capturados para personalizar a experiência imediatamente.', 
      impact: 'Início personalizado reduz taxa de rejeição em 8%.',
      roiMetric: { label: 'Taxa de Rejeição', value: '-8%', trend: 'down' },
      data: { user_id: "u_592", lat: -23.55, lon: -46.63, context: "Almoco_Chuva" } 
    }
  },
  { 
    stepId: 1, node: 'vertex_fs', edge: {from: 'consumer_app', to: 'vertex_fs'}, log: 'Vertex FS: Busca de Features',
    inspectorData: { 
      title: 'Recuperação de Features em Tempo Real', 
      description: 'Buscando features de baixa latência (Dieta Usuário: Vegano, Último Pedido: Burger) do Redis/Vertex Feature Store para alimentar o modelo de ranking.', 
      impact: 'Garante que o modelo de IA use o estado mais atual do usuário ( < 10ms latência).',
      roiMetric: { label: 'Latência de Inferência', value: '8ms', trend: 'down' },
      data: { latency: "8ms", keys: ["rest_123_status", "user_592_vegan"] } 
    }
  },
  { 
    stepId: 2, node: 'discovery_ai', edge: {from: 'vertex_fs', to: 'discovery_ai'}, log: 'Discovery AI: Feed de Ranking',
    inspectorData: { 
      title: 'Personalização do Feed', 
      description: 'Rede Neural Two-Tower pontua 10.000 candidatos para selecionar os top 20 restaurantes relevantes para o contexto atual do usuário.', 
      impact: 'Resultados altamente relevantes impulsionam a métrica primária de conversão.',
      roiMetric: { label: 'Taxa de Conversão', value: '+15%', trend: 'up' },
      data: { candidates: 10000, model: "Two-Tower v4", top_score: 0.98 } 
    }
  },
  {
    stepId: 3, node: 'ads_ai', edge: {from: 'vertex_fs', to: 'ads_ai'}, log: 'Ads AI: Injeção Patrocinada',
    inspectorData: {
        title: 'Leilão e Rankeamento de Ads',
        description: 'Rodando leilão VCG para injetar placements patrocinados que correspondam à intenção do usuário sem prejudicar a relevância orgânica.',
        impact: 'Gera receita de alta margem mantendo a confiança do usuário.',
        roiMetric: { label: 'Receita de Ads', value: 'R$ 0.45', trend: 'up' },
        data: { winner: "Pizza Hut", bid: "R$ 0.45", pCTR: 0.12, roas_target: 5.0 }
    }
  },
  
  // --- PHASE 2: TRANSACTION (Risk & Revenue) ---
  { 
    stepId: 4, node: 'consumer_app', edge: {from: 'discovery_ai', to: 'consumer_app'}, log: 'Usuário: Faz Pedido',
    inspectorData: { 
      title: 'Evento de Checkout', 
      description: 'Usuário seleciona "Burger House" e paga. Evento "OrderCreated" é emitido.', 
      impact: 'Captura GMV. A velocidade desta transição é crítica.',
      roiMetric: { label: 'Abandono de Carrinho', value: '-12%', trend: 'down' },
      data: { order_id: "o_9988", value: "R$ 45.00", payment: "Cartão de Crédito" } 
    }
  },
  { 
    stepId: 5, node: 'confluent_kafka', edge: {from: 'consumer_app', to: 'confluent_kafka'}, log: 'Kafka: Evento OrderCreated',
    inspectorData: { 
      title: 'Persistência de Eventos', 
      description: 'Confluent Kafka garante a entrega do evento financeiro para todos os consumidores downstream (Risco, Logística, Parceiro).', 
      impact: 'Zero perda de dados previne perda de receita e garante auditabilidade.',
      roiMetric: { label: 'Perda de Dados', value: '0%', trend: 'down' },
      data: { topic: "orders.lifecycle", partition: 4, offset: 90210, schema: "avro_v2" } 
    }
  },
  { 
    stepId: 6, node: 'risk_ai', edge: {from: 'confluent_kafka', to: 'risk_ai'}, log: 'Risk AI: Score de Fraude',
    inspectorData: { 
      title: 'Verificação de Fraude Pré-Auth', 
      description: 'Modelo Gradient Boosting pontua a transação em tempo real (<100ms) antes da autorização bancária.', 
      impact: 'Bloqueia transações fraudulentas antes que o dinheiro mova, economizando taxas de chargeback.',
      roiMetric: { label: 'Perda por Fraude', value: '-45%', trend: 'down' },
      data: { fraud_score: 0.02, verdict: "APROVADO", inference_time: "45ms" } 
    }
  },

  // --- PHASE 3: FULFILLMENT (Efficiency) ---
  { 
    stepId: 7, node: 'partner_ai', edge: {from: 'confluent_kafka', to: 'partner_ai'}, log: 'Partner AI: Tempo de Preparo',
    inspectorData: { 
      title: 'Orquestração da Cozinha', 
      description: 'Estima tempo de preparo preciso baseado na carga atual da cozinha para alinhar a chegada do motorista.', 
      impact: 'Reduz tempo de espera do motorista e garante comida fresca.',
      roiMetric: { label: 'Espera do Entregador', value: '-4 min', trend: 'down' },
      data: { predicted_prep: "14 mins", kitchen_load: "Alta" } 
    }
  },
  { 
    stepId: 8, node: 'logistics_ai', edge: {from: 'confluent_kafka', to: 'logistics_ai'}, log: 'Logistics: Despacho',
    inspectorData: { 
      title: 'Otimização de Rotas', 
      description: 'Algoritmo agrupa este pedido com uma coleta próxima para maximizar eficiência da frota.', 
      impact: 'Aumenta pedidos entregues por hora por motorista.',
      roiMetric: { label: 'Pedidos/Hora', value: '+25%', trend: 'up' },
      data: { batch_id: "b_77", strategy: "Cluster_Pickup", eta_impact: "-2 min" } 
    }
  },
  { 
    stepId: 9, node: 'courier_app', edge: {from: 'logistics_ai', to: 'courier_app'}, log: 'Courier: Coleta',
    inspectorData: { 
      title: 'Execução Last Mile', 
      description: 'Entregador recebe rota otimizada e instruções de navegação.', 
      impact: 'Garante entrega no prazo (aderência ao SLA).',
      roiMetric: { label: 'Entrega no Prazo', value: '98%', trend: 'up' },
      data: { courier_id: "c_88", vehicle: "Moto", route_len: "3.2km" } 
    }
  },

  // --- PHASE 4: SUPPORT (Post-Order RAG) ---
  {
      stepId: 10, node: 'n8n', edge: {from: 'consumer_app', to: 'n8n'}, log: 'Usuário: "Onde está meu pedido?"',
      inspectorData: {
          title: 'Gatilho Automático de Suporte',
          description: 'Usuário pergunta sobre status. Workflow n8n intercepta o chat para prevenir escalação para agente.',
          impact: 'Desvia tickets de suporte humano custosos.',
          roiMetric: { label: 'Custo do Ticket', value: 'R$ 0.05', trend: 'down' },
          data: { workflow_id: "wf_support_status", trigger: "in_app_chat" }
      }
  },
  {
      stepId: 11, node: 'rag_engine', edge: {from: 'n8n', to: 'rag_engine'}, log: 'RAG: Recuperação de Status',
      inspectorData: {
          title: 'Geração Contextual',
          description: 'Motor RAG consulta Kafka (Status Ao Vivo) e Vector DB (Política) para gerar uma resposta útil.',
          impact: 'Fornece respostas instantâneas e precisas melhorando o NPS.',
          roiMetric: { label: 'Tempo de Resolução', value: '< 2s', trend: 'down' },
          data: { vector_db: "policy_docs", live_stream: "order_status", embedding_model: "gecko-003" }
      }
  }
];

const REGIONS = ['São Paulo', 'Rio de Janeiro, RJ', 'Brasília', 'Belo Horizonte', 'Bogotá (Expansão)'];

const ROI_PROJECTIONS: Record<number, string> = {
  1: '120%',
  2: '215%',
  3: '340%',
  4: '460%',
  5: '610%'
};

const App: React.FC = () => {
  const [activeNode, setActiveNode] = useState<NodeType | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('São Paulo');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [animatingEdge, setAnimatingEdge] = useState<{from: string, to: string} | null>(null);
  const [inspectorData, setInspectorData] = useState<any>(null);
  const [roiYear, setRoiYear] = useState(3);

  // Veo Video State (Visualizing the App/Food)
  const [rerankVideoUrl, setRerankVideoUrl] = useState<string | null>(null);
  const [isGeneratingRerankVideo, setIsGeneratingRerankVideo] = useState(false);

  // Sidebar Resizing State
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
        // Calculate width based on window width minus mouse X position
        const newWidth = window.innerWidth - e.clientX;
        // Set constraints (min 300px, max 800px)
        if (newWidth > 300 && newWidth < 1000) {
            setSidebarWidth(newWidth);
        }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const log = (msg: string) => {
    setConsoleLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 8)]); 
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStepIndex(-1);
    setConsoleLogs([]);
    log(`Inicializando Estratégia de Plataforma de IA para ${selectedRegion}...`);
    setInspectorData(null);
    setRerankVideoUrl(null); 
    advanceStep(0); 
  };

  const advanceStep = (stepIdx: number) => {
    const steps = getOrderLifecycleSteps(selectedRegion);
    
    if (stepIdx >= steps.length) {
      log('Ciclo de Vida do Pedido Completo.');
      setIsSimulating(false);
      setAnimatingEdge(null);
      return;
    }

    const step = steps[stepIdx];
    setCurrentStepIndex(stepIdx);
    
    // Update UI
    setActiveNode(step.node);
    if (step.edge) {
      setAnimatingEdge({ from: step.edge.from, to: step.edge.to });
    } else {
      setAnimatingEdge(null);
    }
    
    log(step.log);
    setInspectorData(step.inspectorData);
  };

  const handleNextStep = () => {
    if (!isSimulating) return;
    advanceStep(currentStepIndex + 1);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setActiveNode(null);
    setAnimatingEdge(null);
    setCurrentStepIndex(-1);
    setInspectorData(null);
    setRerankVideoUrl(null);
    log('Sistema Reiniciado.');
  };

  // Dedicated handler for the Discovery node video (Visualizing the "Feed")
  const handleGenerateDiscoveryVideo = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
          const hasKey = await aistudio.hasSelectedApiKey();
          if (!hasKey) {
              await aistudio.openSelectKey();
          }
      }

      setIsGeneratingRerankVideo(true);
      setRerankVideoUrl(null);
      log('Gerando visualização do Feed de Descoberta IA...');
      
      const prompt = "A futuristic mobile app interface for food delivery. Dark mode. Fast moving stream of delicious food images (burgers, sushi, pizza) sliding horizontally. Personalization algorithm nodes connecting to specific dishes with glowing red lines. High tech data visualization overlay.";

      try {
          const videoUrl = await generateVeoVideo(prompt, undefined, '9:16'); // Portrait for mobile app vibe
          if (videoUrl) {
              setRerankVideoUrl(videoUrl);
              log('Visualização gerada.');
          } else {
              log('Falha ao gerar vídeo.');
          }
      } catch(e: any) {
          log('Erro ao gerar vídeo. Verifique permissões da API Key.');
          console.error(e);
          if (e.toString().includes("Requested entity was not found") && aistudio) {
             log('Chave inválida ou expirada. Solicitando nova chave...');
             await aistudio.openSelectKey();
          }
      } finally {
          setIsGeneratingRerankVideo(false);
      }
  };

  return (
    <div className={`h-screen flex flex-col font-sans text-slate-200 selection:bg-ifood-red selection:text-white ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* Header */}
      <header className="border-b border-tech-800 bg-tech-900 px-6 py-4 flex items-center justify-between shrink-0 shadow-lg relative z-20">
        <div className="flex items-center gap-4">
          <div className="bg-ifood-red p-2 rounded-lg shadow-[0_0_15px_rgba(234,29,44,0.4)]">
             <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              iFood <span className="text-ifood-red">AI Platform</span> Strategy
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Arquitetura Orientada a Domínio • Fev 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-tech-800 px-4 py-2 rounded-full border border-tech-700">
                <MapPin className="w-4 h-4 text-ifood-red" />
                <span className="text-xs text-slate-400 font-bold uppercase">Mercado:</span>
                <select 
                  value={selectedRegion} 
                  onChange={(e) => {
                      if (!isSimulating) setSelectedRegion(e.target.value);
                  }}
                  disabled={isSimulating}
                  className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer disabled:opacity-50"
                >
                    {REGIONS.map(t => <option key={t} value={t} className="text-black bg-white">{t}</option>)}
                </select>
            </div>
            <div className="h-8 w-px bg-tech-700"></div>
            
            <div className="flex items-center gap-3 bg-tech-800 px-4 py-2 rounded-full border border-tech-700">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400 font-bold uppercase">Meta ROI:</span>
                <select 
                  value={roiYear}
                  onChange={(e) => setRoiYear(Number(e.target.value))}
                  className="bg-transparent text-sm font-bold text-emerald-400 outline-none cursor-pointer"
                >
                    {[1,2,3,4,5].map(y => (
                        <option key={y} value={y} className="text-black bg-white">
                            {ROI_PROJECTIONS[y]} (Ano {y})
                        </option>
                    ))}
                </select>
            </div>
        </div>
      </header>

      {/* Main Content Grid - REFACTORED FOR RESIZING */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-tech-900">
        
        {/* Left: Visualization & Controls (Flexible Width) */}
        <div className="flex-1 min-w-0 p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* Controls Bar */}
          <div className="bg-tech-800/60 backdrop-blur-md border border-tech-700 rounded-2xl p-4 flex items-center justify-between shadow-xl">
             <div className="flex items-center gap-4">
                <div className="bg-tech-900 p-2 rounded-lg border border-tech-700">
                    <TrendingUp className="w-5 h-5 text-ifood-red" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white">Simulação do Ciclo de Vida do Pedido</h3>
                    <p className="text-xs text-slate-400">Fluxo ponta a ponta de Descoberta à Logística</p>
                </div>
             </div>

             <div className="flex gap-2">
                {!isSimulating ? (
                    <button 
                        onClick={startSimulation}
                        className="flex items-center gap-2 px-6 py-2 bg-ifood-red hover:bg-ifood-darkred text-white text-sm font-bold rounded-lg transition shadow-[0_4px_14px_rgba(234,29,44,0.4)]"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Iniciar Simulação
                    </button>
                ) : (
                    <>
                    <button 
                        onClick={handleNextStep}
                        className="flex items-center gap-2 px-6 py-2 bg-white text-ifood-red hover:bg-slate-100 text-sm font-bold rounded-lg transition shadow-lg animate-pulse-fast"
                    >
                        Próxima Etapa <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={resetSimulation}
                        className="p-2 text-slate-400 hover:text-white hover:bg-tech-700 rounded-lg transition"
                        title="Resetar"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    </>
                )}
             </div>
          </div>

          {/* Visualization Stage */}
          <div className="flex-1 min-h-[500px] flex flex-col relative">
             <div className="flex items-center justify-between mb-4 px-1">
               <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Info className="w-3 h-3" /> Mapa da Arquitetura
               </h2>
               {isSimulating && (
                 <span className="text-xs bg-ifood-red/10 text-ifood-red px-3 py-1 rounded-full border border-ifood-red/20 font-mono font-bold">
                    ETAPA {currentStepIndex + 1} / {getOrderLifecycleSteps(selectedRegion).length}
                 </span>
               )}
             </div>
             <PipelineVisualizer 
                activeNode={activeNode} 
                onNodeClick={setActiveNode} 
                activeFlow={isSimulating ? 'both' : null} // simplified prop
                animatingEdge={animatingEdge}
             />
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-60">
             {/* Data Inspector */}
             <DataInspector 
                data={inspectorData} 
                onGenerateVideo={handleGenerateDiscoveryVideo}
                videoUrl={rerankVideoUrl}
                isGeneratingVideo={isGeneratingRerankVideo}
             />

             {/* Console Log */}
             <div className="bg-tech-900 border border-tech-700 rounded-xl p-0 font-mono text-xs overflow-hidden flex flex-col shadow-inner">
              <div className="bg-tech-800 px-4 py-2 border-b border-tech-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-300">Logs da Plataforma</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-tech-700">
                {consoleLogs.map((msg, i) => (
                  <div key={i} className={`truncate font-medium ${i === 0 ? 'text-ifood-red' : 'text-slate-500'}`}>
                    <span className="opacity-30 mr-2">{'>'}</span>{msg}
                  </div>
                ))}
                {consoleLogs.length === 0 && <span className="text-slate-700 italic opacity-50">Sistema Ocioso. Pronto para simulação.</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Resizer Handle */}
        <div 
           className={`hidden lg:flex w-2 bg-tech-900 items-center justify-center cursor-col-resize hover:bg-ifood-red/50 transition-colors z-30 flex-shrink-0 ${isResizing ? 'bg-ifood-red' : ''}`}
           onMouseDown={startResizing}
        >
            <GripVertical className={`w-3 h-3 text-slate-600 ${isResizing ? 'text-white' : ''}`} />
        </div>

        {/* Right: Info Panel (Resizable) */}
        <div 
            className="h-full min-h-0 border-l border-tech-700 bg-tech-800/30 backdrop-blur-sm relative z-10 flex flex-col overflow-hidden transition-none"
            style={{ width: window.innerWidth >= 1024 ? sidebarWidth : '100%' }}
        >
          <DetailPanel nodeId={activeNode} onClose={() => setActiveNode(null)} />
        </div>

      </main>
    </div>
  );
};

export default App;