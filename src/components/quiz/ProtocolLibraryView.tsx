import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ChevronRight, Info, Sparkles } from 'lucide-react';
import { PROTOCOLS } from '../../data/protocols';
import { Protocol, Journey } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProtocolLibraryViewProps {
  onSelect: (protocol: Protocol) => void;
  journeys?: Journey[];
  activeJourneyId?: string | null;
}

interface RecommendedProtocol {
  id: string;
  reason: string;
  matchScore: number;
}

const getRecommendedProtocols = (
  goal: 'dinheiro' | 'relacionamento' | 'carreira' | 'saude',
  debts: string[],
  symptoms: string[]
): RecommendedProtocol[] => {
  const list: RecommendedProtocol[] = [];
  const debtsStr = debts.join(' ').toLowerCase();
  const symptomsStr = symptoms.join(' ').toLowerCase();

  if (goal === 'dinheiro') {
    list.push({
      id: 'culpa_sobrevivente',
      reason: 'Recomendado para desatar a culpa por prosperar ou acumular mais do que sua linhagem familiar pôde.',
      matchScore: 95
    });
    list.push({
      id: 'medo_ultrapassar',
      reason: 'Ideal para desprogramar o sinal de alerta que seu cérebro de sobrevivência dispara ao sair da escassez familiar.',
      matchScore: 90
    });
    if (debtsStr.includes('salvá-los') || debtsStr.includes('carregar') || debtsStr.includes('salvar')) {
      list.push({
        id: 'culpa_responsabilidade',
        reason: 'Indicado para liberar a sobrecarga de tentar salvar financeiramente membros da sua família.',
        matchScore: 85
      });
    }
  } else if (goal === 'relacionamento') {
    list.push({
      id: 'culpa_separacao',
      reason: 'Desenvolvido para dissolver a culpa por ser feliz no amor enquanto seus pais ou antepassados sofreram solidão ou casamentos difíceis.',
      matchScore: 95
    });
    list.push({
      id: 'medo_separacao',
      reason: 'Para desarmar o medo de abandono e a necessidade de se anular para garantir afeto.',
      matchScore: 90
    });
    list.push({
      id: 'dependencia',
      reason: 'Recomendado para restaurar sua autonomia afetiva e quebrar o ciclo de atrair parceiros indisponíveis.',
      matchScore: 85
    });
  } else if (goal === 'carreira') {
    list.push({
      id: 'culpa_sobrevivente',
      reason: 'Para tratar a Síndrome do Impostor e permitir-se destacar profissionalmente de forma leve.',
      matchScore: 95
    });
    list.push({
      id: 'medo_ultrapassar',
      reason: 'Para desatar o travamento na autopromoção e no crescimento profissional além do teto familiar.',
      matchScore: 90
    });
    if (symptomsStr.includes('exaustão') || symptomsStr.includes('trabalho') || symptomsStr.includes('exaustao')) {
      list.push({
        id: 'culpa_auto_odio',
        reason: 'Recomendado para interromper a crença de que o sucesso só é legítimo se vier acompanhado de exaustão e sofrimento.',
        matchScore: 85
      });
    }
  } else if (goal === 'saude') {
    list.push({
      id: 'culpa_auto_odio',
      reason: 'Para cessar o auto-ataque inconsciente e o uso do próprio corpo como moeda de pagamento ou sacrifício à família.',
      matchScore: 95
    });
    list.push({
      id: 'medo',
      reason: 'Para acalmar o sistema nervoso em hipervigilância crônica e fadiga sem explicação médica.',
      matchScore: 90
    });
    if (debtsStr.includes('dor somática') || debtsStr.includes('sintomas físicos') || debtsStr.includes('saúde') || debtsStr.includes('saude')) {
      list.push({
        id: 'culpa_sobrevivente',
        reason: 'Para desatar a lealdade de adoecer para carregar a dor ou o destino trágico de um antepassado.',
        matchScore: 85
      });
    }
  }

  if (list.length < 2) {
    list.push({
      id: 'culpa',
      reason: 'Protocolo de ajuste geral de culpa existencial para desvincular seu destino de fardos alheios.',
      matchScore: 70
    });
  }

  return list.slice(0, 2);
};

export function ProtocolLibraryView({ onSelect, journeys, activeJourneyId }: ProtocolLibraryViewProps) {
  // Find active or latest journey to compute protocol recommendations
  const mabiJourney = journeys?.find(j => j.id === activeJourneyId) || journeys?.find(j => !!j.mabiGoal);
  
  const recommendedList = mabiJourney 
    ? getRecommendedProtocols(
        (mabiJourney.mabiGoal || 'dinheiro') as any,
        mabiJourney.mabiAnswers?.passo1?.selectedDebts || [],
        mabiJourney.mabiAnswers?.passo2?.checkedSymptoms || []
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-8 h-8 text-gold" />
          <h2 className="text-4xl font-serif">Protocolos</h2>
        </div>
        <p className="text-white/40 max-w-xl">
          Ferramentas de resgate e diferenciação emocional para lidar com as feridas de segunda geração.
        </p>
      </div>

      {/* Recommended Protocols Spotlight Section */}
      {recommendedList.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest block">Prescrição Recomendada para o Seu Caso</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl border border-gold/20 bg-gold/[0.02]">
            {recommendedList.map((rec) => {
              const protocol = PROTOCOLS.find(p => p.id === rec.id);
              if (!protocol) return null;
              return (
                <Card 
                  key={protocol.id}
                  className="p-6 bg-black/40 border-gold/10 hover:border-gold/30 transition-all cursor-pointer flex flex-col justify-between group"
                  onClick={() => onSelect(protocol)}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Indicação Clínica</span>
                      <span className="text-[10px] text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full">{rec.matchScore}% de Afinidade</span>
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition-colors">{protocol.title}</h3>
                    <p className="text-xs text-white/50 mb-4 italic">"{protocol.quote}"</p>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs text-white/70 leading-relaxed mb-4">
                      <strong>Diagnóstico:</strong> {rec.reason}
                    </div>
                  </div>
                  <Button className="w-full justify-between group-hover:bg-gold group-hover:text-black">
                    Iniciar Protocolo Clínico
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Protocols Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-6">Todos os Protocolos Disponíveis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROTOCOLS.map((protocol, index) => (
          <motion.div
            key={protocol.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="p-8 h-full flex flex-col justify-between hover:bg-white/[0.05] transition-all cursor-pointer group border-white/5"
              onClick={() => onSelect(protocol)}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60">
                    {protocol.code}
                  </div>
                </div>
                <h3 className="text-2xl font-serif mb-3 group-hover:text-gold transition-colors">{protocol.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed italic mb-4">
                  "{protocol.quote}"
                </p>
                <div className="bg-white/5 p-4 rounded-xl mb-6">
                   <p className="text-xs text-white/60 leading-relaxed">
                     {protocol.useCase}
                   </p>
                </div>
              </div>
              
              <Button className="w-full justify-between group-hover:bg-gold group-hover:text-black">
                Iniciar Protocolo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-gold/5 border border-gold/10 rounded-3xl p-8 flex gap-6 items-start">
        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Info className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h4 className="text-lg font-serif text-gold mb-2">Por que usar estes protocolos?</h4>
          <p className="text-sm text-gold/70 leading-relaxed">
            Eles são projetados para descer à raiz de emoções que paralisam o seu <span className="italic">Plano do Desfrute</span>. Sempre que encontrar uma trava ou resistência em uma área do Raio-X, procure o protocolo correspondente para desbloquear o fluxo.
          </p>
        </div>
      </div>
    </div>
  );
}
