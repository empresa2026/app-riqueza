import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Clock, RefreshCw, TrendingDown } from 'lucide-react';
import { EnjoymentPlanResult, Protocol, ProtocolResult } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { PROTOCOLS } from '../../data/protocols';
import { getPadrao, PadraoId, PADROES } from '../../data/padroesCorpo';
import { calcularPerfilPadroes } from '../../lib/perfilPadroes';
import { diasParaReavaliar, primeiroPlanoComPadroes, ultimoPlanoComPadroes } from '../../lib/pessoasDoMapa';

interface EvolucaoViewProps {
  planHistory: EnjoymentPlanResult[];
  protocolHistory: ProtocolResult[];
  onReavaliar: () => void;
  onAbrirProtocolo: (protocol: Protocol, result: ProtocolResult) => void;
  historico: React.ReactNode;
}

const intensidades = (plano?: EnjoymentPlanResult) =>
  Object.fromEntries(calcularPerfilPadroes(plano?.sintomas as any, plano?.fase1 as any).map(p => [p.id, p.intensidade])) as Record<PadraoId, number>;

export function EvolucaoView({ planHistory, protocolHistory, onReavaliar, onAbrirProtocolo, historico }: EvolucaoViewProps) {
  const primeiro = primeiroPlanoComPadroes(planHistory);
  const ultimo = ultimoPlanoComPadroes(planHistory);
  const temComparacao = !!primeiro && !!ultimo && primeiro.id !== ultimo.id;
  const antes = intensidades(primeiro);
  const depois = intensidades(ultimo);
  const prontoParaReavaliar = protocolHistory.some(r => diasParaReavaliar(r.completedAt) === 0);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 max-w-4xl mx-auto space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <TrendingDown className="w-7 h-7 text-gold" />
          <h2 className="text-3xl sm:text-4xl font-serif">Evolução</h2>
        </div>
        <p className="text-white/40 text-sm">Seus atos, suas reavaliações e o quanto cada padrão perdeu força.</p>
      </div>

      {/* Antes e depois dos padrões */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-serif">Antes e depois</h3>
            <p className="text-white/40 text-xs mt-1">
              {temComparacao
                ? `Primeiro espelho em ${new Date(primeiro!.createdAt).toLocaleDateString('pt-BR')} • último em ${new Date(ultimo!.createdAt).toLocaleDateString('pt-BR')}`
                : 'Depois de 21 dias de um protocolo, refaça Padrões para ver a mudança aqui.'}
            </p>
          </div>
          <Button variant={prontoParaReavaliar ? 'primary' : 'outline'} size="sm" onClick={onReavaliar} className="font-bold shrink-0">
            <RefreshCw className="w-3.5 h-3.5" /> Reavaliar meus padrões
          </Button>
        </div>
        {temComparacao && (
          <div className="space-y-4">
            {PADROES.map(padrao => {
              const a = antes[padrao.id] || 0;
              const d = depois[padrao.id] || 0;
              return (
                <div key={padrao.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold tracking-wider" style={{ color: padrao.cor }}>{padrao.nome}</span>
                    <span className="font-mono text-white/60">
                      {a}% → {d}% {d < a && <span className="text-emerald-400">(−{a - d})</span>}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full opacity-30" style={{ width: `${a}%`, backgroundColor: padrao.cor }} />
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d}%`, backgroundColor: padrao.cor }} />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-white/30">Barra clara: antes • barra cheia: agora</p>
          </div>
        )}
      </Card>

      {/* Atos e reavaliações */}
      <div className="space-y-3">
        <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">Atos e reavaliações</div>
        {protocolHistory.length === 0 && (
          <Card className="p-6 text-sm text-white/40 text-center">Nenhum protocolo concluído ainda. Comece pela aba <b>Intervenção</b>.</Card>
        )}
        {protocolHistory.map(resultado => {
          const protocolo = PROTOCOLS.find(p => p.id === resultado.protocolId);
          if (!protocolo) return null;
          const a = resultado.answers || {};
          const lei = a.targetPersonLaw as PadraoId | undefined;
          const dias = diasParaReavaliar(resultado.completedAt);
          return (
            <Card key={resultado.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-lg">{protocolo.title}</h4>
                  <p className="text-xs text-white/50">
                    {a.targetPersonName && <span style={lei ? { color: getPadrao(lei).cor } : undefined}>{a.targetPersonName} • </span>}
                    {new Date(resultado.completedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onAbrirProtocolo(protocolo, resultado)} className="self-start text-xs">
                  Ver respostas
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                {a.check_usuario_feito !== undefined && (
                  <span className={a.check_usuario_feito ? 'text-emerald-400 flex items-center gap-1.5' : 'text-white/40'}>
                    {a.check_usuario_feito ? <><Check className="w-3.5 h-3.5" /> Ato feito</> : 'Ato pendente'}
                  </span>
                )}
                {a.leveza_pos_ato !== undefined && a.leveza_pos_ato !== null && (
                  <span className="text-white/60">Leveza depois do ato: <b className="text-white">{a.leveza_pos_ato}/10</b></span>
                )}
                {a.check_admin_viu && <span className="text-gold">Ato validado</span>}
                <span className="flex items-center gap-1.5 text-white/40">
                  <Clock className="w-3.5 h-3.5" />
                  {dias > 0 ? `Reavaliação em ${dias} dias` : 'Pronto para reavaliar'}
                </span>
              </div>
              {a.pa_escolha && <p className="text-sm text-white/60 italic">“{a.pa_escolha}”</p>}
            </Card>
          );
        })}
      </div>

      {/* Histórico completo (diagnósticos e protocolos, com exportar e excluir) */}
      <div className="border-t border-white/5 pt-6 space-y-6">
        <button onClick={() => setMostrarHistorico(v => !v)} className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white">
          <ChevronDown className={cn('w-4 h-4 transition-transform', mostrarHistorico && 'rotate-180')} />
          Histórico completo (exportar e excluir)
        </button>
        {mostrarHistorico && historico}
      </div>
    </motion.div>
  );
}
