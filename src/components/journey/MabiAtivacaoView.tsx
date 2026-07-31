import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  BookOpen, 
  Info, 
  ArrowRight,
  Zap,
  Dumbbell,
  HeartCrack,
  Activity,
  Check,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  HelpCircle,
  Eye,
  CheckSquare
} from 'lucide-react';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Journey, ProtocolResult } from '../../types';
import { PROTOCOLS } from '../../data/protocols';
import { MabiTherapeuticChronogram } from './MabiTherapeuticChronogram';
import { MabiAuditoriaSomatica } from './MabiAuditoriaSomatica';

interface MabiAtivacaoViewProps {
  journey: Journey;
  protocolHistory: ProtocolResult[];
  onSelectStaticProtocol?: (protocolId: string) => void;
}

interface WizardSession {
  step: number;
  answers: {
    // Step 1
    s1_avoidedAction: string;
    s1_prediction: string;
    s1_P: number;
    s1_C: number;
    // Step 2
    s2_neutralFact: string;
    s2_evidence: string;
    s2_P_new: number;
    // Step 3
    s3_microAction: string;
    s3_canDoToday: boolean;
    s3_P_before: number;
    s3_whatHappened: string;
    s3_E: number;
    s3_C_post: number;
    // Step 4
    s4_whatGains: string;
    s4_whatCost: string;
    s4_choice: 'old' | 'new' | null;
    // Step 5
    s5_safeAction: string;
    s5_repsDone: number;
    s5_confidence: number;
    // Step 6
    s6_expandedAction: string;
    s6_C_expanded: number;
    s6_E_expanded: number;
    // Step 7
    s7_trigger: string;
    s7_days: number;
  }
}

const INITIAL_ANSWERS: WizardSession['answers'] = {
  s1_avoidedAction: '',
  s1_prediction: '',
  s1_P: 5,
  s1_C: 5,
  s2_neutralFact: '',
  s2_evidence: '',
  s2_P_new: 5,
  s3_microAction: '',
  s3_canDoToday: true,
  s3_P_before: 5,
  s3_whatHappened: '',
  s3_E: 5,
  s3_C_post: 5,
  s4_whatGains: '',
  s4_whatCost: '',
  s4_choice: null,
  s5_safeAction: '',
  s5_repsDone: 0,
  s5_confidence: 5,
  s6_expandedAction: '',
  s6_C_expanded: 5,
  s6_E_expanded: 5,
  s7_trigger: '',
  s7_days: 7,
};

export function MabiAtivacaoView({ journey, protocolHistory, onSelectStaticProtocol }: MabiAtivacaoViewProps) {
  const [activeTab, setActiveTab] = useState<'grandedia' | 'auditoria' | 'cronograma'>('auditoria');
  const [session, setSession] = useState<WizardSession | null>(null);
  const [executions, setExecutions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const goal = journey.mabiGoal || 'dinheiro';
  const mAnswers = journey.mabiAnswers || {};

  // Active Ley
  const activeLivroRazao = mAnswers.passo4?.mabiInputs?.livro_razao_tipo || 'sacrificio';

  // Transgenerational resistance
  const selectedDebts = mAnswers.passo1?.selectedDebts || [];
  const contractStatement = mAnswers.passo1?.contractStatement || '';
  const transgeracionalResistance = Math.min(10, (selectedDebts.length * 2.5) + (contractStatement ? 2.5 : 0)) || 2;

  // Checked symptoms
  const checkedSymptoms = mAnswers.passo2?.checkedSymptoms || [];

  // Recommended protocols based on active Ley
  const getEmotionalProtocols = () => {
    switch (goal) {
      case 'dinheiro':
      case 'carreira':
        return ['culpa_sobrevivente', 'medo_ultrapassar'];
      case 'relacionamento':
        return ['culpa_separacao', 'medo_separacao'];
      case 'saude':
        return ['culpa_auto_odio', 'medo'];
      default:
        return ['culpa', 'medo'];
    }
  };

  const emotionalProtocolIds = getEmotionalProtocols();
  const completedProtocolsForThisJourney = protocolHistory.filter(ph => ph.journeyId === journey.id);
  
  // Pending recommended emotional protocols
  const pendingEmotionalProtocols = emotionalProtocolIds.filter(
    id => !completedProtocolsForThisJourney.some(ph => ph.protocolId === id)
  );

  const isFidelityCritical = transgeracionalResistance >= 5.0;
  const isEmotionalProtocolRecommended = isFidelityCritical && pendingEmotionalProtocols.length > 0;

  const [loadingSession, setLoadingSession] = useState(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session from Firestore on mount/journey.id change (with localStorage fallback)
  useEffect(() => {
    async function fetchSession() {
      const draftKey = `mabi_session_${journey.id}`;
      let loadedSession = null;

      // Try local storage first for speed
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          loadedSession = JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing saved session", e);
        }
      }

      // Sync with cloud draft
      const user = auth.currentUser;
      if (user) {
        try {
          const { getDoc, doc } = await import('firebase/firestore');
          const docId = `${user.uid}_${draftKey}`;
          const docSnap = await getDoc(doc(db, 'userDrafts', docId));
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            if (cloudData && cloudData.data) {
              loadedSession = cloudData.data;
            }
          }
        } catch (error) {
          console.warn("Failed to fetch cloud session:", error);
        }
      }

      setSession(loadedSession);
      setLoadingSession(false);
    }
    fetchSession();
  }, [journey.id]);

  // Save session to Firestore and localStorage when it changes
  useEffect(() => {
    if (loadingSession) return;

    const draftKey = `mabi_session_${journey.id}`;
    const user = auth.currentUser;

    if (session) {
      localStorage.setItem(draftKey, JSON.stringify(session));

      if (user) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(async () => {
          const docId = `${user.uid}_${draftKey}`;
          try {
            const { setDoc, doc } = await import('firebase/firestore');
            await setDoc(doc(db, 'userDrafts', docId), {
              userId: user.uid,
              draftKey,
              data: session,
              updatedAt: new Date().toISOString()
            });
          } catch (error) {
            console.warn("Failed to auto-save session:", error);
          }
        }, 800);
      }
    } else {
      localStorage.removeItem(draftKey);

      if (user) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(async () => {
          const docId = `${user.uid}_${draftKey}`;
          try {
            const { deleteDoc, doc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'userDrafts', docId));
          } catch (error) {
            console.warn("Failed to clear session:", error);
          }
        }, 50);
      }
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [session, journey.id, loadingSession]);

  // Listen to Grande Dia executions from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'mabi_actions'),
      where('userId', '==', user.uid),
      where('isGrandeDia', '==', true),
      where('journeyId', '==', journey.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsList: any[] = [];
      snapshot.forEach((doc) => {
        docsList.push({ id: doc.id, ...doc.data() });
      });
      docsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setExecutions(docsList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao escutar execuções do Grande Dia:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [journey.id]);

  // Compute stats: Level (1-4), successCount, blockCount
  const computeStats = () => {
    let level = 1;
    let successCount = 0;
    let blockCount = 0;

    // Chronological order (oldest first) to apply progression rules step-by-step
    const chronological = [...executions].reverse();
    chronological.forEach(exec => {
      if (exec.status === 'success') {
        const C_val = exec.activationLevel ?? 5;
        const E_val = exec.surpriseLevel ?? 5;
        const isStable = C_val <= 6 && E_val <= 6;
        
        if (isStable) {
          successCount += 1;
          blockCount = 0; // reset blocks on success
          if (successCount >= 3) {
            level = Math.min(4, level + 1);
            successCount = 0;
          }
        }
      } else if (exec.status === 'blocked') {
        blockCount += 1;
        successCount = 0; // break streak
        if (blockCount >= 3 || (exec.activationLevel >= 8)) {
          level = Math.max(1, level - 1);
          blockCount = 0;
        }
      }
    });

    return { level, successCount, blockCount };
  };

  const { level, successCount, blockCount } = computeStats();

  // Determine if consolidated
  const isConsolidated = level === 4 && executions.length > 0 && executions[0].status === 'success' && (executions[0].activationLevel <= 6);

  // Recent block alert
  const hasRecentBlock = executions.length > 0 && (executions[0].status === 'blocked' || executions[0].activationLevel >= 8);
  const hasTwoConsecutiveBlocks = executions.length >= 2 && executions[0].status === 'blocked' && executions[1].status === 'blocked';

  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1: return 'Nível 1: Micro-Ruptura';
      case 2: return 'Nível 2: Ruptura Relacional';
      case 3: return 'Nível 3: Ruptura Estrutural';
      case 4: return 'Nível 4: Consolidação';
      default: return `Nível ${lvl}`;
    }
  };

  const getSpecificCronogramaStep = () => {
    switch (activeLivroRazao) {
      case 'sacrificio':
        return {
          index: 1,
          title: 'Ativação Comportamental de Autoria',
          desc: 'Para recalibrar o sistema de recompensa e desarmar a exaustão por autopunição.',
          reason: 'A lei ativa de SACRIFÍCIO faz você acreditar que só merece existir se sofrer. Ativar prazer de forma deliberada quebra essa barreira.'
        };
      case 'injustica':
        return {
          index: 3,
          title: 'Externalização Narrativa',
          desc: 'Para separar sua identidade do papel de salvador ou apaziguador invisível.',
          reason: 'A lei ativa de INJUSTIÇA confunde você com as dívidas emocionais alheias. Nomear o fardo fora de si te liberta.'
        };
      case 'dor':
        return {
          index: 2,
          title: 'Imagery Rescripting (Reprogramação)',
          desc: 'Para neutralizar a voz crítica introjetada dos pais que cobra reparação de fardos de sofrimento.',
          reason: 'A lei ativa de DOR gera uma barreira somática reativa. Mudar o registro de imagens passadas restabelece o limite biológico.'
        };
      case 'renuncia':
        return {
          index: 4,
          title: 'Des-triangulação Boweniana / Diferenciação',
          desc: 'Para desfazer o papel de mediador e assumir os limites do seu próprio Self.',
          reason: 'A lei ativa de RENÚNCIA faz você se anular em prol de alianças simbióticas. Sair do triângulo familiar consolida sua autonomia.'
        };
      default:
        return {
          index: 1,
          title: 'Ativação Comportamental de Autoria',
          desc: 'Para quebrar o travamento de ação.',
          reason: 'Apoio tático básico do sistema clínico M.A.B.I.'
        };
    }
  };

  const specificSupportStep = getSpecificCronogramaStep();

  // Handle saving the full Great Day result to Firebase
  const handleCompleteSession = async (finalStatus: 'success' | 'blocked', isCalibrationOnly: boolean = false) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar logado.");
      return;
    }

    if (!session) return;

    setSaving(true);
    try {
      // Build notes string from all answers
      const customNotes = `
[Ação Evitada]: ${session.answers.s1_avoidedAction}
[Previsão nos 2m]: ${session.answers.s1_prediction} (P inicial: ${session.answers.s1_P}/10)
[Nível de Ativação (C)]: ${session.answers.s1_C}/10
[Fato Isolado]: ${session.answers.s2_neutralFact} (P após isolar: ${session.answers.s2_P_new}/10)
[Micro-Ruptura 10%]: ${session.answers.s3_microAction} (Previsão de Erro: ${session.answers.s3_P_before}/10)
[O que ocorreu de Fato]: ${session.answers.s3_whatHappened} (E: ${session.answers.s3_E}/10, C final: ${session.answers.s3_C_post}/10)
[Ganhos da Evitação]: ${session.answers.s4_whatGains}
[Custo de Evitar]: ${session.answers.s4_whatCost}
[Escolha]: ${session.answers.s4_choice === 'new' ? 'Avançar para Autoria' : 'Manter Padrão'}
[Prática de Calibragem 5x]: ${session.answers.s5_safeAction} (Confiança final: ${session.answers.s5_confidence}/10)
${isCalibrationOnly ? '[SESSÃO FINALIZADA NA CALIBRAGEM - SEM EXPANSÃO]' : `[Ação Expandida]: ${session.answers.s6_expandedAction} (C expandido: ${session.answers.s6_C_expanded}/10, E expandido: ${session.answers.s6_E_expanded}/10)
[Gatilho Diário]: ${session.answers.s7_trigger} (Plano de ${session.answers.s7_days} dias)`}
      `.trim();

      // Classificação automática da camada (Layer) interna com base em:
      // - Exposição social da ação (se houve Step 6 ou Step 7)
      // - Impacto estrutural da decisão (se s4_choice === 'new')
      // - Estabilidade emocional (se s3_C_post <= 6 e s3_E <= 6)
      // - Frequência de repetição (total de execuções no histórico)
      const repetitionCount = executions.length;
      const hasSocialExposure = !isCalibrationOnly && (!!session.answers.s6_expandedAction || !!session.answers.s7_trigger);
      const hasStructuralImpact = session.answers.s4_choice === 'new';
      const isEmotionallyStable = session.answers.s3_C_post <= 6 && session.answers.s3_E <= 6;

      let calculatedLayer: 1 | 2 | 3 | 4 = 1;
      if (repetitionCount >= 9 && hasSocialExposure && hasStructuralImpact && isEmotionallyStable) {
        calculatedLayer = 4; // Consolidação Identitária
      } else if (repetitionCount >= 6 && hasSocialExposure && hasStructuralImpact) {
        calculatedLayer = 3; // Ruptura Estrutural
      } else if (repetitionCount >= 3 || hasSocialExposure) {
        calculatedLayer = 2; // Ruptura Relacional
      } else {
        calculatedLayer = 1; // Micro-Ruptura
      }

      const layerNames = [
        'Micro-Ruptura',
        'Ruptura Relacional',
        'Ruptura Estrutural',
        'Consolidação Identitária'
      ];

      const actionData = {
        userId: user.uid,
        userEmail: user.email || '',
        journeyId: journey.id,
        isGrandeDia: true,
        activationLevel: finalStatus === 'success' ? session.answers.s3_C_post : session.answers.s1_C,
        surpriseLevel: finalStatus === 'success' ? session.answers.s3_E : 5,
        status: finalStatus,
        notes: customNotes,
        goal: goal.toUpperCase(),
        title: isCalibrationOnly 
          ? `Calibragem do Grande Dia: ${session.answers.s3_microAction || 'Ação de Desengajamento'}`
          : `Grande Dia: ${session.answers.s3_microAction || 'Ação de Desengajamento'}`,
        level,
        layer: calculatedLayer,
        layerName: layerNames[calculatedLayer - 1],
        isCalibrationOnly,
        answers: session.answers,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'mabi_actions'), actionData);

      if (finalStatus === 'success') {
        if (isCalibrationOnly) {
          setSuccessMessage(`Calibragem registrada com sucesso! Seu sistema límbico está se habituando com este micro-passo estável. Continue repetindo para acumular as 3 execuções necessárias e liberar a expansão.`);
        } else {
          setSuccessMessage("Sensacional! Seu ciclo completo de engenharia de ação foi registrado com sucesso. Seu sistema límbico recebeu um Erro de Previsão atualizador!");
        }
      } else {
        setSuccessMessage("Ciclo interrompido. Registramos a ativação límbica preventiva. O M.A.B.I. sugere focar no Cronograma de apoio antes de realizar novas rupturas.");
      }

      setSession(null);
      setTimeout(() => setSuccessMessage(null), 8000);
    } catch (err) {
      console.error("Erro ao salvar execução do Grande Dia:", err);
      alert("Houve um erro técnico ao registrar.");
    } finally {
      setSaving(false);
    }
  };

  const getLeiLabel = (lei: string) => {
    switch (lei) {
      case 'sacrificio': return 'Sacrifício Inconsciente';
      case 'injustica': return 'Injustiça Sistêmica';
      case 'dor': return 'Dor Transgeracional';
      case 'renuncia': return 'Renúncia e Exclusão';
      default: return 'Lealdade Familiar';
    }
  };

  const updateAnswer = (key: keyof WizardSession['answers'], value: any) => {
    if (!session) return;
    setSession({
      ...session,
      answers: {
        ...session.answers,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold">
            Eixo de Integração Comportamental
          </span>
          <h2 className="text-3xl font-serif text-white mt-3 flex items-center gap-2">
            <Flame className="w-8 h-8 text-gold animate-pulse" />
            Grande Dia
          </h2>
          <p className="text-sm text-white/50 mt-1 max-w-2xl font-sans">
            O ponto de desengajamento das alianças invisíveis e integração da sua identidade autoral.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start md:self-center font-mono text-xs">
          <button 
            onClick={() => {
              setActiveTab('auditoria');
              setSession(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'auditoria' 
                ? 'bg-gold text-black shadow-md' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Duplo Check Somático
            <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono font-bold">
              v1
            </span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('grandedia');
              setSession(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all ${
              activeTab === 'grandedia' 
                ? 'bg-gold text-black shadow-md' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Grande Dia
          </button>
          <button 
            onClick={() => setActiveTab('cronograma')}
            className={`px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'cronograma' 
                ? 'bg-gold text-black shadow-md' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Cronograma de Apoio
            {hasRecentBlock && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'grandedia' ? (
          <motion.div 
            key="grandedia"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* SAFETY BANNER */}
            {isEmotionalProtocolRecommended && !session && (
              <Card className="p-6 border-rose-500/20 bg-rose-500/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_20px_rgba(239,68,68,0.03)]">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 text-rose-400">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Alerta de Segurança Límbica</span>
                  </div>
                  <h4 className="text-base font-serif text-white font-medium">
                    Resistência Transgeracional Crítica Detectada ({transgeracionalResistance.toFixed(1)}/10)
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed max-w-2xl font-sans">
                    Seu clã familiar possui alianças profundas de escassez ou sacrifício. Para evitar autossabotagem severa, realize pelo menos um protocolo emocional recomendado antes de forçar o Grande Dia comportamental.
                  </p>
                  <div className="pt-2 text-xs font-mono text-gold/80 flex flex-wrap gap-x-4 gap-y-1">
                    <span>• Lei Ativa: <b className="text-white">{getLeiLabel(activeLivroRazao)}</b></span>
                    <span>• Sintomas no Espelho: <b className="text-white">{checkedSymptoms.length} ativos</b></span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {pendingEmotionalProtocols.map(id => {
                    const protocol = PROTOCOLS.find(p => p.id === id);
                    if (!protocol) return null;
                    return (
                      <Button
                        key={id}
                        onClick={() => onSelectStaticProtocol?.(id)}
                        className="bg-rose-500 hover:bg-rose-600 text-black font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-xl border-none flex items-center justify-center gap-2 font-mono"
                      >
                        Consolidar {protocol.code}
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </Button>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* CONSECUTIVE BLOCKS SUPPORT BANNER */}
            {hasTwoConsecutiveBlocks && !session && (
              <Card className="p-6 border-rose-500/20 bg-rose-500/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_20px_rgba(239,68,68,0.03)] animate-in fade-in duration-300">
                <div className="space-y-2 flex-1 font-sans">
                  <div className="flex items-center gap-2.5 text-rose-400">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Apoio Somático Preventivo</span>
                  </div>
                  <h4 className="text-base font-serif text-white font-medium">
                    Dois Bloqueios Consecutivos Detectados
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed max-w-2xl font-sans">
                    Identificamos travamentos consecutivos no seu histórico para a Lei Ativa: <b className="text-gold">{getLeiLabel(activeLivroRazao)}</b>.
                    Para desarmar essa resistência e restabelecer o limite biológico seguro sem sobrecarregar seu sistema límbico, sugerimos focar em um protocolo emocional de apoio antes de realizar novas ações comportamentais.
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {emotionalProtocolIds.map(id => {
                    const protocol = PROTOCOLS.find(p => p.id === id);
                    if (!protocol) return null;
                    return (
                      <Button
                        key={id}
                        onClick={() => onSelectStaticProtocol?.(id)}
                        className="bg-gold hover:bg-gold/90 text-black font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-xl border-none flex items-center justify-center gap-2 font-mono"
                      >
                        Executar {protocol.code}
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </Button>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Success message banner */}
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-start gap-3.5"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold uppercase font-mono block">Evolução Sistêmica Registrada</span>
                  <p className="leading-relaxed text-white/70 font-sans">{successMessage}</p>
                </div>
              </motion.div>
            )}

            {/* INTERACTIVE WIZARD OR WELCOME LAUNCHER */}
            {!session ? (
              <div className="space-y-8">
                
                {/* Unified Majestic Cockpit Card */}
                <Card className="p-8 border-gold/30 bg-gradient-to-br from-neutral-950 via-[#0e0e11] to-neutral-900 shadow-[0_0_50px_rgba(212,175,55,0.05)] relative overflow-hidden">
                  
                  {/* Absolute Glow Background Effect */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
                  
                  {/* Header Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                        <Flame className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gold uppercase tracking-widest block font-bold">Ponto de Integração Sistêmica</span>
                        <h3 className="text-xl font-serif text-white mt-0.5">O Cockpit do Grande Dia</h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {isConsolidated ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold">
                          Identidade Consolidada 👑
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold">
                          {getLevelName(level)}
                        </span>
                      )}
                      
                      <span className="text-[10px] bg-white/5 text-white/60 border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        Lealdade Ativa: {getLeiLabel(activeLivroRazao)}
                      </span>
                    </div>
                  </div>

                  {/* Main content grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
                    
                    {/* Left Column: The Prescription / planned action */}
                    <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Meta Sistêmica Pactuada</span>
                          <p className="text-base text-white/90 italic font-sans font-medium">
                            "{mAnswers.passo1?.goalTarget || 'Visualizar teto financeiro e permissão de avanço'}"
                          </p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">O Seu Ato de Diferenciação Autoral</span>
                          <p className="text-xl md:text-2xl text-gold font-serif font-medium leading-relaxed">
                            {mAnswers.passo4?.actionPlan || 'Executar uma ação direta de autoria que desafie o teto inconsciente herdado.'}
                          </p>
                          
                          {mAnswers.passo1?.ancestorName && (
                            <p className="text-xs text-white/50 font-mono pt-1">
                              Simbologia: Devolver com amor a herança de escassez/dor para <span className="text-rose-400 font-bold">{mAnswers.passo1.ancestorName}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-white/40 font-sans border-t border-white/5 pt-4 flex gap-2.5 items-start">
                        <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>Este é o ato prático de diferenciação que reorganiza seu sistema nervoso ao provocar um erro de previsão na sua biologia. Execute-o com atenção plena e absoluto silêncio perante o clã.</span>
                      </div>
                    </div>

                    {/* Right Column: Physiological Metrics & Launcher */}
                    <div className="lg:col-span-5 flex flex-col justify-between bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
                      
                      {/* Clinical indicators */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold">Status Clínico do Sistema</span>
                        
                        {/* Rupture indicator */}
                        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5">
                          <span className="text-white/60 font-sans">Nível de Ruptura</span>
                          <span className="font-mono text-white font-medium">{getLevelName(level)}</span>
                        </div>

                        {/* Estabilização indicators */}
                        <div className="space-y-1.5 border-b border-white/5 pb-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60 font-sans">Estabilização Límbica (Estabilidade)</span>
                            <span className="font-mono text-emerald-400 font-bold">{successCount}/3</span>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3].map(idx => (
                              <span 
                                key={idx} 
                                className={`h-1.5 flex-1 rounded ${
                                  idx <= successCount ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-white/10'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Bloqueios indicators */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60 font-sans">Bloqueios Somáticos (Bloqueios Clínicos)</span>
                            <span className="font-mono text-rose-400 font-bold">{blockCount}/3</span>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3].map(idx => (
                              <span 
                                key={idx} 
                                className={`h-1.5 flex-1 rounded ${
                                  idx <= blockCount ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-white/10'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Launch Button inside the card itself as primary integration point */}
                      <div className="pt-2">
                        <Button
                          onClick={() => setSession({ step: 1, answers: { ...INITIAL_ANSWERS } })}
                          className="w-full bg-gold hover:bg-gold/90 text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 border-none shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
                        >
                          <Play className="w-4 h-4 fill-black text-black" />
                          Iniciar Nova Execução
                        </Button>
                      </div>

                    </div>

                  </div>
                </Card>

                {/* HISTORY TABLE (Clean, non-cluttered timeline style) */}
                {executions.length > 0 && (
                  <Card className="p-6 border-white/5 bg-white/[0.005] space-y-4">
                    <h4 className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest">
                      Histórico de Auditorias de Ação ({executions.length})
                    </h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                      {executions.map((exec, idx) => (
                        <div key={exec.id || idx} className="p-4 bg-[#0c0c0e] border border-white/5 rounded-xl flex flex-col gap-2 text-xs font-sans">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-mono font-bold border ${
                                exec.status === 'success' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                {exec.status === 'success' ? 'SUCESSO' : 'TRAVAMENTO SOMÁTICO'}
                              </span>
                              <span className="text-[10px] text-white/30 font-mono">
                                {getLevelName(exec.level || 1)}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/30 font-mono">
                              {new Date(exec.createdAt).toLocaleDateString('pt-BR')} {new Date(exec.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {exec.answers?.s3_microAction && (
                            <p className="text-white/80 font-medium font-sans">
                              <b className="text-gold font-mono font-normal">Ação:</b> {exec.answers.s3_microAction}
                            </p>
                          )}

                          {exec.notes && (
                            <div className="bg-[#050507] p-2.5 rounded border border-white/5 text-[11px] text-white/50 whitespace-pre-line leading-relaxed font-mono">
                              {exec.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

              </div>
            ) : (
              /* WIZARD FLOW STATE ACTIVE */
              <Card className="p-6 md:p-8 border-gold/30 bg-[#0c0c0e] shadow-[0_0_40px_rgba(212,175,55,0.05)] space-y-8 max-w-3xl mx-auto">
                
                {/* Steps Visual Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gold uppercase tracking-widest font-bold">Operação {session.step} de 7</span>
                    <span className="text-white/40 uppercase tracking-widest">
                      {session.step === 1 && "Clarear a Ação"}
                      {session.step === 2 && "Ver os Fatos (Isolar)"}
                      {session.step === 3 && "Dar o Primeiro Passo (Testar)"}
                      {session.step === 4 && "Escolher de Verdade (Colapsar)"}
                      {session.step === 5 && "Ganhar Confiança (Calibrar)"}
                      {session.step === 6 && "Ir um Pouco Além (Expandir)"}
                      {session.step === 7 && "Tornar Automático (Gravar)"}
                    </span>
                  </div>
                  
                  {/* Step dots */}
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(s => (
                      <span 
                        key={s} 
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          s === session.step 
                            ? 'bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                            : s < session.step 
                              ? 'bg-gold/50' 
                              : 'bg-white/5'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: CLAREAR A AÇÃO */}
                  {session.step === 1 && (
                    <motion.div 
                      key="step1" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">1. CLAREAR A AÇÃO</span>
                        <h4 className="text-xl font-serif text-white">O que você está evitando agora?</h4>
                        <p className="text-xs text-white/40 font-sans">
                          A mente sistêmica reativa usa a invisibilidade e o travamento para fugir da culpa familiar. Vamos desarmar isso.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. Qual ação concreta você está evitando agora?</label>
                          <textarea
                            value={session.answers.s1_avoidedAction}
                            onChange={(e) => updateAnswer('s1_avoidedAction', e.target.value)}
                            placeholder="Ex: Cobrar o valor correto de um cliente, recusar um fardo de trabalho que não é meu, marcar aquela consulta médica crucial..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">2. O que você acredita (sua pior previsão catastrófica) que acontecerá nos próximos 2 minutos se executar essa ação?</label>
                          <textarea
                            value={session.answers.s1_prediction}
                            onChange={(e) => updateAnswer('s1_prediction', e.target.value)}
                            placeholder="Ex: Ele vai me achar ganancioso e sumir, serei demitido, meu corpo vai desmoronar, vou sofrer rejeição total..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-white/50 uppercase font-bold">3. De 0 a 10, quão certo você está dessa previsão catastrófica? (Previsão P)</span>
                            <span className="font-bold text-sm text-gold">{session.answers.s1_P}/10</span>
                          </div>
                          <input 
                            type="range" min="1" max="10" value={session.answers.s1_P} 
                            onChange={(e) => updateAnswer('s1_P', Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-white/50 uppercase font-bold">4. De 0 a 10, qual o seu nível de ativação somática / medo agora? (Ativação C)</span>
                            <span className={`font-bold text-sm ${session.answers.s1_C >= 8 ? 'text-rose-400' : 'text-gold'}`}>
                              {session.answers.s1_C}/10
                            </span>
                          </div>
                          <input 
                            type="range" min="1" max="10" value={session.answers.s1_C} 
                            onChange={(e) => updateAnswer('s1_C', Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                          />
                        </div>

                        {/* ALERT IF C >= 8 */}
                        {session.answers.s1_C >= 8 && (
                          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-rose-400 text-[11px] font-mono font-bold">
                              <ShieldAlert className="w-4 h-4 shrink-0" />
                              <span>ALERTA DE SEGURANÇA: ATIVAÇÃO MUITO ALTA</span>
                            </div>
                            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                              Seu cérebro límbico detectou um risco extremo de quebra de lealdade familiar ({session.answers.s1_C}/10). O sistema clínico M.A.B.I. recomenda interromper este ciclo para executar um protocolo emocional preventivo de desativação somática.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleCompleteSession('blocked')}
                                className="bg-rose-500 text-black font-bold uppercase tracking-wider text-[10px] py-2 px-4 rounded-lg border-none hover:bg-rose-600 transition-all font-mono"
                              >
                                Abortar Execução e Gravar Bloqueio
                              </Button>
                              {pendingEmotionalProtocols.length > 0 && (
                                <Button
                                  onClick={() => onSelectStaticProtocol?.(pendingEmotionalProtocols[0])}
                                  className="bg-white/10 text-white font-bold uppercase tracking-wider text-[10px] py-2 px-4 rounded-lg border-none hover:bg-white/20 transition-all font-mono"
                                >
                                  Acionar {pendingEmotionalProtocols[0].toUpperCase()}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={() => {
                            if (!session.answers.s1_avoidedAction || !session.answers.s1_prediction) {
                              alert("Por favor, preencha as respostas para continuar.");
                              return;
                            }
                            setSession({ ...session, step: 2 });
                          }}
                          className="bg-gold text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-none"
                        >
                          Avançar: Isolar Fatos
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: VER OS FATOS (ISOLAR) */}
                  {session.step === 2 && (
                    <motion.div 
                      key="step2" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">2. VER OS FATOS (ISOLAR)</span>
                        <h4 className="text-xl font-serif text-white">Separando Interpretação de Realidade</h4>
                        <p className="text-xs text-white/40 font-sans">
                          Sua biologia está reagindo a fantasias de catástrofe herdadas. Vamos isolar a realidade física da interpretação límbica.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. O que é fato observável de forma neutra nessa situação?</label>
                          <textarea
                            value={session.answers.s2_neutralFact}
                            onChange={(e) => updateAnswer('s2_neutralFact', e.target.value)}
                            placeholder="Ex: Vou enviar um e-mail com a proposta comercial no valor de R$ X.000 para o contato de WhatsApp do cliente. Isso é tudo."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">2. Onde está a evidência concreta e física do que você teme?</label>
                          <textarea
                            value={session.answers.s2_evidence}
                            onChange={(e) => updateAnswer('s2_evidence', e.target.value)}
                            placeholder="Ex: Não há nenhuma evidência física ou contrato anterior de que ele vai me expulsar ou me agredir por oferecer meu valor. É apenas um receio interno."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-white/50 uppercase font-bold">3. Agora, de 0 a 10, quão certo você está da sua previsão catastrófica? (Nova Confiança P)</span>
                            <span className="font-bold text-sm text-gold">{session.answers.s2_P_new}/10</span>
                          </div>
                          <input 
                            type="range" min="1" max="10" value={session.answers.s2_P_new} 
                            onChange={(e) => updateAnswer('s2_P_new', Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                          />
                        </div>

                        {/* WARNING IF P DID NOT REDUCE BY AT LEAST 1 */}
                        {session.answers.s2_P_new >= session.answers.s1_P && (
                          <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl flex gap-3">
                            <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                            <div className="space-y-1 text-[11px]">
                              <span className="font-bold text-gold font-mono uppercase block">Fusão de Realidade</span>
                              <p className="text-white/70 leading-relaxed font-sans">
                                Sua mente ainda está misturando interpretação com realidade física. Tente descrever apenas o que uma câmera de vídeo registraria (sem usar palavras como "ruim", "perigoso", "rejeitado"). Isole o fato mecânico.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4 font-mono">
                        <Button
                          onClick={() => setSession({ ...session, step: 1 })}
                          className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-xl border-none transition-all"
                        >
                          Voltar
                        </Button>
                        <Button
                          onClick={() => {
                            if (!session.answers.s2_neutralFact || !session.answers.s2_evidence) {
                              alert("Por favor, preencha as respostas para avançar.");
                              return;
                            }
                            setSession({ ...session, step: 3 });
                          }}
                          className="bg-gold text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-none"
                        >
                          Avançar: Planejar o Teste
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: DAR O PRIMEIRO PASSO (TESTAR) */}
                  {session.step === 3 && (
                    <motion.div 
                      key="step3" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">3. DAR O PRIMEIRO PASSO (TESTAR)</span>
                        <h4 className="text-xl font-serif text-white">Executar a Micro-Ruptura</h4>
                        <p className="text-xs text-white/40 font-sans">
                          A biologia só atualiza a previsão por meio de Erro de Experiência concreto. Vamos realizar uma versão contida da ação, para colher dados físicos.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. Qual é a menor versão possível dessa ação (10% do peso total) que ainda testa sua previsão?</label>
                          <textarea
                            value={session.answers.s3_microAction}
                            onChange={(e) => updateAnswer('s3_microAction', e.target.value)}
                            placeholder="Ex: Em vez de ligar brigando, vou enviar uma mensagem curta de texto solicitando a alteração da data da reunião..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#050507] rounded-xl border border-white/5">
                          <span className="text-[11px] text-white/60 font-medium">Essa ação mínima pode ser executada hoje, agora mesmo?</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateAnswer('s3_canDoToday', true)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border ${
                                session.answers.s3_canDoToday 
                                  ? 'bg-gold/10 text-gold border-gold/30' 
                                  : 'bg-transparent text-white/30 border-white/5'
                              }`}
                            >
                              Sim
                            </button>
                            <button
                              type="button"
                              onClick={() => updateAnswer('s3_canDoToday', false)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border ${
                                !session.answers.s3_canDoToday 
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                  : 'bg-transparent text-white/30 border-white/5'
                              }`}
                            >
                              Não
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-white/50 uppercase font-bold">Antes de agir: De 0 a 10, qual a probabilidade disso dar errado exatamente como você imagina? (P)</span>
                            <span className="font-bold text-sm text-gold">{session.answers.s3_P_before}/10</span>
                          </div>
                          <input 
                            type="range" min="1" max="10" value={session.answers.s3_P_before} 
                            onChange={(e) => updateAnswer('s3_P_before', Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                          />
                        </div>

                        <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold">
                            <Flame className="w-4 h-4 shrink-0 animate-pulse" />
                            <span>HORA DA EXECUÇÃO COMPORTAMENTAL</span>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            Faça uma pausa de 1 minuto, tome uma respiração profunda e <b>execute a micro-ruptura agora mesmo</b>. Quando terminar, preencha os dados reais abaixo:
                          </p>

                          <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">O que de fato aconteceu após a ação?</label>
                              <textarea
                                value={session.answers.s3_whatHappened}
                                onChange={(e) => updateAnswer('s3_whatHappened', e.target.value)}
                                placeholder="Descreva os fatos físicos observados. Ex: O cliente respondeu em 5 minutos dizendo que tudo bem e marcando outra data, ou ele apenas confirmou a leitura."
                                rows={2}
                                className="w-full bg-[#050507] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-white/50 uppercase font-bold">De 0 a 10, quão diferente foi do que você imaginava? (E)</span>
                                <span className="font-bold text-sm text-gold">{session.answers.s3_E}/10</span>
                              </div>
                              <input 
                                type="range" min="1" max="10" value={session.answers.s3_E} 
                                onChange={(e) => updateAnswer('s3_E', Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                              />
                              <div className="flex justify-between text-[8px] text-white/30 font-mono uppercase tracking-wider">
                                <span>1: Idêntico ao imaginado (catastrófico)</span>
                                <span>5: Moderadamente surpreso</span>
                                <span>10: Totalmente diferente (Seguro)</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-white/50 uppercase font-bold">De 0 a 10, qual sua ativação de medo pós-ação? (Ativação C)</span>
                                <span className={`font-bold text-sm ${session.answers.s3_C_post >= 8 ? 'text-rose-400' : 'text-gold'}`}>{session.answers.s3_C_post}/10</span>
                              </div>
                              <input 
                                type="range" min="1" max="10" value={session.answers.s3_C_post} 
                                onChange={(e) => updateAnswer('s3_C_post', Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* LIVE CALCULATION FEEDBACK FOR E */}
                        {session.answers.s3_whatHappened && (
                          <div className={`p-4 rounded-xl border text-xs font-sans ${
                            session.answers.s3_E < 3 
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                              : session.answers.s3_E >= 7 
                                ? 'bg-gold/10 border-gold/20 text-gold' 
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {session.answers.s3_E < 3 && "⚠️ Intensidade insuficiente. O fato foi idêntico ao esperado. Para atualizar seu cérebro, você precisará propor uma ação levemente mais ousada nas próximas vezes."}
                            {session.answers.s3_E >= 3 && session.answers.s3_E <= 6 && "⚡ Faixa ideal de surpresa! Seu sistema límbico está registrando dados que desafiam o teto de herança com segurança."}
                            {session.answers.s3_E >= 7 && "⚠️ Intensidade excessiva. O impacto foi muito forte ou desorganizador. Reduza a magnitude da ação de expansão para proteger sua regulação límbica."}
                          </div>
                        )}

                        {/* ALERT IF s3_C_post >= 8 */}
                        {session.answers.s3_C_post >= 8 && (
                          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-rose-400 text-[11px] font-mono font-bold">
                              <ShieldAlert className="w-4 h-4 shrink-0" />
                              <span>ALERTA DE SEGURANÇA: ATIVAÇÃO DE MEDO MUITO ALTA (C ≥ 8)</span>
                            </div>
                            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                              Seu nível de ativação de medo após a ação atingiu um patamar crítico ({session.answers.s3_C_post}/10). O sistema clínico M.A.B.I. recomenda interromper o ciclo para que você possa acionar o protocolo emocional de apoio correspondente à sua Lei ativa para desarmar a tensão somática.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleCompleteSession('blocked')}
                                className="bg-rose-500 text-black font-bold uppercase tracking-wider text-[10px] py-2 px-4 rounded-lg border-none hover:bg-rose-600 transition-all font-mono"
                              >
                                Abortar Execução e Gravar Bloqueio
                              </Button>
                              {pendingEmotionalProtocols.length > 0 && (
                                <Button
                                  onClick={() => onSelectStaticProtocol?.(pendingEmotionalProtocols[0])}
                                  className="bg-white/10 text-white font-bold uppercase tracking-wider text-[10px] py-2 px-4 rounded-lg border-none hover:bg-white/20 transition-all font-mono"
                                >
                                  Acionar {pendingEmotionalProtocols[0].toUpperCase()}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4 font-mono">
                        <Button
                          onClick={() => setSession({ ...session, step: 2 })}
                          className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-xl border-none transition-all"
                        >
                          Voltar
                        </Button>
                        <Button
                          disabled={session.answers.s3_C_post >= 8}
                          onClick={() => {
                            if (!session.answers.s3_microAction || !session.answers.s3_whatHappened) {
                              alert("Por favor, execute a ação e preencha as respostas para avançar.");
                              return;
                            }
                            setSession({ ...session, step: 4 });
                          }}
                          className={`font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-none transition-all ${
                            session.answers.s3_C_post >= 8
                              ? 'bg-white/5 text-white/20 cursor-not-allowed'
                              : 'bg-gold text-black hover:bg-gold/90'
                          }`}
                        >
                          Avançar: Colapsar Padrão
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: ESCOLHER DE VERDADE (COLAPSAR) */}
                  {session.step === 4 && (
                    <motion.div 
                      key="step4" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">4. ESCOLHER DE VERDADE (COLAPSAR)</span>
                        <h4 className="text-xl font-serif text-white">Ganhos Secundários vs Futuro de Autoria</h4>
                        <p className="text-xs text-white/40 font-sans">
                          Sustentar a lealdade invisível dá a ilusão de pertencer ao clã. Vamos explicitar esse balanço para tomar uma decisão autêntica.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. O que você ganha/ganhava emocionalmente ao continuar evitando essa ação?</label>
                          <textarea
                            value={session.answers.s4_whatGains}
                            onChange={(e) => updateAnswer('s4_whatGains', e.target.value)}
                            placeholder="Ex: Fico na zona de conforto, evito me sentir culpado perante a escassez dos meus pais, continuo protegido da exposição..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">2. Qual é o custo real e concreto de manter essa evitação a longo prazo?</label>
                          <textarea
                            value={session.answers.s4_whatCost}
                            onChange={(e) => updateAnswer('s4_whatCost', e.target.value)}
                            placeholder="Ex: Cansaço crônico, prejuízo financeiro acumulado, estagnação da carreira, dependência emocional..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">3. Você escolhe conscientemente manter o padrão antigo ou avançar para o novo nível de autoria?</label>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => updateAnswer('s4_choice', 'old')}
                              className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${
                                session.answers.s4_choice === 'old'
                                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                                  : 'bg-white/[0.01] border-white/5 text-white/40 hover:text-white/60'
                              }`}
                            >
                              <Lock className="w-5 h-5 shrink-0" />
                              Manter Padrão Antigo
                            </button>
                            <button
                              type="button"
                              onClick={() => updateAnswer('s4_choice', 'new')}
                              className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all ${
                                session.answers.s4_choice === 'new'
                                  ? 'bg-gold/15 border-gold/40 text-gold'
                                  : 'bg-white/[0.01] border-white/5 text-white/40 hover:text-white/60'
                              }`}
                            >
                              <Unlock className="w-5 h-5 shrink-0" />
                              Avançar na Autoria
                            </button>
                          </div>
                        </div>

                        {session.answers.s4_choice === 'old' && (
                          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
                            <p className="text-[11px] text-rose-400 leading-relaxed font-sans">
                              Você escolheu reter a evitação protetiva. Entendemos a necessidade de segurança sistêmica neste momento. Para desatar este nó emocional com cuidado, interromperemos o Grande Dia comportamental e o direcionaremos ao cronograma de estabilização.
                            </p>
                            <Button
                              onClick={() => handleCompleteSession('blocked')}
                              className="bg-rose-500 text-black font-bold uppercase tracking-wider text-[10px] py-2 px-4 rounded-lg border-none hover:bg-rose-600 transition-all font-mono"
                            >
                              Confirmar Travamento e Concluir
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4 font-mono">
                        <Button
                          onClick={() => setSession({ ...session, step: 3 })}
                          className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-xl border-none transition-all"
                        >
                          Voltar
                        </Button>
                        {session.answers.s4_choice === 'new' && (
                          <Button
                            onClick={() => {
                              if (!session.answers.s4_whatGains || !session.answers.s4_whatCost) {
                                alert("Por favor, preencha as respostas para avançar.");
                                return;
                              }
                              setSession({ ...session, step: 5 });
                            }}
                            className="bg-gold text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-none"
                          >
                            Avançar: Calibrar Confiança
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: GANHAR CONFIANÇA (CALIBRAR) */}
                  {session.step === 5 && (
                    <motion.div 
                      key="step5" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">5. GANHAR CONFIANÇA (CALIBRAR)</span>
                        <h4 className="text-xl font-serif text-white">Fixação de Micro-Padrão Confiável</h4>
                        <p className="text-xs text-white/40 font-sans">
                          A repetição sistemática sem erro habitua o corpo, reduzindo os picos de cortisol e o terror da deslealdade familiar.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. Qual parte dessa ação você tem 100% de convicção de conseguir executar sem erro algum?</label>
                          <textarea
                            value={session.answers.s5_safeAction}
                            onChange={(e) => updateAnswer('s5_safeAction', e.target.value)}
                            placeholder="Ex: Escrever o texto em um rascunho, ou revisar as faturas sem enviar para ninguém ainda."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        {/* Interactive Clicking Reps */}
                        <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold">
                            <Activity className="w-4 h-4 shrink-0 animate-pulse" />
                            <span>TREINO REPETITIVO DE CONFIANÇA</span>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            Pratique mentalmente ou execute fisicamente este micro-passo seguro <b>5 vezes consecutivas</b> para calmar sua resposta fisiológica. Toque nos blocos abaixo após cada repetição:
                          </p>

                          <div className="grid grid-cols-5 gap-2.5 pt-2">
                            {[1, 2, 3, 4, 5].map(rep => (
                              <button
                                key={rep}
                                type="button"
                                onClick={() => {
                                  if (session.answers.s5_repsDone >= rep) {
                                    updateAnswer('s5_repsDone', rep - 1);
                                  } else {
                                    updateAnswer('s5_repsDone', rep);
                                  }
                                }}
                                className={`p-3.5 rounded-xl border font-mono font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all ${
                                  session.answers.s5_repsDone >= rep
                                    ? 'bg-gold/15 border-gold/40 text-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]'
                                    : 'bg-[#050507] border-white/5 text-white/20 hover:text-white/40'
                                }`}
                              >
                                {session.answers.s5_repsDone >= rep ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  rep
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-white/50 uppercase font-bold">De 0 a 10, quão confiante e estável você se sente após as repetições?</span>
                            <span className="font-bold text-sm text-gold">{session.answers.s5_confidence}/10</span>
                          </div>
                          <input 
                            type="range" min="1" max="10" value={session.answers.s5_confidence} 
                            onChange={(e) => updateAnswer('s5_confidence', Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                          />
                        </div>

                        {session.answers.s5_confidence < 7 && session.answers.s5_repsDone === 5 && (
                          <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-sans">
                            💡 RECOMENDAÇÃO DE CALIBRAGEM: Sua confiança ainda está abaixo do patamar de estabilização ({session.answers.s5_confidence}/10). Reduza ainda mais a escala da ação até que pareça ridículo e você consiga praticar se sentindo seguro.
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 font-mono w-full justify-between">
                        <Button
                          onClick={() => setSession({ ...session, step: 4 })}
                          className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-xl border-none transition-all order-3 sm:order-1"
                        >
                          Voltar
                        </Button>
                        
                        <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                          <Button
                            onClick={() => {
                              if (!session.answers.s5_safeAction || session.answers.s5_repsDone < 5) {
                                alert("Por favor, pratique as 5 repetições e responda para registrar.");
                                return;
                              }
                              // Complete as Calibration Only
                              handleCompleteSession('success', true);
                            }}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-xl"
                          >
                            Estabilizar Micro-Passo
                          </Button>

                          <Button
                            onClick={() => {
                              if (!session.answers.s5_safeAction || session.answers.s5_repsDone < 5) {
                                alert("Por favor, pratique as 5 repetições e responda para avançar.");
                                return;
                              }
                              setSession({ ...session, step: 6 });
                            }}
                            className="bg-gold text-black font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded-xl border-none"
                          >
                            Avançar para Expansão
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 6: IR UM POUCO ALÉM (EXPANDIR) */}
                  {session.step === 6 && (
                    <motion.div 
                      key="step6" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">6. IR UM POUCO ALÉM (EXPANDIR)</span>
                        <h4 className="text-xl font-serif text-white">Ampliação Controlada do Teto</h4>
                        <p className="text-xs text-white/40 font-sans">
                          Tendo calibrado o sistema biológico, podemos dar um passo levemente mais ousado (15-20% do peso) para expandir permanentemente o limite do aceitável.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. Qual a próxima versão levemente mais desafiadora da ação você pode executar com segurança?</label>
                          <textarea
                            value={session.answers.s6_expandedAction}
                            onChange={(e) => updateAnswer('s6_expandedAction', e.target.value)}
                            placeholder="Ex: Em vez de apenas salvar o rascunho, enviar para 1 pessoa selecionada, ou falar de forma clara sobre seu preço sem rir ou gaguejar..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold">
                            <Dumbbell className="w-4 h-4 shrink-0 animate-pulse" />
                            <span>EXECUÇÃO DA EXPANSÃO DE LIMITE</span>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            Faça esta expansão prática agora e observe as reações corporais em tempo real. Depois, preencha as reações observadas:
                          </p>

                          <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-white/50 uppercase font-bold">De 0 a 10, qual foi o nível de ativação de ameaça desta vez? (C)</span>
                                <span className="font-bold text-sm text-gold">{session.answers.s6_C_expanded}/10</span>
                              </div>
                              <input 
                                type="range" min="1" max="10" value={session.answers.s6_C_expanded} 
                                onChange={(e) => updateAnswer('s6_C_expanded', Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-white/50 uppercase font-bold">De 0 a 10, quão diferente foi da catástrofe imaginada? (Erro E)</span>
                                <span className="font-bold text-sm text-gold">{session.answers.s6_E_expanded}/10</span>
                              </div>
                              <input 
                                type="range" min="1" max="10" value={session.answers.s6_E_expanded} 
                                onChange={(e) => updateAnswer('s6_E_expanded', Number(e.target.value))}
                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {session.answers.s6_C_expanded >= 8 && (
                          <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-sans">
                            ⚠️ ATIVAÇÃO EXCESSIVA: O passo de expansão excedeu seu limiar de segurança límbico ({session.answers.s6_C_expanded}/10). Na próxima sessão, recue a complexidade das ações para manter seu sistema estabilizado.
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4 font-mono">
                        <Button
                          onClick={() => setSession({ ...session, step: 5 })}
                          className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-xl border-none transition-all"
                        >
                          Voltar
                        </Button>
                        <Button
                          onClick={() => {
                            if (!session.answers.s6_expandedAction) {
                              alert("Por favor, preencha a resposta para avançar.");
                              return;
                            }
                            setSession({ ...session, step: 7 });
                          }}
                          className="bg-gold text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-none"
                        >
                          Avançar: Gravar Automação
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 7: TORNAR AUTOMÁTICO (GRAVAR) */}
                  {session.step === 7 && (
                    <motion.div 
                      key="step7" 
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }} 
                      className="space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-gold font-mono uppercase tracking-wider font-bold">7. TORNAR AUTOMÁTICO (GRAVAR)</span>
                        <h4 className="text-xl font-serif text-white">Ancorar Novo Padrão de Identidade</h4>
                        <p className="text-xs text-white/40 font-sans">
                          Gatilhos cotidianos claros e repetições diárias consolidam a fiação sináptica, transformando a autoria em seu novo piloto automático.
                        </p>
                      </div>

                      <div className="space-y-5 font-sans">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">1. Qual evento físico ou rotineiro específico será o gatilho automático para essa ação?</label>
                          <textarea
                            value={session.answers.s7_trigger}
                            onChange={(e) => updateAnswer('s7_trigger', e.target.value)}
                            placeholder="Ex: Sempre logo após ligar o meu computador no início da jornada de trabalho, ou ao abrir o aplicativo de faturamento nas terças-feiras..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-white/50 uppercase block font-bold">2. Por quantos dias seguidos você se compromete a repetir essa ação para gravá-la em suas marcas biológicas?</label>
                          <input 
                            type="number" min="7" max="90" value={session.answers.s7_days} 
                            onChange={(e) => updateAnswer('s7_days', Number(e.target.value))}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 transition-all font-sans"
                          />
                          <div className="flex justify-between text-[8px] text-white/30 font-mono uppercase tracking-wider pt-1">
                            <span>Sugerido mínimo: 7 dias</span>
                            <span>Ideal reconfiguração: 21 a 40 dias</span>
                          </div>
                        </div>

                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                          <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase block">Resumo do Estado Biológico</span>
                          <p className="text-[11px] text-white/70 leading-normal font-sans">
                            O ciclo demonstrou Erro de Previsão de {session.answers.s3_E}/10 e desativação somática com C de {session.answers.s3_C_post}/10. Seu sistema nervoso está pronto para registrar essa quebra de lealdade.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 font-mono">
                        <Button
                          onClick={() => setSession({ ...session, step: 6 })}
                          className="bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs px-5 py-2.5 rounded-xl border-none transition-all"
                        >
                          Voltar
                        </Button>
                        <Button
                          onClick={() => handleCompleteSession('success')}
                          disabled={saving}
                          className="bg-gold text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl border-none flex items-center gap-2"
                        >
                          {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          ) : (
                            <CheckSquare className="w-4 h-4 text-black" />
                          )}
                          Gravar Evolução Sistêmica
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )}

          </motion.div>
        ) : activeTab === 'auditoria' ? (
          <motion.div
            key="auditoria"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <MabiAuditoriaSomatica 
              journey={journey}
              userId={auth.currentUser?.uid || ''}
              profile={null}
              onComplete={() => {
                setActiveTab('grandedia');
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="cronograma"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {hasRecentBlock && (
              <Card className="p-6 border-rose-500/25 bg-rose-500/5 space-y-3.5">
                <div className="flex items-center gap-2.5 text-rose-400">
                  <Dumbbell className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Ferramenta Específica Recomendada</span>
                </div>
                <div>
                  <h4 className="text-base font-serif text-white font-semibold">
                    Seu sistema travou na Lei de <strong className="text-gold font-normal">{getLeiLabel(activeLivroRazao)}</strong>
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed mt-1 font-sans">
                    O M.A.B.I. determinou que a barreira geracional ativa exige que você realize o <b>Passo {specificSupportStep.index}: {specificSupportStep.title}</b> do cronograma abaixo para liberar as tensões somáticas antes de uma nova tentativa no Grande Dia.
                  </p>
                </div>
              </Card>
            )}

            <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-2xl">
              <MabiTherapeuticChronogram 
                journeyId={journey.id}
                journeyGoal={journey.mabiGoal || journey.name}
                onGoToProtocols={onSelectStaticProtocol ? () => onSelectStaticProtocol('culpa') : undefined}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
