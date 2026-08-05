import React, { useState } from 'react';
import { SheetsConfig } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE } from '../lib/sheetsService';
import { X, FileSpreadsheet, Copy, Check, ExternalLink, Zap, AlertCircle, RefreshCw } from 'lucide-react';

interface SheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetsConfig;
  onSaveConfig: (newConfig: Partial<SheetsConfig>) => void;
  onTestConnection: (sheetUrl: string, sheetName: string) => Promise<{ success: boolean; message: string; count?: number }>;
}

export const SheetsModal: React.FC<SheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTestConnection
}) => {
  const [sheetUrl, setSheetUrl] = useState(config.sheetUrl || '');
  const [sheetName, setSheetName] = useState(config.sheetName || 'Sheet1');
  const [appsScriptUrl, setAppsScriptUrl] = useState(config.appsScriptUrl || '');
  const [autoSync, setAutoSync] = useState(config.autoSync);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'instructions'>('connect');

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection(sheetUrl, sheetName);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || 'Erro ao testar conexão com a planilha.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      sheetUrl,
      sheetName,
      appsScriptUrl,
      autoSync
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8 transition-colors duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Conexão com Google Sheets</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Planilha como única fonte de verdade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 bg-white dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'connect'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Configurar Conexão
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Passo a Passo (2 Minutos)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {activeTab === 'connect' ? (
            <>
              {/* Google Sheets Link Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Link da Planilha do Google Sheets (Pública)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Certifique-se que a planilha está compartilhada como <span className="font-semibold text-slate-700 dark:text-slate-300">"Qualquer pessoa com o link pode ver"</span>.
                </p>
              </div>

              {/* Sheet Tab Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome da Aba na Planilha
                </label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="Sheet1 ou Página1"
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Google Apps Script Web App URL for 2-way write */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    URL do Google Apps Script (Para Edição / Escrita Direta)
                  </label>
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Como obter esta URL?
                  </button>
                </div>
                <input
                  type="text"
                  value={appsScriptUrl}
                  onChange={(e) => setAppsScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-slate-100 transition-all font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Permite que alterações no dashboard atualizem a planilha instantaneamente.
                </p>
              </div>

              {/* Auto Sync Toggle */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Autossincronização Ativa</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Atualiza automaticamente os dados a cada 30 segundos</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Test Connection Result */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">{testResult.message}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Instructions & Code Generator Tab */
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-900 dark:text-blue-200">
                <p className="font-semibold mb-1">Como conectar para Leitura e Escrita Direta:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800 dark:text-blue-300">
                  <li>Abra sua planilha e certifique-se das colunas: <strong className="text-blue-950 dark:text-blue-100">Nome, WhatsApp, Origem do lead, Fase, Valor estimado, Serviço, Forma de pagamento, Observações, Idade, Bairro, data de registro aut</strong>.</li>
                  <li>Compartilhe como <strong>"Qualquer pessoa com o link pode ver"</strong> e copie o link.</li>
                  <li>Para escrita em tempo real, clique em <strong>Extensões → Apps Script</strong> na planilha.</li>
                  <li>Cole o código abaixo e clique em <strong>Implantar → Nova implantação → App da Web (Acesso: Qualquer pessoa)</strong>.</li>
                </ol>
              </div>

              {/* Code Snippet Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Código do Google Apps Script:</span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg text-xs transition-all cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl font-mono text-[10px] overflow-x-auto max-h-52 scrollbar-thin border border-slate-800">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={handleTest}
            disabled={isTesting || !sheetUrl}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testando...' : 'Testar Conexão'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Salvar Conexão
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
