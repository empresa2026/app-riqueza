import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Clock, 
  Flame, 
  AlertTriangle,
  BookOpen,
  Info,
  ArrowRight
} from 'lucide-react';
import { db, auth } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc, writeBatch, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface ChronogramStep {
  index: number;
  type: string;
  category: 'COMPORTAMENTAL' | 'SIMBÓLICO' | 'NARRATIVO' | 'INTERPESSOAL';
  title: string;
  duration: string;
  instructions: string[];
  cenarioClinico: string;
  sinalClinico: string;
  risco: 'Baixo' | 'Médio' | 'Alto';
}

export const CRONOGRAMA_STEPS: ChronogramStep[] = [
  {
    index: 1,
    type: 'Comportamental',
    category: 'COMPORTAMENTAL',
    title: 'Ativação Comportamental de Autoria',
    duration: 'Est. 15 minutos',
    instructions: [
      'Registrar em um diário as atividades diárias que geram exaustão versus prazer',
      'Agendar 3 micro-atividades de puro prazer autônomo sem culpa para esta semana',
      'Registrar o nível de bem-estar corporal antes e depois de cada atividade agendada'
    ],
    cenarioClinico: 'Anedonia / paralisia corporal profunda por sacrifício familiar',
    sinalClinico: 'Falta total de energia para projetos próprios, desânimo e sensação de vazio',
    risco: 'Baixo',
  },
  {
    index: 2,
    type: 'Simbolico',
    category: 'SIMBÓLICO',
    title: 'Imagery Rescripting',
    duration: 'Est. 25 minutos',
    instructions: [
      'Fechar os olhos e reviver mentalmente uma cena antiga de cobrança ou julgamento',
      'Fazer o "Self Adulto" atual entrar na cena do passado para proteger a criança',
      'Modificar o final da cena, tirando o peso da criança e restabelecendo limites'
    ],
    cenarioClinico: 'Voz crítica interna (pai/mãe punitivo introjetado)',
    sinalClinico: 'Auto-sabotagem diária baseada em uma voz interna extremamente severa',
    risco: 'Médio',
  },
  {
    index: 3,
    type: 'Narrativo',
    category: 'NARRATIVO',
    title: 'Externalização Narrativa',
    duration: 'Est. 40 minutos',
    instructions: [
      'Nomear a culpa/trava como um personagem externo (ex: "O Vigilante do Clã")',
      'Escrever uma carta direcionada a esse personagem, separando sua identidade dele',
      'Escrever uma segunda carta do seu "Eu do Futuro" livre dessa influência externa'
    ],
    cenarioClinico: 'Culpa virou identidade',
    sinalClinico: 'Paciente fala em primeira pessoa: "Eu sou quem sempre se sacrifica"',
    risco: 'Médio',
  },
  {
    index: 4,
    type: 'Interpessoal',
    category: 'INTERPESSOAL',
    title: 'Des-triangulação Boweniana',
    duration: 'Est. 45 minutos',
    instructions: [
      'Desenhar o Genograma de 3 gerações identificando as alianças e tensões',
      'Identificar em qual triângulo ativo de fofoca, dívida ou mediação você está preso',
      'Praticar o papel de observador neutro nas reuniões familiares ("não levo recado")'
    ],
    cenarioClinico: 'Sistema familiar altamente triangulado',
    sinalClinico: 'Ansiedade extrema ao dizer "não" ou ao se recusar a resolver briga de terceiros',
    risco: 'Médio',
  }
];

interface MabiTherapeuticChronogramProps {
  journeyId: string;
  journeyGoal?: string;
  onGoToProtocols?: () => void;
}

export function MabiTherapeuticChronogram({ journeyId, journeyGoal, onGoToProtocols }: MabiTherapeuticChronogramProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, { suds: number; completedAt: string; id: string }>>({});
  const [loading, setLoading] = useState(true);
  const [sudsValues, setSudsValues] = useState<Record<number, number>>({ 1: 5, 2: 5, 3: 5, 4: 5 });
  const [savingStep, setSavingStep] = useState<number | null>(null);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch completed steps for this journey from firestore mabi_actions where isChronogram === true
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'mabi_actions'),
      where('userId', '==', user.uid),
      where('isChronogram', '==', true),
      where('journeyId', '==', journeyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const completed: Record<number, { suds: number; completedAt: string; id: string }> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.stepIndex) {
          completed[data.stepIndex] = {
            suds: data.suds || 0,
            completedAt: data.createdAt,
            id: doc.id
          };
        }
      });
      setCompletedSteps(completed);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao escutar cronograma de ações:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [journeyId]);

  const handleCompleteStep = async (step: ChronogramStep) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar autenticado para salvar o progresso.");
      return;
    }

    setSavingStep(step.index);
    try {
      const sudsVal = sudsValues[step.index];
      const actionData = {
        userId: user.uid,
        userEmail: user.email || '',
        journeyId: journeyId,
        isChronogram: true,
        stepIndex: step.index,
        type: step.type,
        title: step.title,
        goal: journeyGoal || 'Expansão de Vida',
        steps: step.instructions.join('\n'),
        commitment: true,
        suds: sudsVal,
        completed: true,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'mabi_actions'), actionData);
      setSuccessMessage(`Protocolo ${step.index} concluído com sucesso com SUDS de alívio nível ${sudsVal}/10!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      console.error("Erro ao concluir intervenção:", error);
      alert("Houve um erro ao registrar sua intervenção.");
    } finally {
      setSavingStep(null);
    }
  };

  const handleRestartChronogram = async () => {
    if (!window.confirm("Deseja realmente reiniciar todo o Cronograma de Ações Terapêuticas? Isso limpará o progresso e avaliações SUDS desta jornada.")) {
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      // Fetch and delete all mabi_actions matching isChronogram === true and journeyId === journeyId
      const q = query(
        collection(db, 'mabi_actions'),
        where('userId', '==', user.uid),
        where('isChronogram', '==', true),
        where('journeyId', '==', journeyId)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.forEach((document) => {
        batch.delete(document.ref);
      });
      
      await batch.commit();
      setSudsValues({ 1: 5, 2: 5, 3: 5, 4: 5 });
      setSuccessMessage("Cronograma reiniciado! Você já pode recomeçar do Passo 1.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao reiniciar cronograma:", error);
      alert("Erro ao reiniciar progresso.");
    } finally {
      setLoading(false);
    }
  };

  // Check if a step is locked
  const isStepLocked = (index: number) => {
    if (index === 1) return false;
    // Step is locked if the previous step is not completed
    return !completedSteps[index - 1];
  };

  const getRiscoColor = (risco: 'Baixo' | 'Médio' | 'Alto') => {
    switch (risco) {
      case 'Baixo': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Médio': return 'text-gold bg-gold/10 border-gold/20';
      case 'Alto': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Upper header with Phase, Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono font-bold">
            Fase 3: Intervenção Prática
          </span>
          <h2 className="text-3xl font-serif text-white mt-3">Cronograma de Ações Terapêuticas</h2>
          <p className="text-sm text-white/50 mt-1 max-w-2xl">
            Libere as couraças do seu clã executando as micro-ações biológicas na ordem exata.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowMethodologyModal(true)}
            className="text-xs border-white/10 text-white/80 hover:bg-white/5"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Dossiê/Cards
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRestartChronogram}
            className="text-xs border-rose-500/20 text-rose-300 hover:bg-rose-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reiniciar Jornada
          </Button>
        </div>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CRONOGRAMA_STEPS.map((step) => {
          const locked = isStepLocked(step.index);
          const completed = !!completedSteps[step.index];
          const completedInfo = completedSteps[step.index];

          return (
            <Card 
              key={step.index} 
              className={`p-6 bg-[#0c0c0e] border transition-all duration-300 flex flex-col justify-between relative overflow-hidden min-h-[580px] ${
                completed 
                  ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : locked 
                    ? 'border-white/5 opacity-50' 
                    : 'border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.03)]'
              }`}
            >
              {/* Highlight bar for active but uncompleted card */}
              {!locked && !completed && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
              )}
              {completed && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
              )}

              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                    0{step.index}. {step.category}
                  </span>
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : locked ? (
                    <Lock className="w-4 h-4 text-white/30" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gold" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-white font-medium leading-tight">
                    {step.title}
                  </h3>
                  <span className="text-[11px] text-white/40 block font-mono">
                    {step.duration}
                  </span>
                </div>

                {/* Instructions */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest block">
                    INSTRUÇÕES (3 PASSOS):
                  </span>
                  <ol className="space-y-2.5 text-xs text-white/70 leading-relaxed list-none pl-0">
                    {step.instructions.map((inst, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="font-mono text-gold font-bold shrink-0">{idx + 1}</span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Clinical Details & Action Interface */}
              <div className="space-y-6 pt-6 mt-6 border-t border-white/5">
                <div className="space-y-3.5 text-[11px] leading-relaxed">
                  <div>
                    <span className="text-[9px] font-mono text-white/40 uppercase block font-bold">Cenário Clínico:</span>
                    <span className="text-white/80">{step.cenarioClinico}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-white/40 uppercase block font-bold">Sinal Clínico:</span>
                    <span className="text-white/80">{step.sinalClinico}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] font-mono text-white/40 uppercase font-bold">Risco:</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${getRiscoColor(step.risco)}`}>
                      {step.risco}
                    </span>
                  </div>
                </div>

                {/* Interactive Status Footer */}
                <div className="pt-2">
                  {locked ? (
                    <div className="py-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col items-center justify-center text-center gap-1">
                      <Lock className="w-5 h-5 text-white/20" />
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                        Aguardando protocolo anterior
                      </span>
                    </div>
                  ) : completed ? (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Intervenção Concluída
                      </div>
                      <p className="text-[9px] text-white/40 font-mono leading-none">
                        Alívio SUDS: {completedInfo?.suds}/10 • {completedInfo?.completedAt ? new Date(completedInfo.completedAt).toLocaleDateString('pt-BR') : ''}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* SUDS Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-white/50">Sensação de Alívio (SUDS):</span>
                          <span className="text-gold font-bold">{sudsValues[step.index]}/10</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          value={sudsValues[step.index]} 
                          onChange={(e) => setSudsValues({
                            ...sudsValues,
                            [step.index]: Number(e.target.value)
                          })}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                        />
                        <div className="flex justify-between text-[8px] text-white/30 font-mono uppercase tracking-wider leading-none">
                          <span>0: Sem Alívio</span>
                          <span>6: Liberação Mínima</span>
                          <span>10: Alívio Pleno</span>
                        </div>
                      </div>

                      {/* Complete Button */}
                      <Button
                        onClick={() => handleCompleteStep(step)}
                        disabled={savingStep === step.index}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-xl shrink-0 border-none flex items-center justify-center gap-2 transition-all"
                      >
                        {savingStep === step.index ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        )}
                        Concluir Intervenção
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CTA to go to Protocols (Fase 4: Protocolos) */}
      {onGoToProtocols && (
        <Card className="p-6 border-gold/30 bg-gradient-to-r from-gold/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest block">Próxima Etapa Clínica</span>
            </div>
            <h3 className="text-lg font-serif text-white font-medium">Protocolos de Permissão</h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-xl">
              Agora que você planejou e programou suas ações táticas, acesse os Protocolos para consolidar as liberações emocionais planejadas.
            </p>
          </div>
          <Button 
            onClick={onGoToProtocols}
            className="bg-gold text-black hover:bg-gold/90 font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl shrink-0 border-none flex items-center gap-2"
          >
            Acessar Protocolos
            <ArrowRight className="w-4 h-4 text-black" />
          </Button>
        </Card>
      )}

      {/* Methodology Description Modal */}
      <AnimatePresence>
        {showMethodologyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0f11] border border-white/10 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-white">Guia de Intervenções Táticas</h3>
                <p className="text-xs text-white/40">Conheça o embasamento clínico de cada micro-ação de reprogramação familiar.</p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 text-xs text-white/70 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-gold">1. Ativação Comportamental de Autoria</h4>
                  <p>Focada em desfazer a <strong>Anedonia e Paralisia Corporal</strong>. Pessoas aprisionadas em heranças de sacrifício desligam os receptores de prazer para nivelar-se à dor do clã. Forçar pequenas micro-atividades de puro prazer sem utilidade produtiva ou culpa recalibra o cérebro límbico, permitindo que a pessoa experimente o bem-estar de forma independente.</p>
                </div>

                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <h4 className="font-bold text-gold">2. Imagery Rescripting (Re-escrever Imagens)</h4>
                  <p>Intervenção simbólica de alto impacto para neutralizar a <strong>Voz Crítica Introjetada</strong>. Quando os pais ou o clã cobraram sacrifícios de forma punitiva, o cérebro grava essa voz como se fosse sua identidade. Fazer o adulto de hoje intervir na memória dolorosa passada protege a criança ferida e estabelece novos limites saudáveis, alterando a codificação biológica do trauma.</p>
                </div>

                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <h4 className="font-bold text-gold">3. Externalização Narrativa</h4>
                  <p>Tratamento para a <strong>Identificação da Culpa</strong>. Quando a pessoa diz "Eu sou quem sempre se sacrifica", a culpa transgeracional virou sua própria personalidade. Ao nomear essa força como um personagem externo (ex: "O Vigilante"), o cliente se separa desse fardo e escreve novas ordens de auto-permissão, restaurando sua verdadeira identidade.</p>
                </div>

                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <h4 className="font-bold text-gold">4. Des-triangulação Boweniana</h4>
                  <p>Ação para quebrar os <strong>Sistemas Familiares Altamente Triangulados</strong>. Triangulação ocorre quando dois familiares usam um terceiro como mediador, amortecedor de tensões ou fofoqueiro. Manter a neutralidade emocional ("não levar recado") e dizer limites claros interrompe esse fluxo invisível e força a diferenciação madura do Self.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button 
                  onClick={() => setShowMethodologyModal(false)}
                  className="bg-gold text-black hover:bg-gold/90 font-bold uppercase text-xs px-5 rounded-xl border-none"
                >
                  Entendi, Fechar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
