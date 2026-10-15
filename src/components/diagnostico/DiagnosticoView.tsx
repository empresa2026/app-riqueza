import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { EnjoymentPlanResult } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { EnjoymentPlanFlow } from '../plan/EnjoymentPlanFlow';
import { PerfilPadroes } from '../plan/PerfilPadroes';
import { ultimoPlanoComAliancas, ultimoPlanoComPadroes } from '../../lib/pessoasDoMapa';

export type EtapaDiagnostico = 'aliancas' | 'padroes' | 'perfil';
type Etapa = EtapaDiagnostico;

interface DiagnosticoViewProps {
  userId: string;
  journeyId?: string;
  planHistory: EnjoymentPlanResult[];
  etapaInicial?: Etapa;
  onIrParaIntervencao: () => void;
}

const ETAPAS: { id: Etapa; numero: number; titulo: string; subtitulo: string }[] = [
  { id: 'aliancas', numero: 1, titulo: 'Alianças', subtitulo: 'O acontecimento' },
  { id: 'padroes', numero: 2, titulo: 'Padrões', subtitulo: 'O espelho' },
  { id: 'perfil', numero: 3, titulo: 'Perfil', subtitulo: 'A leitura' }
];

export function DiagnosticoView({ userId, journeyId, planHistory, etapaInicial, onIrParaIntervencao }: DiagnosticoViewProps) {
  const planoAliancas = ultimoPlanoComAliancas(planHistory);
  const planoPadroes = ultimoPlanoComPadroes(planHistory);
  const concluida: Record<Etapa, boolean> = {
    aliancas: !!planoAliancas,
    padroes: !!planoPadroes,
    perfil: !!planoPadroes
  };
  const [etapa, setEtapa] = useState<Etapa>(() =>
    etapaInicial || (!planoAliancas ? 'aliancas' : !planoPadroes ? 'padroes' : 'perfil')
  );

  return (
    <div className="py-8 space-y-8">
      {/* Etapas do diagnóstico */}
      <div className="grid grid-cols-3 gap-2 max-w-3xl mx-auto">
        {ETAPAS.map(e => {
          const ativa = e.id === etapa;
          return (
            <button
              key={e.id}
              onClick={() => setEtapa(e.id)}
              className={cn(
                'flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl border text-left transition-all min-w-0',
                ativa ? 'border-gold/50 bg-gold/[0.06]' : 'border-white/5 hover:border-white/15'
              )}
            >
              <span className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                concluida[e.id] ? 'bg-gold text-black' : ativa ? 'border border-gold text-gold' : 'border border-white/20 text-white/40'
              )}>
                {concluida[e.id] ? <Check className="w-3.5 h-3.5" /> : e.numero}
              </span>
              <span className="min-w-0">
                <span className={cn('block text-xs sm:text-sm font-bold truncate', ativa ? 'text-white' : 'text-white/50')}>{e.titulo}</span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-white/30 truncate">{e.subtitulo}</span>
              </span>
            </button>
          );
        })}
      </div>

      {etapa === 'aliancas' && (
        <EnjoymentPlanFlow
          key="aliancas"
          userId={userId}
          journeyId={journeyId}
          mode="aliancas"
          onBack={() => {}}
          onComplete={() => setEtapa('padroes')}
        />
      )}

      {etapa === 'padroes' && (
        <EnjoymentPlanFlow
          key="padroes"
          userId={userId}
          journeyId={journeyId}
          mode="padroes"
          onBack={() => setEtapa('aliancas')}
          onComplete={onIrParaIntervencao}
        />
      )}

      {etapa === 'perfil' && (
        <div className="max-w-4xl mx-auto space-y-8">
          {planoPadroes ? (
            <>
              <PerfilPadroes sintomas={planoPadroes.sintomas as any} fase1={(planoAliancas || planoPadroes).fase1 as any} />
              <div className="flex justify-center">
                <Button onClick={onIrParaIntervencao} className="font-bold">
                  Começar a intervenção <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-white/50 text-sm space-y-4 py-12">
              <p>O seu perfil aparece depois que você responder <b>Alianças</b> e <b>Padrões</b>.</p>
              <Button onClick={() => setEtapa(planoAliancas ? 'padroes' : 'aliancas')} className="mx-auto font-bold">
                Continuar o diagnóstico
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
