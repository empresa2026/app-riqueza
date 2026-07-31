import { EnjoymentPlanResult, ProtocolResult } from '../types';
import { PROTOCOLS } from '../data/protocols';

export interface RecommendedAction {
  id: string;
  category: 'padroes' | 'protocolos' | 'acoes';
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  actionText: string;
  targetView: 'padroes' | 'protocols' | 'matrices' | 'plan' | 'history';
  protocolId?: string;
  importance: 'alta' | 'media' | 'baixa';
}

/**
 * Analyzes the user's recent history of Patterns (Enjoyment Plans / sintomas) and Protocols
 * to suggest a tailored set of recommended micro-actions and paths.
 */
export function analyzeHistoryAndGetRecommendations(
  planHistory: EnjoymentPlanResult[] = [],
  protocolHistory: ProtocolResult[] = []
): RecommendedAction[] {
  const recommendations: RecommendedAction[] = [];

  // --- CASE A: EMPTY HISTORY (Onboarding Phase) ---
  if (planHistory.length === 0) {
    recommendations.push({
      id: 'onboard_padroes',
      category: 'padroes',
      title: 'Mapeamento de Padrões Ativos',
      description: 'Identifique quais sintomas corporais e subleis invisíveis estão travando o seu fluxo de vida nas finanças, amor ou carreira.',
      badge: 'Padrões',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionText: 'Iniciar Padrões',
      targetView: 'padroes',
      importance: 'alta'
    });

    recommendations.push({
      id: 'onboard_aliancas',
      category: 'acoes',
      title: 'Auditoria de Alianças Familiares',
      description: 'Mapeie as lealdades invisíveis e os contratos de sobrevivência que você assinou inconscientemente com os seus antepassados.',
      badge: 'Alianças',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      actionText: 'Mapear Alianças',
      targetView: 'plan',
      importance: 'alta'
    });

    recommendations.push({
      id: 'onboard_protocolos',
      category: 'protocolos',
      title: 'Protocolo de Entrada: A Culpa',
      description: 'Antes de mergulhar fundo, faça o protocolo de ajuste geral de culpa existencial para desvincular seu destino de fardos alheios.',
      badge: 'Protocolo Principal',
      badgeColor: 'text-gold bg-gold/10 border-gold/20',
      actionText: 'Iniciar Protocolo',
      targetView: 'protocols',
      protocolId: 'culpa',
      importance: 'media'
    });

    return recommendations;
  }

  // --- CASE B: ACTIVE HISTORY (Analysis Phase) ---
  const latestPlan = planHistory[planHistory.length - 1];
  const sintomas = latestPlan.sintomas || { sacrificio: [], injustica: [], dor: [], renuncia: [] };

  const counts = {
    sacrificio: sintomas.sacrificio?.length || 0,
    injustica: sintomas.injustica?.length || 0,
    dor: sintomas.dor?.length || 0,
    renuncia: sintomas.renuncia?.length || 0
  };

  // Determine dominant pattern
  let dominantPattern: 'sacrificio' | 'injustica' | 'dor' | 'renuncia' = 'sacrificio';
  let maxCount = counts.sacrificio;

  if (counts.injustica > maxCount) {
    dominantPattern = 'injustica';
    maxCount = counts.injustica;
  }
  if (counts.dor > maxCount) {
    dominantPattern = 'dor';
    maxCount = counts.dor;
  }
  if (counts.renuncia > maxCount) {
    dominantPattern = 'renuncia';
    maxCount = counts.renuncia;
  }

  const totalSymptoms = counts.sacrificio + counts.injustica + counts.dor + counts.renuncia;

  // Check which protocols have been completed
  const completedProtocolIds = new Set(protocolHistory.map(p => p.protocolId));

  // 1. Suggest action based on Dominant Active Pattern
  if (dominantPattern === 'sacrificio' && maxCount > 0) {
    const hasSurvivorGuilt = completedProtocolIds.has('culpa_sobrevivente');
    if (!hasSurvivorGuilt) {
      recommendations.push({
        id: 'pat_sacrificio_proto',
        category: 'protocolos',
        title: 'Desatar a Culpa do Sobrevivente',
        description: `Seu principal padrão ativo é o Sacrifício (${maxCount} sintomas). Execute o Protocolo 1 para quebrar a lealdade de trabalhar até a exaustão para pertencer à família.`,
        badge: 'Recomendação Clínica',
        badgeColor: 'text-gold bg-gold/10 border-gold/20',
        actionText: 'Executar Protocolo',
        targetView: 'protocols',
        protocolId: 'culpa_sobrevivente',
        importance: 'alta'
      });
    } else {
      recommendations.push({
        id: 'pat_sacrificio_anchor',
        category: 'acoes',
        title: 'Prática de Repouso Consciente',
        description: 'Você já concluiu o Protocolo de Culpa do Sobrevivente. Hoje, faça o exercício prático: tire 15 minutos para descansar, sem telas e sem culpa. Diga a si mesmo: "Eu me permito ter leveza."',
        badge: 'Âncora Neural',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        actionText: 'Registrar no Diário',
        targetView: 'history',
        importance: 'alta'
      });
    }
  } else if (dominantPattern === 'injustica' && maxCount > 0) {
    const hasOmnipotent = completedProtocolIds.has('culpa_responsabilidade');
    if (!hasOmnipotent) {
      recommendations.push({
        id: 'pat_injustica_proto',
        category: 'protocolos',
        title: 'Responsabilidade Onipotente',
        description: `Seu principal padrão ativo é a Injustiça (${maxCount} sintomas). Faça o Protocolo 3 para liberar o peso de tentar salvar ou resolver a vida financeira de todos.`,
        badge: 'Recomendação Clínica',
        badgeColor: 'text-gold bg-gold/10 border-gold/20',
        actionText: 'Executar Protocolo',
        targetView: 'protocols',
        protocolId: 'culpa_responsabilidade',
        importance: 'alta'
      });
    } else {
      recommendations.push({
        id: 'pat_injustica_anchor',
        category: 'acoes',
        title: 'Estabelecer Limites Saudáveis',
        description: 'Seu padrão de Injustiça foi trabalhado. Hoje, recuse-se a se envolver ou resolver fardos alheios. Pratique devolver a responsabilidade a quem pertence com amor e firmeza.',
        badge: 'Âncora Neural',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        actionText: 'Ver Histórico',
        targetView: 'history',
        importance: 'alta'
      });
    }
  } else if (dominantPattern === 'dor' && maxCount > 0) {
    const hasFear = completedProtocolIds.has('medo') || completedProtocolIds.has('medo_ultrapassar');
    if (!hasFear) {
      recommendations.push({
        id: 'pat_dor_proto',
        category: 'protocolos',
        title: 'Sossegar o Alarme Biológico',
        description: `Seu principal padrão ativo é a Dor (${maxCount} sintomas). Execute o Protocolo "O Medo" ou "Medo de Ultrapassar" para acalmar seu sistema nervoso em constante hipervigilância.`,
        badge: 'Recomendação Clínica',
        badgeColor: 'text-gold bg-gold/10 border-gold/20',
        actionText: 'Executar Protocolo',
        targetView: 'protocols',
        protocolId: 'medo_ultrapassar',
        importance: 'alta'
      });
    } else {
      recommendations.push({
        id: 'pat_dor_anchor',
        category: 'acoes',
        title: 'Sustentação de Segurança Somática',
        description: 'Quando sentir aperto ou aceleração cardíaca hoje, pare por 2 minutos, inspire em 4 tempos, segure em 4, expire em 4 e sustente o corpo relaxado. Seu cérebro precisa saber que você está seguro agora.',
        badge: 'Soma-Regulação',
        badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        actionText: 'Fazer Check-in',
        targetView: 'history',
        importance: 'alta'
      });
    }
  } else if (dominantPattern === 'renuncia' && maxCount > 0) {
    const hasSeparation = completedProtocolIds.has('culpa_separacao');
    if (!hasSeparation) {
      recommendations.push({
        id: 'pat_renuncia_proto',
        category: 'protocolos',
        title: 'Legitimar seu Brilho Próprio',
        description: `Seu principal padrão ativo é a Renúncia (${maxCount} sintomas). Execute o Protocolo 2 para quebrar a culpa familiar de ter sucesso ou ser feliz no amor de forma diferente dos seus familiares.`,
        badge: 'Recomendação Clínica',
        badgeColor: 'text-gold bg-gold/10 border-gold/20',
        actionText: 'Executar Protocolo',
        targetView: 'protocols',
        protocolId: 'culpa_separacao',
        importance: 'alta'
      });
    } else {
      recommendations.push({
        id: 'pat_renuncia_anchor',
        category: 'acoes',
        title: 'Sustentar a Diferenciação',
        description: 'Hoje, diga um "Não" consciente e libertador para alguma demanda que desvie você dos seus próprios objetivos de vida. Defenda o seu espaço vital.',
        badge: 'Diferenciação',
        badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        actionText: 'Ver Progresso',
        targetView: 'history',
        importance: 'alta'
      });
    }
  }

  // 2. Suggest secondary general exploration to keep momentum
  if (protocolHistory.length > 0) {
    const lastProtocol = protocolHistory[protocolHistory.length - 1];
    const protocolDef = PROTOCOLS.find(p => p.id === lastProtocol.protocolId);
    const protocolName = protocolDef ? protocolDef.title : lastProtocol.protocolId;
    recommendations.push({
      id: 'seq_check_sintomas',
      category: 'padroes',
      title: 'Reavaliar Nível de Tensão Visceral',
      description: `Após sua última investigação (${protocolName}), faça um check-in no seu diário de progresso (Check) para auditar seu nível de tensão visceral de 0 a 10.`,
      badge: 'Auto-Auditoria',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      actionText: 'Fazer Check',
      targetView: 'history',
      importance: 'media'
    });
  } else {
    // No protocols run yet, recommend starting one
    recommendations.push({
      id: 'seq_start_general_protocol',
      category: 'protocolos',
      title: 'Iniciar Protocolo Clínico Geral',
      description: 'Utilize nossa biblioteca para selecionar um protocolo clínico de desengajamento neural correspondente ao seu foco de maior trava hoje.',
      badge: 'Investigação',
      badgeColor: 'text-gold bg-gold/10 border-gold/20',
      actionText: 'Acessar Protocolos',
      targetView: 'protocols',
      importance: 'media'
    });
  }

  // 3. Keep investigating Matrix Patterns
  recommendations.push({
    id: 'seq_investigate_matrix',
    category: 'acoes',
    title: 'Investigação de Matrizes Clínicas',
    description: 'Explore as Matrizes de Desativação (CORPO) para desprogramar os reflexos condicionados que impedem sua expansão financeira ou afetiva.',
    badge: 'Matrizes',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    actionText: 'Explorar Matrizes',
    targetView: 'matrices',
    importance: 'baixa'
  });

  return recommendations;
}
