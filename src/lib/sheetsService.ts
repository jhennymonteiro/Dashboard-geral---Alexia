import Papa from 'papaparse';
import { Lead, FunnelStage, FUNNEL_STAGES, HistoryRecord } from '../types';
import { normalizeToYYYYMMDD } from './analytics';

export function extractSpreadsheetId(url: string): string | null {
  if (!url) return null;
  // Match standard spreadsheet ID pattern in Google Sheets URLs
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // If the user pasted just the ID itself
  if (/^[a-zA-Z0-9-_]{20,60}$/.test(url.trim())) {
    return url.trim();
  }
  return null;
}

export function buildCsvUrl(spreadsheetId: string, sheetName: string = 'Sheet1'): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&_t=${Date.now()}`;
}

/**
 * Normalizes string header to standard property name
 */
function normalizeHeader(header: string): string {
  const clean = header.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove accents
  
  if (
    clean === 'fase' || 
    clean.includes('fase') || 
    clean.includes('etapa') || 
    clean.includes('status') || 
    clean.includes('estagio') ||
    clean.includes('pipeline')
  ) return 'fase';

  if (clean.includes('nome') || clean.includes('cliente') || clean.includes('lead')) {
    if (!clean.includes('origem') && !clean.includes('status') && !clean.includes('fonte') && !clean.includes('canal') && !clean.includes('etapa') && !clean.includes('fase')) {
      return 'nome';
    }
  }

  if (clean.includes('whatsapp') || clean.includes('telefone') || clean.includes('whats') || clean.includes('celular') || clean.includes('contato')) return 'whatsapp';
  if (clean.includes('valor')) return 'valorEstimado';
  if (clean.includes('servico') || clean.includes('servica') || clean.includes('procedimento') || clean.includes('queixa') || clean.includes('dor') || clean.includes('tratamento') || clean.includes('interesse')) return 'servico';
  if (clean.includes('pagamento') || clean.includes('forma')) return 'formaPagamento';
  if (clean.includes('idade')) return 'idade';
  if (clean.includes('bairro') || clean.includes('local') || clean.includes('cidade') || clean.includes('endereco')) return 'bairro';
  if (clean.includes('obs') || clean.includes('observacao') || clean.includes('observacoes')) return 'observacoes';
  if (clean.includes('origem') || clean.includes('canal') || clean.includes('fonte') || clean.includes('midia')) return 'origemLead';
  if (
    clean.includes('data') || 
    clean.includes('registro') || 
    clean.includes('aut') || 
    clean.includes('criado') || 
    clean.includes('created')
  ) return 'createdAt';
  return header.trim();
}

/**
 * Clean & map raw string values to valid FunnelStage
 */
function parseFunnelStage(raw: string): FunnelStage {
  if (!raw) return 'Entrada';
  const clean = raw.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Exact match check against FUNNEL_STAGES
  for (const stage of FUNNEL_STAGES) {
    const stageClean = stage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (clean === stageClean) {
      return stage;
    }
  }

  // 2. Closed / Won (Negócio Fechado)
  if (
    clean.includes('fechado') || 
    clean.includes('ganho') || 
    clean.includes('venda') || 
    clean.includes('aprovado') ||
    clean.includes('vendido') ||
    clean.includes('concluido') ||
    clean.includes('sucesso')
  ) return 'Negócio Fechado';

  // 3. Lost (Negócio Perdido)
  if (
    clean.includes('perdido') || 
    clean.includes('perdida') || 
    clean.includes('cancelad') || 
    clean.includes('recusad') || 
    clean.includes('desist') || 
    clean.includes('faltou') || 
    clean.includes('negou') || 
    clean.includes('nao quis') ||
    clean.includes('ausente') ||
    clean.includes('nao fechou') ||
    clean.includes('sem interesse') ||
    clean.includes('perda')
  ) return 'Negócio Perdido';

  // 4. Follow Up / Negotiation
  if (
    clean.includes('follow') || 
    clean.includes('proposta') || 
    clean.includes('negocia') || 
    clean.includes('analise') || 
    clean.includes('retorno') || 
    clean.includes('orcamento') || 
    clean.includes('aguardando')
  ) return 'Follow Up';

  // 5. Evaluation / Appointment Done
  if (
    clean.includes('avaliac') || 
    clean.includes('consulta') || 
    clean.includes('atend') || 
    clean.includes('oportunidade') ||
    clean.includes('realizada')
  ) return 'Avaliação';

  // 6. Conexão / Scheduling
  if (
    clean.includes('conexao') || 
    clean.includes('agend') || 
    clean.includes('contato') ||
    clean.includes('marcado')
  ) return 'Conexão';

  // 7. Entry
  if (
    clean.includes('entrada') || 
    clean.includes('novo') || 
    clean.includes('lead') || 
    clean.includes('primeiro') ||
    clean.includes('recebido')
  ) return 'Entrada';

  return 'Entrada';
}

/**
 * Parse currency string or number to float
 */
function parseCurrency(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).replace('R$', '').replace(/\s/g, '');
  // Brazilian format 1.250,50 -> 1250.50 or US 1250.50
  if (str.includes(',') && str.includes('.')) {
    // 1.250,50
    const normalized = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized) || 0;
  } else if (str.includes(',')) {
    const normalized = str.replace(',', '.');
    return parseFloat(normalized) || 0;
  }
  return parseFloat(str) || 0;
}

/**
 * Fetches and parses CSV from a public Google Sheets URL or CSV endpoint
 */
export async function fetchLeadsFromGoogleSheet(spreadsheetId: string, sheetName: string = 'Sheet1'): Promise<Lead[]> {
  const csvUrl = buildCsvUrl(spreadsheetId, sheetName);
  
  const response = await fetch(csvUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Não foi possível acessar a planilha. Verifique se o link está público ("Qualquer pessoa com o link pode ver"). Status HTTP: ${response.status}`);
  }
  
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const leads: Lead[] = results.data.map((row: any, idx: number) => {
            // Map raw row object using normalized keys
            const rowKeys = Object.keys(row);
            const rowMap: Record<string, any> = {};
            rowKeys.forEach(key => {
              const normKey = normalizeHeader(key);
              rowMap[normKey] = row[key];
            });

            const nome = rowMap.nome || rowMap['Nome'] || `Lead #${idx + 1}`;
            const whatsapp = rowMap.whatsapp || rowMap['WhatsApp'] || '-';
            let rawFase = rowMap.fase || rowMap['Fase'] || rowMap['Etapa'] || rowMap['Etapa do Negócio'] || rowMap['Status'] || '';
            if (!rawFase) {
              for (const k of rowKeys) {
                const kClean = k.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (kClean.includes('fase') || kClean.includes('etapa') || kClean.includes('status') || kClean.includes('estagio') || kClean.includes('funil')) {
                  if (row[k]) {
                    rawFase = row[k];
                    break;
                  }
                }
              }
            }
            const fase = parseFunnelStage(rawFase || '');
            const valorEstimado = parseCurrency(rowMap.valorEstimado || rowMap['Valor estimado'] || 0);
            
            // Map service / queixa from "Serviço", "Servico", "Queixa do cliente", "Procedimento", "Serviço de interesse"
            const servico = rowMap.servico || rowMap['Serviço'] || rowMap['Servico'] || rowMap.queixaCliente || rowMap['Queixa do cliente'] || 'Não informado';
            const queixaCliente = servico;
            const formaPagamento = rowMap.formaPagamento || rowMap['Forma de pagamento'] || rowMap['Forma de Pagamento'] || '';
            const idade = rowMap.idade || rowMap['Idade'] || '';
            const bairro = rowMap.bairro || rowMap['Bairro'] || '';
            const observacoes = rowMap.observacoes || rowMap['Observações'] || rowMap['Observações '] || '';
            const origemLead = rowMap.origemLead || rowMap['Origem do lead'] || 'Outros';

            // Read date specifically checking "data de registro aut" (Column K/H) and standard fallbacks
            let rawDate = rowMap.createdAt || 
                          rowMap.createdat || 
                          rowMap['data de registro aut'] || 
                          rowMap['Data de registro aut'] || 
                          rowMap['data registro aut'] || 
                          rowMap['Data registro aut'] || 
                          rowMap['data de registro'] || 
                          rowMap['Data de registro'] || 
                          rowMap['data aut'] || 
                          rowMap['data_registro_aut'] || 
                          rowMap.data || 
                          rowMap['Data'] || 
                          rowMap['Data de criação'] || 
                          rowMap['Data de criacao'];

            // Fallback to column K (11th column) or column H if rawDate was not mapped
            if (!rawDate && rowKeys.length >= 8) {
              const lastColKey = rowKeys[rowKeys.length - 1];
              if (lastColKey && row[lastColKey]) {
                rawDate = row[lastColKey];
              }
            }

            const createdAt = normalizeToYYYYMMDD(rawDate);

            const safeNameId = nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
            return {
              id: rowMap.id || `sheet-lead-${idx + 1}-${safeNameId}`,
              nome,
              whatsapp,
              fase,
              valorEstimado,
              servico,
              queixaCliente,
              formaPagamento,
              idade,
              bairro,
              observacoes,
              origemLead,
              createdAt
            };
          });

          // Filter out header or corrupted empty rows
          const validLeads = leads.filter(l => l.nome && l.nome !== 'Nome');
          resolve(validLeads);
        } catch (err) {
          reject(err);
        }
      },
      error: (err: any) => {
        reject(err);
      }
    });
  });
}

/**
 * Fetches and parses CSV from the "HISTÓRICO" tab of a Google Sheet
 */
export async function fetchHistoryFromGoogleSheet(spreadsheetId: string): Promise<HistoryRecord[]> {
  if (!spreadsheetId) return [];

  const possibleSheetNames = ['HISTÓRICO', 'HISTORICO', 'Historico', 'Histórico', 'HISTORICO DE LEADS', 'HISTÓRICO DE LEADS'];

  for (const sheetName of possibleSheetNames) {
    try {
      const csvUrl = buildCsvUrl(spreadsheetId, sheetName);
      const response = await fetch(csvUrl, { cache: 'no-store' });
      if (!response.ok) continue;

      const csvText = await response.text();
      if (!csvText || csvText.trim().length === 0 || csvText.includes('<!DOCTYPE html>')) continue;

      const records = await new Promise<HistoryRecord[]>((resolve) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              if (!results.data || results.data.length === 0) {
                resolve([]);
                return;
              }

              const historyList: HistoryRecord[] = results.data.map((row: any, idx: number) => {
                const rowKeys = Object.keys(row);
                const rowMap: Record<string, any> = {};
                rowKeys.forEach(key => {
                  const cleanKey = key.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                  rowMap[cleanKey] = row[key];
                });

                const leadNome = rowMap['nome'] || rowMap['lead'] || rowMap['cliente'] || rowMap['nome do lead'] || rowMap['nome cliente'] || `Lead #${idx + 1}`;
                
                const rawFaseAnterior = (rowMap['fase anterior'] || rowMap['fase de origem'] || rowMap['de'] || rowMap['estagio anterior'] || rowMap['fase de'] || '').toString().trim();
                const rawFaseNova = (rowMap['fase nova'] || rowMap['fase atual'] || rowMap['para'] || rowMap['nova fase'] || rowMap['fase'] || rowMap['etapa'] || rowMap['status'] || '').toString().trim();

                const faseAnterior = rawFaseAnterior || undefined;
                const faseNova = rawFaseNova || 'Entrada';

                let rawResultado = rowMap['resultado'] || rowMap['acao'] || rowMap['status'] || rowMap['tipo'] || rowMap['avanco'] || rowMap['perda'] || '';
                let resultado = 'Avanço';
                if (rawResultado) {
                  const rClean = String(rawResultado).toLowerCase();
                  if (rClean.includes('perda') || rClean.includes('perdido') || rClean.includes('desist')) {
                    resultado = 'Perda';
                  } else if (rClean.includes('mantid') || rClean.includes('igual') || rClean.includes('mesm')) {
                    resultado = 'Mantido';
                  } else if (rClean.includes('avan') || rClean.includes('conver') || rClean.includes('progres')) {
                    resultado = 'Avanço';
                  }
                } else {
                  if (faseNova === 'Negócio Perdido') {
                    resultado = 'Perda';
                  } else {
                    resultado = 'Avanço';
                  }
                }

                const dataMudanca = normalizeToYYYYMMDD(rowMap['data'] || rowMap['data da mudanca'] || rowMap['data mudanca'] || rowMap['data registro'] || '');

                return {
                  id: `hist-${idx + 1}`,
                  leadNome,
                  faseAnterior,
                  faseNova,
                  resultado,
                  dataMudanca
                };
              });

              resolve(historyList.filter(h => h.leadNome && h.leadNome !== 'Nome'));
            } catch (e) {
              resolve([]);
            }
          },
          error: () => resolve([])
        });
      });

      if (records && records.length > 0) {
        return records;
      }
    } catch (e) {
      // try next name
    }
  }

  return [];
}

/**
 * Sends a mutation request to Google Apps Script Web App (if configured) or Server Proxy
 */
export async function syncLeadToAppsScript(
  appsScriptUrl: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  lead: Partial<Lead>
): Promise<boolean> {
  if (!appsScriptUrl) return false;

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Standard Google Apps Script Web App requirement for simple cross-origin POST
      body: JSON.stringify({
        action,
        lead
      }),
    });
    return true;
  } catch (err) {
    console.error('Erro ao sincronizar com Google Apps Script:', err);
    return false;
  }
}

/**
 * Code snippet template for Google Apps Script 2-way immediate sheet synchronization
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Código do Google Apps Script para Sincronização em Tempo Real do Dashboard - ORION Estética
 * 
 * Instruções:
 * 1. Abra sua planilha do Google Sheets.
 * 2. Clique no menu "Extensões" > "Apps Script".
 * 3. Apague todo o código existente e cole este código completo.
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Clique no ícone de engrenagem ao lado de "Selecione o tipo" e escolha "App da Web".
 * 6. Em "Quem pode acessar", selecione "Qualquer pessoa" (Qualquer um).
 * 7. Clique em "Implantar" e copie o URL do App da Web gerado.
 * 8. Cole o URL no campo "URL do Google Apps Script" no Dashboard - ORION Estética.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var action = data.action;
    var lead = data.lead;
    
    var values = sheet.getDataRange().getValues();
    if (values.length === 0) {
      // Criar cabeçalhos se a planilha estiver vazia
      sheet.appendRow(["Nome", "WhatsApp", "Origem do lead", "Fase", "Valor estimado", "Serviço", "Forma de pagamento", "Observações", "Idade", "Bairro", "data de registro aut"]);
    }
    
    var formattedDate = lead.createdAt ? lead.createdAt : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    if (action === "CREATE") {
      sheet.appendRow([
        lead.nome || "",
        lead.whatsapp || "",
        lead.origemLead || "Outros",
        lead.fase || "Entrada",
        lead.valorEstimado || 0,
        lead.servico || lead.queixaCliente || "",
        lead.formaPagamento || "",
        lead.observacoes || "",
        lead.idade || "",
        lead.bairro || "",
        formattedDate
      ]);
      return responseJSON({ status: "success", message: "Lead adicionado com sucesso" });
    }
    
    if (action === "UPDATE") {
      for (var i = 1; i < values.length; i++) {
        var rowName = values[i][0];
        if (rowName == lead.nome || (lead.id && rowName.indexOf(lead.id) !== -1)) {
          var currentDate = values[i][10] || formattedDate;
          sheet.getRange(i + 1, 1, 1, 11).setValues([[
            lead.nome || values[i][0],
            lead.whatsapp || values[i][1],
            lead.origemLead || values[i][2],
            lead.fase || values[i][3],
            lead.valorEstimado !== undefined ? lead.valorEstimado : values[i][4],
            lead.servico || lead.queixaCliente || values[i][5],
            lead.formaPagamento || values[i][6],
            lead.observacoes || values[i][7],
            lead.idade || values[i][8],
            lead.bairro || values[i][9],
            lead.createdAt || currentDate
          ]]);
          return responseJSON({ status: "success", message: "Lead atualizado" });
        }
      }
      sheet.appendRow([
        lead.nome || "",
        lead.whatsapp || "",
        lead.origemLead || "Outros",
        lead.fase || "Entrada",
        lead.valorEstimado || 0,
        lead.servico || lead.queixaCliente || "",
        lead.formaPagamento || "",
        lead.observacoes || "",
        lead.idade || "",
        lead.bairro || "",
        formattedDate
      ]);
      return responseJSON({ status: "success", message: "Lead inserido" });
    }
    
    if (action === "DELETE") {
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] == lead.nome || values[i][1] == lead.whatsapp) {
          sheet.deleteRow(i + 1);
          return responseJSON({ status: "success", message: "Lead removido" });
        }
      }
    }
    
    return responseJSON({ status: "ok" });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
