import React, { useState } from 'react';
import PipelineVisualizer from './components/PipelineVisualizer';
import DetailPanel from './components/DetailPanel';
import DataInspector from './components/DataInspector';
import { generateRAGResponse, generateImage } from './services/geminiService';
import { NodeType, SimulationStepDef } from './types';
import { Play, Database, RefreshCw, Terminal, ChevronRight, RotateCcw, Image as ImageIcon, Users, Loader2 } from 'lucide-react';

// --- Dynamic Simulation Definitions ---

const getIngestionSteps = (tenantId: string): SimulationStepDef[] => [
  { 
    stepId: 0, node: 'source', log: `Source: Detecting changes for Tenant ${tenantId}`,
    inspectorData: { 
      title: 'Modular RAG Ingestion', 
      description: `Why: Modular design allows independent scaling. Metadata tagging ensures Multi-tenancy for ${tenantId}.`, 
      data: { event: "s3:ObjectCreated", file: "policy_v2.pdf", tenant_id: tenantId, technique: "Modular RAG" } 
    }
  },
  { 
    stepId: 1, node: 'kafka', edge: {from: 'source', to: 'kafka'}, log: 'Kafka: Buffering event stream',
    inspectorData: { 
      title: 'Backpressure Handling', 
      description: 'Why: Decouples the fast ingestion source from the slower embedding model.', 
      data: { topic: "raw-docs", partition_