import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Clock, Users } from 'lucide-react';
import { EnjoymentPlanResult, Protocol, ProtocolResult } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { PROTOCOLS } from '../../data/protocols';
import { getPadrao } from '../../data/padroesCorpo';
import { calcularPerfilPadroes } from '../../lib/perfilPadroes';
import { PROTOCOLOS_DO_METODO } from '../../data/intervencao';
import { diasParaReavaliar, montarPessoasDoMapa, PessoaDoMapa, ultimoPlanoComAliancas, ultimoPlanoComPadroes } from '../../lib/pessoasDoMapa';

export interface PessoaAlvo {
  name: string;
  role: string;
  roleLabel: string;
  contractStatement: string;
  law: string;
}

interface IntervencaoViewProps {
  planHistory: EnjoymentPlanResult[];
  protocolHistory: ProtocolResult[];
  onIniciarProtocolo: (protocol: Protocol, pessoa?: PessoaAlvo) => void;
  onIrParaDiagnostico: () => void;
  onVerPerfil: () => void;
}

const PAPEL_PADRAO_LABEL: Record<string, string> = {
  dominante: 'dominante',
  secundario: 'secundário',
  presente: 'presente',
  ausente: 'pouco ativo'
};

const protocoloPorId = (id: string) => PROTOCOLS.find(p => p.id === id)!;

const pessoaAlvo = (p: PessoaDoMapa): PessoaAlvo => ({
  name: p.nome,
  role: p.papelFamiliar,
  roleLabel: getPadrao(p.lei).titulo,
  contractStatement: p.contrato,
  law: p.lei
});

function StatusPessoa({ pessoa }: { pessoa: PessoaDoMapa }) {
  const ultimo = pessoa.ultimoProtocolo;
  if (!ultimo) {
    return <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Não iniciado</span>;
  }
  const dias = diasParaReavaliar(ultimo.completedAt);
  return (
    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-emerald-400/80">
      <Check className="w-3 h-3" />
      {dias > 0 ? `Protocolo feito • reavaliar em ${dias} dias` : 'Protocolo feito • pronto para reavaliar'}
    </span>
  );
}

// Faixa com o padrão dominante e os secundários, ligando a intervenção ao diagnóstico
function FaixaDoPadrao({ planHistory, onVerPerfil }: { planHistory: EnjoymentPlanResult[]; onVerPerfil: () => void }) {
  const planoPadroes = ultimoPlanoComPadroes(planHistory);
  if (!planoPadroes) return null;
  const fase1 = (ultimoPlanoComAliancas(planHistory) || planoPadroes).fase1;
  const ativos = calcularPerfilPadroes(planoPadroes.sintomas as any, fase1 as any)
    .filter(p => p.papel === 'dominante' || p.papel === 'secundario');
  if (ativos.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
      <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Seu padrão</span>
      {ativos.map((p, i) => {
        const padrao = getPadrao(p.id);
        return (
          <span key={p.id} className="text-sm">
            <b style={{ color: padrao.cor }}>{padrao.titulo.replace('Padrão de ', '')}</b>
            <span className="text-white/40"> ({PAPEL_PADRAO_LABEL[p.papel]})</span>
            {i < ativos.length - 1 && <span className="text-white/20"> •</span>}
          </span>
        );
      })}
      <button onClick={onVerPerfil} className="sm:ml-auto text-xs font-bold text-gold hover:underline">
        Ver perfil completo
      </button>
    </div>
  );
}

export function IntervencaoView({ planHistory, protocolHistory, onIniciarProtocolo, onIrParaDiagnostico, onVerPerfil }: IntervencaoViewProps) {
  const [mostrarOutros, setMostrarOutros] = useState(false);
  const pessoas = montarPessoasDoMapa(planHistory, protocolHistory);
  const proxima = pessoas.find(p => !p.ultimoProtocolo);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 text-gold" />
          <h2 className="text-3xl sm:text-4xl font-serif">Intervenção</h2>
        </div>
        <p className="text-white/40 text-sm">Cada pessoa da sua história, uma de cada vez — começando pelo seu padrão dominante.</p>
      </div>

      <FaixaDoPadrao planHistory={planHistory} onVerPerfil={onVerPerfil} />

      {pessoas.length === 0 ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Complete o <b>Diagnóstico</b> (Alianças e Padrões) para que as pessoas da sua história apareçam aqui com o protocolo de cada uma.
          </p>
          <Button onClick={onIrParaDiagnostico} className="font-bold mx-auto">Ir para o Diagnóstico</Button>
        </Card>
      ) : (
        <>
          {/* Próximo passo */}
          {proxima ? (
            <Card className="p-6 sm:p-8 border-gold/30 bg-gold/[0.04] space-y-4">
              <div className="text-[10px] uppercase tracking-widest font-bold text-gold">Seu próximo passo</div>
              <div>
                <h3 className="text-2xl font-serif">{proxima.nome}</h3>
                <p className="text-sm" style={{ color: getPadrao(proxima.lei).cor }}>
                  {getPadrao(proxima.lei).titulo} • {PAPEL_PADRAO_LABEL[proxima.papelPadrao]}
                </p>
              </div>
              <p className="text-white/60 text-sm italic">“{proxima.contrato}”</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  onClick={() => onIniciarProtocolo(protocoloPorId(proxima.protocoloId), pessoaAlvo(proxima))}
                  className="font-bold"
                >
                  Iniciar: {protocoloPorId(proxima.protocoloId).title} <ArrowRight className="w-4 h-4" />
                </Button>
                <span className="flex items-center gap-1.5 text-xs text-white/40"><Clock className="w-3.5 h-3.5" /> cerca de 30 minutos • você pode pausar e continuar</span>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-emerald-500/20 bg-emerald-500/[0.03]">
              <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Todas as pessoas trabalhadas</div>
              <p className="text-white/60 text-sm mt-2">Acompanhe os atos e as reavaliações na aba <b>Evolução</b>. Você pode refazer o protocolo de qualquer pessoa abaixo.</p>
            </Card>
          )}

          {/* Mapa de pessoas */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">Mapa da sua história</div>
            {pessoas.map(pessoa => {
              const padrao = getPadrao(pessoa.lei);
              const protocolo = protocoloPorId(pessoa.protocoloId);
              const protocoloMedo = pessoa.protocoloMedoId ? protocoloPorId(pessoa.protocoloMedoId) : null;
              return (
                <Card key={pessoa.lei} className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: padrao.cor }} />
                      <div>
                        <h4 className="text-xl font-serif">{pessoa.nome}</h4>
                        <p className="text-xs" style={{ color: padrao.cor }}>{padrao.titulo} • {PAPEL_PADRAO_LABEL[pessoa.papelPadrao]}</p>
                      </div>
                    </div>
                    <StatusPessoa pessoa={pessoa} />
                  </div>

                  {pessoa.fatos && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">O que aconteceu</div>
                      <p className="text-sm text-white/70 line-clamp-3">{pessoa.fatos}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant={pessoa.ultimoProtocolo ? 'outline' : 'primary'}
                      onClick={() => onIniciarProtocolo(protocolo, pessoaAlvo(pessoa))}
                      className={cn('text-xs', !pessoa.ultimoProtocolo && 'font-bold')}
                    >
                      {pessoa.ultimoProtocolo ? 'Refazer' : 'Iniciar'}: {protocolo.title}
                    </Button>
                    {protocoloMedo && (
                      <Button
                        variant="outline"
                        onClick={() => onIniciarProtocolo(protocoloMedo, pessoaAlvo(pessoa))}
                        className="text-xs border-white/15 text-white/70 hover:text-white"
                      >
                        Se o que trava é medo: {protocoloMedo.title}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Protocolos sem pessoa ligada */}
      <div className="border-t border-white/5 pt-6">
        <button onClick={() => setMostrarOutros(v => !v)} className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white">
          <ChevronDown className={cn('w-4 h-4 transition-transform', mostrarOutros && 'rotate-180')} />
          Fazer um protocolo sem escolher pessoa
        </button>
        {mostrarOutros && (
          <div className="grid gap-2 sm:grid-cols-2 mt-4">
            {PROTOCOLOS_DO_METODO.map(id => {
              const protocolo = protocoloPorId(id);
              return (
                <button
                  key={id}
                  onClick={() => onIniciarProtocolo(protocolo)}
                  className="text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-colors"
                >
                  <div className="text-sm font-bold">{protocolo.title}</div>
                  <div className="text-[11px] text-white/40 mt-1">{protocolo.useCase}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
