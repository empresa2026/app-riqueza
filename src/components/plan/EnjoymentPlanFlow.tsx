import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  Crown, 
  ShieldAlert, 
  Heart, 
  Briefcase, 
  Activity, 
  TrendingUp, 
  Clock, 
  Printer, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Info,
  Eye,
  CornerDownRight,
  Brain
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, setDoc, limit, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestore';
import { cn } from '../../lib/utils';
import { EnjoymentPlanResult } from '../../types';
import { Fase1Contabilidade } from './fases/Fase1Contabilidade';
import { Fase2Sintomas } from './fases/Fase2Sintomas';
import { Fase3MatrizPrescricao } from './fases/Fase3MatrizPrescricao';
import { 
  AREAS, 
  SUBLEIS_SACRIFICIO, 
  SUBLEIS_INJUSTICA, 
  SUBLEIS_DOR, 
  SUBLEIS_RENUNCIA,
  resolveSubLawTexts
} from '../../data/planConstants';
export { AREAS, SUBLEIS_SACRIFICIO, SUBLEIS_INJUSTICA, SUBLEIS_DOR, SUBLEIS_RENUNCIA, resolveSubLawTexts };
import { MabiDiagnosticMatrix, CULPAS_INFO, MEDOS_INFO } from '../journey/MabiDiagnosticMatrix';

interface EnjoymentPlanFlowProps {
  userId: string;
  journeyId?: string;
  onComplete: () => void;
  onBack: () => void;
  mode?: 'aliancas' | 'padroes';
}

type FlowStep = 
  | 'intro'
  | 'intro_aliancas'
  | 'intro_padroes'
  | 'f1_sacrificio'
  | 'f1_injustica'
  | 'f1_dor'
  | 'f1_renuncia'
  | 'f2_sacrificio'
  | 'f2_injustica'
  | 'f2_dor'
  | 'f2_renuncia'
  | 'f3_matriz'
  | 'concluded';

const FlowStepPlaceholder = true;

const MATRIZ_LEIS = {
  sacrificio: {
    label: "1. SACRIFÍCIO",
    subLabel: "Lealdade Invisível (Terapia Contextual)",
    DINHEIRO: "A facilidade é imoral; sucesso exige exaustão.",
    AMOR: "O amor exige anulação e custo alto para ser real.",
    SAÚDE: "O corpo cobra a conta da hipervigilância.",
    CARREIRA: "Proibição sistêmica de ultrapassar quem sofreu."
  },
  injustica: {
    label: "2. INJUSTIÇA",
    subLabel: "A Contabilidade Familiar (Desequilíbrio de Justiça)",
    DINHEIRO: "O dinheiro foge para equilibrar o débito geracional.",
    AMOR: "A paz relacional incomoda; conflito é conexão.",
    SAÚDE: "Tensão crônica muscular e armadura somática.",
    CARREIRA: "Sabotagem no ápice: devolução da conquista."
  },
  dor: {
    label: "3. DOR",
    subLabel: "Memória Implícita (Registro Somático)",
    DINHEIRO: "A abundância ativa o alarme de sobrevivência.",
    AMOR: "Mesmo padrão de ferida, apenas com novo parceiro.",
    SAÚDE: "Adoecimento solidário quando a vida começa a fluir.",
    CARREIRA: "Limitação de performance pelo filtro do trauma."
  },
  renuncia: {
    label: "4. RENÚNCIA",
    subLabel: "Massa de Ego / Fusão (Diferenciação)",
    DINHEIRO: "Incapacidade biológica de cobrar o real valor.",
    AMOR: "Culpa iminente por ter um vínculo conjugal leve.",
    SAÚDE: "Fadiga inexplicável sem causa orgânica aparente.",
    CARREIRA: "Invisibilidade estratégica; esconder o próprio talento."
  }
};



export function EnjoymentPlanFlow({ userId, journeyId, onComplete, onBack, mode }: EnjoymentPlanFlowProps) {
  const [step, setStep] = useState<FlowStep>(
    mode === 'aliancas' ? 'intro_aliancas' : mode === 'padroes' ? 'intro_padroes' : 'intro'
  );
  const [saving, setSaving] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Form State
  const [fase1, setFase1] = useState({
    sacrificio: { areas: [] as string[], familiar: '', fatos: '' },
    injustica: { areas: [] as string[], familiar: '', fatos: '' },
    dor: { areas: [] as string[], familiar: '', fatos: '' },
    renuncia: { areas: [] as string[], familiar: '', fatos: '' }
  });

  const [sintomas, setSintomas] = useState({
    sacrificio: [] as number[],
    injustica: [] as number[],
    dor: [] as number[],
    renuncia: [] as number[]
  });

  // Clinical Map State variables
  const [smadAlarm, setSmadAlarm] = useState<string>('');
  const [dramaticRoleState, setDramaticRoleState] = useState<string>('');
  const [tacticalAction, setTacticalAction] = useState<string>('');
  const [executionPlan, setExecutionPlan] = useState<string>('');
  const [customVisceralSensation, setCustomVisceralSensation] = useState<string>('');
  const [actionCompleted, setActionCompleted] = useState<boolean>(false);

  // Dynamic automatic crossing calculation from answers
  const autoInputs = useMemo(() => {
    const areaCounts: Record<string, number> = { DINHEIRO: 0, AMOR: 0, SAÚDE: 0, CARREIRA: 0 };
    let highestLaw: 'sacrificio' | 'injustica' | 'dor' | 'renuncia' = 'sacrificio';
    let maxSintomas = -1;

    (Object.keys(fase1) as Array<keyof typeof fase1>).forEach(lawKey => {
      fase1[lawKey].areas.forEach(area => {
        if (areaCounts[area] !== undefined) areaCounts[area]++;
      });
      const numSintomas = sintomas[lawKey]?.length || 0;
      if (numSintomas > maxSintomas) {
        maxSintomas = numSintomas;
        highestLaw = lawKey;
      }
    });

    let primaryArea = 'DINHEIRO';
    let maxAreaCount = -1;
    Object.entries(areaCounts).forEach(([area, count]) => {
      if (count > maxAreaCount) {
        maxAreaCount = count;
        primaryArea = area;
      }
    });

    let autoCulpa = 'Sobrevivente';
    if (highestLaw === 'sacrificio') autoCulpa = 'Sobrevivente';
    else if (highestLaw === 'injustica') autoCulpa = 'Responsavel';
    else if (highestLaw === 'dor') autoCulpa = 'AutoOdio_controle';
    else if (highestLaw === 'renuncia') autoCulpa = 'Deslealdade';

    let autoMedo = 'Exposicao';
    if (highestLaw === 'sacrificio') autoMedo = 'Isolamento';
    else if (highestLaw === 'injustica') autoMedo = 'Exposicao';
    else if (highestLaw === 'dor') autoMedo = 'Subjugacao';
    else if (highestLaw === 'renuncia') autoMedo = 'Invasao';

    let autoSomatica = 'Paralisia';
    if (highestLaw === 'sacrificio') autoSomatica = 'Exaustao';
    else if (highestLaw === 'injustica') autoSomatica = 'Hiper';
    else if (highestLaw === 'dor') autoSomatica = 'Paralisia';
    else if (highestLaw === 'renuncia') autoSomatica = 'Dissociacao';

    let autoArqui = 'Denso';
    if (primaryArea === 'DINHEIRO') autoArqui = 'Articulador';
    else if (primaryArea === 'AMOR') autoArqui = 'Simbiotico';
    else if (primaryArea === 'CARREIRA') autoArqui = 'Cefalico';
    else if (primaryArea === 'SAÚDE') autoArqui = 'Denso';

    let autoSinal = 'Nenhum';
    const numSintomas = sintomas[highestLaw]?.length || 0;
    if (numSintomas > 0) {
      if (highestLaw === 'sacrificio') autoSinal = 'eu sou quem sacrifica';
      else if (highestLaw === 'renuncia') autoSinal = 'não vejo sentido';
    }

    return {
      culpa: autoCulpa,
      arquitetura: autoArqui,
      medo: autoMedo,
      somatica: autoSomatica,
      livroTipo: highestLaw,
      sinalClinico: autoSinal,
      credorAcessivel: false
    };
  }, [fase1, sintomas]);

  const activeCulpa = autoInputs.culpa;
  const activeArquitetura = autoInputs.arquitetura;
  const activeMedo = autoInputs.medo;
  const activeSomatica = autoInputs.somatica;
  const activeLivroRazao = autoInputs.livroTipo;
  const activeSinalClinico = autoInputs.sinalClinico;
  const activeCredorAcessivel = autoInputs.credorAcessivel;

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing draft or completed plan
  useEffect(() => {
    async function loadDraft() {
      try {
        // Try to load from localStorage first as an instant, reliable backup
        const localSaved = localStorage.getItem(`enjoyment_plan_local_draft_${userId}_${journeyId || 'general'}`);
        let hasLocalBackup = false;
        if (localSaved) {
          try {
            const localData = JSON.parse(localSaved);
            if (localData.fase1) setFase1(localData.fase1);
            if (localData.sintomas) setSintomas(localData.sintomas);
            
            let loadedStep = localData.currentStep as FlowStep;
            if (mode === 'aliancas') {
              if (!loadedStep || !loadedStep.startsWith('f1_')) {
                loadedStep = 'intro_aliancas';
              }
            } else if (mode === 'padroes') {
              if (!loadedStep || !loadedStep.startsWith('f2_')) {
                loadedStep = 'intro_padroes';
              }
            }
            setStep(loadedStep || (mode === 'aliancas' ? 'intro_aliancas' : mode === 'padroes' ? 'intro_padroes' : 'intro'));

            if (localData.clinicalMap) {
              if (localData.clinicalMap.smadAlarm) setSmadAlarm(localData.clinicalMap.smadAlarm);
              if (localData.clinicalMap.dramaticRole) setDramaticRoleState(localData.clinicalMap.dramaticRole);
              if (localData.clinicalMap.tacticalAction) setTacticalAction(localData.clinicalMap.tacticalAction);
              if (localData.clinicalMap.executionPlan) setExecutionPlan(localData.clinicalMap.executionPlan);
              if (localData.clinicalMap.visceralSensation) setCustomVisceralSensation(localData.clinicalMap.visceralSensation);
              if (localData.clinicalMap.actionCompleted !== undefined) setActionCompleted(localData.clinicalMap.actionCompleted);
            }
            hasLocalBackup = true;
          } catch (e) {
            console.error("Error parsing local draft", e);
          }
        }

        // 1. Try to find a draft for this specific journey in Firestore to sync
        let q = query(
          collection(db, 'enjoymentPlanDrafts'), 
          where('userId', '==', userId),
          where('journeyId', '==', journeyId || null),
          limit(1)
        );
        let snapshot = await getDocs(q);
        
        // If not found and we are inside a journey, try to find a general draft
        if (snapshot.empty && journeyId) {
          q = query(
            collection(db, 'enjoymentPlanDrafts'), 
            where('userId', '==', userId),
            where('journeyId', '==', null),
            limit(1)
          );
          snapshot = await getDocs(q);
        }

        if (!snapshot.empty) {
          const draftDoc = snapshot.docs[0];
          const data = draftDoc.data();
          setDraftId(draftDoc.id);
          
          // Only overwrite local backup with cloud draft if cloud draft has data and local backup didn't exist
          if (!hasLocalBackup) {
            if (data.fase1) setFase1(data.fase1);
            if (data.sintomas) setSintomas(data.sintomas);
            
            let loadedStep = data.currentStep as FlowStep;
            if (mode === 'aliancas') {
              if (!loadedStep || !loadedStep.startsWith('f1_')) {
                loadedStep = 'intro_aliancas';
              }
            } else if (mode === 'padroes') {
              if (!loadedStep || !loadedStep.startsWith('f2_')) {
                loadedStep = 'intro_padroes';
              }
            }
            setStep(loadedStep || (mode === 'aliancas' ? 'intro_aliancas' : mode === 'padroes' ? 'intro_padroes' : 'intro'));

            if (data.clinicalMap) {
              if (data.clinicalMap.smadAlarm) setSmadAlarm(data.clinicalMap.smadAlarm);
              if (data.clinicalMap.dramaticRole) setDramaticRoleState(data.clinicalMap.dramaticRole);
              if (data.clinicalMap.tacticalAction) setTacticalAction(data.clinicalMap.tacticalAction);
              if (data.clinicalMap.executionPlan) setExecutionPlan(data.clinicalMap.executionPlan);
              if (data.clinicalMap.visceralSensation) setCustomVisceralSensation(data.clinicalMap.visceralSensation);
              if (data.clinicalMap.actionCompleted !== undefined) setActionCompleted(data.clinicalMap.actionCompleted);
            }
          }
        } else if (!hasLocalBackup) {
          // 2. No draft, try to find a completed plan for this specific journey
          const planQuery = query(
            collection(db, 'enjoymentPlans'),
            where('userId', '==', userId),
            where('journeyId', '==', journeyId || null)
          );
          let planSnapshot = await getDocs(planQuery);
          let planDocs = planSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

          // If not found and we are inside a journey, try to find a general completed plan
          if (planDocs.length === 0 && journeyId) {
            const generalPlanQuery = query(
              collection(db, 'enjoymentPlans'),
              where('userId', '==', userId),
              where('journeyId', '==', null)
            );
            planSnapshot = await getDocs(generalPlanQuery);
            planDocs = planSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          }

          if (planDocs.length > 0) {
            // Sort by createdAt desc in memory
            planDocs.sort((a: any, b: any) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });
            const planData = planDocs[0];
            if (planData.fase1) setFase1(planData.fase1);
            if (planData.sintomas) setSintomas(planData.sintomas);
            if (planData.clinicalMap) {
              if (planData.clinicalMap.smadAlarm) setSmadAlarm(planData.clinicalMap.smadAlarm);
              if (planData.clinicalMap.dramaticRole) setDramaticRoleState(planData.clinicalMap.dramaticRole);
              if (planData.clinicalMap.tacticalAction) setTacticalAction(planData.clinicalMap.tacticalAction);
              if (planData.clinicalMap.executionPlan) setExecutionPlan(planData.clinicalMap.executionPlan);
              if (planData.clinicalMap.visceralSensation) setCustomVisceralSensation(planData.clinicalMap.visceralSensation);
              if (planData.clinicalMap.actionCompleted !== undefined) setActionCompleted(planData.clinicalMap.actionCompleted);
            }
            
            if (mode === 'aliancas') {
              setStep('f1_sacrificio');
            } else if (mode === 'padroes') {
              setStep('f2_sacrificio');
            } else {
              setStep('f3_matriz'); // Jump directly to completed structural matrix view!
            }
          }
        }
      } catch (error) {
        console.error('Error loading draft or completed plan:', error);
      } finally {
        setLoadingDraft(false);
      }
    }
    loadDraft();
  }, [userId, journeyId]);

  // Auto-populate clinical map defaults based on user selections
  useEffect(() => {
    if (step === 'f3_matriz') {
      const areaCounts: Record<string, number> = { DINHEIRO: 0, AMOR: 0, SAÚDE: 0, CARREIRA: 0 };
      let highestLaw: 'sacrificio' | 'injustica' | 'dor' | 'renuncia' | null = null;
      let maxSintomas = -1;

      (Object.keys(fase1) as Array<keyof typeof fase1>).forEach(lawKey => {
        fase1[lawKey].areas.forEach(area => {
          if (areaCounts[area] !== undefined) areaCounts[area]++;
        });
        const numSintomas = sintomas[lawKey].length;
        if (numSintomas > maxSintomas) {
          maxSintomas = numSintomas;
          highestLaw = lawKey;
        }
      });

      let primaryArea = 'DINHEIRO';
      let maxAreaCount = -1;
      Object.entries(areaCounts).forEach(([area, count]) => {
        if (count > maxAreaCount) {
          maxAreaCount = count;
          primaryArea = area;
        }
      });

      // 1. SMAD Alarm
      if (!smadAlarm) {
        if (highestLaw === 'sacrificio') setSmadAlarm('Culpa do Sobrevivente (Necessidade de Exaustão)');
        else if (highestLaw === 'injustica') setSmadAlarm('Tensão de Autossabotagem (Medo de Receber)');
        else if (highestLaw === 'dor') setSmadAlarm('Alerta de Perigo de Sucesso (Medo Somático)');
        else if (highestLaw === 'renuncia') setSmadAlarm('Medo da Exposição e Exclusão (Invisibilidade)');
        else setSmadAlarm('Culpa do Sobrevivente (Sinal de Alerta)');
      }

      // 2. Dramatic Role
      if (!dramaticRoleState) {
        if (highestLaw === 'sacrificio') setDramaticRoleState('O Salvador (Carregar os fardos da família)');
        else if (highestLaw === 'injustica') setDramaticRoleState('A Vítima (Sentir-se injustiçado ou traído)');
        else if (highestLaw === 'dor') setDramaticRoleState('O Amortecedor (Gastar energia absorvendo crises)');
        else if (highestLaw === 'renuncia') setDramaticRoleState('O Invisível (Anular-se para salvar os outros)');
        else setDramaticRoleState('O Salvador (Compensador Sistêmico)');
      }

      // 3. Tactical Action
      if (!tacticalAction) {
        if (primaryArea === 'DINHEIRO') {
          setTacticalAction('Cobrar o valor real do trabalho e sustentar a culpa de reter o lucro sem criar imprevistos financeiros.');
        } else if (primaryArea === 'AMOR') {
          setTacticalAction('Permitir-se viver uma relação sem dramas e sustentar o tédio temporário de uma paz conjugal leve.');
        } else if (primaryArea === 'SAÚDE') {
          setTacticalAction('Estabelecer limites claros de trabalho e repousar voluntariamente sem precisar adoecer para ter desculpa.');
        } else {
          setTacticalAction('Assumir um papel de destaque profissional, aceitando prêmios e validações sem se esconder.');
        }
      }

      // 4. Execution Plan
      if (!executionPlan) {
        if (primaryArea === 'DINHEIRO') {
          setExecutionPlan('Vou ajustar minha tabela de preços em pelo menos 20% e suportar a ansiedade corporal de cobrar mais caro de um cliente.');
        } else if (primaryArea === 'AMOR') {
          setExecutionPlan('Vou desfrutar de um final de semana inteiro sem tocar em assuntos de crise, dívida ou problemas familiares com o parceiro.');
        } else if (primaryArea === 'SAÚDE') {
          setExecutionPlan('Vou desligar o celular aos domingos por 4 horas seguidas apenas para desfrutar de lazer e ócio puro.');
        } else {
          setExecutionPlan('Vou apresentar uma ideia inovadora ou postar um texto autoral assinado por mim nas minhas redes profissionais.');
        }
      }

      // 5. Custom Visceral Sensation
      if (!customVisceralSensation) {
        if (highestLaw === 'sacrificio') setCustomVisceralSensation('Aperto no peito e cansaço constante');
        else if (highestLaw === 'injustica') setCustomVisceralSensation('Tensão forte na mandíbula e ombros rígidos');
        else if (highestLaw === 'dor') setCustomVisceralSensation('Nó na garganta e respiração muito curta');
        else if (highestLaw === 'renuncia') setCustomVisceralSensation('Sensação de invisibilidade e peso nas costas');
        else setCustomVisceralSensation('Frio na barriga e hipervigilância física');
      }
    }
  }, [step, fase1, sintomas, smadAlarm, dramaticRoleState, tacticalAction, executionPlan, customVisceralSensation]);

  // Debounced auto-save draft
  const saveDraft = async (currentStep: FlowStep, updatedF1 = fase1, updatedSintomas = sintomas) => {
    if (currentStep === 'concluded') return;
    try {
      const draftData = {
        userId,
        journeyId: journeyId || null,
        fase1: updatedF1,
        sintomas: updatedSintomas,
        clinicalMap: {
          smadAlarm,
          dramaticRole: dramaticRoleState,
          tacticalAction,
          executionPlan,
          visceralSensation: customVisceralSensation,
          actionCompleted,
          mabiInputs: {
            culpa: activeCulpa,
            arquitetura: activeArquitetura,
            medo: activeMedo,
            somatica: activeSomatica,
            livro_razao_tipo: activeLivroRazao,
            sinalClinico: activeSinalClinico,
            credor_acessivel: activeCredorAcessivel
          }
        },
        currentStep,
        updatedAt: new Date().toISOString()
      };

      if (draftId) {
        await updateDoc(doc(db, 'enjoymentPlanDrafts', draftId), draftData);
      } else {
        const newDoc = await addDoc(collection(db, 'enjoymentPlanDrafts'), draftData);
        setDraftId(newDoc.id);
      }
    } catch (error) {
      console.warn('Silent auto-save failed:', error);
    }
  };

  // Sync to localStorage as high-availability real-time backup
  useEffect(() => {
    if (loadingDraft) return;
    const draftData = {
      fase1,
      sintomas,
      currentStep: step,
      clinicalMap: {
        smadAlarm,
        dramaticRole: dramaticRoleState,
        tacticalAction,
        executionPlan,
        visceralSensation: customVisceralSensation,
        actionCompleted
      }
    };
    localStorage.setItem(`enjoyment_plan_local_draft_${userId}_${journeyId || 'general'}`, JSON.stringify(draftData));
  }, [fase1, sintomas, step, smadAlarm, dramaticRoleState, tacticalAction, executionPlan, customVisceralSensation, actionCompleted, userId, journeyId, loadingDraft]);

  // Reactive Firestore Auto-save on ANY user interaction
  useEffect(() => {
    if (loadingDraft) return;
    triggerAutoSave(step);
  }, [
    fase1,
    sintomas,
    step,
    smadAlarm,
    dramaticRoleState,
    tacticalAction,
    executionPlan,
    customVisceralSensation,
    actionCompleted
  ]);

  const triggerAutoSave = (nextStep: FlowStep, nextF1 = fase1, nextSintomas = sintomas) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft(nextStep, nextF1, nextSintomas);
    }, 1000);
  };

  const handleNext = (nextStep: FlowStep) => {
    setStep(nextStep);
    triggerAutoSave(nextStep);
  };

  const handleBack = (prevStep: FlowStep) => {
    setStep(prevStep);
    triggerAutoSave(prevStep);
  };

  const toggleFase1Area = (law: keyof typeof fase1, area: string) => {
    const currentAreas = fase1[law].areas;
    const nextAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area];
    
    const nextF1 = {
      ...fase1,
      [law]: { ...fase1[law], areas: nextAreas }
    };
    setFase1(nextF1);
    triggerAutoSave(step, nextF1);
  };

  const updateFase1Text = (law: keyof typeof fase1, field: 'familiar' | 'fatos', value: string) => {
    const nextF1 = {
      ...fase1,
      [law]: { ...fase1[law], [field]: value }
    };
    setFase1(nextF1);
    triggerAutoSave(step, nextF1);
  };

  const toggleSintoma = (law: keyof typeof sintomas, index: number) => {
    const current = sintomas[law];
    const nextSintomas = current.includes(index)
      ? current.filter(i => i !== index)
      : [...current, index];
    
    const nextSintomasState = {
      ...sintomas,
      [law]: nextSintomas
    };
    setSintomas(nextSintomasState);
    triggerAutoSave(step, fase1, nextSintomasState);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const result = {
        userId,
        journeyId: journeyId || null,
        fase1,
        sintomas,
        clinicalMap: {
          smadAlarm,
          dramaticRole: dramaticRoleState,
          tacticalAction,
          executionPlan,
          visceralSensation: customVisceralSensation,
          actionCompleted,
          mabiInputs: {
            culpa: activeCulpa,
            arquitetura: activeArquitetura,
            medo: activeMedo,
            somatica: activeSomatica,
            livro_razao_tipo: activeLivroRazao,
            sinalClinico: activeSinalClinico,
            credor_acessivel: activeCredorAcessivel
          }
        },
        createdAt: new Date().toISOString()
      };

      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

      await addDoc(collection(db, 'enjoymentPlans'), result);

      if (draftId) {
        await deleteDoc(doc(db, 'enjoymentPlanDrafts', draftId));
        setDraftId(null);
      }

      // Clear local backup on finish
      localStorage.removeItem(`enjoyment_plan_local_draft_${userId}_${journeyId || 'general'}`);

      setStep('concluded');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'enjoymentPlans');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Deseja realmente reiniciar o seu diagnóstico? Isso apagará o progresso atual.')) {
      setFase1({
        sacrificio: { areas: [], familiar: '', fatos: '' },
        injustica: { areas: [], familiar: '', fatos: '' },
        dor: { areas: [], familiar: '', fatos: '' },
        renuncia: { areas: [], familiar: '', fatos: '' }
      });
      setSintomas({
        sacrificio: [],
        injustica: [],
        dor: [],
        renuncia: []
      });
      setSmadAlarm('');
      setDramaticRoleState('');
      setTacticalAction('');
      setExecutionPlan('');
      setCustomVisceralSensation('');
      
      if (draftId) {
        await deleteDoc(doc(db, 'enjoymentPlanDrafts', draftId));
        setDraftId(null);
      }

      // Clear local backup on reset
      localStorage.removeItem(`enjoyment_plan_local_draft_${userId}_${journeyId || 'general'}`);
      
      setStep('intro');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loadingDraft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <Clock className="w-8 h-8 text-gold animate-spin mb-4" />
        <p className="text-white/60 font-serif">Sintonizando Contabilidade Familiar...</p>
      </div>
    );
  }

  // Check if a specific cell in the matrix should be highlighted based on selections
  const isCellActive = (lawKey: 'sacrificio' | 'injustica' | 'dor' | 'renuncia', areaKey: string) => {
    // Highlight if selected in Fase 1
    return fase1[lawKey].areas.includes(areaKey);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-24 text-white">
      {/* Printable CSS inject */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-card {
            border: 2px solid #000 !important;
            color: #000 !important;
            background: #fff !important;
            margin-bottom: 20px !important;
            page-break-inside: avoid !important;
          }
          .print-text {
            color: #000 !important;
          }
          .print-badge {
            border: 1px solid #000 !important;
            color: #000 !important;
            background: #f0f0f0 !important;
          }
          .print-matrix-cell {
            border: 1px solid #000 !important;
            background: #fff !important;
            color: #000 !important;
          }
          .print-matrix-active {
            background: #fbf6e5 !important;
            font-weight: bold !important;
            border: 2px solid #000 !important;
          }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold bg-gold/10 px-3 py-1 rounded-full">
                Extração de Débito Sistêmico
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight font-medium">
                MAPA DAS ALIANÇAS FAMILIARES
              </h1>
              <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                A sua estagnação atual não é um problema de mentalidade ou competência. Seu sistema nervoso transformou a história da sua família em um <span className="text-gold italic font-semibold">Acordo Biológico</span>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              <Card className="p-6 bg-black/40 border-white/10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">A Contabilidade Familiar (Fase 1)</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Identifique onde a balança sistêmica desequilibrou através de sacrifícios, injustiças, dores e renúncias geracionais.
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-black/40 border-white/10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Espelho da Realidade (Fase 2)</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Marque as subleis corporais invisíveis que você executa hoje como um marcador de lealdade solidária.
                  </p>
                </div>
              </Card>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-8 bg-gold text-black hover:bg-gold/80 flex items-center gap-2" onClick={() => handleNext('f1_sacrificio')}>
                Iniciar Diagnóstico <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="text-white/40 hover:text-white" onClick={onBack}>
                Voltar à Biblioteca
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'intro_aliancas' && (
          <motion.div 
            key="intro_aliancas"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center space-y-8 py-6"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold bg-gold/10 px-3 py-1 rounded-full">
                Extração de Débito Sistêmico | Fase 1
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight font-medium">
                MAPA DAS ALIANÇAS FAMILIARES
              </h1>
              <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                A sua estagnação atual não é um problema de mentalidade ou competência. Seu sistema nervoso transformou a história da sua família em um <span className="text-gold italic font-semibold">Acordo Biológico</span>.
              </p>
            </div>

            <div className="max-w-2xl mx-auto text-left">
              <Card className="p-6 bg-black/40 border-white/10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">A Contabilidade Familiar</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Identifique onde a balança sistêmica desequilibrou através de sacrifícios, injustiças, dores e renúncias geracionais de quem veio antes de você.
                  </p>
                </div>
              </Card>
            </div>

            <div className="pt-4 flex justify-center">
              <Button size="lg" className="px-8 bg-gold text-black hover:bg-gold/80 flex items-center gap-2 font-bold" onClick={() => handleNext('f1_sacrificio')}>
                Iniciar Diagnóstico de Alianças <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'intro_padroes' && (
          <motion.div 
            key="intro_padroes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center space-y-8 py-6"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold bg-gold/10 px-3 py-1 rounded-full">
                Diagnóstico de Sintomas | Fase 2
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight font-medium">
                O ESPELHO DA REALIDADE
              </h1>
              <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                Aqui expomos as subleis inconscientes, travas de vida e comportamentos que o seu corpo executa no dia a dia para permanecer leal aos acordos familiares.
              </p>
            </div>

            <div className="max-w-2xl mx-auto text-left">
              <Card className="p-6 bg-black/40 border-white/10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Mapeamento de Padrões e Subleis</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Marque os sintomas corporais, sensações somáticas e autossabotagens automáticas que travam sua prosperidade, saúde ou amor no presente.
                  </p>
                </div>
              </Card>
            </div>

            <div className="pt-4 flex justify-center">
              <Button size="lg" className="px-8 bg-gold text-black hover:bg-gold/80 flex items-center gap-2 font-bold" onClick={() => handleNext('f2_sacrificio')}>
                Iniciar Diagnóstico de Padrões <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* FASE 1: A CONTABILIDADE FAMILIAR */}
        {step.startsWith('f1_') && (
          <Fase1Contabilidade
            step={step as any}
            fase1={fase1}
            mode={mode}
            onToggleArea={toggleFase1Area}
            onUpdateText={updateFase1Text}
            onNext={handleNext}
            onBack={(prevStep) => setStep(prevStep as any)}
            onFinish={handleFinish}
          />
        )}

        {/* FASE 2: DIAGNÓSTICO DE SINTOMAS (O ESPELHO DA REALIDADE) */}
        {step.startsWith('f2_') && (
          <Fase2Sintomas
            step={step as any}
            sintomas={sintomas}
            mode={mode}
            onToggleSintoma={toggleSintoma}
            onNext={handleNext}
            onBack={(prevStep) => setStep(prevStep as any)}
            onFinish={handleFinish}
          />
        )}

        {/* FASE 3: MATRIZ DE LEIS PRÉ-CONFIGURADAS E PRESCRIÇÃO */}
        {step === 'f3_matriz' && (
          <Fase3MatrizPrescricao
            fase1={fase1}
            sintomas={sintomas}
            customVisceralSensation={customVisceralSensation}
            setCustomVisceralSensation={setCustomVisceralSensation}
            tacticalAction={tacticalAction}
            setTacticalAction={setTacticalAction}
            actionCompleted={actionCompleted}
            setActionCompleted={setActionCompleted}
            autoInputs={{
              culpa: activeCulpa,
              arquitetura: activeArquitetura,
              medo: activeMedo,
              somatica: activeSomatica,
              livroTipo: activeLivroRazao,
              sinalClinico: activeSinalClinico,
              credorAcessivel: activeCredorAcessivel
            }}
            onBack={(prevStep) => setStep(prevStep as any)}
            onFinish={handleFinish}
            onPrint={handlePrint}
            saving={saving}
          />
        )}

        {step === 'concluded' && (
          <motion.div
            key="concluded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6 py-12 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Crown className="w-8 h-8 text-gold" />
            </div>

            <h2 className="text-3xl font-serif font-medium text-white uppercase tracking-tight">
              {mode === 'aliancas' && "Alianças Sistêmicas Mapeadas"}
              {mode === 'padroes' && "Espelho da Realidade Concluído"}
              {!mode && "Diagnóstico Selado com Sucesso"}
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              {mode === 'aliancas' && "O seu histórico de Alianças Invisíveis e débitos herdados foi registrado com sucesso. A consciência destas lealdades é o primeiro passo para a autoria plena. Agora, avance para diagnosticar os padrões somáticos."}
              {mode === 'padroes' && "Seu diagnóstico de sintomas corporais e subleis ativas foi concluído e salvo. Você expôs com sucesso as amarras do inconsciente. Agora, acesse os protocolos de liberação recomendados."}
              {!mode && "O seu Mapa de Alianças Familiares foi registrado no seu histórico e conectado ao seu plano biológico. A consciência destas lealdades é o primeiro passo para a autoria plena."}
            </p>

            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button onClick={onComplete} className="bg-gold text-black hover:bg-gold/80 font-bold px-6">
                {mode === 'aliancas' && "Avançar para Padrões"}
                {mode === 'padroes' && "Acessar Meus Protocolos"}
                {!mode && "Voltar à Jornada"}
              </Button>
              <Button variant="ghost" onClick={handleReset} className="text-white/40 hover:text-white">
                Iniciar Novo Diagnóstico
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
