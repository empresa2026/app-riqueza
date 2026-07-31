export interface ProtocolQuestion {
  question: string;
  options: string[];
}

export interface ProtocolSection {
  title: string;
  intro?: string;
  questions: ProtocolQuestion[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  categoryId?: string;
  identifiedStructure: {
    ferida: string;
    dominio: string;
    mascara: string;
    modo: string;
  };
  axisEstablishment: {
    text: string;
    instruction: string;
  };
  sections: ProtocolSection[];
  finalPrayer: string;
  createdAt: string;
  createdBy: string;
}

export interface JourneyStep {
  type: 'matrix' | 'quiz' | 'protocol';
  id: string; // The id of the matrix, quiz or protocol
  title: string;
  order: number;
  description?: string;
  contextPrompt?: string; // Specific prompt for this step based on context
}

export interface Journey {
  id: string;
  userId: string;
  name: string;
  themeId?: string;
  description?: string;
  createdAt: string;
  status: 'active' | 'archived';
  steps?: JourneyStep[];
  context?: string; // Summary of what has been discovered so far
  mabiGoal?: 'dinheiro' | 'relacionamento' | 'carreira' | 'saude';
  mabiAnswers?: Record<string, any>;
  mabiCurrentStep?: number;
  mabiTrailState?: {
    activeExerciseId: string | null;
    completedExercises: {
      exerciseId: string;
      completedAt: string;
      score: number;
      shelf: 'L' | 'E' | 'C' | 'M';
    }[];
    failedAttemptsCount?: Record<string, number>;
    currentShelfIndex: number;
    trail: string[];
  };
}

export interface Exercise {
  id: string;
  nome: string;
  prateleira: 'L' | 'E' | 'C' | 'M';
  ataca_coluna: number;
  aliança_alvo: string[];
  culpa_alvo: string[];
  medo_alvo: string[];
  corpo_alvo: string[];
  duração_min: number;
  risco: 'baixo' | 'médio' | 'alto';
  instruções: string[];
  métrica_saída: string;
  próximo_sugerido: string[];
}

export interface UserResult {
  id: string;
  userId: string;
  quizId: string;
  journeyId?: string;
  answers: Record<string, number>; // question index -> option index
  completedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
}

export interface MatrixField {
  letter: string;
  label: string;
  description: string;
  hints?: string[];
  details?: string;
}

export interface MatrixHelp {
  what: string;   // O que procurar
  how: string;    // Como sei que achei
  do: string;     // O que faço quando acho
  cure: string;   // Como isso leva à cura
}

export interface Matrix {
  id: string;
  number: string;
  title: string;
  acronym: string;
  author: string;
  concept: string;
  category?: string;
  help: MatrixHelp;
  fields: MatrixField[];
  extraQuestions?: string[];
}

export interface MatrixResult {
  id: string;
  userId: string;
  matrixId: string;
  journeyId?: string;
  answers: Record<string, string>;
  completedAt: string;
}

export interface Protocol {
  id: string;
  title: string;
  code: string;
  description: string;
  quote: string;
  useCase: string;
}

export interface ProtocolResult {
  id: string;
  userId: string;
  protocolId: string;
  journeyId?: string;
  answers: Record<string, any>;
  completedAt: string;
}

export interface EnjoymentPlanResult {
  id: string;
  userId: string;
  journeyId?: string;
  fase1: {
    sacrificio: { areas: string[]; familiar: string; fatos: string };
    injustica: { areas: string[]; familiar: string; fatos: string };
    dor: { areas: string[]; familiar: string; fatos: string };
    renuncia: { areas: string[]; familiar: string; fatos: string };
  };
  sintomas: {
    sacrificio: string[];
    injustica: string[];
    dor: string[];
    renuncia: string[];
  };
  clinicalMap?: {
    scenario?: string;
    smadAlarm?: string;
    dramaticRole?: string;
    tacticalAction?: string;
    executionPlan?: string;
    visceralSensation?: string;
    mabiInputs?: {
      culpa: string;
      arquitetura: string;
      medo: string;
      somatica: string;
      livro_razao_tipo: string;
      sinalClinico?: string;
      credor_acessivel?: boolean;
    };
  };
  createdAt: string;
}
