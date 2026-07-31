import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { cn } from '../../../lib/utils';
import { AREAS } from '../../../data/planConstants';

export interface Fase1Data {
  sacrificio: { areas: string[]; familiar: string; fatos: string };
  injustica: { areas: string[]; familiar: string; fatos: string };
  dor: { areas: string[]; familiar: string; fatos: string };
  renuncia: { areas: string[]; familiar: string; fatos: string };
}

interface Fase1ContabilidadeProps {
  step: 'f1_sacrificio' | 'f1_injustica' | 'f1_dor' | 'f1_renuncia';
  fase1: Fase1Data;
  mode?: 'aliancas' | 'padroes';
  onToggleArea: (law: keyof Fase1Data, areaId: string) => void;
  onUpdateText: (law: keyof Fase1Data, field: 'familiar' | 'fatos', value: string) => void;
  onNext: (nextStep: any) => void;
  onBack: (prevStep: any) => void;
  onFinish: () => void;
}

export const Fase1Contabilidade: React.FC<Fase1ContabilidadeProps> = ({
  step,
  fase1,
  mode,
  onToggleArea,
  onUpdateText,
  onNext,
  onBack,
  onFinish
}) => {
  const currentLaw = step.replace('f1_', '') as keyof Fase1Data;

  const titles = {
    f1_sacrificio: "1. SACRIFÍCIO NÃO RECONHECIDO",
    f1_injustica: "2. INJUSTIÇA NÃO REPARADA",
    f1_dor: "3. DOR NÃO PROCESSADA",
    f1_renuncia: "4. RENÚNCIA / EXCLUÍDO"
  };

  const folhaLabels = {
    f1_sacrificio: "Folha 1/5",
    f1_injustica: "Folha 2/5",
    f1_dor: "Folha 3/5",
    f1_renuncia: "Folha 4/5"
  };

  const quotes = {
    f1_sacrificio: "“O pai que sacrificou a própria saúde para sustentar a família. Quem se acabou pela família? Qual foi o custo real da sobrevivência?”",
    f1_injustica: "“A avó que suportou um casamento difícil para manter a família unida. Quem carregou um peso desproporcional e silencioso?”",
    f1_dor: "“O sofrimento que nunca foi nomeado. Qual tragédia, perda ou escassez virou a 'temperatura normal' e silenciosa da casa?”",
    f1_renuncia: "“A mãe que renunciou à própria carreira para estar presente. Qual talento ou potencial foi deixado na mesa? Quem foi excluído da família?”"
  };

  const factsPlaceholders = {
    f1_sacrificio: "DESCREVA OS FATOS (O QUE FOI PAGO, PERDIDO OU DEIXADO PARA TRÁS):",
    f1_injustica: "DESCREVA OS FATOS (COMO A BALANÇA FOI DESEQUILIBRADA):",
    f1_dor: "DESCREVA OS FATOS (O TRAUMA CRÔNICO QUE O SISTEMA ENGOLIU):",
    f1_renuncia: "DESCREVA OS FATOS (O QUE FOI ABORTADO PARA O SISTEMA SOBREVIVER):"
  };

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">
            FASE 1: A CONTABILIDADE FAMILIAR
          </span>
          <h2 className="text-2xl font-serif font-medium uppercase mt-1 text-white">
            {titles[step]}
          </h2>
        </div>
        <span className="text-xs font-mono text-white/40">
          {folhaLabels[step]}
        </span>
      </div>

      {/* Quote Card */}
      <Card className="p-5 bg-gold/5 border-gold/15 italic text-sm text-gold/90 leading-relaxed">
        {quotes[step]}
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {/* Areas */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
            ÁREA AFETADA:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AREAS.map((item) => {
              const isSelected = fase1[currentLaw].areas.includes(item.id);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggleArea(currentLaw, item.id)}
                  className={cn(
                    "p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all",
                    isSelected 
                      ? "bg-gold/15 border-gold text-gold" 
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:border-white/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Familiar Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
            NOME(S) DO FAMILIAR:
          </label>
          <input
            type="text"
            placeholder="Ex: Meu pai Francisco, minha avó Maria..."
            value={fase1[currentLaw].familiar}
            onChange={(e) => onUpdateText(currentLaw, 'familiar', e.target.value)}
            className="w-full bg-white/[0.02] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Facts */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
            {factsPlaceholders[step]}
          </label>
          <textarea
            rows={5}
            placeholder="Seja honesto e direto. Descreva com calma..."
            value={fase1[currentLaw].fatos}
            onChange={(e) => onUpdateText(currentLaw, 'fatos', e.target.value)}
            className="w-full bg-white/[0.02] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 'f1_sacrificio') {
              onBack(mode === 'aliancas' ? 'intro_aliancas' : 'intro');
            } else if (step === 'f1_injustica') {
              onBack('f1_sacrificio');
            } else if (step === 'f1_dor') {
              onBack('f1_injustica');
            } else if (step === 'f1_renuncia') {
              onBack('f1_dor');
            }
          }}
          className="text-white/40 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <Button
          onClick={() => {
            if (step === 'f1_sacrificio') onNext('f1_injustica');
            else if (step === 'f1_injustica') onNext('f1_dor');
            else if (step === 'f1_dor') onNext('f1_renuncia');
            else if (step === 'f1_renuncia') {
              if (mode === 'aliancas') {
                onFinish();
              } else {
                onNext('f2_sacrificio');
              }
            }
          }}
          className="bg-gold text-black hover:bg-gold/80 flex items-center gap-2 font-bold"
        >
          {step === 'f1_renuncia' && mode === 'aliancas' ? (
            <>
              Salvar e Concluir Alianças <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Avançar <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
