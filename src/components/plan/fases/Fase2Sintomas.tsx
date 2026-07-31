import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';
import { 
  SUBLEIS_SACRIFICIO, 
  SUBLEIS_INJUSTICA, 
  SUBLEIS_DOR, 
  SUBLEIS_RENUNCIA 
} from '../../../data/planConstants';

export interface SintomasData {
  sacrificio: number[];
  injustica: number[];
  dor: number[];
  renuncia: number[];
}

interface Fase2SintomasProps {
  step: 'f2_sacrificio' | 'f2_injustica' | 'f2_dor' | 'f2_renuncia';
  sintomas: SintomasData;
  mode?: 'aliancas' | 'padroes';
  onToggleSintoma: (law: keyof SintomasData, index: number) => void;
  onNext: (nextStep: any) => void;
  onBack: (prevStep: any) => void;
  onFinish: () => void;
}

export const Fase2Sintomas: React.FC<Fase2SintomasProps> = ({
  step,
  sintomas,
  mode,
  onToggleSintoma,
  onNext,
  onBack,
  onFinish
}) => {
  const currentLaw = step.replace('f2_', '') as keyof SintomasData;

  const subleis = step === 'f2_sacrificio' ? SUBLEIS_SACRIFICIO :
                  step === 'f2_injustica' ? SUBLEIS_INJUSTICA :
                  step === 'f2_dor' ? SUBLEIS_DOR : SUBLEIS_RENUNCIA;

  const titles = {
    f2_sacrificio: "1. A LEI DO SACRIFÍCIO",
    f2_injustica: "2. A LEI DA INJUSTIÇA",
    f2_dor: "3. A LEI DA DOR",
    f2_renuncia: "4. A LEI DA RENÚNCIA"
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
            DIAGNÓSTICO DE SINTOMAS | LEALDADE DE NÃO ULTRAPASSAR
          </span>
          <h2 className="text-2xl font-serif font-medium uppercase mt-1 text-white">
            {titles[step]}
          </h2>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-xs text-white/60 leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-xl">
        Marque os sintomas ou subleis invisíveis que o seu corpo/vida pode estar executando hoje para pagar essa dívida sistêmica.
      </p>

      {/* Symptoms List */}
      <div className="grid gap-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
        {subleis.map((subleiText, idx) => {
          const isChecked = sintomas[currentLaw].includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onToggleSintoma(currentLaw, idx)}
              className={cn(
                "p-4 rounded-xl border text-left flex items-start gap-3 transition-all",
                isChecked 
                  ? "bg-gold/10 border-gold/40 text-white" 
                  : "bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/[0.03] hover:border-white/10"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                isChecked ? "bg-gold border-gold text-black" : "border-white/20 text-transparent"
              )}>
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gold/60 block">
                  SUTILEZA {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-xs leading-relaxed">{subleiText}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 'f2_sacrificio') {
              onBack(mode === 'padroes' ? 'intro_padroes' : 'f1_renuncia');
            } else if (step === 'f2_injustica') {
              onBack('f2_sacrificio');
            } else if (step === 'f2_dor') {
              onBack('f2_injustica');
            } else if (step === 'f2_renuncia') {
              onBack('f2_dor');
            }
          }}
          className="text-white/40 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <Button
          onClick={() => {
            if (step === 'f2_sacrificio') onNext('f2_injustica');
            else if (step === 'f2_injustica') onNext('f2_dor');
            else if (step === 'f2_dor') onNext('f2_renuncia');
            else if (step === 'f2_renuncia') {
              if (mode === 'padroes') {
                onFinish();
              } else {
                onNext('f3_matriz');
              }
            }
          }}
          className="bg-gold text-black hover:bg-gold/80 flex items-center gap-2 font-bold"
        >
          {step === 'f2_renuncia' && mode === 'padroes' ? (
            <>
              Salvar e Concluir Padrões <Check className="w-4 h-4" />
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
