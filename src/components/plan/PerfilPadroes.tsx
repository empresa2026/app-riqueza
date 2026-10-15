import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BookOpen, ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { getPadrao, PadraoId, TIPOS_MANIFESTACAO, TipoManifestacao } from '../../data/padroesCorpo';
import { calcularPerfilPadroes, PapelPadrao } from '../../lib/perfilPadroes';

interface PerfilPadroesProps {
  sintomas?: Partial<Record<PadraoId, unknown[]>>;
  fase1?: Partial<Record<PadraoId, { areas?: unknown[] }>>;
}

const PAPEL_LABEL: Record<PapelPadrao, string> = {
  dominante: 'Dominante',
  secundario: 'Secundário',
  presente: 'Presente',
  ausente: 'Ausente'
};

export function PerfilPadroes({ sintomas, fase1 }: PerfilPadroesProps) {
  const perfil = useMemo(() => calcularPerfilPadroes(sintomas, fase1), [sintomas, fase1]);
  const ativos = perfil.filter(p => p.papel === 'dominante' || p.papel === 'secundario');
  const [padraoCorpo, setPadraoCorpo] = useState<PadraoId | null>(null);
  const [mostrarGraves, setMostrarGraves] = useState(false);

  if (ativos.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/[0.01] border-white/5">
        <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
          Responda <b>Alianças</b> e <b>Padrões</b> para ver o seu perfil dos 4 padrões.
        </p>
      </Card>
    );
  }

  const padraoSelecionado = getPadrao(padraoCorpo ?? ativos[0].id);
  const manifestacoesPorTipo = (tipo: TipoManifestacao) =>
    padraoSelecionado.manifestacoes.filter(m => m.tipo === tipo);

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-6 h-6 text-gold" />
          <h3 className="text-2xl font-serif">Seu Perfil dos 4 Padrões</h3>
        </div>
        <p className="text-white/40 text-xs">Calculado a partir das suas respostas em Alianças e Padrões.</p>
      </div>

      {/* Intensidade de cada padrão */}
      <Card className="p-6 space-y-4">
        {perfil.map(p => {
          const padrao = getPadrao(p.id);
          return (
            <div key={p.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold tracking-wider truncate" style={{ color: padrao.cor }}>
                    {padrao.numero} • {padrao.nome}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider shrink-0',
                    p.papel === 'dominante' ? 'bg-gold text-black'
                      : p.papel === 'secundario' ? 'bg-white/15 text-white'
                      : 'bg-white/5 text-white/40'
                  )}>
                    {PAPEL_LABEL[p.papel]}
                  </span>
                </div>
                <span className="text-white/60 font-mono shrink-0">{p.intensidade}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.intensidade}%`, backgroundColor: padrao.cor }} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Sequestra: {padrao.sequestra}</div>
            </div>
          );
        })}
      </Card>

      {/* Leitura dos padrões dominante e secundários */}
      <div className="grid gap-4 md:grid-cols-2">
        {ativos.map(p => {
          const padrao = getPadrao(p.id);
          return (
            <Card key={p.id} className={cn('p-6 space-y-4', (p.papel === 'dominante' || ativos.length === 2) && 'md:col-span-2')}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: padrao.cor }}>
                    Padrão {PAPEL_LABEL[p.papel]}
                  </div>
                  <h4 className="text-2xl font-serif">{padrao.nome}</h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Sequestra</div>
                  <div className="text-sm font-bold" style={{ color: padrao.cor }}>{padrao.sequestra}</div>
                </div>
              </div>

              <div className="grid gap-3 text-xs sm:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Emoção raiz</div>
                  <div className="text-white/80">{padrao.emocao}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Comportamento</div>
                  <div className="text-white/80">{padrao.comportamento}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Onde o padrão aperta no corpo</div>
                <div className="flex flex-wrap gap-1.5">
                  {padrao.mapaCorporal.map(regiao => (
                    <span key={regiao} className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-white/70">
                      {regiao}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/30 mb-1">
                  <BookOpen className="w-3 h-3" /> Lastro
                </div>
                <ul className="text-[11px] text-white/50 space-y-0.5">
                  {padrao.lastro.map(item => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Possíveis manifestações no corpo */}
      <Card className="p-6 space-y-5">
        <div>
          <h4 className="text-xl font-serif">Possíveis manifestações no corpo</h4>
          <p className="text-white/40 text-xs mt-1">
            Condições que costumam aparecer em quem tem este padrão ativo.
          </p>
        </div>

        {ativos.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {ativos.map(p => {
              const padrao = getPadrao(p.id);
              const selecionado = padrao.id === padraoSelecionado.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPadraoCorpo(p.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                    selecionado ? 'text-black border-transparent' : 'text-white/60 border-white/10 hover:text-white'
                  )}
                  style={selecionado ? { backgroundColor: padrao.cor } : undefined}
                >
                  {padrao.nome}
                </button>
              );
            })}
          </div>
        )}

        {(['sinal', 'cronica'] as TipoManifestacao[]).map(tipo => (
          <ListaManifestacoes key={tipo} tipo={tipo} itens={manifestacoesPorTipo(tipo)} cor={padraoSelecionado.cor} />
        ))}

        <div className="border-t border-white/5 pt-4">
          <button
            onClick={() => setMostrarGraves(v => !v)}
            className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white"
          >
            <ChevronDown className={cn('w-4 h-4 transition-transform', mostrarGraves && 'rotate-180')} />
            {TIPOS_MANIFESTACAO.grave.titulo} ({manifestacoesPorTipo('grave').length})
          </button>
          {mostrarGraves && (
            <div className="mt-4">
              <ListaManifestacoes tipo="grave" itens={manifestacoesPorTipo('grave')} cor={padraoSelecionado.cor} semTitulo />
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 leading-relaxed">
        <AlertTriangle className="w-4 h-4 shrink-0 text-gold/60" />
        <p>
          Hipóteses associadas ao padrão, não diagnóstico médico. Este conteúdo não substitui avaliação médica
          ou psicológica nem qualquer tratamento em curso. Se estiver em sofrimento intenso, ligue 188 (CVV).
        </p>
      </div>
    </div>
  );
}

function ListaManifestacoes({ tipo, itens, cor, semTitulo }: { tipo: TipoManifestacao; itens: { nome: string; gatilho: string }[]; cor: string; semTitulo?: boolean }) {
  if (itens.length === 0) return null;
  const { titulo, nota } = TIPOS_MANIFESTACAO[tipo];
  return (
    <div className="space-y-2">
      {!semTitulo && <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{titulo}</div>}
      {nota && <p className="text-[11px] text-white/40">{nota}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {itens.map(item => (
          <div key={item.nome} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: cor }} />
            <div className="min-w-0">
              <div className="text-sm text-white/90">{item.nome}</div>
              <div className="text-[11px] text-white/40">Gatilho: {item.gatilho}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
