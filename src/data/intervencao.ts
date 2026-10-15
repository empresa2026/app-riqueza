import { PadraoId } from './padroesCorpo';

// Protocolo de cada lei: o de culpa é o principal; o de medo, quando existe,
// é a alternativa para quando o que trava é medo.
export const PROTOCOLO_POR_LEI: Record<PadraoId, { culpa: string; medo?: string }> = {
  sacrificio: { culpa: 'culpa_sobrevivente', medo: 'medo_ultrapassar' },
  injustica: { culpa: 'culpa_responsabilidade' },
  dor: { culpa: 'culpa_auto_odio' },
  renuncia: { culpa: 'culpa_separacao', medo: 'medo_separacao' }
};

export const PROTOCOLOS_DO_METODO = [
  'culpa_sobrevivente',
  'culpa_separacao',
  'culpa_responsabilidade',
  'culpa_auto_odio',
  'medo_ultrapassar',
  'medo_separacao'
];

export const DIAS_PARA_REAVALIAR = 21;

// Contrato silencioso de cada lei (mesmo texto da leitura do diagnóstico)
export function contratoDaLei(lei: PadraoId, familiar: string, areas: string[], fatos: string): string {
  // "Minha mãe" vira "minha mãe" no meio da frase
  const pessoa = familiar.replace(/^(Minha|Meu|Minhas|Meus)\b/, m => m.toLowerCase());
  const onde = areas.length > 0 ? `na área de ${areas.map(a => a.toLowerCase()).join(' e ')}` : 'na minha vida';
  const fato = fatos.trim().replace(/[.!;\s]+$/, '');
  const detalhe = fato ? ` (${fato})` : '';
  switch (lei) {
    case 'sacrificio':
      return `Para honrar o sacrifício de ${pessoa}, eu me comprometo a sofrer e me exaurir ${onde}${detalhe}.`;
    case 'injustica':
      return `Para compensar a perda vivida por ${pessoa}, eu me comprometo a abrir mão da prosperidade ${onde}${detalhe}.`;
    case 'dor':
      return `Para carregar a dor de ${pessoa}, meu corpo e mente repetirão o padrão de sofrimento ${onde}${detalhe}.`;
    case 'renuncia':
      return `Para não ofuscar ou trair a exclusão de ${pessoa}, eu renuncio ao meu brilho e destaque ${onde}${detalhe}.`;
  }
}

// Situações do dia a dia que abrem um protocolo na hora (botão SOS)
export const SITUACOES_SOS = [
  {
    id: 'cobrar',
    titulo: 'Tensão ao cobrar, vender ou receber',
    descricao: 'Medo de ter mais dinheiro, receber um valor alto ou ultrapassar a escassez da família.',
    protocoloId: 'medo_ultrapassar'
  },
  {
    id: 'rejeicao',
    titulo: 'Discussão ou medo de rejeição',
    descricao: 'Tensão antes de se posicionar com parceiro(a) ou família, medo de ser deixado(a).',
    protocoloId: 'medo_separacao'
  },
  {
    id: 'sobrecarga',
    titulo: 'Cansaço súbito e sobrecarga',
    descricao: 'Sensação de carregar o mundo nas costas ou assumir problemas que não são seus.',
    protocoloId: 'culpa_responsabilidade'
  },
  {
    id: 'sabotagem',
    titulo: 'Travar perto do resultado',
    descricao: 'Procrastinar ou criar imprevistos justo quando tudo está dando certo.',
    protocoloId: 'culpa_sobrevivente'
  }
];
