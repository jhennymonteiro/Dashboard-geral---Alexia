export interface ComplaintCategoryRule {
  id: string;
  name: string;
}

export const FALLBACK_CATEGORY = 'Outros Serviços';

/**
 * Standard default categories for select dropdown.
 */
export const STANDARD_SERVICES = [
  'Botox / Toxina Botulínica',
  'Preenchimento / Ácido Hialurônico',
  'Limpeza de Pele / Peeling',
  'Bioestimulador / Fios',
  'Consulta / Avaliação',
  'Gestão de Tráfego / Marketing'
];

/**
 * Utility to remove accents/diacritics from strings.
 */
export function removeAccents(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Returns the exact service string from the lead without grouping or keyword rules.
 */
export function getNormalizedCategories(rawComplaint?: string): string[] {
  if (!rawComplaint || !rawComplaint.trim()) {
    return [FALLBACK_CATEGORY];
  }
  return [rawComplaint.trim()];
}

/**
 * Returns a list of standard category names.
 */
export function getAllStandardCategories(): string[] {
  return [...STANDARD_SERVICES];
}

