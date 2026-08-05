import { Lead } from '../types';

function getFormattedDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    nome: 'Carlos Eduardo Silva',
    whatsapp: '(11) 98765-4321',
    fase: 'Negócio Fechado',
    valorEstimado: 3500,
    servico: 'Harmonização Facial',
    queixaCliente: 'Harmonização Facial',
    formaPagamento: 'Pix',
    idade: '34',
    bairro: 'Moema',
    observacoes: 'Fechou protocolo de harmonização facial completo.',
    origemLead: 'Google Ads',
    createdAt: getFormattedDate(0) // Today
  },
  {
    id: 'lead-2',
    nome: 'Mariana Costa Ferreira',
    whatsapp: '(21) 99887-6543',
    fase: 'Follow Up',
    valorEstimado: 2200,
    servico: 'Botox / Toxina Botulínica',
    queixaCliente: 'Botox / Toxina Botulínica',
    formaPagamento: 'Cartão 6x',
    idade: '41',
    bairro: 'Jardins',
    observacoes: 'Aguardando confirmação da data do procedimento.',
    origemLead: 'Instagram',
    createdAt: getFormattedDate(1)
  },
  {
    id: 'lead-3',
    nome: 'Lucas Mendes Rocha',
    whatsapp: '(31) 97654-3210',
    fase: 'Avaliação',
    valorEstimado: 4800,
    servico: 'Preenchimento / Ácido Hialurônico',
    queixaCliente: 'Preenchimento / Ácido Hialurônico',
    formaPagamento: 'Pix',
    idade: '29',
    bairro: 'Batel',
    observacoes: 'Consulta de avaliação realizada. Proposta enviada.',
    origemLead: 'Indicação',
    createdAt: getFormattedDate(2)
  },
  {
    id: 'lead-4',
    nome: 'Fernanda Lima Oliveira',
    whatsapp: '(41) 98877-1122',
    fase: 'Conexão',
    valorEstimado: 1500,
    servico: 'Limpeza de Pele / Peeling',
    queixaCliente: 'Limpeza de Pele / Peeling',
    formaPagamento: 'Cartão à vista',
    idade: '25',
    bairro: 'Moinhos de Vento',
    observacoes: 'Interessada no pacote de limpeza profunda e peeling.',
    origemLead: 'Anúncio Meta',
    createdAt: getFormattedDate(3)
  },
  {
    id: 'lead-5',
    nome: 'Rafael Albuquerque',
    whatsapp: '(51) 99123-4455',
    fase: 'Entrada',
    valorEstimado: 5500,
    servico: 'Bioestimulador / Fios',
    queixaCliente: 'Bioestimulador / Fios',
    formaPagamento: 'Boleto',
    idade: '48',
    bairro: 'Barra da Tijuca',
    observacoes: 'Preencheu formulário de contato no site.',
    origemLead: 'Orgânico',
    createdAt: getFormattedDate(0) // Today
  },
  {
    id: 'lead-6',
    nome: 'Beatriz Vasconcelos',
    whatsapp: '(19) 98223-9988',
    fase: 'Negócio Fechado',
    valorEstimado: 6000,
    servico: 'Harmonização Facial',
    queixaCliente: 'Harmonização Facial',
    formaPagamento: 'Pix',
    idade: '38',
    bairro: 'Campinas',
    observacoes: 'Sessão agendada para próxima semana.',
    origemLead: 'Indicação',
    createdAt: getFormattedDate(4)
  },
  {
    id: 'lead-7',
    nome: 'Thiago Nogueira',
    whatsapp: '(81) 99765-8899',
    fase: 'Negócio Perdido',
    valorEstimado: 1800,
    servico: 'Consulta / Avaliação',
    queixaCliente: 'Consulta / Avaliação',
    formaPagamento: '-',
    idade: '32',
    bairro: 'Boa Viagem',
    observacoes: 'Não compareceu à consulta e não respondeu WhatsApp.',
    origemLead: 'Google Ads',
    createdAt: getFormattedDate(5)
  },
  {
    id: 'lead-8',
    nome: 'Camila Santos Prado',
    whatsapp: '(11) 97112-3344',
    fase: 'Follow Up',
    valorEstimado: 3200,
    servico: 'Preenchimento / Ácido Hialurônico',
    queixaCliente: 'Preenchimento / Ácido Hialurônico',
    formaPagamento: 'Cartão 10x',
    idade: '36',
    bairro: 'Pinheiros',
    observacoes: 'Pediu desconto para pagamento via Pix.',
    origemLead: 'Anúncio Meta',
    createdAt: getFormattedDate(6)
  },
  {
    id: 'lead-9',
    nome: 'Rodrigo Barbosa',
    whatsapp: '(27) 98811-2233',
    fase: 'Avaliação',
    valorEstimado: 8500,
    servico: 'Gestão de Tráfego / Marketing',
    queixaCliente: 'Gestão de Tráfego / Marketing',
    formaPagamento: 'Boleto mensal',
    idade: '45',
    bairro: 'Praia do Canto',
    observacoes: 'Reunião estratégica de marketing agendada.',
    origemLead: 'Instagram',
    createdAt: getFormattedDate(8)
  },
  {
    id: 'lead-10',
    nome: 'Juliana Paes de Souza',
    whatsapp: '(31) 99221-5566',
    fase: 'Negócio Fechado',
    valorEstimado: 2800,
    servico: 'Botox / Toxina Botulínica',
    queixaCliente: 'Botox / Toxina Botulínica',
    formaPagamento: 'Pix',
    idade: '39',
    bairro: 'Lourdes',
    observacoes: 'Aplicação efetuada com sucesso.',
    origemLead: 'Google Ads',
    createdAt: getFormattedDate(10)
  }
];
