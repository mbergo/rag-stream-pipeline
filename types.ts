import React from 'react';

export type NodeType = 
  // User Interfaces
  | 'consumer_app' 
  | 'courier_app' 
  | 'partner_portal'
  
  // Infrastructure / Data (Specific Tools)
  | 'confluent_kafka'   // Event Bus
  | 'vertex_fs'         // Feature Store
  | 'bigquery'          // Data Warehouse
  | 'vertex_endpoints'  // Model Serving
  | 'vector_db'         // Vertex AI Vector Search
  | 'rag_engine'        // LangChain on Cloud Run
  | 'n8n'               // Workflow Automation
  
  // Domain Contexts (Brains)
  | 'discovery_ai' // Recommendations
  | 'ads_ai'       // Monetization & Sponsored
  | 'logistics_ai' // Dispatch
  | 'risk_ai'      // Trust & Safety
  | 'partner_ai'   // Restaurant Ops
  | 'support_ai'   // Customer Experience

  // Organization (Departments)
  | 'dept_marketing'
  | 'dept_operations'
  | 'dept_engineering'
  | 'dept_product'
  | 'dept_finance';

export interface PipelineNodeDef {
  id: NodeType;
  label: string;
  x: number;
  y: number;
  icon: React.ComponentType<any>;
  description: string;
  category: 'channel' | 'infrastructure' | 'domain_service' | 'organization';
}

export interface PipelineEdgeDef {
  from: NodeType;
  to: NodeType;
  label?: string;
  activeInFlow: boolean;
  payloadInfo?: string; 
}

export interface CrossDomainImpact {
  inputs: { source: string; benefit: string }[]; // Benefits FROM
  outputs: { target: string; improvement: string }[]; // Improves OTHERS
}

export interface NodeDetail {
  title: string;
  subtitle: string;
  content: string; 
  algorithms: string[];
  techStack: string[];
  kpis?: string[]; 
  crossDomainImpact?: CrossDomainImpact; // New field for cross-domain synergy
}

export interface SimulationStepData {
  title: string;
  data: Record<string, any> | string;
  description: string;
  visualType?: 'json' | 'ranking';
  impact?: string; // Narrative benefit
  roiMetric?: { label: string; value: string; trend: 'up' | 'down' }; // Quantitative benefit
}

export interface SimulationStepDef {
  stepId: number;
  node: NodeType;
  edge?: { from: string; to: string };
  log: string;
  inspectorData?: SimulationStepData;
}