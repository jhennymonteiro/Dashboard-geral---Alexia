export type FunnelStage = 
  | 'Entrada'
  | 'Conexão'
  | 'Avaliação'
  | 'Follow Up'
  | 'Negócio Fechado'
  | 'Negócio Perdido';

export const FUNNEL_STAGES: FunnelStage[] = [
  'Entrada',
  'Conexão',
  'Avaliação',
  'Follow Up',
  'Negócio Fechado',
  'Negócio Perdido'
];

export const ACTIVE_STAGES: FunnelStage[] = [
  'Entrada',
  'Conexão',
  'Avaliação',
  'Follow Up'
];

export const CONVERSION_STEPS: { from: FunnelStage; to: FunnelStage; label: string }[] = [
  { from: 'Entrada', to: 'Conexão', label: 'Entrada → Conexão' },
  { from: 'Conexão', to: 'Avaliação', label: 'Conexão → Avaliação' },
  { from: 'Avaliação', to: 'Follow Up', label: 'Avaliação → Follow Up' },
  { from: 'Follow Up', to: 'Negócio Fechado', label: 'Follow Up → Negócio Fechado' }
];

export interface HistoryRecord {
  id?: string;
  leadNome?: string;
  leadId?: string;
  faseAnterior?: FunnelStage | string;
  faseNova?: FunnelStage | string;
  fase?: FunnelStage | string;
  dataMudanca?: string;
  resultado?: 'Avanço' | 'Perda' | 'Mantido' | string;
  observacao?: string;
}

export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  fase: FunnelStage;
  faseAnterior?: FunnelStage; // Prior stage before moving to Negócio Perdido or next stage
  valorEstimado: number;
  servico: string; // Serviço solicitado (Novo campo da planilha)
  queixaCliente?: string; // Alias de compatibilidade para serviço
  formaPagamento?: string; // Forma de pagamento (Novo campo)
  idade?: string | number; // Idade (Novo campo)
  bairro?: string; // Bairro (Novo campo)
  observacoes: string;
  origemLead: string;
  createdAt: string; // ISO String format (YYYY-MM-DD)
}

export type PeriodFilter = 'hoje' | 'ontem' | '7d' | '30d' | 'mes' | 'todos' | 'personalizado';

export interface FilterState {
  period: PeriodFilter;
  customStartDate?: string;
  customEndDate?: string;
  origem: string | null;
  fase: FunnelStage | null;
  queixa: string | null; // Serviço selecionado
  servico?: string | null;
  searchQuery: string;
  valorMin: number | null;
  valorMax: number | null;
}

export interface SheetsConfig {
  sheetUrl: string;
  spreadsheetId: string;
  appsScriptUrl: string;
  autoSync: boolean;
  syncIntervalSeconds: number;
  lastSyncedAt: string | null;
  isConnected: boolean;
  sheetName: string;
}

export const STAGE_COLORS: Record<FunnelStage, { bg: string; text: string; border: string; badgeBg: string; hex: string }> = {
  'Entrada': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    hex: '#3b82f6'
  },
  'Conexão': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    hex: '#6366f1'
  },
  'Avaliação': {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
    hex: '#8b5cf6'
  },
  'Follow Up': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    hex: '#f59e0b'
  },
  'Negócio Fechado': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    hex: '#10b981'
  },
  'Negócio Perdido': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    hex: '#f43f5e'
  }
};
