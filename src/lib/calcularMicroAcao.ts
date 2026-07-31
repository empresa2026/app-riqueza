// MABI OS - calcularMicroAcao.ts
// PROTOCOLO OFICIAL: Culpa + Medo definem a modalidade. Arquitetura é descritiva.

export interface LivroRazao {
  sacrificio?: string[];
  renuncia?: string[];
  injustica?: string[];
  tipo?: string;
}

export interface CalcularMicroAcaoDados {
  livroRazao: LivroRazao;
  espelho: string[];
  somatica: string;
  credorAcessivel?: boolean;
}

export interface MicroAcaoResultado {
  codigo: string;
  nome: string;
  risco: string;
  justificativa: string;
  acao: string;
  culpa: string;
  medo: string;
  protocolo: string;
}

// MAPA PRINCIPAL - Culpa + Medo = Modalidade
const MAPA_PROTOCOLO: Record<string, { codigo: string; nome: string; risco: string; justificativa: string; acao: string }> = {
  'Sobrevivente-Exposicao': {
    codigo: 'M3',
    nome: 'Ato de Enfrentamento',
    risco: 'Baixo',
    justificativa: 'Culpa de ultrapassar + medo de ser visto. Exposição direta resolve.',
    acao: 'Executar 1 ato de 10% que o sistema proíbe'
  },
  'Sobrevivente-Isolamento': {
    codigo: 'M11',
    nome: 'Des-triangulação',
    risco: 'Médio',
    justificativa: 'Medo de ser excluído por ter mais que a família.',
    acao: 'Sair do papel de mediador'
  },
  'Sobrevivente-Subjugacao': {
    codigo: 'M8',
    nome: 'Perdão Enright',
    risco: 'Médio',
    justificativa: 'Ressentimento por injustiça mantém o contrato.',
    acao: 'Processar raiva e decidir soltar'
  },
  'Responsavel-Isolamento': {
    codigo: 'M7',
    nome: 'Externalização Narrativa',
    risco: 'Médio',
    justificativa: 'Culpa virou identidade. Precisa separar pessoa do problema.',
    acao: 'Nomear o problema e escrever carta para ele'
  },
  'Responsavel-Exposicao': {
    codigo: 'M1',
    nome: 'Carta de Devolução',
    risco: 'Baixo',
    justificativa: 'Lealdade inconsciente detectada. Devolver responsabilidade.',
    acao: 'Escrever carta devolvendo fardos ao ancestral'
  },
  'Responsavel-Subjugacao': {
    codigo: 'M10',
    nome: 'Ativação Comportamental',
    risco: 'Baixo',
    justificativa: 'Exaustão por carregar todos. Reativar prazer.',
    acao: 'Agendar 3 atividades de prazer'
  },
  'AutoOdio_controle-Exposicao': {
    codigo: 'M9',
    nome: 'ACT Valores',
    risco: 'Baixo',
    justificativa: 'Medo de perder controle ao se expor. Precisa de valor.',
    acao: 'Conectar ação a valor essencial'
  },
  'AutoOdio_controle-Subjugacao': {
    codigo: 'M3',
    nome: 'Ato de Enfrentamento',
    risco: 'Baixo',
    justificativa: 'Controle como defesa. Expor quebra o padrão.',
    acao: 'Executar ato sem controle perfeito'
  },
  'AutoOdio_imperfeicao-Imperfeicao': {
    codigo: 'M10',
    nome: 'Ativação Comportamental',
    risco: 'Baixo',
    justificativa: 'Perfeccionismo paralisa. Ação imperfeita reativa.',
    acao: 'Fazer 1 coisa mal feita propositalmente'
  },
  'AutoOdio_imperfeicao-Exposicao': {
    codigo: 'M9',
    nome: 'ACT Valores',
    risco: 'Baixo',
    justificativa: 'Medo de errar em público. Valor > medo.',
    acao: 'Agir apesar do pensamento "vou falhar"'
  },
  'Deslealdade-Isolamento': {
    codigo: 'M11',
    nome: 'Des-triangulação',
    risco: 'Médio',
    justificativa: 'Medo de trair e ser excluído.',
    acao: 'Praticar "não levo recado"'
  },
  'Deslealdade-Invasao': {
    codigo: 'M2',
    nome: 'Conversa Conduzida',
    risco: 'Médio-Alto',
    justificativa: 'Sistema invasivo. Precisa diferenciar.',
    acao: 'Script de 3 frases + sustentar silêncio'
  }
};

const MODALIDADES = {
  M1: { codigo: 'M1', nome: 'Carta de Devolução', risco: 'Baixo', justificativa: 'Lealdade inconsciente', acao: 'Escrever carta e queimar' },
  M2: { codigo: 'M2', nome: 'Conversa Conduzida', risco: 'Médio-Alto', justificativa: 'Credor acessível', acao: 'Script + silêncio' },
  M3: { codigo: 'M3', nome: 'Ato de Enfrentamento', risco: 'Baixo', justificativa: 'Bloqueio puro', acao: 'Ato de 10%' },
  M7: { codigo: 'M7', nome: 'Externalização', risco: 'Médio', justificativa: 'Identidade fusionada', acao: 'Nomear problema' },
  M8: { codigo: 'M8', nome: 'Perdão Enright', risco: 'Médio', justificativa: 'Ressentimento', acao: 'Processar raiva' },
  M9: { codigo: 'M9', nome: 'ACT Valores', risco: 'Baixo', justificativa: 'Falta sentido', acao: 'Conectar a valor' },
  M10: { codigo: 'M10', nome: 'Ativação', risco: 'Baixo', justificativa: 'Anedonia', acao: 'Agendar prazeres' },
  M11: { codigo: 'M11', nome: 'Des-triangulação', risco: 'Médio', justificativa: 'Triângulo', acao: 'Sair do meio' }
};

export function calcularMicroAcao(dados: CalcularMicroAcaoDados): MicroAcaoResultado {
  const { livroRazao, espelho, somatica, credorAcessivel } = dados;

  // PASSO 1: Calcular CULPA (do Livro-Razão)
  const culpa = calcularCulpa(livroRazao, espelho);

  // PASSO 2: Calcular MEDO (do Espelho/Somática)
  const medo = calcularMedo(espelho, somatica);

  // PASSO 3: PROTOCOLO - Cruzar Culpa + Medo (NÃO use arquitetura aqui)
  const protocolo = `${culpa}-${medo}`;

  // PASSO 4: Buscar modalidade
  const resultado = MAPA_PROTOCOLO[protocolo] || MAPA_PROTOCOLO['Sobrevivente-Exposicao'];

  // PASSO 5: Ajuste fino com Livro (para Carta de Devolução)
  if (livroRazao.tipo === 'sacrificio' && culpa === 'Sobrevivente' && resultado.codigo === 'M3') {
    return { ...MODALIDADES.M1, culpa, medo, protocolo }; // Carta antes do Ato
  }

  if (livroRazao.tipo === 'renuncia' && culpa === 'Responsavel') {
    return { ...MODALIDADES.M1, culpa, medo, protocolo };
  }

  // PASSO 6: Ajuste para credor acessível
  if (credorAcessivel && ['Deslealdade-Isolamento', 'Responsavel-Isolamento'].includes(protocolo)) {
    return { ...MODALIDADES.M2, culpa, medo, protocolo };
  }

  return { ...resultado, culpa, medo, protocolo };
}

function calcularCulpa(livro: LivroRazao, espelho: string[]): string {
  const espelhoStr = espelho.join(' ').toLowerCase();
  
  // Juntamos todas as dívidas preenchidas pelo usuário
  const libroStr = [
    ...(livro.sacrificio || []),
    ...(livro.renuncia || []),
    ...(livro.injustica || [])
  ].join(' ').toLowerCase();

  // Regra 1: Se tem sacrifício + "bato em teto" ou "dinheiro foge"
  const temSacrificio = (livro.sacrificio && livro.sacrificio.length > 0) || libroStr.includes('sacrificar') || libroStr.includes('duro') || libroStr.includes('trabalhar') || libroStr.includes('sofrer') || libroStr.includes('escassez');
  const temBatoTeto = espelhoStr.includes('bato em teto') || espelhoStr.includes('prosperando') || espelhoStr.includes('imprevisto') || espelhoStr.includes('sabotando') || espelhoStr.includes('frear');
  const temDinheiroFoge = espelhoStr.includes('dinheiro foge') || espelhoStr.includes('escorrer pelos dedos') || espelhoStr.includes('queimar na minha mão') || espelhoStr.includes('gastar') || espelhoStr.includes('se livrar');

  if (temSacrificio && (temBatoTeto || temDinheiroFoge)) {
    return 'Sobrevivente';
  }

  // Regra 2: Se tem renúncia + "trabalho de graça" ou "me anulo"
  const temRenuncia = (livro.renuncia && livro.renuncia.length > 0) || libroStr.includes('direito') || libroStr.includes('feliz') || libroStr.includes('viver um amor') || libroStr.includes('subir na vida') || libroStr.includes('saudável');
  const temTrabalhoDeGraca = espelhoStr.includes('trabalho de graça') || espelhoStr.includes('cobrar pelo meu trabalho') || espelhoStr.includes('cobrar mais caro') || espelhoStr.includes('negligência') || espelhoStr.includes('abaixo da minha competência');
  const temMeAnulo = espelhoStr.includes('me anulo') || espelhoStr.includes('anulo nas relações') || espelhoStr.includes('desvalorizam') || espelhoStr.includes('traem') || espelhoStr.includes('rejeição');

  if (temRenuncia && (temTrabalhoDeGraca || temMeAnulo)) {
    return 'Responsavel';
  }

  // Regra 3: Se tem injustiça + "ressentimento" ou "amargura"
  const temInjustica = (livro.injustica && livro.injustica.length > 0) || libroStr.includes('resolver') || libroStr.includes('conflitos') || libroStr.includes('salv') || libroStr.includes('humilhando') || libroStr.includes('adoecer ou falhar');
  const temRessentimento = espelhoStr.includes('ressentimento') || espelhoStr.includes('amargura') || espelhoStr.includes('desvalorizam') || espelhoStr.includes('traem') || espelhoStr.includes('rejeição') || espelhoStr.includes('insegurança') || espelhoStr.includes('ciúme');

  if (temInjustica && (temRessentimento)) {
    return 'Sobrevivente'; // ressentimento é sobrevivente que não perdoou
  }

  // Regra 4: Se espelho tem "eu sou" ou "sempre fui" ou impostor/fraude
  if (espelhoStr.includes('eu sou') || espelhoStr.includes('sempre fui') || espelhoStr.includes('fraude') || espelhoStr.includes('impostor')) {
    return 'Responsavel';
  }

  // Regra 5: Se espelho tem "preciso controlar" ou "perfeccionismo" ou relaxar/hipervigilância
  if (espelhoStr.includes('preciso controlar') || espelhoStr.includes('perfeccionismo') || espelhoStr.includes('relaxar') || espelhoStr.includes('hipervigilância') || espelhoStr.includes('alerta')) {
    return 'AutoOdio_controle';
  }

  // Regra 6: Se espelho tem "medo de errar" ou "não sou bom o suficiente" ou procrastinar
  if (espelhoStr.includes('medo de errar') || espelhoStr.includes('não sou bom') || espelhoStr.includes('não sei o suficiente') || espelhoStr.includes('procrastino') || espelhoStr.includes('sabotando')) {
    return 'AutoOdio_imperfeicao';
  }

  // Regra 7: Se é mediador ou "não posso trair" ou trair/abandonar na dívida
  if (espelhoStr.includes('mediador') || espelhoStr.includes('não posso trair') || libroStr.includes('traindo') || libroStr.includes('abandonando') || libroStr.includes('mediar') || libroStr.includes('salv')) {
    return 'Deslealdade';
  }

  return 'Sobrevivente'; // default mais comum
}

function calcularMedo(espelho: string[], somatica: string): string {
  const espelhoStr = espelho.join(' ').toLowerCase();
  
  if (somatica === 'Dissociacao' || espelhoStr.includes('invisivel') || espelhoStr.includes('sozinho') || espelhoStr.includes('rejeição') || espelhoStr.includes('indisponível') || espelhoStr.includes('distanciamento')) {
    return 'Invasao';
  }
  if (somatica === 'Submissao' || espelhoStr.includes('dizer não') || espelhoStr.includes('anulo') || espelhoStr.includes('cobrar') || espelhoStr.includes('egoísmo') || espelhoStr.includes('agressão')) {
    return 'Isolamento';
  }
  if (somatica === 'Paralisia' || espelhoStr.includes('travo') || espelhoStr.includes('procrastino') || espelhoStr.includes('autopromover') || espelhoStr.includes('falar em público') || espelhoStr.includes('peso nas pernas') || espelhoStr.includes('garganta') || espelhoStr.includes('engasgo')) {
    return 'Exposicao';
  }
  if (somatica === 'Exaustao' || espelhoStr.includes('cansado') || espelhoStr.includes('exaustão') || espelhoStr.includes('fadiga') || espelhoStr.includes('corpo') || espelhoStr.includes('negligência') || espelhoStr.includes('colapso')) {
    return 'Subjugacao';
  }
  if (espelhoStr.includes('errar') || espelhoStr.includes('perfeito') || espelhoStr.includes('fraude') || espelhoStr.includes('impostor')) {
    return 'Imperfeicao';
  }
  return 'Exposicao'; // default
}
