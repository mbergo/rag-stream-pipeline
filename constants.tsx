import { Smartphone, Bike, Store, Layers, Database, HardDrive, Cpu, Search, MapPin, ShieldAlert, TrendingUp, MessageCircle, Megaphone, Workflow, BrainCircuit, Library, Users, Briefcase, Calculator, Wrench, BarChart } from 'lucide-react';
import { PipelineNodeDef, PipelineEdgeDef, NodeDetail } from './types';

export const NODES: PipelineNodeDef[] = [
  // --- Channels (Top) ---
  { id: 'consumer_app', label: 'App Consumidor', x: 100, y: 50, icon: Smartphone, description: 'O principal motor de receita (80M+ Pedidos). Personalização via IA gera +15% na Taxa de Conversão.', category: 'channel' },
  { id: 'courier_app', label: 'App Entregador', x: 600, y: 50, icon: Bike, description: 'Interface de força de trabalho para 200k+ entregadores. Roteamento via IA aumenta ganhos/hora em +25%.', category: 'channel' },
  { id: 'partner_portal', label: 'Portal do Parceiro', x: 950, y: 50, icon: Store, description: 'Dashboard B2B para 330k+ restaurantes. Insights de IA reduzem churn em 63%.', category: 'channel' },

  // --- Domain Services (Middle) ---
  { id: 'discovery_ai', label: 'Descoberta', x: 50, y: 220, icon: Search, description: 'Motor de RecSys', category: 'domain_service' },
  { id: 'ads_ai', label: 'Motor de Ads', x: 230, y: 220, icon: Megaphone, description: 'Rankeamento Patrocinado', category: 'domain_service' },
  { id: 'risk_ai', label: 'Intel. de Risco', x: 410, y: 220, icon: ShieldAlert, description: 'Trust & Safety', category: 'domain_service' },
  { id: 'logistics_ai', label: 'IA de Despacho', x: 590, y: 220, icon: MapPin, description: 'Otimização de Rotas', category: 'domain_service' },
  { id: 'partner_ai', label: 'IA de Parceiros', x: 770, y: 220, icon: TrendingUp, description: 'Demanda & Precificação', category: 'domain_service' },
  { id: 'support_ai', label: 'IA de Suporte', x: 950, y: 220, icon: MessageCircle, description: 'Automação de CX', category: 'domain_service' },

  // --- Infrastructure (Expanded & Named) ---
  { id: 'n8n', label: 'Workflow n8n', x: 50, y: 400, icon: Workflow, description: 'Orquestração', category: 'infrastructure' },
  { id: 'vertex_fs', label: 'Vertex Feature Store', x: 230, y: 400, icon: Database, description: 'Features de Baixa Latência', category: 'infrastructure' },
  { id: 'confluent_kafka', label: 'Confluent Kafka', x: 450, y: 400, icon: Layers, description: 'Streaming de Eventos', category: 'infrastructure' },
  { id: 'rag_engine', label: 'Motor RAG', x: 650, y: 400, icon: BrainCircuit, description: 'Recuperação LangChain', category: 'infrastructure' },
  { id: 'vector_db', label: 'Vertex Vector Search', x: 850, y: 400, icon: Library, description: 'Índice de Embeddings', category: 'infrastructure' },
  { id: 'bigquery', label: 'BigQuery', x: 1050, y: 400, icon: HardDrive, description: 'Data Warehouse', category: 'infrastructure' },
  { id: 'vertex_endpoints', label: 'Vertex Endpoints', x: 450, y: 550, icon: Cpu, description: 'Serviço de Modelos', category: 'infrastructure' },

  // --- Organization / Departments (Right Side) ---
  { id: 'dept_marketing', label: 'Marketing', x: 1300, y: 50, icon: Megaphone, description: 'Crescimento & Marca', category: 'organization' },
  { id: 'dept_product', label: 'Produto', x: 1300, y: 170, icon: Users, description: 'UX & Features', category: 'organization' },
  { id: 'dept_operations', label: 'Operações', x: 1300, y: 290, icon: Briefcase, description: 'Logística & Suporte', category: 'organization' },
  { id: 'dept_engineering', label: 'Engenharia', x: 1300, y: 410, icon: Wrench, description: 'Plataforma & DevOps', category: 'organization' },
  { id: 'dept_finance', label: 'Finanças', x: 1300, y: 530, icon: Calculator, description: 'FP&A & Jurídico', category: 'organization' },
];

export const EDGES: PipelineEdgeDef[] = [
  // Consumer -> Domains
  { from: 'consumer_app', to: 'discovery_ai', activeInFlow: true, payloadInfo: 'Obter Feed' },
  { from: 'consumer_app', to: 'ads_ai', activeInFlow: true, payloadInfo: 'Obter Ads' },
  
  // Domain -> Vertex Feature Store
  { from: 'discovery_ai', to: 'vertex_fs', activeInFlow: true, payloadInfo: 'Vetores de Usuário' },
  { from: 'ads_ai', to: 'vertex_fs', activeInFlow: true, payloadInfo: 'Estatísticas de Campanha' },
  { from: 'risk_ai', to: 'vertex_fs', activeInFlow: true, payloadInfo: 'Device FP' },
  { from: 'logistics_ai', to: 'vertex_fs', activeInFlow: true, payloadInfo: 'Features de Geohash' },

  // Kafka Backbone
  { from: 'consumer_app', to: 'confluent_kafka', activeInFlow: true, payloadInfo: 'Evento: OrderCreated' },
  { from: 'confluent_kafka', to: 'risk_ai', activeInFlow: true, payloadInfo: 'Consumir: Pedido' },
  { from: 'confluent_kafka', to: 'logistics_ai', activeInFlow: true, payloadInfo: 'Gatilho: Despacho' },
  { from: 'partner_portal', to: 'confluent_kafka', activeInFlow: true, payloadInfo: 'Atualização de Menu' },
  { from: 'confluent_kafka', to: 'partner_ai', activeInFlow: true, payloadInfo: 'Sinal de Demanda' },
  { from: 'confluent_kafka', to: 'bigquery', activeInFlow: true, payloadInfo: 'Sink para DW' },

  // Logistics Out
  { from: 'logistics_ai', to: 'courier_app', activeInFlow: true, payloadInfo: 'Atribuição' },

  // RAG & Workflow Pipeline
  { from: 'n8n', to: 'support_ai', activeInFlow: true, payloadInfo: 'Orquestrar Ticket' },
  { from: 'support_ai', to: 'rag_engine', activeInFlow: true, payloadInfo: 'Consultar Contexto' },
  { from: 'rag_engine', to: 'vector_db', activeInFlow: true, payloadInfo: 'Busca ANN' },
  { from: 'bigquery', to: 'vector_db', activeInFlow: true, payloadInfo: 'Sincronizar Embeddings' },
  { from: 'rag_engine', to: 'vertex_endpoints', activeInFlow: true, payloadInfo: 'Geração LLM' },

  // --- Organizational Dependencies (Dashed Lines) ---
  // Marketing
  { from: 'dept_marketing', to: 'ads_ai', activeInFlow: false },
  { from: 'dept_marketing', to: 'discovery_ai', activeInFlow: false },
  
  // Product
  { from: 'dept_product', to: 'consumer_app', activeInFlow: false },
  { from: 'dept_product', to: 'partner_portal', activeInFlow: false },
  
  // Operations
  { from: 'dept_operations', to: 'logistics_ai', activeInFlow: false },
  { from: 'dept_operations', to: 'support_ai', activeInFlow: false },
  { from: 'dept_operations', to: 'partner_ai', activeInFlow: false },
  
  // Engineering
  { from: 'dept_engineering', to: 'confluent_kafka', activeInFlow: false },
  { from: 'dept_engineering', to: 'vertex_endpoints', activeInFlow: false },
  { from: 'dept_engineering', to: 'n8n', activeInFlow: false },
  
  // Finance
  { from: 'dept_finance', to: 'risk_ai', activeInFlow: false },
  { from: 'dept_finance', to: 'bigquery', activeInFlow: false },
];

export const NODE_DETAILS: Record<string, NodeDetail> = {
  n8n: {
    title: 'Automação de Workflow n8n',
    subtitle: 'Infraestrutura: Camada de Orquestração',
    content: `**Foco no ROI**: Reduz drasticamente o overhead de Engenharia.
    
**Valor de Negócio**:
*   **Agilidade Operacional**: Permite que não-engenheiros modifiquem a lógica de suporte sem deploy de código, reduzindo o "Time-to-Adapt" em 90%.
*   **Eficiência de Custo**: Orquestra chamadas de API de forma inteligente, prevenindo tokens desnecessários e gastos com computação em nuvem.

**Papel**: A cola que conecta o stack de IA. Gerencia o fluxo entre os agentes de IA de Suporte, o processo de recuperação RAG e APIs externas (CRM, Gateways de Pagamento).

**Capacidades**:
*   **Human-in-the-Loop**: Roteia respostas de IA com baixa confiança para agentes humanos via Slack/Zendesk.
*   **Tratamento de Erros**: Tenta novamente chamadas LLM falhas automaticamente ou troca de modelos (Gemini Flash -> Pro) se o raciocínio falhar.`,
    algorithms: ['Grafos Acíclicos Dirigidos (DAG)', 'Webhook Handling'],
    techStack: ['n8n', 'TypeScript', 'Docker'],
    kpis: ['99.9% Sucesso no Workflow', 'Ajustes Zero-code', '200ms Overhead']
  },
  rag_engine: {
    title: 'Motor RAG',
    subtitle: 'Infraestrutura: Recuperação & Síntese',
    content: `**Foco no ROI**: Maximiza Precisão & Reduz Alucinações.

**Valor de Negócio**:
*   **Deflexão de Suporte**: A recuperação precisa permite que a IA resolva 96% dos tickets, economizando R$ 110M em custos de equipe de suporte.
*   **Confiança do Cliente**: Previne informações incorretas de política ("Isso é reembolsável?") que levam ao churn.

**Pipeline**:
1.  **Decomposição da Query**: Quebra perguntas complexas em sub-queries usando LangChain.
2.  **Busca Híbrida**: Combina Busca Vetorial Densa (semântica) com Busca Esparsa (BM25 palavra-chave) para máximo recall.
3.  **Re-ranking**: Usa um modelo Cross-Encoder para re-pontuar os top 50 documentos recuperados e filtrar ruído.`,
    algorithms: ['Busca Híbrida (Densa + Esparsa)', 'Re-ranking Cross-Encoder', 'Context Stuffing'],
    techStack: ['LangChain', 'Cloud Run', 'Python'],
    kpis: ['<2s Latência Ponta a Ponta', '92% Precisão de Recuperação@5']
  },
  vector_db: {
    title: 'Vertex AI Vector Search',
    subtitle: 'Infraestrutura: Memória Vetorial',
    content: `**Foco no ROI**: Habilita Hiper-Personalização em Escala.

**Valor de Negócio**:
*   **Aumento de Conversão**: Recuperação rápida de resultados personalizados (<10ms) está diretamente correlacionada ao aumento de +15% na taxa de conversão.
*   **Escala**: Lida com 1 Bilhão+ de vetores, suportando expansão agressiva de mercado sem re-platforming.

**Mecanismo**:
*   **Algoritmo ScaNN**: Algoritmo proprietário de quantização do Google permitindo busca de similaridade em escala de bilhões em milissegundos.
*   **Filtragem de Metadados**: Filtra resultados de busca por "Cidade", "Restrição Alimentar" ou "Segmento de Usuário" *durante* o scan vetorial.`,
    algorithms: ['ScaNN (Scalable Nearest Neighbors)', 'Quantização de Produto', 'HNSW'],
    techStack: ['Vertex AI', 'GCP'],
    kpis: ['10ms Latência (p99)', '1B+ Vetores', '99.9% Recall']
  },
  vertex_fs: {
    title: 'Vertex Feature Store',
    subtitle: 'Infraestrutura: Serving Online',
    content: `**Foco no ROI**: Velocidade & Confiabilidade.

**Valor de Negócio**:
*   **Time-to-Market**: Reduz o tempo de deploy de novos modelos em 40% via reuso de features entre times.
*   **Proteção de Receita**: Elimina "Training-Serving Skew", garantindo que o modelo em produção gere dinheiro exatamente como nos testes.

**Papel**: Serve features de ML pré-computadas para modelos em tempo real. Apoiado por Redis/Bigtable para recuperação <10ms de "Últimos 10 Cliques do Usuário" ou "Tempo Médio de Preparo do Restaurante".`,
    algorithms: ['Consistência Online/Offline'],
    techStack: ['Vertex AI', 'Bigtable', 'Redis'],
    kpis: ['<10ms Latência de Serving', 'Reuso de Features']
  },
  bigquery: {
    title: 'BigQuery',
    subtitle: 'Infraestrutura: Data Warehouse',
    content: `**Foco no ROI**: Democratização de Dados & Eficiência de Armazenamento.

**Valor de Negócio**:
*   **Insight Estratégico**: Fonte Única da Verdade permite a análise que identificou a oportunidade de R$ 630M em GMV.
*   **Gestão de Custos**: Arquitetura serverless significa que pagamos apenas por queries rodadas, não por tempo ocioso.

**Integração**:
*   **Pipeline Vetorial**: Fonte da verdade para itens de menu. Atualizações aqui acionam um pipeline de embedding (via Dataflow) para atualizar o Vertex Vector Search.
*   **Dados de Treinamento**: Fonte de exportação para treinar modelos de Recomendação.`,
    algorithms: ['Armazenamento Colunar', 'Capacitor'],
    techStack: ['Google BigQuery', 'SQL'],
    kpis: ['Armazenamento Escala-PB', 'Serverless']
  },
  vertex_endpoints: {
    title: 'Vertex AI Endpoints',
    subtitle: 'Infraestrutura: Serviço de Modelos',
    content: `**Foco no ROI**: Otimização de Infraestrutura.

**Valor de Negócio**:
*   **Gasto em Nuvem**: Auto-scaling para zero durante horas fora de pico economiza ~30% em custos de GPU comparado a clusters estáticos.
*   **Experimentação**: Traffic splitting permite testes A/B, nos permitindo provar cientificamente o aumento de +15% na conversão antes do rollout total.

**Papel**: Inferência escalável para modelos Generativos e Preditivos.`,
    algorithms: ['Monitoramento de Modelo', 'Auto-scaling'],
    techStack: ['Vertex AI', 'TensorFlow', 'PyTorch'],
    kpis: ['99.99% Uptime', 'Auto-scale < 30s']
  },
  confluent_kafka: {
    title: 'Confluent Kafka',
    subtitle: 'Infraestrutura: Sistema Nervoso de Eventos',
    content: `**Foco no ROI**: Responsividade em Tempo Real.

**Valor de Negócio**:
*   **Prevenção de Perda de Receita**: Garantia de zero perda de dados assegura que cada pedido (receita) seja capturado e processado.
*   **Agilidade**: Arquitetura desacoplada permite que novos serviços de IA (como Risco IA) sejam plugados sem interromper o fluxo principal de pedidos.

**Escala**:
*   **Throughput**: 2M+ eventos/segundo (Atualizações de Pedido, Localização de Drivers, Clickstream).`,
    algorithms: ['Particionamento', 'Log Compaction'],
    techStack: ['Apache Kafka', 'Confluent Cloud'],
    kpis: ['<5ms Latência Ponta a Ponta', 'Zero Perda de Dados']
  },
  
  // --- Domains with Cross Domain Impact ---
  
  ads_ai: {
    title: 'Motor de Ads',
    subtitle: 'Pilar Estratégico: Monetização',
    content: `**Foco no ROI**: Geração Direta de Lucro.

**Valor de Negócio**:
*   **Nova Receita**: Cria um fluxo de receita anual de **R$ 50M** completamente separado das margens de comida.
*   **Retenção de Anunciantes**: Alto ROAS (+25%) mantém restaurantes gastando na plataforma ao invés de competidores.

**Mecanismo**:
*   **Recuperação**: Seleciona anúncios elegíveis baseados no contexto do usuário.
*   **Rankeamento**: Usa **Vertex Feature Store** para buscar features de Click-Through-Rate (pCTR) em tempo real.
*   **Leilão**: Mecanismo VCG garante justiça de mercado.`,
    algorithms: ['DeepFM', 'Regressão Logística', 'Leilão VCG'],
    techStack: ['Druid', 'Vertex AI', 'TensorFlow'],
    kpis: ['R$ 50M Nova Receita', '+25% ROAS'],
    crossDomainImpact: {
        inputs: [
            { source: 'Discovery AI', benefit: 'Ingere vetores de embedding do usuário para segmentar anúncios baseados em preferências orgânicas.' },
            { source: 'Partner AI', benefit: 'Verifica status "Aberto/Fechado" da loja antes de aceitar lances para prevenir gasto desperdiçado.' }
        ],
        outputs: [
            { target: 'Partner Portal', improvement: 'Fornece dashboards de "Analytics de Campanha" para que restaurantes vejam seu ROI.' },
            { target: 'Consumer App', improvement: 'Injeta conteúdo patrocinado relevante no feed sem degradar a experiência do usuário.' }
        ]
    }
  },
  discovery_ai: {
    title: 'Motor de Recomendação',
    subtitle: 'Pilar Estratégico: Conversão',
    content: `**Foco no ROI**: Aumento de Gross Merchandise Volume (GMV).

**Valor de Negócio**:
*   **Crescimento de Receita**: Diretamente responsável por **R$ 630M** em GMV incremental ao longo de 3 anos.
*   **LTV do Usuário**: +15% na Taxa de Conversão significa que adquirir um usuário é mais lucrativo, justificando maior gasto em marketing.

**Fluxo**:
1.  **Geração de Candidatos**: Recupera 1000 itens do **Vertex Vector Search**.
2.  **Rankeamento**: Pontua itens usando **Vertex Endpoints** (XGBoost) com features do **Vertex Feature Store**.`,
    algorithms: ['Two-Tower NN', 'XGBoost', 'Thompson Sampling'],
    techStack: ['Vertex AI', 'TensorFlow Recommenders'],
    kpis: ['+15% Conversão', 'R$ 630M Aumento GMV'],
    crossDomainImpact: {
        inputs: [
            { source: 'Logistics AI', benefit: 'Filtra restaurantes com tempo de entrega previsto > 60 min para melhorar UX.' },
            { source: 'Risk AI', benefit: 'Esconde parceiros sinalizados com altas taxas de cancelamento para proteger a confiança na plataforma.' }
        ],
        outputs: [
            { target: 'Ads AI', improvement: 'Exporta "Vetores de Gosto do Usuário" para que anúncios pareçam personalizados, não spam.' },
            { target: 'Partner AI', improvement: 'Fornece dados de previsão de demanda para que cozinhas preparem pratos populares com antecedência.' }
        ]
    }
  },
  logistics_ai: {
    title: 'IA de Despacho',
    subtitle: 'Pilar Estratégico: Eficiência',
    content: `**Foco no ROI**: Unit Economics & Proteção de Margem.

**Valor de Negócio**:
*   **Redução de Custo**: Otimização de rotas economiza 12% na distância total, reduzindo diretamente custos de pagamento por entrega.
*   **Capacidade de Rede**: Entregas mais rápidas (-26% tempo) efetivamente aumentam a capacidade da frota sem adicionar headcount.

**Integração**:
Consome eventos 'OrderCreated' do **Confluent Kafka** e usa Redes Neurais em Grafos para agrupar pedidos.`,
    algorithms: ['GNN', 'PPO (RL)', 'VRP Solvers'],
    techStack: ['Ray', 'Google Maps Platform'],
    kpis: ['-26% Tempo de Entrega', '+25% Ganhos do Entregador'],
    crossDomainImpact: {
        inputs: [
            { source: 'Partner AI', benefit: 'Usa previsões de "Tempo de Preparo" para garantir que motoristas não esperem ociosos no restaurante.' },
            { source: 'Risk AI', benefit: 'Evita despachar para geohashes de alto risco sinalizados para segurança do entregador.' }
        ],
        outputs: [
            { target: 'Discovery AI', improvement: 'Fornece polígonos de "Área de Serviço" em tempo real para esconder restaurantes inalcançáveis.' },
            { target: 'Support AI', improvement: 'Alimenta telemetria ao vivo do motorista no motor RAG para tickets de "Onde está meu pedido?".' }
        ]
    }
  },
  risk_ai: {
    title: 'Inteligência de Risco',
    subtitle: 'Pilar Estratégico: Proteção',
    content: `**Foco no ROI**: Proteção de Lucro (Bottom-Line).

**Valor de Negócio**:
*   **Economia de Perdas**: Previne **R$ 75M** em chargebacks e perdas por fraude em 3 anos.
*   **Crescimento Top-Line**: Reduz falsos positivos, garantindo que clientes legítimos de alto valor não sejam bloqueados no checkout.

**Integração**:
Pontuação em tempo real via **Vertex Endpoints** (<100ms) cria um score de "Probabilidade de Fraude" adicionado ao evento de pedido Kafka.`,
    algorithms: ['Gradient Boosting', 'Isolation Forest'],
    techStack: ['Vertex AI', 'Redis'],
    kpis: ['-45% Perdas por Fraude', 'R$ 75M Economia'],
    crossDomainImpact: {
        inputs: [
            { source: 'Consumer App', benefit: 'Analisa fingerprints de dispositivo e cadência de digitação para detecção de bots.' },
            { source: 'Logistics AI', benefit: 'Ingere sinais de spoofing de GPS do app do entregador.' }
        ],
        outputs: [
            { target: 'Logistics AI', improvement: 'Previne despacho para pedidos sinalizados como "alta probabilidade de fraude" para economizar tempo do entregador.' },
            { target: 'Support AI', improvement: 'Etiqueta perfis de clientes com "Risco de Abuso" para que agentes saibam se um pedido de reembolso é legítimo.' }
        ]
    }
  },
  partner_ai: {
    title: 'IA de Parceiros',
    subtitle: 'Pilar Estratégico: Saúde do Supply',
    content: `**Foco no ROI**: Lifetime Value (LTV) do Supply.

**Valor de Negócio**:
*   **Custos de Aquisição**: Reduzir churn em 63% economiza **R$ 135M** em custos de re-aquisição.
*   **Lucratividade do Parceiro**: Ajudar restaurantes a reduzir desperdício de comida em 25% os torna mais financeiramente estáveis e leais.

**Integração**:
Analisa sinais de demanda do **BigQuery** histórico para prever volume de preparo da próxima semana para restaurantes.`,
    algorithms: ['Prophet', 'Inferência Causal'],
    techStack: ['Spark', 'Databricks'],
    kpis: ['-63% Churn', '-25% Desperdício de Comida'],
    crossDomainImpact: {
        inputs: [
            { source: 'Discovery AI', benefit: 'Usa "Tendências de Busca" para aconselhar parceiros sobre tipos de cozinha faltantes em sua área.' },
            { source: 'Support AI', benefit: 'Agrega "Temas de Reclamação" (ex: comida fria) para sugerir melhorias operacionais.' }
        ],
        outputs: [
            { target: 'Logistics AI', improvement: 'Publica offsets precisos de "Tempo de Preparo" para que motoristas cheguem exatamente quando a comida está pronta.' },
            { target: 'Ads AI', improvement: 'Identifica pratos de alta performance para sugerir em campanhas patrocinadas.' }
        ]
    }
  },
  support_ai: {
    title: 'IA de Suporte',
    subtitle: 'Pilar Estratégico: Automação de CX',
    content: `**Foco no ROI**: Redução de Despesa Operacional (OpEx).

**Valor de Negócio**:
*   **Economia de Custos**: Automatizar 96% dos tickets economiza **R$ 110M** anualmente em custos de call center.
*   **Lealdade do Cliente**: Resolução instantânea previne o impacto negativo no NPS de longos tempos de espera.

**Pipeline RAG**:
1.  **n8n** recebe ticket.
2.  **Motor RAG** recupera documentos de política do **Vertex Vector Search**.
3.  **Vertex Endpoints** (Gemini) gera a resposta.`,
    algorithms: ['BERT', 'LLM', 'Análise de Sentimento'],
    techStack: ['Vertex AI', 'n8n', 'LangChain'],
    kpis: ['96% Auto-Resolução', 'R$ 110M Economia'],
    crossDomainImpact: {
        inputs: [
            { source: 'Logistics AI', benefit: 'Acessa localização do entregador em tempo real para responder instantaneamente perguntas de "ETA?".' },
            { source: 'Risk AI', benefit: 'Verifica "Histórico de Reembolso" do usuário para determinar se uma compensação deve ser concedida.' }
        ],
        outputs: [
            { target: 'Partner AI', improvement: 'Agrupa logs de chat não estruturados em feedback estruturado para restaurantes.' },
            { target: 'Discovery AI', improvement: 'Sinaliza "Sentimento Negativo" pós-pedido para temporariamente reduzir rank de experiências ruins.' }
        ]
    }
  },
  consumer_app: { 
    title: 'App Consumidor', 
    subtitle: 'Canal: Storefront', 
    content: `**Foco no ROI**: Conversão de Funil.
    
**Valor de Negócio**:
*   **Receita**: A porta de entrada para 80M+ pedidos. Cada melhoria de 100ms na latência aqui converte diretamente em GMV.
*   **Engajamento**: Features como "Infinite Scroll" impulsionadas por Discovery AI mantêm usuários no app por mais tempo.`, 
    algorithms: [], 
    techStack: ['React Native'] 
  },
  courier_app: { 
    title: 'App Entregador', 
    subtitle: 'Canal: Força de Trabalho', 
    content: `**Foco no ROI**: Produtividade Laboral.
    
**Valor de Negócio**:
*   **Utilização**: Navegação guiada e instruções de agrupamento aumentam pedidos entregues por hora em 25%.
*   **Retenção**: Maiores ganhos por hora reduzem churn de entregadores e custos de recrutamento.`, 
    algorithms: [], 
    techStack: ['Android', 'iOS'] 
  },
  partner_portal: { 
    title: 'Portal do Parceiro', 
    subtitle: 'Canal: Fornecedor', 
    content: `**Foco no ROI**: Otimização da Cadeia de Suprimentos.
    
**Valor de Negócio**:
*   **Auto-Atendimento**: Insights de IA permitem que parceiros otimizem seus próprios menus/preços, reduzindo a necessidade de gerentes de conta iFood.
*   **Crescimento**: Promoções sugeridas aumentam vendas do parceiro, levando a maior receita de comissão.`, 
    algorithms: [], 
    techStack: ['React'] 
  },

  // --- Department Details ---
  dept_marketing: {
    title: 'Departamento de Marketing',
    subtitle: 'Stakeholder: Crescimento & Marca',
    content: `**Benefício Primário**: Targeting Preciso & Eficiência de Gastos.
    
**Utilização do Pipeline**:
*   **Discovery AI**: Sai de emails de "disparo em massa" para targeting algorítmico 1:1, aumentando taxas de abertura e conversão.
*   **Ads AI**: Desbloqueia um novo fluxo de receita "Retail Media", permitindo que Marketing venda inventário de anúncios para parceiros, transformando um centro de custo em centro de lucro.

**Impacto Operacional**:
Times de marketing podem lançar campanhas acionadas por eventos em tempo real (ex: "Está chovendo -> Push Comida Confortável") sem suporte de engenharia via automação n8n.`,
    algorithms: ['Segmentação de Cliente', 'Modelagem de Propensão'],
    techStack: ['Braze', 'AppsFlyer'],
    kpis: ['Redução de CAC', 'Aumento de LTV']
  },
  dept_operations: {
    title: 'Departamento de Operações',
    subtitle: 'Stakeholder: Logística & Suporte',
    content: `**Benefício Primário**: Escala & Eficiência.
    
**Utilização do Pipeline**:
*   **Logistics AI**: O sistema nervoso das operações. Auto-despacho permite gerenciar 200k+ entregadores com um time central de ops mínimo.
*   **Partner AI**: Fornece a visibilidade necessária para identificar "Gargalos na Cozinha" antes que causem cancelamentos de pedidos.
*   **Support AI**: Desvia 96% dos tickets repetitivos "Onde está meu pedido?", permitindo que agentes humanos foquem em crises complexas (ex: acidentes, disputas de pagamento).

**Impacto Operacional**:
Permite uma mudança de "Apagar Incêndios Reativo" para "Gestão de Exceção Proativa".`,
    algorithms: ['Pesquisa Operacional', 'Teoria das Filas'],
    techStack: ['Salesforce', 'Tableau'],
    kpis: ['Custo Por Pedido (CPO)', 'SLA de Entrega']
  },
  dept_engineering: {
    title: 'Departamento de Engenharia',
    subtitle: 'Stakeholder: Plataforma & Confiabilidade',
    content: `**Benefício Primário**: Velocidade & Estabilidade.
    
**Utilização do Pipeline**:
*   **Vertex Feature Store**: "Escreva uma vez, use em todo lugar". Previne que diferentes squads (Fraude vs. Ads) re-implementem as mesmas features (ex: "Contagem de Pedidos do Usuário").
*   **Confluent Kafka**: Desacopla serviços. O Squad de Checkout não precisa saber se o Serviço de Logística está fora do ar; eles apenas emitem um evento e o sistema se cura.
*   **Vertex Endpoints**: Infraestrutura gerenciada significa escala zero-ops. Sem acordar às 3 AM para provisionar mais servidores.

**Impacto Operacional**:
Engenheiros focam em lógica de negócio (algoritmos) ao invés de encanamento (manutenção de infraestrutura).`,
    algorithms: ['CI/CD', 'Site Reliability Engineering'],
    techStack: ['Kubernetes', 'Terraform'],
    kpis: ['Frequência de Deploy', 'MTTR']
  },
  dept_product: {
    title: 'Departamento de Produto',
    subtitle: 'Stakeholder: UX & Estratégia',
    content: `**Benefício Primário**: Iteração Orientada a Dados.
    
**Utilização do Pipeline**:
*   **Consumer App**: A tela para experimentação.
*   **Discovery AI**: Fornece o framework de testes A/B para provar cientificamente se um novo carrossel de "Comida Saudável" realmente gera engajamento.
*   **BigQuery**: A fonte da verdade para todas as métricas de produto, permitindo análise profunda de coorte.

**Impacto Operacional**:
Gerentes de Produto podem validar hipóteses em dias ao invés de meses usando a infraestrutura flexível de IA.`,
    algorithms: ['Teste A/B', 'Análise de Coorte'],
    techStack: ['Amplitude', 'Jira'],
    kpis: ['DAU/MAU', 'Adoção de Feature']
  },
  dept_finance: {
    title: 'Departamento de Finanças',
    subtitle: 'Stakeholder: FP&A & Risco',
    content: `**Benefício Primário**: Proteção de Margem & Previsibilidade.
    
**Utilização do Pipeline**:
*   **Risk AI**: Para diretamente o vazamento de dinheiro da empresa via fraude de cartão de crédito e abuso de promoções.
*   **Ads AI**: Receita de alta margem (lucro puro) que melhora o EBITDA geral da empresa.
*   **BigQuery**: Pipelines automatizados de reconciliação financeira garantem que cada centavo seja contabilizado no fechamento do mês.

**Impacto Operacional**:
Visibilidade em tempo real dos unit economics (Lucro por Pedido) permite correção de curso imediata se as margens caírem.`,
    algorithms: ['Previsão (Forecasting)', 'Detecção de Anomalia'],
    techStack: ['SAP', 'Oracle'],
    kpis: ['EBITDA', 'Margem Bruta']
  }
};