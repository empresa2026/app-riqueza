import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Check, 
  CheckCircle, 
  AlertTriangle, 
  Volume2, 
  Play, 
  ArrowRight,
  CheckSquare,
  Sparkle,
  RefreshCw,
  Award
} from 'lucide-react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { Journey, UserProfile } from '../../types';
import { Button } from '../ui/Button';

interface MabiAuditoriaSomaticaProps {
  journey: Journey;
  userId: string;
  profile: UserProfile | null;
  onComplete: () => void;
}

const BODY_PARTS = [
  { 
    id: 'cabeca', 
    label: 'Cabeça', 
    fatiaCode: 'FATIA.01', 
    x: 36,
    y: 16,
    width: 128,
    height: 38,
    textY: 35, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'mandibula', 
    label: 'Mandíbula', 
    fatiaCode: 'FATIA.02', 
    x: 36,
    y: 60,
    width: 128,
    height: 38,
    textY: 79, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'pescoco', 
    label: 'Pescoço', 
    fatiaCode: 'FATIA.03', 
    x: 36,
    y: 104,
    width: 128,
    height: 38,
    textY: 123, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'ombros', 
    label: 'Ombros', 
    fatiaCode: 'FATIA.04', 
    x: 36,
    y: 148,
    width: 128,
    height: 38,
    textY: 167, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'peito', 
    label: 'Peito', 
    fatiaCode: 'FATIA.05', 
    x: 36,
    y: 192,
    width: 128,
    height: 38,
    textY: 211, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'estomago', 
    label: 'Estômago', 
    fatiaCode: 'FATIA.06', 
    x: 36,
    y: 236,
    width: 128,
    height: 38,
    textY: 255, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'barriga', 
    label: 'Barriga', 
    fatiaCode: 'FATIA.07', 
    x: 36,
    y: 280,
    width: 128,
    height: 38,
    textY: 299, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  }
];

const SOMATIC_FEELINGS = [
  'Leveza sistêmica',
  'Alívio visceral',
  'Calor nas mãos',
  'Choro liberador',
  'Energia para fluir',
  'Ainda com tensão'
];

export function MabiAuditoriaSomatica({ journey, userId, profile, onComplete }: MabiAuditoriaSomaticaProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);

  // Screen 1: Barreira Biológica state
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [timerCount, setTimerCount] = useState<number>(60);
  const [isTimerRunning, setTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pausedCompleted, setPausedCompleted] = useState<boolean>(false);

  // Screen 2: Espectro de Bloqueio & Alarme state
  const [checkedGuidance, setCheckedGuidance] = useState<boolean[]>([false, false, false, false]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlayedPercentage, setAudioPlayedPercentage] = useState<number>(0);
  const [audioCompleted, setAudioCompleted] = useState<boolean>(false);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [sensationText, setSensationText] = useState<string>('');
  
  // Real-time loaded voices list
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Symptom mapped texts state
  const [symptomTexts, setSymptomTexts] = useState<string[]>([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState<boolean>(true);

  // Dynamic values
  const ancestorName = journey.mabiAnswers?.passo1?.ancestorName || 'meu clã familiar';
  const symptomPattern = journey.mabiAnswers?.passo2?.checkedSymptoms?.join(', ') || journey.mabiAnswers?.passo1?.selectedDebts?.join(', ') || 'este padrão repetitivo';
  const goalTerm = journey.mabiAnswers?.passo2?.symptomDescription || journey.mabiGoal || 'minha escassez sistêmica';
  const resourceTerm = journey.mabiGoal === 'dinheiro' 
    ? 'a abundância e a prosperidade' 
    : journey.mabiGoal === 'relacionamento' 
      ? 'a intimidade e o amor pleno' 
      : 'a saúde vibrante e a liberdade de viver';
  const microActText = journey.mabiAnswers?.passo4?.actionPlan || 'Fazer o desengajamento reativo e agir com autonomia';

  // Load physical parts
  const selectedPartLabel = BODY_PARTS.find(p => p.id === selectedPart)?.label || 'Corpo';

  // Fetch or map symptoms dynamically to avoid numbers
  useEffect(() => {
    async function loadSymptomTexts() {
      setLoadingSymptoms(true);
      try {
        const activeLivroRazao = journey.mabiAnswers?.passo4?.mabiInputs?.livro_razao_tipo || 
                                 journey.mabiAnswers?.passo4?.mabiInputs?.livroTipo || 
                                 'sacrificio';
        
        let initialTexts: string[] = [];
        const checkedIndexes = journey.mabiAnswers?.passo2?.checkedSymptoms || [];
        
        // Import symptom arrays dynamically to ensure code safety
        const { 
          SUBLEIS_SACRIFICIO, 
          SUBLEIS_INJUSTICA, 
          SUBLEIS_DOR, 
          SUBLEIS_RENUNCIA 
        } = await import('../plan/EnjoymentPlanFlow');

        // Fallback: Map using active book arrays
        const mapList = activeLivroRazao === 'sacrificio' ? SUBLEIS_SACRIFICIO :
                        activeLivroRazao === 'injustica' ? SUBLEIS_INJUSTICA :
                        activeLivroRazao === 'dor' ? SUBLEIS_DOR :
                        SUBLEIS_RENUNCIA;

        checkedIndexes.forEach((idx: any) => {
          const num = Number(idx);
          if (mapList[num]) {
            initialTexts.push(mapList[num]);
          }
        });

        // Exact look-up from user's actual saved plan document (most precise)
        if (userId && userId.trim() !== '') {
          try {
            const q = query(
              collection(db, 'enjoymentPlans'),
              where('userId', '==', userId),
              orderBy('createdAt', 'desc'),
              limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const planData = querySnapshot.docs[0].data();
              if (planData?.sintomas) {
                const exactTexts: string[] = [];
                const { sacrificio = [], injustica = [], dor = [], renuncia = [] } = planData.sintomas;
                sacrificio.forEach((idx: any) => {
                  if (SUBLEIS_SACRIFICIO[Number(idx)]) exactTexts.push(SUBLEIS_SACRIFICIO[Number(idx)]);
                });
                injustica.forEach((idx: any) => {
                  if (SUBLEIS_INJUSTICA[Number(idx)]) exactTexts.push(SUBLEIS_INJUSTICA[Number(idx)]);
                });
                dor.forEach((idx: any) => {
                  if (SUBLEIS_DOR[Number(idx)]) exactTexts.push(SUBLEIS_DOR[Number(idx)]);
                });
                renuncia.forEach((idx: any) => {
                  if (SUBLEIS_RENUNCIA[Number(idx)]) exactTexts.push(SUBLEIS_RENUNCIA[Number(idx)]);
                });
                if (exactTexts.length > 0) {
                  initialTexts = exactTexts;
                }
              }
            }
          } catch (queryErr) {
            console.warn("Could not query enjoymentPlans collection, using fallback symptom mapping:", queryErr);
          }
        }
        
        const uniqueTexts = Array.from(new Set(initialTexts));
        setSymptomTexts(uniqueTexts);
      } catch (err) {
        console.error("Error loading symptom texts:", err);
      } finally {
        setLoadingSymptoms(false);
      }
    }
    loadSymptomTexts();
  }, [userId, journey]);

  // Load Synthesis voices list on mount & updates
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        setBrowserVoices(window.speechSynthesis.getVoices());
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Screen 1: Timer logic
  useEffect(() => {
    if (isTimerRunning && timerCount > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setPausedCompleted(true);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerCount]);

  const handleSelectPart = (partId: string) => {
    setSelectedPart(partId);
    setTimerCount(60);
    setTimerRunning(true);
    setPausedCompleted(false);
  };

  const handleToggleGuidance = (idx: number) => {
    const next = [...checkedGuidance];
    next[idx] = !next[idx];
    setCheckedGuidance(next);
  };

  const allGuidanceChecked = checkedGuidance.every(Boolean);

  // Modernized speech synthesis with premium, neural voice selection
  const playSomaticConfirmation = () => {
    if (!allGuidanceChecked) return;

    const symptomDescription = symptomTexts.length > 0 
      ? symptomTexts.join(', ') 
      : 'este padrão de impedimento sistêmico';

    const phrasesList = [
      `Frase um. O sofrimento de ${ancestorName} pertence à história de ${ancestorName}.`,
      `Frase dois. Eu não preciso repetir ${symptomDescription} para honrar.`,
      `Frase três. Me limitar não repara ${goalTerm}.`,
      `Frase quatro. Me punir não devolve ${resourceTerm}.`,
      `Frase cinco. Hoje o que me cabe é praticar o seguinte micro ato seguro: ${microActText}.`
    ];

    const textToSpeak = phrasesList.join(' ');

    setIsPlayingAudio(true);
    setAudioCompleted(false);
    setAudioPlayedPercentage(0);

    let progressInterval: NodeJS.Timeout | null = null;

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'pt-BR';
        
        // Deeply somatic parameters (not squeaky or hyper fast)
        utterance.rate = 0.85; 
        utterance.pitch = 0.95;

        // Select the most professional neural voice
        const bestVoice = browserVoices.find(v => 
          v.lang.startsWith('pt') && 
          (v.name.includes('Neural') || v.name.includes('Natural') || v.name.includes('Online'))
        ) || browserVoices.find(v => 
          v.lang.startsWith('pt') && 
          v.name.includes('Google')
        ) || browserVoices.find(v => 
          v.lang.startsWith('pt') && 
          (v.name.includes('Maria') || v.name.includes('Daniel') || v.name.includes('Heloisa'))
        ) || browserVoices.find(v => 
          v.lang.toLowerCase().includes('br')
        ) || browserVoices.find(v => v.lang.startsWith('pt'));

        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        let elapsed = 0;
        const estimatedDuration = 18000; // ~18s full sequence

        utterance.onstart = () => {
          progressInterval = setInterval(() => {
            elapsed += 100;
            const pct = Math.min(100, (elapsed / estimatedDuration) * 100);
            setAudioPlayedPercentage(pct);
          }, 100);
        };

        utterance.onend = () => {
          if (progressInterval) clearInterval(progressInterval);
          setAudioPlayedPercentage(100);
          setIsPlayingAudio(false);
          setAudioCompleted(true);
        };

        utterance.onerror = () => {
          if (progressInterval) clearInterval(progressInterval);
          fallbackAudioSimulation();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech Synthesis failed, falling back to simulation:", err);
        fallbackAudioSimulation();
      }
    } else {
      fallbackAudioSimulation();
    }
  };

  const fallbackAudioSimulation = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setAudioPlayedPercentage(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsPlayingAudio(false);
        setAudioCompleted(true);
      }
    }, 120); // ~12s
  };

  const handleToggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
    );
  };

  const handleFinishExercise = async () => {
    if (sensationText.trim().length < 4) return;
    setSaving(true);

    try {
      const activeSymptomText = symptomTexts.length > 0 ? symptomTexts.join(', ') : 'Padrão sistêmico de fidelidade';
      const auditSummary = `
[AUDITORIA SISTÊMICA CONCLUÍDA]
Tensão Somática Localizada: ${selectedPartLabel}
Pausa Límbica de 60s: CUMPRIDA

[INSTRUÇÕES DE PRONÚNCIA INTEGRADAS]
- Toque firme no peito, não leve: SIM
- Olhos abertos, pés no chão: SIM
- Sussurro, não grito. Sussurro registra: SIM
- Leia em voz baixa, uma por vez, sentindo a mão: SIM

[FRASE SISTÊMICA INTEGRADA COM SUCESSO]
1. O sofrimento de ${ancestorName} pertence à história de ${ancestorName}.
2. Eu não preciso repetir ${activeSymptomText} para honrar.
3. Me limitar não repara ${goalTerm}.
4. Me punir não devolve ${resourceTerm}.
5. Hoje o que me cabe é: ${microActText}.

[MARCADORES SOMÁTICOS REGISTRADOS]
Marcadores assinalados: ${selectedFeelings.join(', ') || 'Nenhum'}
Descrição visceral da mudança: ${sensationText}
      `.trim();

      const auditData = {
        userId,
        userEmail: profile?.email || auth.currentUser?.email || '',
        journeyId: journey.id,
        isGrandeDia: true, 
        isSomaticAudit: true, 
        title: `Auditoria de Barreira Biológica: ${selectedPartLabel}`,
        goal: (journey.mabiGoal || 'dinheiro').toUpperCase(),
        activationLevel: 10,
        surpriseLevel: 10, 
        status: 'success',
        notes: auditSummary,
        createdAt: new Date().toISOString(),
        answers: {
          local_tensao_mapa: selectedPart,
          tempo_pausa_60s_cumprido: pausedCompleted,
          audio_frase_tocado: audioCompleted,
          sensacao_pos_mao: sensationText,
          selected_feelings: selectedFeelings,
          micro_ato: microActText,
          postura_concluida: allGuidanceChecked
        }
      };

      await addDoc(collection(db, 'mabi_actions'), auditData);
      onComplete();
    } catch (err) {
      console.error("Error saving exercise:", err);
      alert("Houve um erro técnico ao gravar o seu exercício.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="mabi-somatic-audit-container" className="max-w-3xl mx-auto py-2 font-sans text-white/95">
      
      {/* STEPS PROGRESS HEADER */}
      <div id="somatic-audit-header" className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
            {step}
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] font-bold block uppercase">
              Auditoria e Integração Somática
            </span>
            <h3 className="text-base font-serif text-white font-bold tracking-tight">
              {step === 1 ? "Fase I: Auditoria de Barreira Biológica" : "Fase II: Espectro de Bloqueio & Alarme (Resistência)"}
            </h3>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex gap-2">
          {[1, 2].map(s => (
            <button 
              id={`step-dot-btn-${s}`}
              key={s}
              onClick={() => {
                if (s < step) setStep(s as any);
              }}
              disabled={s > step}
              className={`h-1.5 w-12 rounded-full transition-all ${
                s === step 
                  ? 'bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.6)]' 
                  : s < step 
                    ? 'bg-[#D4AF37]/40 cursor-pointer' 
                    : 'bg-white/5 cursor-not-allowed'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* PHASE I: BARREIRA BIOLÓGICA */}
        {step === 1 && (
          <motion.div 
            key="phase1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="bg-[#121214] border border-[#D4AF37]/20 rounded-2xl p-5 md:p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wider uppercase text-[#D4AF37]">I. Auditoria de Barreira Biológica</h4>
                  <p className="text-[11px] text-white/50">Mapear onde no corpo se concentra a barreira física ao padrão sistêmico.</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/70">
                Se você compreende o padrão racionalmente, mas o seu corpo ainda responde com exaustão ou congelamento, a barreira é somática. Toque na silhueta corporal onde você sente essa contração física.
              </p>
            </div>

            <div className="grid md:grid-cols-[250px_1fr] gap-8 pt-2">
              
              {/* Hotspots body silhouette */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">Mapa do Corpo:</span>
                <div className="relative w-[210px] h-[390px] rounded-[30px] bg-[#0c0c0e] border border-white/5 p-3 shadow-2xl flex items-center justify-center">
                  <svg viewBox="0 0 200 340" className="w-full h-full select-none">
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Sliced guideline horizontal lines representing sliced levels */}
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
                      const isSelected = selectedPart === part.id;
                      return (
                        <g 
                          id={`body-part-g-${part.id}`}
                          key={part.id} 
                          onClick={() => handleSelectPart(part.id)}
                          className="cursor-pointer group"
                        >
                          {/* Main geometric rectangle */}
                          <rect
                            x={part.x}
                            y={part.y}
                            width={part.width}
                            height={part.height}
                            rx="6"
                            className={`transition-all duration-300 stroke-[1.5] ${
                              isSelected 
                                ? "fill-[#D4AF37] stroke-[#D4AF37]" 
                                : "fill-white/[0.03] stroke-white/20 hover:fill-white/[0.08] hover:stroke-[#D4AF37]/60"
                            }`}
                            style={isSelected ? { filter: "url(#glow)" } : {}}
                          />

                          {/* Fatia Code on Left */}
                          <text 
                            x="6" 
                            y={part.textY + 2} 
                            className={`text-[6px] font-mono transition-all duration-300 uppercase tracking-wider ${
                              isSelected ? "fill-[#D4AF37] font-bold" : "fill-white/40 group-hover:fill-white/70"
                            }`}
                          >
                            {part.fatiaCode}
                          </text>

                          {/* Left guideline */}
                          <line 
                            x1={part.leftLine.x1} 
                            y1={part.textY} 
                            x2={part.leftLine.x2} 
                            y2={part.textY} 
                            className={`stroke-[0.8] transition-all duration-300 ${
                              isSelected ? "stroke-[#D4AF37]" : "stroke-white/15 group-hover:stroke-white/40"
                            }`}
                            strokeDasharray="1.5,2"
                          />

                          {/* Right guideline */}
                          <line 
                            x1={part.rightLine.x1} 
                            y1={part.textY} 
                            x2={part.rightLine.x2} 
                            y2={part.textY} 
                            className={`stroke-[0.8] transition-all duration-300 ${
                              isSelected ? "stroke-[#D4AF37]" : "stroke-white/15 group-hover:stroke-white/40"
                            }`}
                            strokeDasharray="1.5,2"
                          />

                          {/* Label overlay centered on the slice */}
                          <text
                            x="100"
                            y={part.textY + 3.5}
                            textAnchor="middle"
                            className={`text-[9px] font-mono tracking-widest font-bold transition-all duration-300 pointer-events-none uppercase ${
                              isSelected 
                                ? "fill-black" 
                                : "fill-white/90 group-hover:fill-white"
                            }`}
                            style={isSelected ? { fill: "#000", fontWeight: "900" } : {}}
                          >
                            {part.id === 'pescoco' ? 'PESCOÇO' : part.label.toUpperCase()}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {selectedPart && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse whitespace-nowrap">
                      <span>✋</span> Coloque a mão aqui
                    </div>
                  )}
                </div>
              </div>

              {/* Timer & Guidance */}
              <div className="space-y-5">
                
                {/* Timer container */}
                <div className="rounded-2xl border border-white/5 bg-[#121214]/40 p-6 text-center space-y-4 shadow-xl">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] font-bold block uppercase">
                      Pausa Límbica Obrigatória
                    </span>
                    <h5 className="text-[11px] text-white/40">Mantenha a mão posicionada sobre o ponto de dor para desarmar a defesa biológica.</h5>
                  </div>

                  <div className="font-mono text-5xl font-extrabold tracking-tighter text-white py-2 bg-black/40 rounded-xl border border-white/5 max-w-[180px] mx-auto">
                    00:{String(timerCount).padStart(2, '0')}
                  </div>

                  {/* Progress line */}
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                      style={{ width: `${((60 - timerCount) / 60) * 100}%` }}
                    />
                  </div>

                  <div className="text-xs min-h-[32px] flex items-center justify-center text-white/70">
                    {!selectedPart ? (
                      <span className="text-white/30 italic">Toque em uma área do mapa corporal para disparar a contagem obrigatória.</span>
                    ) : isTimerRunning ? (
                      <span className="flex items-center gap-2 text-[#D4AF37] animate-pulse">
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        Toque firme no(a) {BODY_PARTS.find(p => p.id === selectedPart)?.label.toLowerCase()} — Apenas sinta.
                      </span>
                    ) : pausedCompleted ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Pausa de 60s devidamente cumprida.
                      </span>
                    ) : (
                      <span className="text-white/40">Selecione uma área para recalibrar.</span>
                    )}
                  </div>
                </div>

                {/* Connection helper */}
                <div className="rounded-xl bg-[#D4AF37]/[0.05] border border-[#D4AF37]/15 p-5 space-y-2 relative overflow-hidden">
                  <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">
                    Conexão Sistêmica (Texto de Empréstimo)
                  </span>
                  <p className="text-xs leading-relaxed text-[#E8E2D6] italic font-sans font-medium">
                    "Faz sentido doer aí. É lealdade antiga. Ficar com isso não é fraqueza — é o chão que seu sistema precisa."
                  </p>
                </div>

              </div>

            </div>

            {/* Step navigation buttons */}
            <div className="flex justify-end pt-6 border-t border-white/5 font-mono">
              <Button
                id="advance-phase2-btn"
                onClick={() => setStep(2)}
                disabled={!pausedCompleted}
                className={`h-[46px] rounded-full px-8 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2
                  ${pausedCompleted 
                    ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                    : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"}`}
              >
                Avançar para Correção {!pausedCompleted && `(${timerCount}s)`}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PHASE II: ESPECTRO DE BLOQUEIO & ALARME */}
        {step === 2 && (
          <motion.div 
            key="phase2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Rule Callout: Só faça depois da pausa 3.5. Corpo primeiro, palavra depois */}
            <div className="bg-[#121214] border-l-[3px] border-[#D4AF37] p-4 rounded-r-xl">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block">
                Ordem Clínica Crucial
              </span>
              <p className="text-xs text-white/80 font-sans italic mt-1">
                "Só faça depois da pausa 3.5. Corpo primeiro, palavra depois."
              </p>
            </div>

            {/* Checklist of Phonation requirements */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold uppercase">
                <Sparkle className="w-4 h-4 text-[#D4AF37]" />
                Instruções Físicas de Pronúncia (Marque para Integrar):
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Toque firme no peito, não leve.",
                  "Olhos abertos, pés no chão.",
                  "Sussurro, não grito. Sussurro registra.",
                  "Leia em voz baixa, uma por vez, sentindo a mão."
                ].map((instruction, idx) => (
                  <button
                    id={`guidance-check-btn-${idx}`}
                    key={idx}
                    type="button"
                    onClick={() => handleToggleGuidance(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left text-xs transition-all
                      ${checkedGuidance[idx]
                        ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-white'
                        : 'bg-white/[0.01] border-white/10 text-white/50 hover:border-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 text-[10px]
                      ${checkedGuidance[idx] ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold' : 'border-white/30 text-transparent'}`}
                    >
                      ✓
                    </div>
                    <span>{instruction}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TEXT SENTENCES PAGE - Text only as requested (No checkboxes) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D4AF37] uppercase block font-bold">
                  Sentenças de Integração Somática (Frases de Correção):
                </span>
                {loadingSymptoms && (
                  <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Carregando palavras do seu diagnóstico...
                  </span>
                )}
              </div>

              {/* The core parchment-like readable text layout */}
              <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0c0c0e] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden font-serif">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/[0.02] rounded-full blur-2xl pointer-events-none" />
                
                <div className="text-center pb-4 border-b border-white/5">
                  <p className="text-xs font-mono tracking-widest text-[#D4AF37]/70 uppercase font-bold">
                    Leia em voz baixa, uma por vez, sentindo a mão {selectedPartLabel ? `no(a) ${selectedPartLabel.toLowerCase()}` : "no lugar da tensão"}
                  </p>
                </div>

                <div className="space-y-6 text-white/95 text-sm md:text-base leading-relaxed pt-2">
                  <p className="border-b border-white/[0.03] pb-4">
                    <span className="font-mono text-xs text-[#D4AF37]/40 mr-2">1.</span>
                    O sofrimento de <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span> pertence à história de <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span>.
                  </p>

                  <p className="border-b border-white/[0.03] pb-4">
                    <span className="font-mono text-xs text-[#D4AF37]/40 mr-2">2.</span>
                    Eu não preciso repetir <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span> para honrar.
                  </p>

                  <p className="border-b border-white/[0.03] pb-4">
                    <span className="font-mono text-xs text-[#D4AF37]/40 mr-2">3.</span>
                    Me limitar não repara <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span>.
                  </p>

                  <p className="border-b border-white/[0.03] pb-4">
                    <span className="font-mono text-xs text-[#D4AF37]/40 mr-2">4.</span>
                    Me limitar não repara <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span> e me punir não devolve <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span>.
                  </p>

                  <p className="pb-2">
                    <span className="font-mono text-xs text-[#D4AF37]/40 mr-2">5.</span>
                    Hoje o que me cabe é <span className="font-sans text-[#D4AF37] font-bold border-b border-white/20 px-2 italic bg-white/[0.01]">_________</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* REFERENCE PANEL WITH MAPPED KEYWORDS */}
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 space-y-4 font-sans text-xs shadow-md">
              <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-wider">
                <span>💡</span>
                <span>Palavras-Chave do Seu Diagnóstico (Para Preencher as Lacunas)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wide">Lugar da Tensão</span>
                  <span className="text-[#D4AF37] font-medium text-sm capitalize">{selectedPartLabel}</span>
                </div>
                
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wide">Seu Ancestral / História</span>
                  <span className="text-white font-medium text-sm">{ancestorName}</span>
                </div>
                
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 md:col-span-2">
                  <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wide">Sintomas a parar de repetir</span>
                  <div className="text-white text-xs mt-1 space-y-1.5">
                    {symptomTexts.length > 0 ? (
                      symptomTexts.map((text, i) => (
                        <p key={i} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-[#D4AF37] shrink-0">•</span>
                          <span>{text}</span>
                        </p>
                      ))
                    ) : (
                      <p className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-[#D4AF37] shrink-0">•</span>
                        <span>{symptomPattern}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wide">Teto de Bloqueio (O que limitar)</span>
                  <span className="text-white font-medium text-xs">{goalTerm}</span>
                </div>
                
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wide">Recurso & Abundância (O que punir)</span>
                  <span className="text-white font-medium text-xs">{resourceTerm}</span>
                </div>
                
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 md:col-span-2">
                  <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wide">Seu Micro Ato (O que me cabe hoje)</span>
                  <span className="text-[#D4AF37] font-medium text-xs leading-relaxed">{microActText}</span>
                </div>
              </div>
            </div>

            {/* AUDIO REPEATER CONFIRMATION - Modern premium voice */}
            <div className="space-y-3 pt-1">
              <button
                id="play-somatic-audio-btn"
                type="button"
                disabled={!allGuidanceChecked}
                onClick={playSomaticConfirmation}
                className={`w-full h-[50px] rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all
                  ${!allGuidanceChecked
                    ? "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                    : isPlayingAudio 
                      ? "bg-white text-black shadow-lg animate-pulse" 
                      : "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-[0_0_20px_rgba(212,175,55,0.4)]"}`}
              >
                {isPlayingAudio ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    Ouvindo Confirmação com Voz Sistêmica Moderna...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4.5 h-4.5 text-black" />
                    Confirmar Leitura Somática (Ouvir Áudio Guia Completo)
                  </>
                )}
              </button>

              {/* Waveform Player */}
              {(isPlayingAudio || audioCompleted) && (
                <div className="rounded-xl border border-[#D4AF37]/20 bg-[#121214] p-4 flex gap-4 items-center animate-in fade-in duration-300">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPlayingAudio ? "bg-[#D4AF37]" : "bg-white/10"}`}>
                    <Play className={`w-3.5 h-3.5 ${isPlayingAudio ? "text-black fill-black" : "text-white"}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-[2px] items-center h-4">
                      {Array.from({ length: 35 }).map((_, i) => {
                        const isActive = isPlayingAudio && (i / 35) * 100 <= audioPlayedPercentage;
                        return (
                          <div 
                            key={i} 
                            className={`w-[2px] rounded-full transition-all duration-300
                              ${isActive 
                                ? "bg-[#D4AF37] animate-[wave_0.7s_ease-in-out_infinite]" 
                                : audioCompleted 
                                  ? "bg-[#D4AF37]/50" 
                                  : "bg-white/10"}`}
                            style={{ 
                              height: `${4 + Math.sin(i * 0.7) * 9 + Math.random() * 4}px`,
                              animationDelay: `${i * 0.03}s`
                            }}
                          />
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-white/40 font-mono">
                      {isPlayingAudio ? "Sintonia profunda — Absorva e ouça sua autorização." : "Leitura somática devidamente integrada pelo sistema límbico."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* WHATSAPP RECORDING CARD INTEGRATION */}
            {allGuidanceChecked && (
              <div className="bg-[#102a1e]/40 border border-emerald-500/25 rounded-2xl p-5 space-y-3 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold">Instrução de Integração Sistêmica</span>
                    <h4 className="text-xs text-white font-bold">Gravação no WhatsApp</h4>
                  </div>
                </div>
                <p className="text-xs text-white/85 leading-relaxed font-sans">
                  Grave no WhatsApp sua voz dizendo essas frases, com pausa entre elas. Ouça em loop 2 vezes seguidas. Deixe seu corpo ouvir sua própria autorização.
                </p>
              </div>
            )}

            {/* SOMATIC RESPONSE FEEDBACK */}
            {allGuidanceChecked && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 pt-2"
              >
                {/* Checklist Somática */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-white/50 uppercase block font-bold">O que sentiu no corpo depois de ler e falar a frase?</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SOMATIC_FEELINGS.map((feeling) => {
                      const isSelected = selectedFeelings.includes(feeling);
                      return (
                        <button
                          id={`feeling-btn-${feeling.replace(/\s+/g, '-').toLowerCase()}`}
                          key={feeling}
                          type="button"
                          onClick={() => handleToggleFeeling(feeling)}
                          className={`text-left px-4 py-2.5 rounded-full text-xs border transition-all flex items-center justify-between
                            ${isSelected 
                              ? "bg-[#D4AF37] border-[#D4AF37] text-black font-semibold shadow-md" 
                              : "bg-white/[0.02] border-white/10 text-white/70 hover:border-[#D4AF37]/35"}`}
                        >
                          <span className="truncate">{feeling}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/50 uppercase block font-bold">
                    Descreva em uma frase o que mudou no corpo depois da mão e da frase *
                  </label>
                  <textarea
                    id="somatic-sensation-textarea"
                    value={sensationText}
                    onChange={(e) => setSensationText(e.target.value)}
                    placeholder="Ex: Senti um calor forte abrindo meu peito, a mandíbula relaxou e consegui respirar fundo..."
                    rows={3}
                    className="w-full bg-[#121214] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none transition-all font-sans"
                  />
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/5 font-mono">
              <Button
                id="back-to-phase1-btn"
                onClick={() => setStep(1)}
                className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-full border-none transition-all"
              >
                Voltar
              </Button>

              <Button
                id="finish-somatic-exercise-btn"
                onClick={handleFinishExercise}
                disabled={saving || !allGuidanceChecked || sensationText.trim().length < 4}
                className={`h-[48px] rounded-full px-8 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2
                  ${!saving && allGuidanceChecked && sensationText.trim().length >= 4
                    ? "bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                    : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"}`}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Marcar Exercício Como Realizado e Finalizar
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Waves animations */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}
