import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Brain, 
  Compass, 
  BookOpen, 
  FileText, 
  Clock, 
  ArrowRight,
  Flame,
  Dumbbell,
  Users,
  LockKeyhole,
  HeartCrack,
  Lock,
  Unlock,
  RefreshCw,
  Sparkles,
  Eye
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Journey, ProtocolResult } from '../../types';
import { PROTOCOLS } from '../../data/protocols';

// Simple local duplicate of protocol recommendation logic to keep it fast and decoupled
const getLocalRecommendedProtocols = (
  goal: string,
  debts: string[],
  symptoms: string[]
) => {
  const list: { id: string; reason: string; matchScore: number }[] = [];
  const debtStr = (debts || []).join(' ').toLowerCase();
  const symptomsStr = (symptoms || []).join(' ').toLowerCase();

  if (goal === 'dinheiro') {
    list.push({
      id: 'culpa_sobrevivente',
      reason: 'Cura lealdades com antepassados que passaram por falências e escassez grave.',
      matchScore: 95
    });
    if (debtStr.includes('sofrer') || symptomsStr.includes('perder')) {
      list.push({
        id: 'medo_ultrapassar',
        reason: 'Para romper o teto invisível de conquistas financeiras em relação à família.',
        matchScore: 90
      });
    }
  } else if (goal === 'relacionamento') {
    list.push({
      id: 'culpa_separacao',
      reason: 'Cura a necessidade de autosabotagem para honrar divórcios e anulações familiares.',
      matchScore: 95
    });
    list.push({
      id: 'medo_separacao',
      reason: 'Cria autorização emocional para viver uma relação duradoura com autonomia.',
      matchScore: 85
    });
  } else if (goal === 'carreira') {
    list.push({
      id: 'culpa_responsabilidade',
      reason: 'Cura a exaustão por carregar a missão de salvar e sustentar o status da família.',
      matchScore: 95
    });
    list.push({
      id: 'medo_ultrapassar',
      reason: 'Autorização profunda para sobressair-se profissionalmente sem trair os pais.',
      matchScore: 90
    });
  } else { // saude
    list.push({
      id: 'culpa_auto_odio',
      reason: 'Para desatar a lealdade somática de adoecer para dividir fardos de dor física familiar.',
      matchScore: 90
    });
    if (symptomsStr.includes('fadiga') || symptomsStr.includes('crônica')) {
      list.push({
        id: 'medo_ultrapassar',
        reason: 'Para desativar o mecanismo de alerta biológico de hipervigilância crônica.',
        matchScore: 85
      });
    }
  }

  if (list.length < 2) {
    list.push({
      id: 'culpa',
      reason: 'Ajuste geral de culpa existencial sistêmica.',
      matchScore: 70
    });
  }

  return list.slice(0, 3);
};

interface MabiDashboardProgressProps {
  journey: Journey;
  protocolHistory: ProtocolResult[];
  onSelectStaticProtocol?: (protocolId: string) => void;
  onGoToChronogram?: () => void;
}

export function MabiDashboardProgress({
  journey,
  protocolHistory,
  onSelectStaticProtocol,
  onGoToChronogram
}: MabiDashboardProgressProps) {
  const goal = journey.mabiGoal || 'dinheiro';
  const mAnswers = journey.mabiAnswers || {};

  // Fase 1 Answers
  const goalTarget = mAnswers.passo1?.goalTarget || '';
  const checkedSymptoms = mAnswers.passo2?.checkedSymptoms || [];
  const visceralSensation = mAnswers.passo2?.visceralSensation || '';
  const safetyScore = mAnswers.passo2?.safetyScore || 5;

  // Fase 2 Answers
  const ancestorName = mAnswers.passo1?.ancestorName || '';
  const selectedDebts = mAnswers.passo1?.selectedDebts || [];
  const contractStatement = mAnswers.passo1?.contractStatement || '';

  // Fase 3 Answers
  const sensationType = mAnswers.passo3?.sensationType || '';
  const judgmentOwner = mAnswers.passo3?.judgmentOwner || '';
  const guiltPhrase = mAnswers.passo3?.guiltPhrase || '';
  const survivalFear = mAnswers.passo3?.survivalFear || '';

  // Fase 4 Answers
  const selectedActionType = mAnswers.passo4?.selectedActionType || '';
  const actionPlan = mAnswers.passo4?.actionPlan || '';
  const commitmentAccepted = mAnswers.passo4?.commitmentAccepted || false;

  // Compute Completion percentages for the 4 Fases
  const getFase1Completion = () => {
    let pts = 0;
    if (goalTarget) pts += 35;
    if (checkedSymptoms.length > 0) pts += 35;
    if (visceralSensation) pts += 30;
    return pts;
  };

  const getFase2Completion = () => {
    let pts = 0;
    if (ancestorName) pts += 40;
    if (selectedDebts.length > 0) pts += 30;
    if (contractStatement) pts += 30;
    return pts;
  };

  const getFase3Completion = () => {
    let pts = 0;
    if (sensationType) pts += 25;
    if (judgmentOwner) pts += 25;
    if (guiltPhrase) pts += 25;
    if (survivalFear) pts += 25;
    return pts;
  };

  const getFase4Completion = () => {
    let pts = 0;
    if (selectedActionType) pts += 30;
    if (actionPlan) pts += 30;
    if (commitmentAccepted) pts += 40;
    return pts;
  };

  const f1Prog = getFase2Completion(); // Contabilidade is now Fase 1
  const f2Prog = getFase1Completion(); // Espelho is now Fase 2
  const f3Prog = getFase3Completion(); // Processos is now Fase 3
  const f4Prog = getFase4Completion(); // Ações is now Fase 4

  const totalProgress = Math.round((f1Prog + f2Prog + f3Prog + f4Prog) / 4);

  // Check if we have clinical data from ANY source (journey answers, symptoms, debts, mabiInputs, plan)
  const hasClinicalData = totalProgress > 0 
    || checkedSymptoms.length > 0 
    || selectedDebts.length > 0 
    || !!ancestorName 
    || !!goalTarget 
    || !!visceralSensation
    || !!mAnswers.passo4?.mabiInputs;

  // Compute M.A.B.I. Resistance Scores (0 to 10 scale)
  // 1. Somatica (Somatic Resistance): direct visceral tension level
  const somaticaResistance = Math.min(10, Math.max(safetyScore, (checkedSymptoms.length * 1.5) + (visceralSensation ? 2 : 0))) || 6.5;

  // 2. Transgeracional (Loyalty Debt Resistance): based on active debts
  const transgeracionalResistance = Math.min(10, Math.max(4, (selectedDebts.length * 2.5) + (contractStatement ? 2.5 : 0) + (checkedSymptoms.length * 1))) || 5.5;

  // 3. Culpa (Guilt Rigidity): AutoOdio has maximum resistance
  let culpaResistance = 5.5;
  const activeCulpa = mAnswers.passo4?.mabiInputs?.culpa || 'Sobrevivente';
  if (activeCulpa.startsWith('AutoOdio')) {
    culpaResistance = 9.5;
  } else if (activeCulpa === 'Deslealdade') {
    culpaResistance = 8;
  } else if (activeCulpa === 'Responsavel') {
    culpaResistance = 7;
  } else if (activeCulpa === 'Sobrevivente') {
    culpaResistance = 5.5;
  }

  // 4. Medo Primitivo (Instinctive Fear Resistance): based on survival fear intensity
  let medoResistance = 6;
  const activeMedo = mAnswers.passo4?.mabiInputs?.medo || 'Exposicao';
  if (activeMedo === 'Invasao' || survivalFear.toLowerCase().includes('morrer') || survivalFear.toLowerCase().includes('morte')) {
    medoResistance = 9;
  } else if (activeMedo === 'Isolamento' || survivalFear.toLowerCase().includes('sol') || survivalFear.toLowerCase().includes('abandon')) {
    medoResistance = 8;
  } else if (activeMedo === 'Subjugacao') {
    medoResistance = 7;
  } else if (activeMedo === 'Exposicao') {
    medoResistance = 6;
  } else if (activeMedo === 'Imperfeicao') {
    medoResistance = 4.5;
  }

  // 5. Inércia do Livro (Ledger Inertia): sacrifice is historically highest inertia
  let ledgerResistance = 7;
  const activeLivroRazao = mAnswers.passo4?.mabiInputs?.livroTipo || mAnswers.passo4?.mabiInputs?.livro_razao_tipo || 'sacrificio';
  if (activeLivroRazao === 'sacrificio') {
    ledgerResistance = 9;
  } else if (activeLivroRazao === 'dor') {
    ledgerResistance = 8;
  } else if (activeLivroRazao === 'renuncia') {
    ledgerResistance = 7;
  } else if (activeLivroRazao === 'injustica') {
    ledgerResistance = 5.5;
  }

  const resistanceData = [
    { name: 'Tensão Corporal (Somática)', valor: somaticaResistance, desc: 'Instabilidade corporal e respostas reflexas' },
    { name: 'Fidelidade Familiar (Sistêmica)', valor: transgeracionalResistance, desc: 'Fidelidades e alianças inconscientes familiares' },
    { name: 'Culpa (Autopunição)', valor: culpaResistance, desc: 'Julgamento severo e autopunições ativas' },
    { name: 'Medo (Insegurança)', valor: medoResistance, desc: 'Fantasias de perda de pertencimento ou exclusão social' },
    { name: 'Sacrifício (Livro Razão)', valor: ledgerResistance, desc: 'Crença profunda no valor do sofrimento/sacrifício' }
  ];

  // Find Peak Resistance
  const peakResistance = [...resistanceData].sort((a, b) => b.valor - a.valor)[0];

  // Clinical Diagnosis Feedback based on peak resistance
  const getClinicalDiagnosticFeedback = () => {
    if (!hasClinicalData) {
      return "Preencha o mapeamento em Alianças e Padrões para obtermos a primeira análise detalhada de resistência clínica.";
    }

    switch (peakResistance.name) {
      case 'Tensão Corporal (Somática)':
        return `O sistema identifica que sua maior trava operacional é de caráter Somático (Nível ${somaticaResistance}/10). Seu corpo e sistema nervoso geram reações físicas intensas ("${visceralSensation || 'aperto corporal'}") para paralisar sua aproximação de "${goalTarget}". Isso atua como um 'disparador biológico' para evitar o desconforto da diferenciação. Foco em autorregulação física e relaxamento corporal.`;
      case 'Fidelidade Familiar (Sistêmica)':
        return `O sistema detecta que o maior entrave é de ordem Familiar/Sistêmica (${transgeracionalResistance}/10). Seu avanço financeiro ou afetivo se choca diretamente contra a memória de escassez ou dor de ${ancestorName || 'seus antepassados'}. Romper o bloqueio parece ao inconsciente uma traição ou abandono a eles. É vital aplicar os exercícios de devolução de fardos de dor.`;
      case 'Culpa (Autopunição)':
        return `O pico de resistência clínica está na Culpa e Autopunição (${culpaResistance}/10). Atualmente sob a dinâmica "${activeCulpa}", o olhar julgador inconsciente de "${judgmentOwner}" funciona como um peso constante. Você sabota seus resultados para aliviar a culpa de ter mais sucesso ou ser mais feliz que a sua família.`;
      case 'Medo (Insegurança)':
        return `O sistema identifica que o maior obstáculo é o Medo (${medoResistance}/10). A aproximação de sua meta evoca sentimentos de perda de proteção ou exclusão ("${survivalFear || 'aniquilação'}"). Para a sua mente, vencer em ${journey.mabiGoal} traz o receio de ser abandonado ou rejeitado. Use os exercícios de segurança emocional.`;
      case 'Sacrifício (Livro Razão)':
        return `A maior inércia mapeada está na necessidade de sacrifício (${ledgerResistance}/10). Seu sistema opera sob a lealdade de "${activeLivroRazao === 'sacrificio' ? 'Trabalho Duro & Sacrifício' : activeLivroRazao === 'renuncia' ? 'Renúncia & Abnegação' : 'Carregar Dores'}". Há uma crença de que seu valor depende de quanto sofrimento você carrega. Florescer sem esforço extremo parece proibido ou perigoso.`;
      default:
        return "Sua jornada clínica está em andamento. Continue respondendo as Fases para que o diagnóstico trace o mapa de resistência definitivo.";
    }
  };

  const clinicalFeedback = getClinicalDiagnosticFeedback();

  // Recommend protocols and check completed status
  const recommendedProtocols = getLocalRecommendedProtocols(goal, selectedDebts, checkedSymptoms);

  const completedProtocolsForThisJourney = protocolHistory.filter(ph => ph.journeyId === journey.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & Quick Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Status da Sessão</span>
              <Activity className="w-4 h-4 text-gold animate-pulse" />
            </div>
            <h3 className="text-2xl font-serif text-white">Aliança Familiar Ativa</h3>
            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
              O diagnóstico geracional está monitorando {checkedSymptoms.length} sintoma(s) ativo(s) na área de <strong className="text-gold font-medium">{journey.name}</strong>.
            </p>
          </div>
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Foco: {goal.toUpperCase()}</span>
            <span>Ref: {journey.id.substring(0,6).toUpperCase()}</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2 block">Progresso das 4 Fases</span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-mono text-gold font-bold">{totalProgress}%</span>
              <span className="text-xs text-white/30">concluído</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-4 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-gold/70 to-gold h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-white/30 mt-3 leading-tight">
            Etapas concluídas formam as fundações neurais para reequilibrar o sistema familiar.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent border-white/5 flex flex-col justify-between border-rose-500/10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Pico de Resistência</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            {hasClinicalData ? (
              <>
                <h3 className="text-lg font-serif text-rose-300 font-medium leading-tight">{peakResistance.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-xs text-white/50">Nível Crítico:</span>
                  <span className="text-sm font-bold text-rose-400 font-mono">{peakResistance.valor.toFixed(1)}/10</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-white/30 italic">Aguardando preenchimento do mapeamento...</p>
            )}
          </div>
          <p className="text-[10px] text-white/30 mt-3 leading-tight">
            Indica a âncora biológica inconsciente de maior inércia ao florescimento.
          </p>
        </Card>
      </div>

      {/* 2. Visual Progression Timeline across 4 Fases */}
      <Card className="p-6 md:p-8 border-white/5 bg-white/[0.01]">
        <h3 className="text-base font-serif text-white mb-6 flex items-center gap-2">
          <Compass className="w-4 h-4 text-gold" />
          Mapeamento da Progressão
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Timeline Connector Line (Desktop Only) */}
          <div className="absolute top-[32px] left-[10%] right-[10%] h-[1px] bg-white/5 hidden md:block z-0" />

          {[
            {
              fase: 1,
              title: "1. Contabilidade Familiar",
              subtitle: "Investigação de heranças e contratos de sobrevivência familiar.",
              prog: f1Prog,
              color: "border-gold/30",
              data: ancestorName ? `Ancestral: ${ancestorName}` : "Pendente"
            },
            {
              fase: 2,
              title: "2. Alianças e Padrões",
              subtitle: "Mapeamento visceral de sintomas e meta real.",
              prog: f2Prog,
              color: "border-gold/30",
              data: goalTarget ? `Alvo: "${goalTarget}"` : "Pendente"
            },
            {
              fase: 3,
              title: "3. Processos Familiares",
              subtitle: "Identificação da engrenagem da culpa e medo primitivo.",
              prog: f3Prog,
              color: "border-gold/30",
              data: sensationType ? `Alarme: "${sensationType}"` : "Pendente"
            },
            {
              fase: 4,
              title: "4. Ações de Desengajamento",
              subtitle: "Prescrição de microação tática e compromisso real.",
              prog: f4Prog,
              color: "border-gold/30",
              data: commitmentAccepted ? "Acordo Assinado" : "Pendente"
            }
          ].map((f, idx) => {
            const isCompleted = f.prog === 100;
            const isInProgress = f.prog > 0 && f.prog < 100;

            return (
              <div key={idx} className="relative z-10 flex flex-col space-y-3">
                <div className="flex items-center md:flex-col md:items-center gap-3 md:gap-4 text-left md:text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                    isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                      : isInProgress 
                        ? 'bg-gold/10 border-gold/40 text-gold animate-pulse'
                        : 'bg-white/[0.01] border-white/5 text-white/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <span className="text-base font-bold font-mono">0{f.fase}</span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-400' : isInProgress ? 'text-gold' : 'text-white/40'}`}>
                      {f.title}
                    </h4>
                    <span className="text-[10px] text-white/30 block md:mt-0.5 font-mono">
                      {f.prog}% concluído
                    </span>
                  </div>
                </div>

                <div className="pl-16 md:pl-0 md:text-center">
                  <p className="text-[11px] text-white/40 leading-relaxed max-w-[180px] mx-auto min-h-[32px]">
                    {f.subtitle}
                  </p>
                  
                  {f.prog > 0 && (
                    <div className="mt-2 text-[9px] bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg inline-block text-white/60 font-mono truncate max-w-full">
                      {f.data}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Resistance Mappings - Chart and Clinical Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graphical Map of Resistance */}
        <Card className="p-6 md:p-8 border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-serif text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" />
              Espectro de Bloqueio & Alarme (Resistência)
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Visualização gráfica das forças inconscientes que sustentam a estagnação clínica.
            </p>
          </div>

          {!hasClinicalData ? (
            <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center text-center text-white/20 border border-dashed border-white/5 rounded-2xl p-6">
              <Brain className="w-8 h-8 text-white/10 mb-2 animate-bounce" />
              <p className="text-xs font-mono">Aguardando dados clínicos para gerar gráfico...</p>
            </div>
          ) : (
            <div className="h-[220px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resistanceData} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, width: 100 }} 
                    width={110}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0f0f0f] border border-white/10 p-3 rounded-xl shadow-xl max-w-[200px] text-xs">
                            <span className="font-bold text-gold block">{data.name}</span>
                            <span className="text-[10px] text-white/40 block mt-0.5 leading-tight">{data.desc}</span>
                            <span className="text-xs font-bold font-mono text-rose-400 mt-1.5 block">Resistência: {data.valor}/10</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={12}>
                    {resistanceData.map((entry, index) => {
                      // Color bar depending on resistance level
                      let color = 'rgba(212, 175, 55, 0.5)'; // default gold
                      if (entry.valor >= 8) color = 'rgba(239, 68, 68, 0.7)'; // red-orange for extremely high
                      else if (entry.valor >= 6) color = 'rgba(212, 175, 55, 0.8)'; // gold
                      else color = 'rgba(16, 185, 129, 0.6)'; // emerald for low

                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white/[0.01] border border-white/5 p-3.5 rounded-xl text-[10px] leading-relaxed text-white/40 space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-white/50 block font-mono font-bold">Guia de Escores:</span>
            <p><strong className="text-rose-400">8.0 — 10.0:</strong> Resistência Crítica. Exige intervenção com scripts de reprogramação neural direta.</p>
            <p><strong className="text-gold">5.0 — 7.9:</strong> Resistência Reativa. Respondida de forma excelente por atos de diferenciação de 10%.</p>
            <p><strong className="text-emerald-400">0.0 — 4.9:</strong> Regulação Saudável. Sistema flexível com excelente aceitação ao fluxo real.</p>
          </div>
        </Card>

        {/* Clinical Interpretation Narrative */}
        <Card className="p-6 md:p-8 border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono font-bold w-fit block mb-3">
              Parecer Clínico de Resistência
            </span>
            <h3 className="text-xl font-serif text-white">Auditoria de Barreira Biológica</h3>
            <p className="text-xs text-white/40 mt-1">
              Como o seu inconsciente se articula para travar o crescimento e como desativar essa inteligência de defesa.
            </p>
          </div>

          <div className="p-5 bg-[#0f0f0f] border border-white/5 rounded-2xl flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-gold/60">
                <Brain className="w-3.5 h-3.5 text-gold shrink-0" />
                Diagnóstico Baseado em Alarme & Sintomas
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans italic">
                "{clinicalFeedback}"
              </p>
            </div>

            {hasClinicalData && peakResistance.valor >= 6 && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div className="text-[10px] text-white/50 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">Dinâmica de Ganho Secundário Inconsciente:</span>
                  Ao perpetuar o sintoma e a dor, seu cérebro evita o perigo imaginário de exclusão gerada pelo sucesso. O sintoma é um "sacrifício" pacificador.
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-white/30 font-mono text-right leading-tight">
            Análise gerada pelo diagnóstico geracional
          </div>
        </Card>
      </div>

      {/* 4. Protocols Checklist: Recommended & Completed */}
      <Card className="p-6 md:p-8 border-white/5 bg-white/[0.01]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-serif text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold" />
              Protocolos
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Status das intervenções exatas receitadas para reorganizar o fluxo em {journey.name}.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-white/5 text-white/50 px-2.5 py-1 rounded-lg border border-white/5">
            Concluídos: {completedProtocolsForThisJourney.length} / {recommendedProtocols.length}
          </span>
        </div>

        {!hasClinicalData ? (
          <div className="py-8 text-center text-white/20 border border-dashed border-white/5 rounded-2xl">
            <p className="text-xs">Preencha o mapeamento para ver os protocolos recomendados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedProtocols.map((rec) => {
              const protocol = PROTOCOLS.find(p => p.id === rec.id);
              if (!protocol) return null;

              // Check if already completed in this journey
              const isCompleted = completedProtocolsForThisJourney.some(ph => ph.protocolId === rec.id);
              const completionRecord = completedProtocolsForThisJourney.find(ph => ph.protocolId === rec.id);

              return (
                <div 
                  key={rec.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isCompleted 
                      ? 'border-emerald-500/20 bg-emerald-500/[0.01]' 
                      : 'border-white/5 bg-white/[0.005] hover:border-gold/15'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gold/10 text-gold border border-gold/20'
                        }`}>
                          {protocol.code}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono font-medium">Relevância: {rec.matchScore}%</span>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          Concluído
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          <Clock className="w-3 h-3 shrink-0" />
                          Pendente
                        </div>
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-medium text-white/90 leading-tight">
                      {protocol.title}
                    </h4>
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {isCompleted && completionRecord ? (
                      <span className="text-[9px] text-white/30 font-mono">
                        Concluído em: {new Date(completionRecord.completedAt).toLocaleDateString('pt-BR')}
                      </span>
                    ) : (
                      <span className="text-[9px] text-white/30 font-mono">
                        Tempo estimado: 20-30 min
                      </span>
                    )}

                    {onSelectStaticProtocol && (
                      <Button 
                        size="sm"
                        onClick={() => onSelectStaticProtocol(rec.id)}
                        className={`text-[10px] font-bold py-1.5 h-auto shrink-0 ${
                          isCompleted 
                            ? 'bg-white/5 hover:bg-white/10 text-white/60 border border-white/5' 
                            : 'bg-gold text-black font-bold hover:bg-gold/90'
                        }`}
                      >
                        {isCompleted ? 'Refazer Protocolo' : 'Executar Protocolo'}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
