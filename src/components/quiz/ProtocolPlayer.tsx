import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Activity,
  History,
  Target,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Protocol, ProtocolResult } from '../../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestore';
import { cn } from '../../lib/utils';

import { 
  BODY_PARTS, 
  getProtocolStepsForId, 
  applyTargetPersonPersonalization, 
  TargetPersonInfo 
} from '../../data/protocolSteps';

export { BODY_PARTS };
export type { TargetPersonInfo };


interface ProtocolPlayerProps {
  userId: string;
  journeyId?: string;
  protocol: Protocol;
  targetPerson?: TargetPersonInfo | null;
  viewResult?: ProtocolResult;
  onComplete: () => void;
  onBack: () => void;
  journeys?: any[];
  profile?: any;
}

export function ProtocolPlayer({ userId, journeyId, protocol, targetPerson, viewResult, onComplete, onBack, journeys, profile }: ProtocolPlayerProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    if (targetPerson) {
      const role = (targetPerson.role || '').toLowerCase();
      const name = targetPerson.name || '';
      const lowerName = name.toLowerCase();

      let possessive = name;
      if (role === 'mae' || lowerName === 'mãe' || lowerName === 'mae') {
        possessive = 'minha mãe';
      } else if (role === 'pai' || lowerName === 'pai') {
        possessive = 'meu pai';
      } else if (role === 'ancestral') {
        possessive = (name && name !== 'Ancestral da Linhagem' && name !== 'Ancestral Mapeado') ? name : 'meu ancestral';
      } else if (role === 'credor') {
        possessive = (name && name !== 'Credor Moral') ? name : 'meu credor moral';
      } else if (role === 'parceiro') {
        possessive = (name && name !== 'Parceiro(a) / Ex-Parceiro(a)') ? name : 'meu/minha parceiro(a)';
      } else if (lowerName.includes('avó') || lowerName.includes('avoa')) {
        possessive = lowerName.startsWith('minha') ? name : `minha ${name}`;
      } else if (lowerName.includes('avô') || lowerName.includes('avo')) {
        possessive = lowerName.startsWith('meu') ? name : `meu ${name}`;
      } else if (lowerName.includes('tio')) {
        possessive = lowerName.startsWith('meu') ? name : `meu ${name}`;
      } else if (lowerName.includes('tia')) {
        possessive = lowerName.startsWith('minha') ? name : `minha ${name}`;
      } else if (lowerName.includes('irmão') || lowerName.includes('irmao')) {
        possessive = lowerName.startsWith('meu') ? name : `meu ${name}`;
      } else if (lowerName.includes('irmã') || lowerName.includes('irma')) {
        possessive = lowerName.startsWith('minha') ? name : `minha ${name}`;
      }

      return {
        targetPersonName: targetPerson.name,
        targetPersonRole: targetPerson.role,
        targetPersonRoleLabel: targetPerson.roleLabel,
        targetPersonContract: targetPerson.contractStatement,
        envolved: possessive,
        person_link: possessive,
        resentment_target: possessive,
        e2_quem_viveu: possessive,
        e2_quem_pagou: possessive,
        e2_quem_nao_afasta: possessive,
        e2_quem_excessivo: possessive,
        e2_quem_fez_sentir: possessive,
        e1_pessoa: possessive,
        e1_contrato: targetPerson.contractStatement || ''
      };
    }
    return {};
  });
  const [saving, setSaving] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isViewMode = !!viewResult;

  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  // Load Synthesis voices list on mount & updates
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        setBrowserVoices(window.speechSynthesis.getVoices());
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel speaking when changing step
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      setSpeakingText(null);
    }
  }, [step]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingSpeech && speakingText === text) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      setSpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingText(text);
    setIsPlayingSpeech(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    
    // Warm, somatic and natural speed and pitch
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Prioritize natural neural Portuguese voices
    const bestVoice = browserVoices.find(v => 
      v.lang.startsWith('pt') && 
      (v.name.includes('Neural') || v.name.includes('Natural') || v.name.includes('Online'))
    ) || browserVoices.find(v => 
      v.lang.startsWith('pt') && 
      v.name.includes('Google')
    ) || browserVoices.find(v => 
      v.lang.startsWith('pt') && 
      (v.name.includes('Maria') || v.name.includes('Daniel') || v.name.includes('Heloisa') || v.name.includes('Francisca'))
    ) || browserVoices.find(v => 
      v.lang.toLowerCase().includes('br')
    ) || browserVoices.find(v => v.lang.startsWith('pt'));

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      setSpeakingText(null);
    };

    utterance.onerror = () => {
      setIsPlayingSpeech(false);
      setSpeakingText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Load from Firestore on mount (with localStorage fallback)
  React.useEffect(() => {
    if (isViewMode) {
      setAnswers(viewResult?.answers || {});
      setStep(0);
      setLoadingDraft(false);
      return;
    }

    const loadDraft = async () => {
      const draftKey = `protocol_draft_${protocol.id}`;
      const docId = `${userId}_${draftKey}`;
      let loadedAnswers = {};
      let loadedStep = 0;

      // Try local storage first for speed
      const saved = localStorage.getItem(`protocol_draft_${protocol.id}_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          loadedAnswers = parsed.answers || parsed;
          loadedStep = parsed.step || 0;
        } catch (e) {
          console.error("Error parsing saved local draft", e);
        }
      }

      // Sync with cloud draft
      try {
        const { getDoc, doc } = await import('firebase/firestore');
        const docSnap = await getDoc(doc(db, 'userDrafts', docId));
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData && cloudData.data) {
            loadedAnswers = cloudData.data.answers || {};
            loadedStep = cloudData.data.step || 0;
          }
        }
      } catch (error) {
        console.warn("Failed to load cloud draft:", error);
      }

      setAnswers(loadedAnswers);
      setStep(loadedStep);
      setLoadingDraft(false);
    };
    loadDraft();
  }, [protocol.id, userId, isViewMode, viewResult]);

  // Auto-save to localStorage and Firestore
  React.useEffect(() => {
    if (loadingDraft || isViewMode) return;

    const draftKey = `protocol_draft_${protocol.id}`;
    const localDraftKey = `protocol_draft_${protocol.id}_${userId}`;
    
    // Save to localStorage immediately
    localStorage.setItem(localDraftKey, JSON.stringify({ answers, step }));

    // Debounce saving to Firestore to prevent spamming
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const docId = `${userId}_${draftKey}`;
      try {
        const { setDoc, doc } = await import('firebase/firestore');
        await setDoc(doc(db, 'userDrafts', docId), {
          userId,
          draftKey,
          data: {
            answers,
            step
          },
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.warn("Failed to auto-save draft to Firestore:", error);
      }
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [answers, step, protocol.id, userId, loadingDraft]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result: Omit<ProtocolResult, 'id'> = {
        userId,
        protocolId: protocol.id,
        journeyId: journeyId || null,
        answers,
        completedAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'protocolResults'), result);
      
      // Clear draft after successful save
      const draftKey = `protocol_draft_${protocol.id}`;
      const localDraftKey = `protocol_draft_${protocol.id}_${userId}`;
      localStorage.removeItem(localDraftKey);

      try {
        const { deleteDoc, doc } = await import('firebase/firestore');
        const docId = `${userId}_${draftKey}`;
        await deleteDoc(doc(db, 'userDrafts', docId));
      } catch (e) {
        console.warn("Failed to delete cloud draft:", e);
      }

      setStep(999); // Transition to success step
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'protocolResults');
    } finally {
      setSaving(false);
    }
  };

  // Steps resolved from protocolSteps definition
  const getProtocolSteps = () => getProtocolStepsForId(protocol.id, protocol.title);

  const getActiveTargetPerson = (): TargetPersonInfo | null => {
    if (targetPerson && targetPerson.name) return targetPerson;

    const activeJourney = journeys?.find(j => j.id === journeyId);
    if (!activeJourney) return targetPerson || null;

    const jPerson = activeJourney.targetPerson || activeJourney.mabiAnswers?.targetPerson || activeJourney.context?.targetPerson;
    if (jPerson && jPerson.name) {
      return {
        name: jPerson.name,
        role: jPerson.role || 'ancestral',
        roleLabel: jPerson.roleLabel,
        activeGuilt: jPerson.activeGuilt || activeJourney.context?.activeGuilt,
        activeFear: jPerson.activeFear || activeJourney.context?.activeFear,
        contractStatement: jPerson.contractStatement || activeJourney.context?.contractStatement || activeJourney.mabiAnswers?.passo3?.contractStatement
      };
    }

    if (activeJourney.mabiAnswers?.passo1?.ancestorName) {
      return {
        name: activeJourney.mabiAnswers.passo1.ancestorName,
        role: activeJourney.mabiAnswers.passo1.ancestorRole || 'ancestral',
        contractStatement: activeJourney.mabiAnswers.passo3?.contractStatement || activeJourney.mabiAnswers.passo2?.fearStatement || activeJourney.context?.contractStatement
      };
    }

    if (activeJourney.context?.ancestorName) {
      return {
        name: activeJourney.context.ancestorName,
        role: activeJourney.context.ancestorRole || 'ancestral',
        contractStatement: activeJourney.context.contractStatement
      };
    }

    return targetPerson || null;
  };

  const getModifiedSteps = () => {
    const original = getProtocolSteps();
    const activePerson = getActiveTargetPerson();
    const personalized = applyTargetPersonPersonalization(original, activePerson);
    const isMainProtocol = ['culpa_sobrevivente', 'culpa_separacao', 'culpa_responsabilidade', 'culpa_auto_odio'].includes(protocol.id);
    if (!isMainProtocol) return personalized;

    const resultSteps: any[] = [];
    for (let i = 0; i < personalized.length; i++) {
      resultSteps.push(personalized[i]);
      if (personalized[i].title.toLowerCase().includes('regra invisível')) {
        resultSteps.push({
          type: 'mapa_corporal',
          title: 'Etapa 3.5 — Mapa Corporal Fatiado com Timer',
          description: 'Onde no corpo aperta quando você lê essa regra? Clique no corpo fatiado.',
          fields: []
        });
      }
    }
    return resultSteps;
  };

  const protocolSteps = getModifiedSteps();
  const currentStepData = protocolSteps[step];

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  React.useEffect(() => {
    if (currentStepData?.type === 'mapa_corporal') {
      setSecondsLeft(60);
      setTimerActive(false);
      if (isViewMode) {
        setAnswers(prev => ({ ...prev, tempo_60s_cumprido: true }));
        return;
      }
    }
  }, [step, currentStepData?.type, isViewMode]);

  React.useEffect(() => {
    if (currentStepData?.type === 'mapa_corporal' && timerActive && !isViewMode) {
      const interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            setAnswers(a => ({ ...a, tempo_60s_cumprido: true }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStepData?.type, timerActive, isViewMode]);

  const isPartSuggested = (partId: string) => {
    if (protocol.id === 'culpa_sobrevivente') {
      return ['peito', 'estomago'].includes(partId);
    }
    if (protocol.id === 'culpa_separacao') {
      return ['pescoco', 'peito'].includes(partId);
    }
    if (protocol.id === 'culpa_responsabilidade') {
      return ['ombros', 'pescoco', 'mandibula'].includes(partId);
    }
    if (protocol.id === 'culpa_auto_odio') {
      return ['cabeca', 'estomago', 'mandibula'].includes(partId);
    }
    return false;
  };

  const getFraseAudioText = () => {
    const activeJourney = journeys?.find(j => j.id === journeyId);
    let targetName = targetPerson?.name;
    if (targetPerson?.role === 'mae' && (!targetName || targetName === 'Mãe')) targetName = 'minha mãe';
    if (targetPerson?.role === 'pai' && (!targetName || targetName === 'Pai')) targetName = 'meu pai';

    const ancestorName = targetName || activeJourney?.mabiAnswers?.passo1?.ancestorName || answers.e2_quem_pagou || answers.e2_quem_nao_afasta || answers.e2_quem_excessivo || 'meu clã familiar';

    if (protocol.id === 'culpa_sobrevivente') {
      return `O sofrimento de ${ancestorName} pertence à história de ${ancestorName}. Eu não preciso repetir isso para continuar pertencendo. O que é meu agora é seguir com leveza.`;
    }
    if (protocol.id === 'culpa_separacao') {
      return `A renúncia de ${ancestorName} pertence à história de ${ancestorName}. Eu posso me diferenciar e continuar ligado. Me limitar não salva.`;
    }
    if (protocol.id === 'culpa_responsabilidade') {
      return `O peso de ${ancestorName} pertence à vida de ${ancestorName}. Eu não tenho o poder nem a obrigação de resolver no lugar de ${ancestorName}. Hoje o que me cabe é fazer só a minha parte.`;
    }
    if (protocol.id === 'culpa_auto_odio') {
      const treatedRes = answers.e2_como_acontecia || answers.e2_errado_ambiente || 'minha história';
      const moldadoPor = answers.e2_quem_fez_sentir || ancestorName || 'outros';
      return `O modo como eu fui tratado em ${treatedRes} não define quem eu sou. O que aprendi a odiar em mim foi moldado por ${moldadoPor}. Me punir não corrige.`;
    }
    return '';
  };

  const isStepValid = () => {
    if (!currentStepData) return true;

    if (currentStepData.type === 'mapa_corporal') {
      if (isViewMode) return true;
      return !!answers.local_tensao_mapa && !!answers.tempo_60s_cumprido;
    }

    if (currentStepData.title?.includes('Frase de Correção')) {
      if (isViewMode) return true;
      const chipSelected = answers.sensacao_pos_mao && answers.sensacao_pos_mao.length > 0;
      const descFilled = answers.texto_mudanca_corpo && answers.texto_mudanca_corpo.trim() !== '';
      const audioPlayed = !!answers.audio_frase_tocado;
      return chipSelected && descFilled && audioPlayed;
    }

    if (currentStepData.title?.toLowerCase().includes('ato de')) {
      if (isViewMode) return true;
      const check1Done = !!answers.check_usuario_feito;
      const scaleSelected = answers.leveza_pos_ato !== undefined && answers.leveza_pos_ato !== null;
      const obsFilled = answers.observacao_pos_ato && answers.observacao_pos_ato.trim() !== '';
      return check1Done && scaleSelected && obsFilled;
    }

    return true;
  };

  if (step === 999) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-12">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
        >
          <Check className="w-12 h-12 text-gold" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-4xl font-serif">Protocolo Concluído</h2>
          <p className="text-xl text-gold/60 font-serif italic">"{protocol.quote}"</p>
          <p className="text-white/40 max-w-lg mx-auto">
            Suas percepções foram seladas. Continue sua jornada com esta nova clareza.
          </p>
        </div>
        <Button onClick={onComplete} className="px-12 py-4">Ir para Ações</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-gold uppercase tracking-widest text-[10px] font-bold">{protocol.code}</span>
            <h2 className="text-3xl font-serif">{protocol.title}</h2>
          </div>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-white/20">
          Passo {step + 1} de {protocolSteps.length}
        </div>
      </div>

      {targetPerson && (
        <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border border-gold/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gold/10 text-gold rounded-xl border border-gold/20 shrink-0">
              <Zap className="w-5 h-5 fill-gold" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold block">
                Protocolo Direcionado ao Mapa
              </span>
              <h4 className="text-sm font-serif font-bold text-white">
                Alvo Sistêmico: <span className="text-gold">{targetPerson.name}</span> ({targetPerson.roleLabel || targetPerson.role})
              </h4>
            </div>
          </div>
          {targetPerson.contractStatement && (
            <p className="text-[11px] text-white/60 italic max-w-md">
              "{targetPerson.contractStatement}"
            </p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6 shadow-sm">
            <button
              onClick={() => speakText(`${currentStepData.title}. ${currentStepData.description}`)}
              className={cn(
                "mt-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border shrink-0",
                isPlayingSpeech && speakingText === `${currentStepData.title}. ${currentStepData.description}`
                  ? "bg-gold border-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-gold/30 hover:text-white"
              )}
              title="Ouvir instruções do passo"
            >
              {isPlayingSpeech && speakingText === `${currentStepData.title}. ${currentStepData.description}` ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-serif text-gold leading-tight">{currentStepData.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{currentStepData.description}</p>
            </div>
          </div>

          {currentStepData.type === 'mapa_corporal' ? (
            <div className="flex flex-col items-center gap-8 py-4">
              <div className="text-center space-y-2">
                <p className="text-lg text-white/80 font-serif">Onde no corpo aperta quando você lê essa regra?</p>
                <p className="text-sm text-[#D4AF37] font-mono uppercase tracking-wider">Selecione na estrutura corporal fatiada abaixo.</p>
              </div>

              {/* Visual Geometric Anatomical Body Map Card */}
              <div className="flex flex-col items-center gap-3 w-full max-w-sm">
                <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                  MAPA DO CORPO:
                </span>

                <div className="relative w-full h-[450px] rounded-[32px] bg-[#09090b] border border-white/10 p-4 shadow-2xl flex flex-col items-center justify-center">
                  <svg viewBox="0 0 200 340" className="w-full h-full select-none">
                    <defs>
                      <filter id="bodyGlowProtocol" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Horizontal background guideline levels */}
                    {BODY_PARTS.map((part) => (
                      <line 
                        key={`grid-${part.id}`}
                        x1="6" 
                        y1={part.textY} 
                        x2="194" 
                        y2={part.textY} 
                        className="stroke-white/10 stroke-[0.5]" 
                        strokeDasharray="2,3"
                      />
                    ))}

                    {/* Slices of body as uniform rectangles */}
                    {BODY_PARTS.map((part) => {
                      const isSelected = answers.local_tensao_mapa === part.id;
                      const suggested = isPartSuggested(part.id);
                      return (
                        <g 
                          key={part.id} 
                          onClick={() => {
                            if (isViewMode) return;
                            setAnswers(prev => ({ ...prev, local_tensao_mapa: part.id }));
                            setTimerActive(false);
                            setSecondsLeft(60);
                          }}
                          className={cn("cursor-pointer group", isViewMode && "cursor-default")}
                        >
                          {/* Main geometric rectangle */}
                          <rect
                            x={part.x}
                            y={part.y}
                            width={part.width}
                            height={part.height}
                            rx="6"
                            className={cn(
                              "transition-all duration-300 stroke-[1.5]",
                              isSelected 
                                ? "fill-[#D4AF37] stroke-[#D4AF37]" 
                                : suggested
                                  ? "fill-[#D4AF37]/10 stroke-[#D4AF37]/50 hover:fill-[#D4AF37]/20 hover:stroke-[#D4AF37]"
                                  : "fill-white/[0.03] stroke-white/20 hover:fill-white/[0.08] hover:stroke-[#D4AF37]/60"
                            )}
                            style={isSelected ? { filter: "url(#bodyGlowProtocol)" } : {}}
                          />

                          {/* Technical code on left: FATIA.01 ... */}
                          <text
                            x="6"
                            y={part.textY + 2}
                            className={cn(
                              "text-[5.5px] font-mono transition-all duration-300 uppercase tracking-wider",
                              isSelected ? "fill-[#D4AF37] font-bold" : "fill-white/40 group-hover:fill-white/70"
                            )}
                          >
                            {part.fatiaCode}
                          </text>

                          {/* Dotted left guideline */}
                          <line 
                            x1={part.leftLine.x1} 
                            y1={part.textY} 
                            x2={part.leftLine.x2} 
                            y2={part.textY} 
                            className={cn(
                              "stroke-[0.8] transition-all duration-300",
                              isSelected ? "stroke-[#D4AF37]" : "stroke-white/15 group-hover:stroke-white/40"
                            )}
                            strokeDasharray="1.5,2"
                          />

                          {/* Dotted right guideline */}
                          <line 
                            x1={part.rightLine.x1} 
                            y1={part.textY} 
                            x2={part.rightLine.x2} 
                            y2={part.textY} 
                            className={cn(
                              "stroke-[0.8] transition-all duration-300",
                              isSelected ? "stroke-[#D4AF37]" : "stroke-white/15 group-hover:stroke-white/40"
                            )}
                            strokeDasharray="1.5,2"
                          />

                          {/* Label text inside rectangle */}
                          <text
                            x="100"
                            y={part.textY + 3.5}
                            textAnchor="middle"
                            className={cn(
                              "text-[9px] font-mono tracking-widest font-bold transition-all duration-300 pointer-events-none uppercase",
                              isSelected ? "fill-black" : "fill-white/90 group-hover:fill-white"
                            )}
                            style={isSelected ? { fill: "#000", fontWeight: "900" } : {}}
                          >
                            {part.id === 'pescoco' ? 'PESCOÇO' : part.label.toUpperCase()}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {answers.local_tensao_mapa && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[10px] font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse whitespace-nowrap">
                      <span>✋</span> Coloque a mão no(a) {BODY_PARTS.find(p => p.id === answers.local_tensao_mapa)?.label}
                    </div>
                  )}
                </div>

                {/* Quick select pill options under the map for accessibility */}
                <div className="flex flex-wrap gap-1.5 justify-center pt-2 max-w-sm">
                  {BODY_PARTS.map((part) => {
                    const isSelected = answers.local_tensao_mapa === part.id;
                    const suggested = isPartSuggested(part.id);
                    return (
                      <button
                        key={part.id}
                        type="button"
                        disabled={isViewMode}
                        onClick={() => {
                          if (isViewMode) return;
                          setAnswers(prev => ({ ...prev, local_tensao_mapa: part.id }));
                          setTimerActive(false);
                          setSecondsLeft(60);
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-mono transition-all border flex items-center gap-1.5",
                          isSelected
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-md"
                            : suggested
                              ? "bg-white/5 border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              : "bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                        )}
                      >
                        <span>{part.label}</span>
                        {suggested && !isSelected && <span className="text-[9px]">✨</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timer Control Panel & Affirmation */}
              <div className="w-full max-w-md text-center space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="space-y-4 flex flex-col items-center">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/30">Tempo restante de integração:</span>
                  
                  <div className="text-5xl font-mono text-[#D4AF37] font-bold tracking-tight tabular-nums">
                    {secondsLeft > 0 ? `${secondsLeft}s` : 'Tempo concluído'}
                  </div>

                  {!answers.local_tensao_mapa ? (
                    <div className="text-xs text-white/40 italic py-1">
                      Selecione uma região de tensão corporal acima para liberar o timer.
                    </div>
                  ) : answers.tempo_60s_cumprido ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono uppercase tracking-wide bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Integração Concluída
                    </div>
                  ) : timerActive ? (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => setTimerActive(false)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 text-xs font-mono flex items-center gap-1"
                      >
                        <Pause className="w-3 h-3" /> Pausar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setTimerActive(false);
                          setSecondsLeft(60);
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 px-4 py-2 text-xs font-mono flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Reiniciar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setTimerActive(true)}
                      className="bg-[#D4AF37] hover:bg-[#bda030] text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                    >
                      <Play className="w-4 h-4 fill-black" /> Iniciar Timer (60s)
                    </Button>
                  )}
                </div>

                <p className="text-sm text-white/60 leading-relaxed italic border-t border-white/5 pt-4">
                  "Faz sentido doer aí. É lealdade antiga. Ficar 60 segundos assim sem corrigir é o chão que seu sistema precisa para não disparar imunidade."
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {currentStepData.fields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <label className="text-lg text-white/80 font-serif leading-tight">{field.label}</label>
                    <button
                      onClick={() => speakText(field.label)}
                      className={cn(
                        "p-2 rounded-lg hover:bg-white/5 transition-all text-white/30 hover:text-gold flex items-center justify-center border border-transparent hover:border-white/5 shrink-0",
                        isPlayingSpeech && speakingText === field.label && "text-gold bg-gold/10 border-gold/20"
                      )}
                      title="Ouvir pergunta"
                    >
                      {isPlayingSpeech && speakingText === field.label ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {field.type === 'textarea' ? (
                    <textarea
                      readOnly={isViewMode}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-gold/50 transition-all min-h-[150px]",
                        isViewMode && "cursor-default border-white/5 text-white/70"
                      )}
                      placeholder={isViewMode ? "" : field.placeholder}
                      value={answers[field.id] || ''}
                      onChange={(e) => !isViewMode && setAnswers(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                  ) : field.type === 'select' ? (
                    <div className="grid gap-3">
                      {field.options?.map((opt) => (
                         <button
                           key={opt.value}
                           disabled={isViewMode}
                           onClick={() => !isViewMode && setAnswers(prev => ({ ...prev, [field.id]: opt.value }))}
                           className={cn(
                             "p-4 text-left rounded-xl border transition-all text-sm",
                             answers[field.id] === opt.value
                               ? "bg-gold border-gold text-black font-bold"
                               : "bg-white/5 border-white/5 text-white/60",
                             isViewMode ? "cursor-default" : "hover:border-gold/30"
                           )}
                         >
                           {opt.label}
                         </button>
                      ))}
                    </div>
                  ) : field.type === 'multiselect' ? (
                    <div className="grid gap-3">
                      {field.options?.map((opt) => {
                        const isSelected = (answers[field.id] || []).includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            disabled={isViewMode}
                            onClick={() => {
                              if (isViewMode) return;
                              const currentVal = answers[field.id] || [];
                              const newVal = currentVal.includes(opt.value)
                                ? currentVal.filter((v: string) => v !== opt.value)
                                : [...currentVal, opt.value];
                              setAnswers(prev => ({ ...prev, [field.id]: newVal }));
                            }}
                            className={cn(
                              "p-4 text-left rounded-xl border transition-all text-sm flex items-center justify-between",
                              isSelected
                                ? "bg-gold/10 border-gold text-gold font-bold"
                                : "bg-white/5 border-white/5 text-white/60",
                              isViewMode ? "cursor-default" : "hover:border-gold/30"
                            )}
                          >
                            <span>{opt.label}</span>
                            <div className={cn(
                              "w-5 h-5 rounded flex items-center justify-center border transition-all",
                              isSelected ? "border-gold bg-gold text-black" : "border-white/20"
                            )}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <input
                      type="text"
                      readOnly={isViewMode}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold/50 transition-all",
                        isViewMode && "cursor-default border-white/5 text-white/70"
                      )}
                      placeholder={isViewMode ? "" : field.placeholder}
                      value={answers[field.id] || ''}
                      onChange={(e) => !isViewMode && setAnswers(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                  )}
                </div>
              ))}

              {/* Specific Somatic Integration elements for 'Frase de Correção' */}
              {currentStepData.title?.includes('Frase de Correção') && (
                <div className="mt-8 border-t border-white/10 pt-8 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-serif text-gold">Integração Somática com Áudio</h4>
                    <p className="text-sm text-white/50">
                      Toque no botão abaixo para registrar seu gesto de colocar a mão na região de tensão e ouvir a frase de correção falada em áudio.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <Button
                        type="button"
                        onClick={() => {
                          if (isViewMode) return;
                          setAnswers(prev => ({ ...prev, audio_frase_tocado: true }));
                          speakText(getFraseAudioText());
                        }}
                        className={cn(
                          "w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 transition-all",
                          answers.audio_frase_tocado 
                            ? "bg-gold/10 border border-gold text-gold hover:bg-gold/20"
                            : "bg-gold text-black font-bold hover:bg-gold-light"
                        )}
                      >
                        <Volume2 className="w-5 h-5" />
                        {answers.audio_frase_tocado ? "Ouvir Frase de Correção Novamente" : "Marquei que coloquei a mão e senti"}
                      </Button>
                      
                      {answers.audio_frase_tocado && (
                        <span className="text-xs font-mono text-gold/70 flex items-center gap-1">
                          <Check className="w-4 h-4 text-gold" /> Áudio reproduzido
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chips */}
                  <div className="space-y-3">
                    <label className="text-lg text-white/80 font-serif leading-tight block">
                      O que senti depois da mão? <span className="text-gold">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['leveza', 'alívio', 'calor', 'choro', 'energia para fluir', 'ainda tenso'].map((opt) => {
                        const isSelected = (answers.sensacao_pos_mao || []).includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isViewMode}
                            onClick={() => {
                              if (isViewMode) return;
                              const current = answers.sensacao_pos_mao || [];
                              const next = current.includes(opt)
                                ? current.filter((c: string) => c !== opt)
                                : [...current, opt];
                              setAnswers(prev => ({ ...prev, sensacao_pos_mao: next }));
                            }}
                            className={cn(
                              "px-4 py-2 rounded-full border text-xs font-medium transition-all",
                              isSelected
                                ? "bg-gold border-gold text-black"
                                : "bg-white/5 border-white/10 text-white/60 hover:border-gold/40"
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text area */}
                  <div className="space-y-3">
                    <label className="text-lg text-white/80 font-serif leading-tight block">
                      Descreva em uma frase o que mudou no seu corpo depois da mão e da frase. <span className="text-gold">*</span>
                    </label>
                    <textarea
                      readOnly={isViewMode}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-gold/50 transition-all min-h-[100px]"
                      placeholder="Descreva a sensação física no corpo..."
                      value={answers.texto_mudanca_corpo || ''}
                      onChange={(e) => !isViewMode && setAnswers(prev => ({ ...prev, texto_mudanca_corpo: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Specific Somatic Integration elements for 'Ato de' */}
              {currentStepData.title?.toLowerCase().includes('ato de') && (
                <div className="mt-8 border-t border-white/10 pt-8 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-serif text-gold">Testemunho do Ato</h4>
                    <p className="text-sm text-white/50">
                      O ato de descolamento precisa ser assumido e testemunhado para se sedimentar em seu sistema.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      {/* Check 1: User */}
                      <button
                        type="button"
                        disabled={isViewMode}
                        onClick={() => {
                          if (isViewMode) return;
                          const hasVal = answers.check_usuario_feito;
                          if (hasVal) {
                            setAnswers(prev => ({
                              ...prev,
                              check_usuario_feito: null,
                              audio_testemunha_tocado: false
                            }));
                          } else {
                            const nowStr = new Date().toISOString();
                            setAnswers(prev => ({
                              ...prev,
                              check_usuario_feito: nowStr,
                              audio_testemunha_tocado: true
                            }));
                            speakText("Ato isolado volta, ato testemunhado sedimenta. Estamos aqui. Você avançou sem trair.");
                          }
                        }}
                        className={cn(
                          "p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                          answers.check_usuario_feito
                            ? "bg-gold/10 border-gold text-gold"
                            : "bg-white/5 border-white/5 text-white/60 hover:border-gold/30"
                        )}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-bold">Check do Usuário</div>
                          <div className="text-[11px] text-white/40">Marquei que fiz o ato</div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded flex items-center justify-center border transition-all",
                          answers.check_usuario_feito ? "border-gold bg-gold text-black" : "border-white/20"
                        )}>
                          {answers.check_usuario_feito && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>

                      {/* Check 2: Admin */}
                      {profile?.role === 'admin' ? (
                        <button
                          type="button"
                          disabled={isViewMode}
                          onClick={() => {
                            if (isViewMode) return;
                            const hasVal = answers.check_admin_viu;
                            setAnswers(prev => ({
                              ...prev,
                              check_admin_viu: hasVal ? null : new Date().toISOString()
                            }));
                          }}
                          className={cn(
                            "p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                            answers.check_admin_viu
                              ? "bg-gold/10 border-[#D4AF37] text-gold"
                              : "bg-white/5 border-white/5 text-white/60 hover:border-gold/30"
                          )}
                        >
                          <div className="space-y-1">
                            <div className="text-sm font-bold">Check do Administrador</div>
                            <div className="text-[11px] text-white/40">Vi que o usuário fez</div>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded flex items-center justify-center border transition-all",
                            answers.check_admin_viu ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/20"
                          )}>
                            {answers.check_admin_viu && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      ) : (
                        answers.check_admin_viu && (
                          <div className="p-4 rounded-xl border border-gold/20 bg-gold/5 text-gold flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                            <div className="text-xs">
                              <span className="font-bold block">Ato Validado pelo Mestre</span>
                              Este passo foi selado e testemunhado pela escola.
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Scale 0-10 */}
                  <div className="space-y-4">
                    <label className="text-lg text-white/80 font-serif leading-tight block">
                      Quanta energia para fluir você sente agora? (0 a 10) <span className="text-gold">*</span>
                    </label>
                    <div className="grid grid-cols-11 gap-1">
                      {Array.from({ length: 11 }).map((_, val) => {
                        const isSelected = answers.leveza_pos_ato === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            disabled={isViewMode}
                            onClick={() => {
                              if (isViewMode) return;
                              setAnswers(prev => ({ ...prev, leveza_pos_ato: val }));
                            }}
                            className={cn(
                              "h-12 rounded-lg border text-sm font-mono flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-gold border-gold text-black font-bold"
                                : "bg-white/5 border-white/10 text-white/60 hover:border-gold/40"
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text input */}
                  <div className="space-y-3">
                    <label className="text-lg text-white/80 font-serif leading-tight block">
                      O que observou em você depois do ato? <span className="text-gold">*</span>
                    </label>
                    <p className="text-xs text-white/40 italic">Considere sentimentos como: culpa, vontade de voltar, leveza, energia.</p>
                    <textarea
                      readOnly={isViewMode}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-gold/50 transition-all min-h-[100px]"
                      placeholder="Descreva o que observou em você..."
                      value={answers.observacao_pos_ato || ''}
                      onChange={(e) => !isViewMode && setAnswers(prev => ({ ...prev, observacao_pos_ato: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-12">
            <Button 
              variant="outline" 
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-8 border-white/10 text-white/40"
            >
              Anterior
            </Button>
            {step === protocolSteps.length - 1 ? (
              <Button onClick={isViewMode ? onBack : handleSave} disabled={saving || !isStepValid()} className="px-12 py-4 text-lg">
                {isViewMode ? 'Fechar' : saving ? 'Selando...' : 'Finalizar Protocolo'}
              </Button>
            ) : (
              <Button onClick={() => setStep(s => s + 1)} disabled={!isStepValid()} className="px-12 py-4">
                Próximo <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
