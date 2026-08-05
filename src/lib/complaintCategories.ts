export interface ComplaintCategoryRule {
  id: string;
  name: string;
  keywords: string[];
}

/**
  * Utility to remove accents/diacritics from strings.
  */
export function removeAccents(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const FALLBACK_CATEGORY = 'Outros Serviços';

/**
  * Central configuration structure for service categories and keyword rules.
  */
export const COMPLAINT_CATEGORY_RULES: ComplaintCategoryRule[] = [
  {
    id: 'botox',
    name: 'Botox / Toxina Botulínica',
    keywords: ['botox', 'toxina', 'botulinica', 'botulínica']
  },
  {
    id: 'preenchimento',
    name: 'Preenchimento / Ácido Hialurônico',
    keywords: ['preenchimento', 'labial', 'olheiras', 'hialuronico', 'hialurônico', 'microvasos']
  },
  {
    id: 'harmonizacao',
    name: 'Harmonização Facial',
    keywords: ['harmonizacao', 'harmonização', 'facial', 'mandibula', 'mento', 'papada']
  },
  {
    id: 'limpeza_pele',
    name: 'Limpeza de Pele / Peeling',
    keywords: ['limpeza', 'pele', 'peeling', 'hidratação', 'facial completo']
  },
  {
    id: 'bioestimulador',
    name: 'Bioestimulador / Fios',
    keywords: ['bioestimulador', 'sculptra', 'radiesse', 'fios', 'pdo', 'colágeno']
  },
  {
    id: 'consulta',
    name: 'Consulta / Avaliação',
    keywords: ['consulta', 'avaliacao', 'avaliação', 'triagem', 'diagnóstico']
  },
  {
    id: 'trafego_marketing',
    name: 'Gestão de Tráfego / Marketing',
    keywords: ['trafego', 'tráfego', 'marketing', 'ads', 'redes', 'gestão', 'mídia']
  }
];

/**
  * Maps any raw service string to standardized category names or raw service name.
  */
export function getNormalizedCategories(rawComplaint?: string): string[] {
  if (!rawComplaint || !rawComplaint.trim()) {
    return [FALLBACK_CATEGORY];
  }

  const cleanInput = removeAccents(rawComplaint.toLowerCase().trim());
  const matchedCategories: string[] = [];

  for (const rule of COMPLAINT_CATEGORY_RULES) {
    const hasMatch = rule.keywords.some((keyword) => {
      const cleanKeyword = removeAccents(keyword.toLowerCase().trim());
      return cleanInput.includes(cleanKeyword);
    });

    if (hasMatch) {
      matchedCategories.push(rule.name);
    }
  }

  if (matchedCategories.length === 0) {
    // Capitalize first letter of raw string if no standard rule matched
    const formattedRaw = rawComplaint.trim().charAt(0).toUpperCase() + rawComplaint.trim().slice(1);
    return [formattedRaw];
  }

  return matchedCategories;
}

/**
  * Returns a list of all predefined standard category names.
  */
export function getAllStandardCategories(): string[] {
  return COMPLAINT_CATEGORY_RULES.map((r) => r.name);
}
