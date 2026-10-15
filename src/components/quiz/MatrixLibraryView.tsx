import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Flame, ShieldAlert } from 'lucide-react';
import { Journey, EnjoymentPlanResult, ProtocolResult, Protocol } from '../../types';
import { Card } from '../ui/Card';
import { MabiDashboardProgress } from '../journey/MabiDashboardProgress';
import { MabiPersonMap, MabiPerson } from '../journey/MabiPersonMap';
import { buildMabiAnswersFromPlan } from '../../lib/mabiEngine';
import { PROTOCOLS } from '../../data/protocols';
import { PerfilPadroes } from '../plan/PerfilPadroes';

interface MatrixLibraryViewProps {
  onSelect?: (m: any) => void;
  journeys?: Journey[];
  activeJourneyId?: string | null;
  planHistory?: EnjoymentPlanResult[];
  protocolHistory?: ProtocolResult[];
  onSelectStaticProtocol?: (protocolId: string, targetPerson?: any) => void;
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
  const [activeTab, setActiveTab] = useState<'pessoas' | 'diagnostico'>('pessoas');

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

  const handleStartPersonProtocol = (person: MabiPerson, protocol: Protocol) => {
    if (onSelectStaticProtocol) {
      onSelectStaticProtocol(protocol.id, {
        name: person.name,
        role: person.role,
        roleLabel: person.roleLabel,
        activeGuilt: person.activeGuilt,
        activeFear: person.activeFear,
        contractStatement: person.contractStatement
      });
    }
  };

  const handleStartDailyProtocol = (protocolId: string, personRole?: string) => {
    if (onSelectStaticProtocol) {
      onSelectStaticProtocol(protocolId, {
        name: personRole ? personRole.toUpperCase() : 'EVENTO DO DIA A DIA',
        role: personRole || 'cotidiano',
        roleLabel: 'Gatilho do Cotidiano',
        contractStatement: 'Reset Somático e Liberação de Culpas em Eventos em Tempo Real.'
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="py-8 px-4 max-w-6xl mx-auto space-y-8"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gold" />
            <h2 className="text-3xl sm:text-4xl font-serif">Mapa de Pessoas &amp; Diagnóstico</h2>
          </div>
          <p className="text-white/40 max-w-xl text-xs md:text-sm">
            Conecte cada pessoa do seu sistema aos protocolos de desvinculação de medo e culpa.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('pessoas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pessoas'
                ? 'bg-gold text-black shadow-md shadow-gold/10'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Mapa de Pessoas &amp; Cotidiano
          </button>

          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'diagnostico'
                ? 'bg-gold text-black shadow-md shadow-gold/10'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Diagnóstico M.A.B.I.
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      <div className="space-y-6">
        {activeTab === 'pessoas' ? (
          <MabiPersonMap 
            journey={mabiJourney}
            planHistory={planHistory}
            protocolHistory={protocolHistory}
            onStartPersonProtocol={handleStartPersonProtocol}
            onStartDailyProtocol={handleStartDailyProtocol}
          />
        ) : (
          mabiJourney ? (
            <div className="space-y-10">
            {latestPlan && <PerfilPadroes sintomas={latestPlan.sintomas} fase1={latestPlan.fase1} />}
            <MabiDashboardProgress
              journey={mabiJourney} 
              protocolHistory={protocolHistory || []} 
              onSelectStaticProtocol={(protoId) => onSelectStaticProtocol && onSelectStaticProtocol(protoId)}
              onGoToChronogram={onGoToChronogram}
            />
            </div>
          ) : (
            <Card className="p-8 text-center bg-white/[0.01] border-white/5">
              <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
                Nenhum diagnóstico ou jornada ativa encontrada. Preencha o mapeamento em <b>Alianças</b> e <b>Padrões</b> primeiro para que o sistema gere seu painel de resistência.
              </p>
            </Card>
          )
        )}
      </div>
    </motion.div>
  );
}

