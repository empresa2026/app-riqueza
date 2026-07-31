
export interface Phase {
  label: string;
  title: string;
  matrixId?: string;
  quizId?: string;
  protocolId?: string;
  type: 'matrix' | 'quiz' | 'protocol';
}

export interface ProblemTheme {
  id: string;
  title: string;
  subtitle: string;
  phases: Phase[];
}

export const PROBLEM_THEMES: ProblemTheme[] = [
  {
    id: 'divida-recorrente',
    title: 'A DÍVIDA RECORRENTE',
    subtitle: 'Ganha bem, mas o dinheiro queima ou atrai imprevistos.',
    phases: [
      { label: 'PASSO 1 (Raio-X)', title: 'Protocolo Financeiro', quizId: 'financeiro-base', type: 'quiz' },
      { label: 'FASE 1 (O Fato)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Família)', title: 'F.A.M.I.L.I.A.', matrixId: 'familia', type: 'matrix' },
      { label: 'FASE 3 (Lealdade)', title: 'L.E.A.L.', matrixId: 'leal', type: 'matrix' },
      { label: 'FASE 4 (A Utilidade)', title: 'N.E.C.E.S.', matrixId: 'neces', type: 'matrix' },
      { label: 'FASE 5 (A Narrativa)', title: 'N.A.R.R.A.', matrixId: 'narra', type: 'matrix' },
      { label: 'FASE 6 (A Crença)', title: 'A.B.C.D.E.', matrixId: 'abcde', type: 'matrix' },
      { label: 'FASE 7 (A Expansão)', title: 'G.E.N.I.O.', matrixId: 'genio', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'Protocolo de Culpa', protocolId: 'culpa', type: 'protocol' }
    ]
  },
  {
    id: 'doenca-panico',
    title: 'DOENÇA CRÔNICA OU PÂNICO',
    subtitle: 'Sintomas que paralisam quando a vida exige postura adulta.',
    phases: [
      { label: 'FASE 1 (O Fato)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Relações)', title: 'D.R.A.M.A.', matrixId: 'drama', type: 'matrix' },
      { label: 'FASE 3 (O Teste)', title: 'T.E.S.T.E.', matrixId: 'teste', type: 'matrix' },
      { label: 'FASE 4 (A Defesa)', title: 'I.M.U.N.E.', matrixId: 'imune', type: 'matrix' },
      { label: 'FASE 5 (O Humos)', title: 'H.U.M.O.R.', matrixId: 'humor', type: 'matrix' },
      { label: 'FASE 6 (O Sentido)', title: 'S.E.N.S.O.', matrixId: 'senso', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'Protocolo de Medo', protocolId: 'medo', type: 'protocol' }
    ]
  },
  {
    id: 'traicao-toxico',
    title: 'TRAIÇÃO E RELAÇÕES TÓXICAS',
    subtitle: 'Perdões sucessivos ou "dedo podre" para parceiros.',
    phases: [
      { label: 'PASSO 1 (Raio-X)', title: 'Protocolo de Relacionamento', quizId: 'relacionamento-base', type: 'quiz' },
      { label: 'FASE 1 (O Fato)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (O Jogo)', title: 'D.R.A.M.A.', matrixId: 'drama', type: 'matrix' },
      { label: 'FASE 3 (A Ganho)', title: 'N.E.C.E.S.', matrixId: 'neces', type: 'matrix' },
      { label: 'FASE 4 (A História)', title: 'N.A.R.R.A.', matrixId: 'narra', type: 'matrix' },
      { label: 'FASE 5 (A Escolha)', title: 'A.C.E.I.T.A.', matrixId: 'aceit', type: 'matrix' },
      { label: 'PROCESSO A', title: 'Dependência Emocional', protocolId: 'dependencia', type: 'protocol' },
      { label: 'PROCESSO B', title: 'O Ressentimento', protocolId: 'ressentimento', type: 'protocol' },
      { label: 'PROCESSO C', title: 'A Culpa', protocolId: 'culpa', type: 'protocol' }
    ]
  },
  {
    id: 'procrastinacao-medo',
    title: 'ESTAGNAÇÃO E PROCRASTINAÇÃO',
    subtitle: 'Excelentes no que fazem, mas travam na hora de cobrar ou aparecer.',
    phases: [
      { label: 'FASE 1 (O Fato)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Família)', title: 'F.A.M.I.L.I.A.', matrixId: 'familia', type: 'matrix' },
      { label: 'FASE 3 (Lealdade)', title: 'L.E.A.L.', matrixId: 'leal', type: 'matrix' },
      { label: 'FASE 4 (O Travo)', title: 'I.M.U.N.E.', matrixId: 'imune', type: 'matrix' },
      { label: 'FASE 5 (A Mente)', title: 'A.B.C.D.E.', matrixId: 'abcde', type: 'matrix' },
      { label: 'FASE 6 (A Ação)', title: 'G.E.N.I.O.', matrixId: 'genio', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'A Autoestima', protocolId: 'autoestima', type: 'protocol' }
    ]
  },
  {
    id: 'filho-salvador',
    title: 'O FILHO "SALVADOR" DA FAMÍLIA',
    subtitle: 'Vive para resolver problemas dos pais ou irmãos, travando a própria vida.',
    phases: [
      { label: 'FASE 1 (O Fato)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (O Triângulo)', title: 'D.R.A.M.A.', matrixId: 'drama', type: 'matrix' },
      { label: 'FASE 3 (A Herança)', title: 'F.A.M.I.L.I.A.', matrixId: 'familia', type: 'matrix' },
      { label: 'FASE 4 (A Função)', title: 'N.E.C.E.S.', matrixId: 'neces', type: 'matrix' },
      { label: 'FASE 5 (A Versão)', title: 'N.A.R.R.A.', matrixId: 'narra', type: 'matrix' },
      { label: 'FASE 6 (A Postura)', title: 'A.C.E.I.T.A.', matrixId: 'aceit', type: 'matrix' },
      { label: 'FASE 7 (O Propósito)', title: 'S.E.N.S.O.', matrixId: 'senso', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'A Culpa', protocolId: 'culpa', type: 'protocol' }
    ]
  },
  {
    id: 'prisao-estagnacao',
    title: 'A PRISÃO DA ESTAGNAÇÃO',
    subtitle: 'Detesta o trabalho e quer mudar, mas procrastina o salto real.',
    phases: [
      { label: 'FASE 1 (Fadiga)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Fidelidade)', title: 'F.A.M.I.L.I.A.', matrixId: 'familia', type: 'matrix' },
      { label: 'FASE 3 (Lealdade)', title: 'L.E.A.L.', matrixId: 'leal', type: 'matrix' },
      { label: 'FASE 4 (O Medo)', title: 'I.M.U.N.E.', matrixId: 'imune', type: 'matrix' },
      { label: 'FASE 5 (A Mentira)', title: 'N.A.R.R.A.', matrixId: 'narra', type: 'matrix' },
      { label: 'FASE 6 (A Decisão)', title: 'A.C.E.I.T.A.', matrixId: 'aceit', type: 'matrix' },
      { label: 'FASE 7 (A Expansão)', title: 'G.E.N.I.O.', matrixId: 'genio', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'A Autoestima', protocolId: 'autoestima', type: 'protocol' }
    ]
  },
  {
    id: 'escudo-corporal',
    title: 'O ESCUDO CORPORAL',
    subtitle: 'O peso como armadura contra intimidade ou exposição.',
    phases: [
      { label: 'FASE 1 (Defesa)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (O Ganho)', title: 'D.R.A.M.A.', matrixId: 'drama', type: 'matrix' },
      { label: 'FASE 3 (Necessidade)', title: 'N.E.C.E.S.', matrixId: 'neces', type: 'matrix' },
      { label: 'FASE 4 (Crenças)', title: 'A.B.C.D.E.', matrixId: 'abcde', type: 'matrix' },
      { label: 'FASE 5 (O Sentido)', title: 'S.E.N.S.O.', matrixId: 'senso', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'O Ressentimento', protocolId: 'ressentimento', type: 'protocol' }
    ]
  },
  {
    id: 'ciume-profecia',
    title: 'A PROFECIA DO CIÚME',
    subtitle: 'Insegurança que asfixia o outro e gera o que mais teme.',
    phases: [
      { label: 'FASE 1 (Sinais)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Raízes)', title: 'F.A.M.I.L.I.A.', matrixId: 'familia', type: 'matrix' },
      { label: 'FASE 3 (O Teste)', title: 'T.E.S.T.E.', matrixId: 'teste', type: 'matrix' },
      { label: 'FASE 4 (Ficção)', title: 'N.A.R.R.A.', matrixId: 'narra', type: 'matrix' },
      { label: 'FASE 5 (Flexibilidade)', title: 'A.C.E.I.T.A.', matrixId: 'aceit', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'Dependência Emocional', protocolId: 'dependencia', type: 'protocol' }
    ]
  },
  {
    id: 'vicio-indispensavel',
    title: 'O VÍCIO DE SER INDISPENSÁVEL',
    subtitle: 'Esgotamento por carregar o mundo nas costas e apagar fogos alheios.',
    phases: [
      { label: 'FASE 1 (Exaustão)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Salvador)', title: 'D.R.A.M.A.', matrixId: 'drama', type: 'matrix' },
      { label: 'FASE 3 (Significância)', title: 'N.E.C.E.S.', matrixId: 'neces', type: 'matrix' },
      { label: 'FASE 4 (O Mártir)', title: 'H.U.M.O.R.', matrixId: 'humor', type: 'matrix' },
      { label: 'FASE 5 (O Não)', title: 'A.C.E.I.T.A.', matrixId: 'aceit', type: 'matrix' },
      { label: 'FASE 6 (Propósito)', title: 'S.E.N.S.O.', matrixId: 'senso', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'A Culpa', protocolId: 'culpa', type: 'protocol' }
    ]
  },
  {
    id: 'guerra-poder-filhos',
    title: 'A GUERRA DE PODER (FILHOS)',
    subtitle: 'Conflitos com adolescentes que escondem frustrações do adulto.',
    phases: [
      { label: 'FASE 1 (Tensão)', title: 'C.O.R.P.O.', matrixId: 'corpo', type: 'matrix' },
      { label: 'FASE 2 (Perseguidor)', title: 'D.R.A.M.A.', matrixId: 'drama', type: 'matrix' },
      { label: 'FASE 3 (Repetição)', title: 'F.A.M.I.L.I.A.', matrixId: 'familia', type: 'matrix' },
      { label: 'FASE 4 (O Teste)', title: 'T.E.S.T.E.', matrixId: 'teste', type: 'matrix' },
      { label: 'FASE 5 (Controle)', title: 'N.A.R.R.A.', matrixId: 'narra', type: 'matrix' },
      { label: 'FASE 6 (Limites)', title: 'A.C.E.I.T.A.', matrixId: 'aceit', type: 'matrix' },
      { label: 'FASE 7 (Autonomia)', title: 'G.E.N.I.O.', matrixId: 'genio', type: 'matrix' },
      { label: 'FINAL (Processo)', title: 'O Medo', protocolId: 'medo', type: 'protocol' }
    ]
  }
];
