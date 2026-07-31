// M.A.B.I. OS - Motor de Decisão Clínica
// Baseado na Matriz de Decisão Fase III

export interface MABIInputs {
  culpa: 'Sobrevivente' | 'Responsavel' | 'AutoOdio_controle' | 'AutoOdio_imperfeicao' | 'Deslealdade';
  arquitetura: 'Cefalico' | 'Simbiotico' | 'Articulador' | 'Denso' | 'Simetrico';
  medo: 'Invasao' | 'Isolamento' | 'Subjugacao' | 'Exposicao' | 'Imperfeicao';
  somatica: 'Dissociacao' | 'Submissao' | 'Paralisia' | 'Exaustao' | 'Hiper';
  livroTipo: 'sacrificio' | 'injustica' | 'dor' | 'renuncia';
  sinalClinico?: string;
  credorAcessivel?: boolean;
}

export interface ModalidadeOutput {
  codigo: string;
  nome: string;
  risco: 'Baixo' | 'Baixo-Médio' | 'Médio' | 'Médio-Alto' | 'Alto';
  justificativa: string;
  acaoCirurgica: string;
  primeiraAcao: string[];
  tempoEstimado: string;
}

const modalidades: Record<string, ModalidadeOutput> = {
  'M1': {
    codigo: 'MODALIDADE 1',
    nome: 'Carta de Devolução',
    risco: 'Baixo',
    justificativa: 'Lealdade inconsciente e herança emocional detectadas. Requer rompimento simbólico e permissão visceral.',
    acaoCirurgica: 'Escrever uma carta manuscrita devolvendo os fardos ao ancestral correspondente e queimar em ritual simbólico.',
    primeiraAcao: ['Escrever carta endereçada ao familiar', 'Ler em voz alta', 'Queimar ou rasgar'],
    tempoEstimado: '20 minutos'
  },
  'M2': {
    codigo: 'MODALIDADE 2',
    nome: 'Conversa Conduzida',
    risco: 'Médio-Alto',
    justificativa: 'Credor acessível e sistema permite diferenciação presencial.',
    acaoCirurgica: 'Declarar posição em script de 3 frases e sustentar silêncio.',
    primeiraAcao: ['Escrever script', 'Declarar posição', 'Sustentar silêncio'],
    tempoEstimado: '15 minutos'
  },
  'M3': {
    codigo: 'MODALIDADE 3',
    nome: 'Ato de Enfrentamento',
    risco: 'Baixo',
    justificativa: 'Bloqueio comportamental puro sem figura presente. Exposição direta resolve.',
    acaoCirurgica: 'Executar 1 ato de 10% que o sistema proíbe e monitorar ansiedade até cair.',
    primeiraAcao: ['Escolher ato de 10%', 'Executar hoje', 'Anotar ansiedade 0-10 antes/depois'],
    tempoEstimado: '15 minutos'
  },
  'M7': {
    codigo: 'MODALIDADE 7',
    nome: 'Externalização Narrativa',
    risco: 'Médio',
    justificativa: 'Culpa virou identidade. Pessoa e problema estão fusionados.',
    acaoCirurgica: 'Nomear o problema como entidade externa e separar da identidade.',
    primeiraAcao: ['Dar nome ao problema', 'Escrever carta para ele', 'Escrever carta do futuro sem ele'],
    tempoEstimado: '25 minutos'
  },
  'M8': {
    codigo: 'MODALIDADE 8',
    nome: 'Perdão Enright (4 fases)',
    risco: 'Médio',
    justificativa: 'Ressentimento crônico mantendo o contrato ativo.',
    acaoCirurgica: 'Processar raiva sem contato e decidir soltar.',
    primeiraAcao: ['Listar custos do ressentimento', 'Decidir soltar', 'Escrever o que não virá'],
    tempoEstimado: '30 minutos'
  },
  'M9': {
    codigo: 'MODALIDADE 9',
    nome: 'Exposição Baseada em Valores ACT',
    risco: 'Baixo',
    justificativa: 'Bloqueio com falta de sentido. Precisa de valor antes da ação.',
    acaoCirurgica: 'Conectar ato a valor essencial e agir apesar do medo.',
    primeiraAcao: ['Identificar valor', 'Fazer defusão do pensamento', 'Agir conectado ao valor'],
    tempoEstimado: '20 minutos'
  },
  'M10': {
    codigo: 'MODALIDADE 10',
    nome: 'Ativação Comportamental',
    risco: 'Baixo',
    justificativa: 'Anedonia e paralisia por sacrifício. Sistema de recompensa desligado.',
    acaoCirurgica: 'Reativar comportamentos de prazer e domínio.',
    primeiraAcao: ['Monitorar 3 dias', 'Agendar 3 prazeres', 'Registrar SUDS'],
    tempoEstimado: '10 minutos/dia'
  },
  'M11': {
    codigo: 'MODALIDADE 11',
    nome: 'Des-triangulação Bowen',
    risco: 'Médio',
    justificativa: 'Sistema triangulado. Você está no meio.',
    acaoCirurgica: 'Sair do papel de mediador e devolver responsabilidade.',
    primeiraAcao: ['Mapear triângulo', 'Identificar sua posição', 'Praticar "não levo recado"'],
    tempoEstimado: '20 minutos'
  }
};

export function calcularModalidade(inputs: MABIInputs): ModalidadeOutput {
  const { culpa, arquitetura, medo, somatica, livroTipo, sinalClinico, credorAcessivel } = inputs;

  // REGRA 1: Des-triangulação (prioridade máxima para triângulos)
  if (culpa === 'Deslealdade' && arquitetura === 'Simbiotico' && medo === 'Isolamento') {
    return modalidades['M11'];
  }

  // REGRA 2: Externalização (culpa virou identidade)
  if ((culpa === 'Responsavel' && arquitetura === 'Simbiotico') || 
      (sinalClinico?.includes('eu sou') || sinalClinico?.includes('sempre fui'))) {
    return modalidades['M7'];
  }

  // REGRA 3: Perdão (ressentimento)
  if (livroTipo === 'injustica' && (somatica === 'Hiper' || sinalClinico?.includes('amargura'))) {
    return modalidades['M8'];
  }

  // REGRA 4: ACT Valores (bloqueio sem sentido) - SEU CASO DA IMAGEM
  if (culpa === 'AutoOdio_controle' && arquitetura === 'Denso' && medo === 'Exposicao' && 
      (sinalClinico?.includes('sentido') || somatica === 'Paralisia')) {
    return modalidades['M9'];
  }

  // REGRA 5: Ato de Enfrentamento (bloqueio puro)
  if (culpa === 'Sobrevivente' && arquitetura === 'Denso' && medo === 'Exposicao' && !credorAcessivel) {
    return modalidades['M3'];
  }

  // REGRA 6: Ativação Comportamental (anedonia)
  if ((culpa === 'AutoOdio_imperfeicao' && arquitetura === 'Simetrico') || 
      (somatica === 'Exaustao' && sinalClinico?.includes('prazer'))) {
    return modalidades['M10'];
  }

  // REGRA 7: Conversa Conduzida (credor acessível)
  if (credorAcessivel && arquitetura !== 'Cefalico') {
    return modalidades['M2'];
  }

  // REGRA 8: Carta de Devolução (default para lealdades)
  if ((culpa === 'Sobrevivente' && livroTipo === 'sacrificio') ||
      (culpa === 'Responsavel' && livroTipo === 'renuncia')) {
    return modalidades['M1'];
  }

  // Fallback seguro
  return modalidades['M3'];
}

export function buildMabiAnswersFromPlan(plan: any) {
  if (!plan) return {};

  const f1 = plan.fase1 || {};
  const sints = plan.sintomas || {};
  const cmap = plan.clinicalMap || {};

  const ancestorName = f1.sacrificio?.familiar || f1.injustica?.familiar || f1.dor?.familiar || f1.renuncia?.familiar || '';
  const selectedDebts = [
    ...(f1.sacrificio?.areas || []),
    ...(f1.injustica?.areas || []),
    ...(f1.dor?.areas || []),
    ...(f1.renuncia?.areas || [])
  ];
  const checkedSymptoms = [
    ...(sints.sacrificio || []),
    ...(sints.injustica || []),
    ...(sints.dor || []),
    ...(sints.renuncia || [])
  ];

  return {
    passo1: {
      goalTarget: cmap.tacticalAction || '',
      ancestorName: ancestorName,
      selectedDebts: selectedDebts,
      contractStatement: cmap.executionPlan || ''
    },
    passo2: {
      checkedSymptoms: checkedSymptoms,
      visceralSensation: cmap.visceralSensation || '',
      safetyScore: 6
    },
    passo3: {
      sensationType: cmap.visceralSensation || '',
      judgmentOwner: ancestorName,
      guiltPhrase: '',
      survivalFear: ''
    },
    passo4: {
      selectedActionType: cmap.tacticalAction || '',
      actionPlan: cmap.executionPlan || '',
      commitmentAccepted: true,
      mabiInputs: cmap.mabiInputs || {
        culpa: 'Sobrevivente',
        arquitetura: 'Denso',
        medo: 'Exposicao',
        somatica: 'Paralisia',
        livro_razao_tipo: 'sacrificio'
      }
    }
  };
}

// Retro-compatibilidade UI e Dropdowns
export const MABI_OPTIONS = {
  culpa: [
    { value: 'Sobrevivente', label: 'Sobrevivente' },
    { value: 'Responsavel', label: 'Responsável' },
    { value: 'AutoOdio_controle', label: 'Auto-Ódio (Controle)' },
    { value: 'AutoOdio_imperfeicao', label: 'Auto-Ódio (Imperfeição)' },
    { value: 'Deslealdade', label: 'Deslealdade' }
  ],
  arquitetura: [
    { value: 'Cefalico', label: 'Cefálico' },
    { value: 'Simbiotico', label: 'Simbiótico' },
    { value: 'Articulador', label: 'Articulador' },
    { value: 'Denso', label: 'Denso' },
    { value: 'Simetrico', label: 'Simétrico' }
  ],
  medo: [
    { value: 'Invasao', label: 'Invasão' },
    { value: 'Isolamento', label: 'Isolamento' },
    { value: 'Subjugacao', label: 'Subjugação' },
    { value: 'Exposicao', label: 'Exposição' },
    { value: 'Imperfeicao', label: 'Imperfeição' }
  ],
  somatica: [
    { value: 'Dissociacao', label: 'Dissociação' },
    { value: 'Submissao', label: 'Submissão' },
    { value: 'Paralisia', label: 'Paralisia' },
    { value: 'Exaustao', label: 'Exaustão' },
    { value: 'Hiper', label: 'Hiper (Hipervigilância)' }
  ],
  livro_razao_tipo: [
    { value: 'sacrificio', label: 'Sacrifício' },
    { value: 'injustica', label: 'Injustiça' },
    { value: 'dor', label: 'Dor' },
    { value: 'renuncia', label: 'Renúncia' }
  ],
  sinalClinico: [
    { value: 'Nenhum', label: 'Nenhum' },
    { value: 'eu sou quem sacrifica', label: '"Eu sou quem sacrifica"' },
    { value: 'não vejo sentido', label: '"Não vejo sentido"' }
  ]
};

export interface OldMabiRecommendation {
  id: string;
  modalidade: string;
  porque: string;
  acao: string;
  plano: string[];
  dramaticRole: string;
  smadAlarm: string;
  risco: string;
  tempoEstimado: string;
}

export function getMabiRecommendation(inputs: {
  culpa: string;
  arquitetura: string;
  medo: string;
  somatica: string;
  livro_razao_tipo: string;
  sinalClinico?: string;
  credor_acessivel?: boolean;
}): OldMabiRecommendation {
  const result = calcularModalidade({
    culpa: (inputs.culpa || 'Sobrevivente') as any,
    arquitetura: (inputs.arquitetura || 'Denso') as any,
    medo: (inputs.medo || 'Exposicao') as any,
    somatica: (inputs.somatica || 'Paralisia') as any,
    livroTipo: (inputs.livro_razao_tipo || 'sacrificio') as any,
    sinalClinico: inputs.sinalClinico || '',
    credorAcessivel: !!inputs.credor_acessivel
  });

  // Map to old dynamic role and smad values depending on rule
  let dramaticRole = 'O Compensador Incorruptível';
  let smadAlarm = 'Alerta de Lealdade Familiar';

  if (result.codigo === 'MODALIDADE 11') {
    dramaticRole = 'O Mediador (Apaziguador Triangulado)';
    smadAlarm = 'Alarme de Exclusão (Medo do Isolamento)';
  } else if (result.codigo === 'MODALIDADE 7') {
    dramaticRole = 'O Salvador do Clã (Identidade de Sacrifício)';
    smadAlarm = 'Culpa pelo Sucesso (Necessidade de Exaustão)';
  } else if (result.codigo === 'MODALIDADE 8') {
    dramaticRole = 'O Amortecedor (Hipervigilância de Injustiça)';
    smadAlarm = 'Ressentimento Sistêmico (Alerta de Injustiça)';
  } else if (result.codigo === 'MODALIDADE 9') {
    dramaticRole = 'A Vítima Leal (Paralisia de Sentido)';
    smadAlarm = 'Alerta de Perigo de Sucesso (Medo da Exposição)';
  } else if (result.codigo === 'MODALIDADE 10') {
    dramaticRole = 'O Perfeccionista Rígido (Anedonia Ativa)';
    smadAlarm = 'Alerta de Imperfeição (Terror do Erro)';
  } else if (result.codigo === 'MODALIDADE 2') {
    dramaticRole = 'O Filho Adulto Diferenciado';
    smadAlarm = 'Confronto do Self (Sinal de Diferenciação)';
  } else if (result.codigo === 'MODALIDADE 3') {
    dramaticRole = 'O Rebelde Leal (Teto de Conquistas)';
    smadAlarm = 'Culpa do Sobrevivente (Perigo ao Ultrapassar)';
  }

  return {
    id: result.codigo,
    modalidade: `${result.codigo} - ${result.nome}`,
    porque: result.justificativa,
    acao: result.acaoCirurgica,
    plano: result.primeiraAcao,
    dramaticRole,
    smadAlarm,
    risco: result.risco,
    tempoEstimado: result.tempoEstimado
  };
}

export function autoCrossJourneyData(answers: any, goal: string = 'dinheiro'): MABIInputs {
  const p1 = answers?.passo1 || {};
  const p2 = answers?.passo2 || {};
  const p3 = answers?.passo3 || {};
  const p4 = answers?.passo4 || {};

  const debtsList: string[] = p1.selectedDebts || [];
  const checkedSymptoms: string[] = p2.checkedSymptoms || [];
  const sensationType: string = p3.sensationType || '';
  const survivalFear: string = p3.survivalFear || '';
  const dramaticRole: string = p4.dramaticRole || '';

  // 1. livroTipo
  let libro: 'sacrificio' | 'injustica' | 'dor' | 'renuncia' = 'sacrificio';
  if (goal === 'relacionamento') libro = 'renuncia';
  else if (goal === 'carreira') libro = 'sacrificio';
  else if (goal === 'saude') libro = 'dor';

  const debtStr = debtsList.join(' ').toLowerCase();
  if (debtStr.includes('sofrimento') || debtStr.includes('dor') || debtStr.includes('adoecer') || debtStr.includes('saúde')) {
    libro = 'dor';
  } else if (debtStr.includes('escassez') || debtStr.includes('trabalhar') || debtStr.includes('sacrificar') || debtStr.includes('duro') || debtStr.includes('sacrificando')) {
    libro = 'sacrificio';
  } else if (debtStr.includes('resolver') || debtStr.includes('conflitos') || debtStr.includes('salvá-los') || debtStr.includes('humilhando')) {
    libro = 'injustica';
  } else if (debtStr.includes('direito') || debtStr.includes('feliz') || debtStr.includes('traindo') || debtStr.includes('abandonando') || debtStr.includes('vida')) {
    libro = 'renuncia';
  }

  // 2. culpa
  let culpaVal: 'Sobrevivente' | 'Responsavel' | 'AutoOdio_controle' | 'AutoOdio_imperfeicao' | 'Deslealdade' = 'Sobrevivente';
  if (dramaticRole === 'Rebelde' || dramaticRole.toLowerCase().includes('rebelde') || debtStr.includes('traindo') || debtStr.includes('humilhando') || debtStr.includes('arrogante')) {
    culpaVal = 'Deslealdade';
  } else if (dramaticRole === 'Salvador' || dramaticRole.toLowerCase().includes('salvador') || debtStr.includes('salvá-los') || debtStr.includes('resolver')) {
    culpaVal = 'Responsavel';
  } else if (debtStr.includes('trabalhar até adoecer') || debtStr.includes('carregar a dor') || debtStr.includes('carregar a escassez')) {
    culpaVal = 'AutoOdio_controle';
  } else if (debtStr.includes('arrogante') || debtStr.includes('pretensioso') || dramaticRole === 'Mediador' || dramaticRole.toLowerCase().includes('mediador')) {
    culpaVal = 'AutoOdio_imperfeicao';
  } else {
    culpaVal = 'Sobrevivente';
  }

  // 3. medo
  let medoVal: 'Invasao' | 'Isolamento' | 'Subjugacao' | 'Exposicao' | 'Imperfeicao' = 'Exposicao';
  if (survivalFear) {
    if (survivalFear.includes('criticado') || survivalFear.includes('arrogante') || survivalFear.includes('orgulhoso')) {
      medoVal = 'Exposicao';
    } else if (survivalFear.includes('conexão') || survivalFear.includes('amparo') || survivalFear.includes('pertencimento')) {
      medoVal = 'Isolamento';
    } else if (survivalFear.includes('tragédia') || survivalFear.includes('castigo') || survivalFear.includes('adoecimento')) {
      medoVal = 'Subjugacao';
    } else if (survivalFear.includes('sozinho') || survivalFear.includes('exposto ao perigo') || survivalFear.includes('proteção')) {
      medoVal = 'Invasao';
    }
  }

  // 4. somatica
  let somaticaVal: 'Dissociacao' | 'Submissao' | 'Paralisia' | 'Exaustao' | 'Hiper' = 'Paralisia';
  if (sensationType) {
    if (sensationType.includes('Aperto') || sensationType.includes('Taquicardia') || sensationType.includes('aceleração') || sensationType.includes('peito')) {
      somaticaVal = 'Hiper';
    } else if (sensationType.includes('Nó') || sensationType.includes('Paralisia') || sensationType.includes('peso') || sensationType.includes('garganta')) {
      somaticaVal = 'Paralisia';
    } else if (sensationType.includes('Frio') || sensationType.includes('vazio') || sensationType.includes('estômago')) {
      somaticaVal = 'Submissao';
    } else if (sensationType.includes('Tontura') || sensationType.includes('distanciamento')) {
      somaticaVal = 'Dissociacao';
    }
  }

  // 5. arquitetura
  let arquiVal: 'Cefalico' | 'Simbiotico' | 'Articulador' | 'Denso' | 'Simetrico' = 'Denso';
  if (goal === 'relacionamento' || dramaticRole === 'Salvador' || dramaticRole.toLowerCase().includes('salvador')) {
    arquiVal = 'Simbiotico';
  } else if (goal === 'dinheiro' || dramaticRole === 'Rebelde' || dramaticRole.toLowerCase().includes('rebelde')) {
    arquiVal = 'Articulador';
  } else if (goal === 'carreira' || dramaticRole === 'Mediador' || dramaticRole.toLowerCase().includes('mediador')) {
    arquiVal = 'Cefalico';
  } else if (goal === 'saude' || somaticaVal === 'Paralisia') {
    arquiVal = 'Denso';
  } else {
    arquiVal = 'Simetrico';
  }

  // 6. sinalClinico
  let sinalClinico = 'Nenhum';
  const checkedStr = checkedSymptoms.join(' ').toLowerCase();
  if (checkedStr.includes('sentido') || checkedStr.includes('significado')) {
    sinalClinico = 'não vejo sentido';
  } else if (checkedStr.includes('sacrifica') || checkedStr.includes('exaustão') || checkedStr.includes('trabalho até')) {
    sinalClinico = 'eu sou quem sacrifica';
  }

  return {
    culpa: culpaVal,
    arquitetura: arquiVal,
    medo: medoVal,
    somatica: somaticaVal,
    livroTipo: libro,
    sinalClinico,
    credorAcessivel: false
  };
}
