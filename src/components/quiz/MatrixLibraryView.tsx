import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Journey, EnjoymentPlanResult, ProtocolResult } from '../../types';
import { Card } from '../ui/Card';
import { MabiDashboardProgress } from '../journey/MabiDashboardProgress';
import { buildMabiAnswersFromPlan } from '../../lib/mabiEngine';

interface MatrixLibraryViewProps {
  onSelect?: (m: any) => void;
  journeys?: Journey[];
  activeJourneyId?: string | null;
  planHistory?: EnjoymentPlanResult[];
  protocolHistory?: ProtocolResult[];
  onSelectStaticProtocol?: (protocolId: string) => void;
  onGoToChronogram?: () => void;
}

export function MatrixLibraryView({ 
  journeys, 
  activeJourneyId, 
  planHistory,
  protocolHistory,
  onSelectStaticProtocol,
  onGoToChronogram
}: MatrixLibraryViewProps) {
  // Find active/latest journey
  let mabiJourney = journeys?.find(j => j.id === activeJourneyId) || journeys?.find(j => !!j.mabiGoal);

  const latestPlan = planHistory && planHistory.length > 0 ? planHistory[0] : null;

  if (!mabiJourney && latestPlan) {
    const goalMapping: Record<string, string> = {
      'DINHEIRO': 'dinheiro',
      'AMOR': 'relacionamento',
      'CARREIRA': 'carreira',
      'SAÚDE': 'saude'
    };
    const primaryDebt = latestPlan.fase1?.sacrificio?.areas?.[0] || latestPlan.fase1?.injustica?.areas?.[0] || 'DINHEIRO';
    mabiJourney = {
      id: latestPlan.id || 'plan-journey',
      userId: latestPlan.userId || '',
      name: 'Aliança Familiar',
      mabiGoal: goalMapping[primaryDebt] || 'dinheiro',
      mabiAnswers: buildMabiAnswersFromPlan(latestPlan),
      status: 'active',
      createdAt: latestPlan.createdAt || new Date().toISOString()
    } as Journey;
  } else if (mabiJourney && latestPlan) {
    const hasAnswers = mabiJourney.mabiAnswers && Object.keys(mabiJourney.mabiAnswers).length > 0;
    if (!hasAnswers) {
      mabiJourney = {
        ...mabiJourney,
        mabiAnswers: buildMabiAnswersFromPlan(latestPlan)
      };
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="py-8 px-4 max-w-6xl mx-auto space-y-10"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-gold" />
            <h2 className="text-4xl font-serif">Mapeamento &amp; Resistência</h2>
          </div>
          <p className="text-white/40 max-w-xl text-xs md:text-sm">
            Identificação do bloqueio geracional ativo e diagnóstico das resistências.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {mabiJourney ? (
          <MabiDashboardProgress 
            journey={mabiJourney} 
            protocolHistory={protocolHistory || []} 
            onSelectStaticProtocol={onSelectStaticProtocol}
            onGoToChronogram={onGoToChronogram}
          />
        ) : (
          <Card className="p-8 text-center bg-white/[0.01] border-white/5">
            <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
              Nenhum diagnóstico ou jornada ativa encontrada. Preencha o mapeamento em <b>Alianças</b> e <b>Padrões</b> primeiro para que o sistema gere seu painel de resistência.
            </p>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
