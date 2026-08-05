import { Lead, FilterState, FunnelStage, FUNNEL_STAGES, HistoryRecord } from '../types';
import { getNormalizedCategories } from './complaintCategories';

/**
 * Returns today's date formatted as YYYY-MM-DD in local timezone
 */
export function getLocalTodayYYYYMMDD(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper to subtract days from local date and format as YYYY-MM-DD
 */
export function getPastDateYYYYMMDD(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Robust date parser/normalizer that converts any raw date (ISO, DD/MM/YYYY, Date object, GViz)
 * into a standard YYYY-MM-DD string format for accurate filtering and comparison.
 */
export function normalizeToYYYYMMDD(raw: any): string {
  if (!raw) return getLocalTodayYYYYMMDD();

  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return getLocalTodayYYYYMMDD();
    const y = raw.getFullYear();
    const m = String(raw.getMonth() + 1).padStart(2, '0');
    const d = String(raw.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const str = String(raw).trim();

  // 1. Check for DD/MM/YYYY or DD/MM/YYYY HH:mm:ss or DD-MM-YYYY (Brazilian format)
  const ddmmyyyyMatch = str.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})(?:\s+.*)?$/);
  if (ddmmyyyyMatch) {
    const day = ddmmyyyyMatch[1].padStart(2, '0');
    const month = ddmmyyyyMatch[2].padStart(2, '0');
    const year = ddmmyyyyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 2. Check for YYYY-MM-DD or ISO 8601 string (e.g. 2026-07-25 or 2026-07-25T14:30:00.000Z)
  const yyyymmddMatch = str.match(/^(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})/);
  if (yyyymmddMatch) {
    const year = yyyymmddMatch[1];
    const month = yyyymmddMatch[2].padStart(2, '0');
    const day = yyyymmddMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 3. Check for Google Sheets GViz format: Date(2026,6,25) -> Note month is 0-indexed in GViz
  const gvizMatch = str.match(/Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})\)/i);
  if (gvizMatch) {
    const year = gvizMatch[1];
    const month = String(Number(gvizMatch[2]) + 1).padStart(2, '0');
    const day = gvizMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 4. Native JS Date parsing fallback
  const parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime())) {
    const y = parsedDate.getFullYear();
    const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const d = String(parsedDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return getLocalTodayYYYYMMDD();
}

export function filterLeads(leads: Lead[], filters: FilterState): Lead[] {
  const todayStr = getLocalTodayYYYYMMDD();
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  return leads.filter((lead) => {
    // 1. Period Filter
    if (filters.period && filters.period !== 'todos') {
      const leadDateStr = normalizeToYYYYMMDD(lead.createdAt);

      if (filters.period === 'hoje') {
        if (leadDateStr !== todayStr) return false;
      } else if (filters.period === 'ontem') {
        const yesterdayStr = getPastDateYYYYMMDD(1);
        if (leadDateStr !== yesterdayStr) return false;
      } else if (filters.period === '7d') {
        const d7Str = getPastDateYYYYMMDD(7);
        if (leadDateStr < d7Str) return false;
      } else if (filters.period === '30d') {
        const d30Str = getPastDateYYYYMMDD(30);
        if (leadDateStr < d30Str) return false;
      } else if (filters.period === 'mes') {
        if (!leadDateStr.startsWith(currentMonthStr)) return false;
      } else if (filters.period === 'personalizado') {
        if (filters.customStartDate) {
          const startStr = normalizeToYYYYMMDD(filters.customStartDate);
          if (leadDateStr < startStr) return false;
        }
        if (filters.customEndDate) {
          const endStr = normalizeToYYYYMMDD(filters.customEndDate);
          if (leadDateStr > endStr) return false;
        }
      }
    }

    // 2. Origem do lead
    if (filters.origem && lead.origemLead !== filters.origem) {
      return false;
    }

    // 3. Fase
    if (filters.fase && lead.fase !== filters.fase) {
      return false;
    }

    // 4. Queixa / Serviço (usando categorias normalizadas)
    if (filters.queixa) {
      const categories = getNormalizedCategories(lead.servico || lead.queixaCliente);
      if (!categories.includes(filters.queixa)) {
        return false;
      }
    }

    // 5. Valor Estimado range
    if (filters.valorMin !== null && lead.valorEstimado < filters.valorMin) {
      return false;
    }
    if (filters.valorMax !== null && lead.valorEstimado > filters.valorMax) {
      return false;
    }

    // 6. Search Query (Nome, WhatsApp, Serviço, Bairro, Forma de Pagamento or Observações)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = lead.nome.toLowerCase().includes(q);
      const matchPhone = lead.whatsapp.toLowerCase().includes(q);
      const matchService = (lead.servico || lead.queixaCliente || '').toLowerCase().includes(q);
      const matchBairro = (lead.bairro || '').toLowerCase().includes(q);
      const matchPayment = (lead.formaPagamento || '').toLowerCase().includes(q);
      const matchObs = lead.observacoes.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchService && !matchBairro && !matchPayment && !matchObs) return false;
    }

    return true;
  });
}

/**
 * Top KPI Summary Metrics
 */
export function calculateKpis(leads: Lead[]) {
  const totalLeads = leads.length;

  const activeLeads = leads.filter((l) =>
    ['Entrada', 'Conexão', 'Avaliação', 'Follow Up'].includes(l.fase)
  );
  const totalActiveCount = activeLeads.length;

  const fechadosLeads = leads.filter((l) => l.fase === 'Negócio Fechado');
  const totalFechadosCount = fechadosLeads.length;
  const valorFechado = fechadosLeads.reduce((sum, l) => sum + (l.valorEstimado || 0), 0);

  const perdidosLeads = leads.filter((l) => l.fase === 'Negócio Perdido');
  const totalPerdidosCount = perdidosLeads.length;
  const valorPerdido = perdidosLeads.reduce((sum, l) => sum + (l.valorEstimado || 0), 0);

  const valorEmNegociacao = activeLeads.reduce(
    (sum, l) => sum + (l.valorEstimado || 0),
    0
  );

  // Conversão Geral = Fechados / Total Leads (ou Fechados / Entradas)
  const entradasCount = leads.filter(l => l.fase === 'Entrada').length;
  // If we calculate total entry base:
  const conversaoGeralPct = totalLeads > 0 ? (totalFechadosCount / totalLeads) * 100 : 0;

  return {
    totalLeads,
    totalActiveCount,
    totalFechadosCount,
    valorFechado,
    totalPerdidosCount,
    valorPerdido,
    valorEmNegociacao,
    conversaoGeralPct,
    entradasCount
  };
}

/**
 * Funnel Stage Progressions & Conversions
 */
export interface StageFunnelMetrics {
  stage: FunnelStage;
  countCurrent: number;
  countPassed: number;
  valueCurrent: number;
  conversionToNextPct: number;
  lossPct: number;
}

export function calculateFunnelMetrics(leads: Lead[]) {
  // Stage order mapping index
  const stageIndexMap: Record<FunnelStage, number> = {
    'Entrada': 0,
    'Conexão': 1,
    'Avaliação': 2,
    'Follow Up': 3,
    'Negócio Fechado': 4,
    'Negócio Perdido': 99 // Lost leads exit the main funnel pipeline
  };

  const countsCurrent: Record<FunnelStage, number> = {
    'Entrada': 0,
    'Conexão': 0,
    'Avaliação': 0,
    'Follow Up': 0,
    'Negócio Fechado': 0,
    'Negócio Perdido': 0
  };

  const valuesCurrent: Record<FunnelStage, number> = {
    'Entrada': 0,
    'Conexão': 0,
    'Avaliação': 0,
    'Follow Up': 0,
    'Negócio Fechado': 0,
    'Negócio Perdido': 0
  };

  leads.forEach((l) => {
    if (countsCurrent[l.fase] !== undefined) {
      countsCurrent[l.fase]++;
      valuesCurrent[l.fase] += l.valorEstimado || 0;
    }
  });

  const mainPipelineStages: FunnelStage[] = [
    'Entrada',
    'Conexão',
    'Avaliação',
    'Follow Up',
    'Negócio Fechado'
  ];

  // Helper to determine the highest stage index reached by a lead
  const getHighestStageIndex = (l: Lead): number => {
    if (l.fase !== 'Negócio Perdido') {
      return stageIndexMap[l.fase] ?? 0;
    }
    // If lost, check prior stage reached before loss (defaults to Follow Up if unspecified)
    const priorStage = l.faseAnterior || 'Follow Up';
    return stageIndexMap[priorStage] ?? 3;
  };

  // Cumulative leads that reached or passed stage i
  const countPassed: Record<FunnelStage, number> = {
    'Entrada': leads.length, // All leads entered
    'Conexão': leads.filter(l => getHighestStageIndex(l) >= 1).length,
    'Avaliação': leads.filter(l => getHighestStageIndex(l) >= 2).length,
    'Follow Up': leads.filter(l => getHighestStageIndex(l) >= 3).length,
    'Negócio Fechado': countsCurrent['Negócio Fechado'],
    'Negócio Perdido': countsCurrent['Negócio Perdido']
  };

  const result: StageFunnelMetrics[] = mainPipelineStages.map((stage, idx) => {
    const passed = countPassed[stage];
    let conversionToNextPct = 0;
    let lossPct = 0;

    if (idx < mainPipelineStages.length - 1) {
      const nextStage = mainPipelineStages[idx + 1];
      const nextPassed = countPassed[nextStage];
      if (passed > 0) {
        conversionToNextPct = (nextPassed / passed) * 100;
        lossPct = 100 - conversionToNextPct;
      }
    } else {
      // For Negócio Fechado (final conversion)
      conversionToNextPct = passed > 0 ? 100 : 0;
      lossPct = 0;
    }

    return {
      stage,
      countCurrent: countsCurrent[stage],
      countPassed: passed,
      valueCurrent: valuesCurrent[stage],
      conversionToNextPct,
      lossPct
    };
  });

  return result;
}

/**
 * Stage-by-stage conversions for Conversions Card
 */
export function calculateConversionSteps(leads: Lead[]) {
  const funnel = calculateFunnelMetrics(leads);
  const entradaPassed = funnel.find(f => f.stage === 'Entrada')?.countPassed || 0;
  const conexaoPassed = funnel.find(f => f.stage === 'Conexão')?.countPassed || 0;
  const avaliacaoPassed = funnel.find(f => f.stage === 'Avaliação')?.countPassed || 0;
  const followPassed = funnel.find(f => f.stage === 'Follow Up')?.countPassed || 0;
  const fechadoPassed = funnel.find(f => f.stage === 'Negócio Fechado')?.countPassed || 0;

  const steps = [
    {
      from: 'Entrada' as FunnelStage,
      to: 'Conexão' as FunnelStage,
      title: 'Entrada → Conexão',
      countFrom: entradaPassed,
      countTo: conexaoPassed,
      pct: entradaPassed > 0 ? (conexaoPassed / entradaPassed) * 100 : 0
    },
    {
      from: 'Conexão' as FunnelStage,
      to: 'Avaliação' as FunnelStage,
      title: 'Conexão → Avaliação',
      countFrom: conexaoPassed,
      countTo: avaliacaoPassed,
      pct: conexaoPassed > 0 ? (avaliacaoPassed / conexaoPassed) * 100 : 0
    },
    {
      from: 'Avaliação' as FunnelStage,
      to: 'Follow Up' as FunnelStage,
      title: 'Avaliação → Follow Up',
      countFrom: avaliacaoPassed,
      countTo: followPassed,
      pct: avaliacaoPassed > 0 ? (followPassed / avaliacaoPassed) * 100 : 0
    },
    {
      from: 'Follow Up' as FunnelStage,
      to: 'Negócio Fechado' as FunnelStage,
      title: 'Follow Up → Negócio Fechado',
      countFrom: followPassed,
      countTo: fechadoPassed,
      pct: followPassed > 0 ? (fechadoPassed / followPassed) * 100 : 0
    }
  ];

  const totalFunnelConversionPct = entradaPassed > 0 ? (fechadoPassed / entradaPassed) * 100 : 0;

  return {
    steps,
    totalFunnelConversionPct,
    totalEntradas: entradaPassed,
    totalFechados: fechadoPassed
  };
}

/**
 * Gargalos do Funil (Bottlenecks) Calculation
 * Identifies where leads are dropping out to Negócio Perdido.
 */
export function calculateBottlenecks(leads: Lead[]) {
  if (leads.length === 0) {
    return {
      worstStep: 'Sem Evasão',
      fromStage: 'Nenhum' as FunnelStage,
      toStage: 'Sem Perdas' as FunnelStage,
      lostQuantity: 0,
      lostPct: 0,
      summaryMessage: 'Nenhum lead cadastrado para análise de gargalos.'
    };
  }

  // Filter actual lost leads (leads with fase === 'Negócio Perdido')
  const lostLeads = leads.filter(l => l.fase === 'Negócio Perdido');

  if (lostLeads.length === 0) {
    return {
      worstStep: 'Sem Evasão',
      fromStage: 'Nenhum' as FunnelStage,
      toStage: 'Sem Perdas' as FunnelStage,
      lostQuantity: 0,
      lostPct: 0,
      summaryMessage: 'Nenhum gargalo de evasão detectado no funil atual. Não há nenhum lead no estado Negócio Perdido.'
    };
  }

  const nextStageMap: Record<string, FunnelStage> = {
    'Entrada': 'Conexão',
    'Conexão': 'Avaliação',
    'Avaliação': 'Follow Up',
    'Follow Up': 'Negócio Fechado'
  };

  const stageOrderMap: Record<string, number> = {
    'Entrada': 0,
    'Conexão': 1,
    'Avaliação': 2,
    'Follow Up': 3,
    'Negócio Fechado': 4
  };

  const stages: FunnelStage[] = ['Entrada', 'Conexão', 'Avaliação', 'Follow Up'];

  const lossByStage = stages.map((stage) => {
    const stageLost = lostLeads.filter(l => (l.faseAnterior || 'Follow Up') === stage);
    const lostQuantity = stageLost.length;

    const reachedCount = leads.filter(l => {
      if (l.fase !== 'Negócio Perdido') {
        return (stageOrderMap[l.fase] ?? 0) >= (stageOrderMap[stage] ?? 0);
      }
      const prior = l.faseAnterior || 'Follow Up';
      return (stageOrderMap[prior] ?? 3) >= (stageOrderMap[stage] ?? 0);
    }).length;

    const lostPct = reachedCount > 0 ? (lostQuantity / reachedCount) * 100 : 0;
    const nextStage = nextStageMap[stage] || 'Follow Up';

    return {
      from: stage,
      to: nextStage,
      title: `${stage} → ${nextStage}`,
      lostQuantity,
      lostPct,
      reachedCount
    };
  });

  let worst = lossByStage[0];
  for (const item of lossByStage) {
    if (
      item.lostQuantity > worst.lostQuantity ||
      (item.lostQuantity === worst.lostQuantity && item.lostPct > worst.lostPct)
    ) {
      worst = item;
    }
  }

  if (worst.lostQuantity === 0) {
    return {
      worstStep: 'Sem Evasão',
      fromStage: 'Nenhum' as FunnelStage,
      toStage: 'Sem Perdas' as FunnelStage,
      lostQuantity: 0,
      lostPct: 0,
      summaryMessage: 'Nenhum gargalo de evasão detectado no funil atual.'
    };
  }

  const summaryMessage = `A maior perda de leads ocorre na transição de ${worst.from} para ${worst.to}, com evasão de ${worst.lostPct.toFixed(1)}% (${worst.lostQuantity} lead${worst.lostQuantity > 1 ? 's' : ''} perdido${worst.lostQuantity > 1 ? 's' : ''}).`;

  return {
    worstStep: worst.title,
    fromStage: worst.from,
    toStage: worst.to,
    lostQuantity: worst.lostQuantity,
    lostPct: worst.lostPct,
    summaryMessage
  };
}

/**
 * Lead Source Breakdown
 */
export function calculateLeadSources(leads: Lead[]) {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const source = l.origemLead || 'Outros';
    map[source] = (map[source] || 0) + 1;
  });

  const total = leads.length;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  const items = Object.entries(map).map(([name, count], index) => ({
    name,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
    color: colors[index % colors.length]
  }));

  // Sort descending
  items.sort((a, b) => b.count - a.count);

  return items;
}

/**
 * Complaints / Services Breakdown & Ranking (Normalized Categories)
 */
export function calculateComplaints(leads: Lead[]) {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const categories = getNormalizedCategories(l.servico || l.queixaCliente);
    categories.forEach((cat) => {
      map[cat] = (map[cat] || 0) + 1;
    });
  });

  const total = leads.length;
  const items = Object.entries(map).map(([queixa, count]) => ({
    queixa,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0
  }));

  items.sort((a, b) => b.count - a.count);

  return items;
}

/**
 * Pipeline Financeiro Breakdown
 */
export function calculateFinancialPipeline(leads: Lead[]) {
  const totals: Record<FunnelStage, number> = {
    'Entrada': 0,
    'Conexão': 0,
    'Avaliação': 0,
    'Follow Up': 0,
    'Negócio Fechado': 0,
    'Negócio Perdido': 0
  };

  leads.forEach((l) => {
    if (totals[l.fase] !== undefined) {
      totals[l.fase] += l.valorEstimado || 0;
    }
  });

  const totalPipeline = Object.values(totals).reduce((sum, v) => sum + v, 0);
  const activePipeline = totals['Entrada'] + totals['Conexão'] + totals['Avaliação'] + totals['Follow Up'];

  return {
    valorEntrada: totals['Entrada'],
    valorConexao: totals['Conexão'],
    valorAvaliacao: totals['Avaliação'],
    valorFollowUp: totals['Follow Up'],
    valorFechado: totals['Negócio Fechado'],
    valorPerdido: totals['Negócio Perdido'],
    activePipeline,
    totalPipeline
  };
}

/**
 * Neighborhoods Breakdown (Bairros)
 */
export function calculateNeighborhoods(leads: Lead[]) {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const raw = l.bairro ? l.bairro.trim() : '';
    const bairro = raw || 'Não informado';
    map[bairro] = (map[bairro] || 0) + 1;
  });

  const total = leads.length;
  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#64748b'];

  const items = Object.entries(map).map(([name, count], index) => ({
    name,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
    color: colors[index % colors.length]
  }));

  items.sort((a, b) => b.count - a.count);
  return items;
}

/**
 * Payment Methods Breakdown (Formas de Pagamento)
 */
export function calculatePaymentMethods(leads: Lead[]) {
  const map: Record<string, number> = {};
  leads.forEach((l) => {
    const raw = l.formaPagamento ? l.formaPagamento.trim() : '';
    const payment = raw && raw !== '-' ? raw : 'Não informado';
    map[payment] = (map[payment] || 0) + 1;
  });

  const total = leads.length;
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

  const items = Object.entries(map).map(([name, count], index) => ({
    name,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
    color: colors[index % colors.length]
  }));

  items.sort((a, b) => b.count - a.count);
  return items;
}

/**
 * Age Groups / Brackets Breakdown (Faixa Etária)
 */
export function parseAgeNumber(rawAge?: string | number): number | null {
  if (rawAge === undefined || rawAge === null || rawAge === '') return null;
  if (typeof rawAge === 'number') return isNaN(rawAge) ? null : rawAge;
  const str = String(rawAge).trim();
  const match = str.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function getAgeBracket(rawAge?: string | number): string {
  const num = parseAgeNumber(rawAge);
  if (num === null) return 'Não informado';
  if (num <= 18) return 'Até 18 anos';
  if (num <= 25) return '19 a 25 anos';
  if (num <= 35) return '26 a 35 anos';
  if (num <= 45) return '36 a 45 anos';
  if (num <= 55) return '46 a 55 anos';
  return '56+ anos';
}

export function calculateAgeGroups(leads: Lead[]) {
  const order = ['Até 18 anos', '19 a 25 anos', '26 a 35 anos', '36 a 45 anos', '46 a 55 anos', '56+ anos', 'Não informado'];
  const map: Record<string, number> = {};
  
  order.forEach(group => { map[group] = 0; });

  leads.forEach((l) => {
    const bracket = getAgeBracket(l.idade);
    map[bracket] = (map[bracket] || 0) + 1;
  });

  const total = leads.length;
  const colors: Record<string, string> = {
    'Até 18 anos': '#38bdf8',
    '19 a 25 anos': '#3b82f6',
    '26 a 35 anos': '#6366f1',
    '36 a 45 anos': '#8b5cf6',
    '46 a 55 anos': '#a855f7',
    '56+ anos': '#ec4899',
    'Não informado': '#94a3b8'
  };

  const items = order
    .filter(name => map[name] > 0 || total === 0)
    .map(name => ({
      name,
      count: map[name] || 0,
      percentage: total > 0 ? ((map[name] || 0) / total) * 100 : 0,
      color: colors[name] || '#64748b'
    }));

  return items;
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value || 0);
}

export interface FunnelHistoryStageMetric {
  stage: FunnelStage;
  nextStage: FunnelStage;
  label: string;
  totalProcessed: number;
  advancedCount: number;
  advancedPct: number;
  lostCount: number;
  lostPct: number;
  retainedCount: number;
  retainedPct: number;
}

export interface FunnelHistorySummary {
  hasSheetHistory: boolean;
  totalHistoryRecords: number;
  overallAdvancementPct: number;
  overallConversionPct: number;
  overallLossPct: number;
  stageMetrics: FunnelHistoryStageMetric[];
}

export function calculateHistoryMetrics(
  leads: Lead[],
  historyRecords: HistoryRecord[] = []
): FunnelHistorySummary {
  const hasSheetHistory = historyRecords.length > 0;
  const mainStages: FunnelStage[] = ['Entrada', 'Conexão', 'Avaliação', 'Follow Up'];
  
  const nextStageMap: Record<string, FunnelStage> = {
    'Entrada': 'Conexão',
    'Conexão': 'Avaliação',
    'Avaliação': 'Follow Up',
    'Follow Up': 'Negócio Fechado'
  };

  const stageOrder: Record<FunnelStage, number> = {
    'Entrada': 0,
    'Conexão': 1,
    'Avaliação': 2,
    'Follow Up': 3,
    'Negócio Fechado': 4,
    'Negócio Perdido': 99
  };

  if (hasSheetHistory) {
    const stageMetrics: FunnelHistoryStageMetric[] = mainStages.map((stage) => {
      const nextStage = nextStageMap[stage];
      const recordsForStage = historyRecords.filter(r => {
        if (r.faseAnterior) return r.faseAnterior === stage;
        return r.faseNova === stage || (r.faseAnterior === undefined && r.faseNova === nextStage);
      });

      const totalProcessed = recordsForStage.length;
      let advancedCount = 0;
      let lostCount = 0;
      let retainedCount = 0;

      recordsForStage.forEach(r => {
        if (r.resultado === 'Perda' || r.faseNova === 'Negócio Perdido') {
          lostCount++;
        } else if (r.resultado === 'Avanço' || (r.faseNova && stageOrder[r.faseNova as FunnelStage] > stageOrder[stage])) {
          advancedCount++;
        } else {
          retainedCount++;
        }
      });

      const advancedPct = totalProcessed > 0 ? (advancedCount / totalProcessed) * 100 : 0;
      const lostPct = totalProcessed > 0 ? (lostCount / totalProcessed) * 100 : 0;
      const retainedPct = totalProcessed > 0 ? (retainedCount / totalProcessed) * 100 : 0;

      return {
        stage,
        nextStage,
        label: `${stage} → ${nextStage}`,
        totalProcessed,
        advancedCount,
        advancedPct,
        lostCount,
        lostPct,
        retainedCount,
        retainedPct
      };
    });

    const totalProcessedAll = stageMetrics.reduce((sum, s) => sum + s.totalProcessed, 0);
    const totalAdvancedAll = stageMetrics.reduce((sum, s) => sum + s.advancedCount, 0);
    const totalLostAll = stageMetrics.reduce((sum, s) => sum + s.lostCount, 0);

    const overallAdvancementPct = totalProcessedAll > 0 ? (totalAdvancedAll / totalProcessedAll) * 100 : 0;
    const overallLossPct = totalProcessedAll > 0 ? (totalLostAll / totalProcessedAll) * 100 : 0;
    
    const totalEntrada = historyRecords.filter(r => r.faseAnterior === 'Entrada' || r.faseNova === 'Entrada').length || leads.length;
    const totalClosed = historyRecords.filter(r => r.faseNova === 'Negócio Fechado').length || leads.filter(l => l.fase === 'Negócio Fechado').length;
    const overallConversionPct = totalEntrada > 0 ? (totalClosed / totalEntrada) * 100 : 0;

    return {
      hasSheetHistory: true,
      totalHistoryRecords: historyRecords.length,
      overallAdvancementPct,
      overallConversionPct,
      overallLossPct,
      stageMetrics
    };
  }

  // Fallback / standard derived history from current leads
  const totalLeads = leads.length;

  const stageMetrics: FunnelHistoryStageMetric[] = mainStages.map((stage) => {
    const nextStage = nextStageMap[stage];
    const targetIdx = stageOrder[stage];

    const reachedStage = leads.filter(l => {
      if (l.fase !== 'Negócio Perdido') {
        return stageOrder[l.fase] >= targetIdx;
      }
      const priorIdx = stageOrder[l.faseAnterior || 'Follow Up'] ?? 3;
      return priorIdx >= targetIdx;
    });

    const totalProcessed = reachedStage.length;

    const advancedLeads = reachedStage.filter(l => {
      if (l.fase !== 'Negócio Perdido') {
        return stageOrder[l.fase] > targetIdx;
      }
      const priorIdx = stageOrder[l.faseAnterior || 'Follow Up'] ?? 3;
      return priorIdx > targetIdx;
    });

    const lostLeads = reachedStage.filter(l => {
      if (l.fase === 'Negócio Perdido') {
        const priorStage = l.faseAnterior || 'Follow Up';
        return priorStage === stage;
      }
      return false;
    });

    const retainedLeads = reachedStage.filter(l => l.fase === stage);

    const advancedCount = advancedLeads.length;
    const lostCount = lostLeads.length;
    const retainedCount = retainedLeads.length;

    const advancedPct = totalProcessed > 0 ? (advancedCount / totalProcessed) * 100 : 0;
    const lostPct = totalProcessed > 0 ? (lostCount / totalProcessed) * 100 : 0;
    const retainedPct = totalProcessed > 0 ? (retainedCount / totalProcessed) * 100 : 0;

    return {
      stage,
      nextStage,
      label: `${stage} → ${nextStage}`,
      totalProcessed,
      advancedCount,
      advancedPct,
      lostCount,
      lostPct,
      retainedCount,
      retainedPct
    };
  });

  const totalFechados = leads.filter(l => l.fase === 'Negócio Fechado').length;
  const totalPerdidos = leads.filter(l => l.fase === 'Negócio Perdido').length;

  const overallConversionPct = totalLeads > 0 ? (totalFechados / totalLeads) * 100 : 0;
  const overallLossPct = totalLeads > 0 ? (totalPerdidos / totalLeads) * 100 : 0;

  const totalProcessedSum = stageMetrics.reduce((sum, s) => sum + s.totalProcessed, 0);
  const totalAdvancedSum = stageMetrics.reduce((sum, s) => sum + s.advancedCount, 0);
  const overallAdvancementPct = totalProcessedSum > 0 ? (totalAdvancedSum / totalProcessedSum) * 100 : 0;

  return {
    hasSheetHistory: false,
    totalHistoryRecords: totalLeads,
    overallAdvancementPct,
    overallConversionPct,
    overallLossPct,
    stageMetrics
  };
}

export function getWorstBottleneck(
  leads: Lead[],
  historySummary?: FunnelHistorySummary
) {
  const nextStageMap: Record<string, string> = {
    'Entrada': 'Conexão',
    'Conexão': 'Avaliação',
    'Avaliação': 'Follow Up',
    'Follow Up': 'Negócio Fechado'
  };

  if (historySummary && historySummary.stageMetrics && historySummary.stageMetrics.length > 0) {
    let worst = historySummary.stageMetrics[0];
    for (const m of historySummary.stageMetrics) {
      if (
        m.lostCount > worst.lostCount ||
        (m.lostCount === worst.lostCount && m.lostPct > worst.lostPct)
      ) {
        worst = m;
      }
    }
    if (worst.lostCount > 0) {
      return {
        stage: worst.stage,
        nextStage: worst.nextStage || nextStageMap[worst.stage] || 'Próxima Etapa',
        lostCount: worst.lostCount,
        lostPct: worst.lostPct,
        totalProcessed: worst.totalProcessed
      };
    }
  }

  const b = calculateBottlenecks(leads);
  return {
    stage: b.fromStage,
    nextStage: b.toStage,
    lostCount: b.lostQuantity,
    lostPct: b.lostPct,
    totalProcessed: leads.length
  };
}
