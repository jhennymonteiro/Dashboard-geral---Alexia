import React, { useState } from 'react';
import { Lead, STAGE_COLORS } from '../types';
import { formatCurrencyBRL } from '../lib/analytics';
import { getNormalizedCategories } from '../lib/complaintCategories';
import { MessageCircle } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
}

function formatDateBR(dateStr?: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(leads.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsPerPage);

  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${fullNumber}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-colors duration-200">
      
      {/* Table Header / Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Base de Leads ({leads.length})
          </h3>
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3 px-4">Nome</th>
              <th className="py-3 px-4">WhatsApp</th>
              <th className="py-3 px-4">Origem</th>
              <th className="py-3 px-4">Serviço / Interesse</th>
              <th className="py-3 px-4">Valor Estimado</th>
              <th className="py-3 px-4">Fase do Funil</th>
              <th className="py-3 px-4">Data Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                  Nenhum lead encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const colors = STAGE_COLORS[lead.fase] || STAGE_COLORS['Entrada'];

                return (
                  <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors group">
                    
                    {/* Nome */}
                    <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 font-bold">
                      <div className="truncate max-w-[180px]" title={lead.nome}>
                        {lead.nome}
                      </div>
                      {lead.observacoes && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate max-w-[180px]">
                          {lead.observacoes}
                        </div>
                      )}
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <a
                        href={getWhatsAppLink(lead.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold hover:underline"
                        title="Abrir no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{lead.whatsapp || '-'}</span>
                      </a>
                    </td>

                    {/* Origem */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <span className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-200 dark:border-slate-700">
                        {lead.origemLead || 'Outros'}
                      </span>
                    </td>

                    {/* Serviço / Queixa */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-[220px]">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate" title={lead.servico || lead.queixaCliente}>
                        {lead.servico || lead.queixaCliente || '-'}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getNormalizedCategories(lead.servico || lead.queixaCliente).map((cat) => (
                          <span
                            key={cat}
                            className="inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold"
                          >
                            {cat}
                          </span>
                        ))}
                        {lead.bairro && (
                          <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {lead.bairro}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Valor Estimado */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrencyBRL(lead.valorEstimado)}
                    </td>

                    {/* Fase */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${colors.badgeBg}`}>
                        {lead.fase}
                      </span>
                    </td>

                    {/* Data Registro (Coluna H) */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {formatDateBR(lead.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 px-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Mostrando {startIndex + 1} até {Math.min(startIndex + itemsPerPage, leads.length)} de {leads.length} leads
          </span>
          <div className="flex items-center gap-1 font-semibold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            <span className="px-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
