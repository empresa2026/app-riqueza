import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, FileText, Loader2, ExternalLink, LayoutGrid, Trash2, X, Trophy, CornerDownRight } from 'lucide-react';
import { Journey, Quiz, UserResult, MatrixResult, Matrix, EnjoymentPlanResult, ProtocolResult, Protocol } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { createGoogleDoc } from '../../services/googleDocsService';
import { MATRICES } from '../../data/matrices';
import { PROTOCOLS } from '../../data/protocols';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { SUBLEIS_SACRIFICIO, SUBLEIS_INJUSTICA, SUBLEIS_DOR, SUBLEIS_RENUNCIA, resolveSubLawTexts } from '../plan/EnjoymentPlanFlow';

interface HistoryViewProps {
  history: UserResult[];
  matrixHistory: MatrixResult[];
  protocolHistory: ProtocolResult[];
  planHistory: EnjoymentPlanResult[];
  quizzes: Quiz[];
  onBack: () => void;
  onSelectQuiz: (quiz: Quiz, result?: UserResult) => void;
  onViewMatrixResult: (matrix: Matrix, result: MatrixResult) => void;
  onSelectProtocol?: (protocol: Protocol, result?: ProtocolResult) => void;
  onDeleteUserResult?: (resultId: string) => void;
  onDeleteMatrixResult?: (resultId: string) => void;
  onDeleteProtocolResult?: (resultId: string) => void;
  onDeletePlanResult?: (resultId: string) => void;
  activeJourneyId?: string | null;
  journeys?: Journey[];
  embutido?: boolean;
}

const DeleteButton = ({ 
  id, 
  onDelete, 
  label, 
  confirmDeleteId, 
  setConfirmDeleteId 
}: { 
  id: string, 
  onDelete: (id: string) => void, 
  label: string,
  confirmDeleteId: string | null,
  setConfirmDeleteId: (id: string | null) => void
}) => {
  const isConfirming = confirmDeleteId === id;

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
        <Button 
          variant="ghost" 
          onClick={() => setConfirmDeleteId(null)}
          className="text-[10px] uppercase font-bold px-3 py-1"
        >
          Cancelar
        </Button>
        <Button 
          className="bg-red-500 text-white hover:bg-red-600 text-[10px] uppercase font-bold px-3 py-1 border-none shadow-lg shadow-red-500/20"
          onClick={() => {
            onDelete(id);
            setConfirmDeleteId(null);
          }}
        >
          Confirmar
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={() => setConfirmDeleteId(id)}
      title={`Excluir ${label}`}
      className="p-3 border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
};

export function HistoryView({ 
  history, 
  matrixHistory, 
  protocolHistory,
  planHistory,
  quizzes, 
  onBack, 
  onSelectQuiz,
  onViewMatrixResult,
  onSelectProtocol,
  onDeleteUserResult,
  onDeleteMatrixResult,
  onDeleteProtocolResult,
  onDeletePlanResult,
  activeJourneyId,
  journeys = [],
  embutido = false
}: HistoryViewProps) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewingPlan, setViewingPlan] = useState<EnjoymentPlanResult | null>(null);

  const activeJourney = journeys.find(j => j.id === activeJourneyId);

  const filteredHistory = activeJourneyId 
    ? history.filter(h => h.journeyId === activeJourneyId)
    : history;
  
  const filteredMatrixHistory = activeJourneyId 
    ? matrixHistory.filter(h => h.journeyId === activeJourneyId)
    : matrixHistory;

  const filteredProtocolHistory = activeJourneyId 
    ? protocolHistory.filter(h => h.journeyId === activeJourneyId)
    : protocolHistory;

  const filteredPlanHistory = activeJourneyId 
    ? planHistory.filter(h => h.journeyId === activeJourneyId || h.journeyId === null || !h.journeyId)
    : planHistory;

  const downloadTxt = (title: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };



  const handleSaveToDocs = async (result: UserResult, quiz: Quiz) => {
    setSavingId(result.id);
    try {
      let content = `Protocolo: ${quiz.title}\n`;
      content += `Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}\n\n`;
      
      content += `ESTRUTURA IDENTIFICADA\n`;
      content += `Ferida: ${quiz.identifiedStructure.ferida}\n`;
      content += `Domínio: ${quiz.identifiedStructure.dominio}\n`;
      content += `Máscara: ${quiz.identifiedStructure.mascara}\n`;
      content += `Modo: ${quiz.identifiedStructure.modo}\n\n`;
      
      content += `RESPOSTAS\n`;
      quiz.sections.forEach((section, sIdx) => {
        content += `\n[ ${section.title} ]\n`;
        section.questions.forEach((q, qIdx) => {
          const answerIdx = result.answers[`${sIdx}-${qIdx}`];
          const answer = answerIdx !== undefined ? q.options[answerIdx] : 'Não respondida';
          content += `P: ${q.question}\nR: ${answer}\n\n`;
        });
      });

      content += `\nORAÇÃO FINAL\n${quiz.finalPrayer}\n`;

      try {
        const docUrl = await createGoogleDoc(`Protocolo - ${quiz.title}`, content);
        window.open(docUrl, '_blank');
      } catch (docErr) {
        console.warn('Google Docs failed, falling back to TXT download', docErr);
        downloadTxt(`Protocolo - ${quiz.title}`, content);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao processar exportação');
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveMatrixToDocs = async (result: MatrixResult) => {
    const matrix = MATRICES.find(m => m.id === result.matrixId);
    if (!matrix) return;
    
    setSavingId(result.id);
    try {
      let content = `Checkpoint de Investigação: ${matrix.title}\n`;
      content += `Autor: ${matrix.author}\n`;
      content += `Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}\n\n`;
      
      content += `INVESTIGAÇÃO\n`;
      Object.entries(result.answers).forEach(([label, answer]) => {
        content += `${label}\n${answer}\n\n`;
      });

      try {
        const docUrl = await createGoogleDoc(`Checkpoint - ${matrix.title}`, content);
        window.open(docUrl, '_blank');
      } catch (docErr) {
        console.warn('Google Docs failed, falling back to TXT download', docErr);
        downloadTxt(`Checkpoint - ${matrix.title}`, content);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao processar exportação');
    } finally {
      setSavingId(null);
    }
  };

  const handleSavePlanToDocs = async (result: EnjoymentPlanResult) => {
    setSavingId(result.id);
    try {
      let content = `MAPA DAS ALIANÇAS FAMILIARES & ESPELHO DA VIDA\n`;
      content += `Data: ${new Date(result.createdAt).toLocaleString('pt-BR')}\n\n`;
      
      content += `==================================================\n`;
      content += `FASE 1: A CONTABILIDADE FAMILIAR (Extração de Débito Sistêmico)\n`;
      content += `==================================================\n\n`;
      
      const f1 = (result.fase1 as any) || {};
      
      content += `1. SACRIFÍCIO NÃO RECONHECIDO\n`;
      content += `   Áreas Afetadas: ${(f1.sacrificio?.areas || []).join(', ') || 'Nenhuma'}\n`;
      content += `   Familiar de Lealdade: ${f1.sacrificio?.familiar || 'Não informado'}\n`;
      content += `   Fatos Relevantes: ${f1.sacrificio?.fatos || 'Não informado'}\n\n`;

      content += `2. INJUSTIÇA NÃO REPARADA\n`;
      content += `   Áreas Afetadas: ${(f1.injustica?.areas || []).join(', ') || 'Nenhuma'}\n`;
      content += `   Familiar de Lealdade: ${f1.injustica?.familiar || 'Não informado'}\n`;
      content += `   Fatos Relevantes: ${f1.injustica?.fatos || 'Não informado'}\n\n`;

      content += `3. DOR NÃO PROCESSADA\n`;
      content += `   Áreas Afetadas: ${(f1.dor?.areas || []).join(', ') || 'Nenhuma'}\n`;
      content += `   Familiar de Lealdade: ${f1.dor?.familiar || 'Não informado'}\n`;
      content += `   Fatos Relevantes: ${f1.dor?.fatos || 'Não informado'}\n\n`;

      content += `4. RENÚNCIA / EXCLUÍDO\n`;
      content += `   Áreas Afetadas: ${(f1.renuncia?.areas || []).join(', ') || 'Nenhuma'}\n`;
      content += `   Familiar de Lealdade: ${f1.renuncia?.familiar || 'Não informado'}\n`;
      content += `   Fatos Relevantes: ${f1.renuncia?.fatos || 'Não informado'}\n\n`;

      content += `==================================================\n`;
      content += `FASE 2: DIAGNÓSTICO DE SINTOMAS & SUBLEIS DO ESPELHO DA VIDA\n`;
      content += `==================================================\n\n`;

      const sints = result.sintomas || { sacrificio: [], injustica: [], dor: [], renuncia: [] };

      const sacSub = resolveSubLawTexts(sints.sacrificio, SUBLEIS_SACRIFICIO);
      const injSub = resolveSubLawTexts(sints.injustica, SUBLEIS_INJUSTICA);
      const dorSub = resolveSubLawTexts(sints.dor, SUBLEIS_DOR);
      const renSub = resolveSubLawTexts(sints.renuncia, SUBLEIS_RENUNCIA);

      content += `1. SUBLEIS DE SACRIFÍCIO (${sacSub.length} ativas):\n`;
      if (sacSub.length > 0) {
        sacSub.forEach(txt => content += `   • ${txt}\n`);
      } else {
        content += `   (Nenhuma sublei selecionada)\n`;
      }
      content += `\n`;

      content += `2. SUBLEIS DE INJUSTIÇA (${injSub.length} ativas):\n`;
      if (injSub.length > 0) {
        injSub.forEach(txt => content += `   • ${txt}\n`);
      } else {
        content += `   (Nenhuma sublei selecionada)\n`;
      }
      content += `\n`;

      content += `3. SUBLEIS DE DOR (${dorSub.length} ativas):\n`;
      if (dorSub.length > 0) {
        dorSub.forEach(txt => content += `   • ${txt}\n`);
      } else {
        content += `   (Nenhuma sublei selecionada)\n`;
      }
      content += `\n`;

      content += `4. SUBLEIS DE RENÚNCIA (${renSub.length} ativas):\n`;
      if (renSub.length > 0) {
        renSub.forEach(txt => content += `   • ${txt}\n`);
      } else {
        content += `   (Nenhuma sublei selecionada)\n`;
      }
      content += `\n`;

      content += `==================================================\n`;
      content += `A SENTENÇA ONTO-SISTÊMICA\n`;
      content += `==================================================\n`;
      content += `A sua estagnação atual não é um problema de mentalidade ou competência. Os quadrantes que você mapeou provam que o seu sistema nervoso transformou a história da sua família em um Acordo Biológico. Ele registrou que o sacrifício e a dor deles representam o território FAMILIAR (seguro), e que a sua prosperidade autoral é NÃO-FAMILIAR (uma ameaça de exclusão familiar). Você está limitando a sua identidade para não trair a Contabilidade Familiar da linhagem.\n\n`;

      if (result.clinicalMap) {
        content += `==================================================\n`;
        content += `MAPA CLÍNICO DO ACORDO BIOLÓGICO & MATRIZ M.A.B.I.\n`;
        content += `==================================================\n\n`;

        if (result.clinicalMap.mabiInputs) {
          const mi = result.clinicalMap.mabiInputs;
          content += `MATRIZ DE ALIANÇA FAMILIAR (M.A.B.I.):\n`;
          content += `   - Tipo de Culpa: ${mi.culpa || 'Não informado'}\n`;
          content += `   - Arquitetura: ${mi.arquitetura || 'Não informado'}\n`;
          content += `   - Medo Primitivo: ${mi.medo || 'Não informado'}\n`;
          content += `   - Somática: ${mi.somatica || 'Não informado'}\n`;
          content += `   - Livro Razão: ${mi.livro_razao_tipo || 'Não informado'}\n`;
          if (mi.sinalClinico) content += `   - Sinal Clínico: ${mi.sinalClinico}\n`;
          if (mi.credor_acessivel !== undefined) content += `   - Credor Acessível: ${mi.credor_acessivel ? 'Sim' : 'Não'}\n`;
          content += `\n`;
        }

        if (result.clinicalMap.scenario) {
          content += `CENÁRIO CLÍNICO:\n${result.clinicalMap.scenario}\n\n`;
        }
        if (result.clinicalMap.visceralSensation) {
          content += `VISCERALIDADE CORPORAL:\n${result.clinicalMap.visceralSensation}\n\n`;
        }
        if (result.clinicalMap.smadAlarm) {
          content += `ALARME VISCERAL (SMAD):\n${result.clinicalMap.smadAlarm}\n\n`;
        }
        if (result.clinicalMap.dramaticRole) {
          content += `PAPEL DRAMÁTICO:\n${result.clinicalMap.dramaticRole}\n\n`;
        }
        if (result.clinicalMap.tacticalAction) {
          content += `AÇÃO TÁTICA:\n${result.clinicalMap.tacticalAction}\n\n`;
        }
        if (result.clinicalMap.executionPlan) {
          content += `PLANO DE EXECUÇÃO / PRESCRIÇÃO:\n${result.clinicalMap.executionPlan}\n\n`;
        }
      }

      try {
        const docUrl = await createGoogleDoc(`Mapa das Alianças Familiares`, content);
        window.open(docUrl, '_blank');
      } catch (docErr) {
        console.warn('Google Docs failed, falling back to TXT download', docErr);
        downloadTxt(`Mapa das Alianças Familiares`, content);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao processar exportação');
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveProtocolToDocs = async (result: ProtocolResult) => {
    setSavingId(result.id);
    try {
      const protocol = PROTOCOLS.find(p => p.id === result.protocolId);
      if (!protocol) return;

      let content = `PROTOCOLO: ${protocol.title}\n`;
      content += `Código: ${protocol.code}\n`;
      content += `Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}\n\n`;
      content += `Frase: "${protocol.quote}"\n\n`;

      Object.entries(result.answers).forEach(([key, value]) => {
        const formattedValue = Array.isArray(value) ? value.join(', ') : value;
        content += `${key.toUpperCase()}: ${formattedValue}\n`;
      });

      try {
        const docUrl = await createGoogleDoc(`Protocolo - ${protocol.title}`, content);
        window.open(docUrl, '_blank');
      } catch (docErr) {
        downloadTxt(`Protocolo - ${protocol.title}`, content);
      }
    } catch (error) {
       alert('Erro ao exportar protocolo');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className={embutido ? "" : "py-8"}
    >
      {!embutido && (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-4xl font-serif">Estações</h2>
            {activeJourney && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-bold text-gold uppercase tracking-widest">
                  Visualizando Espaço: {activeJourney.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {activeJourneyId && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Histórico do Evento</span>
          </div>
        )}
      </div>
      )}

      <div className="space-y-12 pb-32">
        {/* Enjoyment Plans */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Alianças Familiares</h3>
          {filteredPlanHistory.map((result) => (
            <Card key={result.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gold/[0.03] border-gold/10">
              <div className="flex-1">
                <h3 className="text-xl font-serif mb-1">Mapa das Alianças Familiares</h3>
                <p className="text-white/40 text-xs uppercase tracking-widest">
                  {new Date(result.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingPlan(result)}
                  className="flex items-center gap-2 border-white/5 hover:bg-white/5"
                >
                  <Play className="w-4 h-4" />
                  Visualizar
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => handleSavePlanToDocs(result)}
                  disabled={savingId === result.id}
                  className="flex items-center gap-2 border-gold/20 text-gold hover:bg-gold hover:text-black"
                >
                  {savingId === result.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Exportar
                </Button>

                {onDeletePlanResult && (
                  <DeleteButton 
                    id={result.id} 
                    onDelete={onDeletePlanResult} 
                    label="aliança" 
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                  />
                )}
              </div>
            </Card>
          ))}
          {filteredPlanHistory.length === 0 && (
            <div className="text-center py-10 glass rounded-3xl border-dashed border-white/5 text-white/20">
              Nenhum diagnóstico de alianças neste espaço.
            </div>
          )}
        </section>

        {!embutido && (<>
        {/* IA Results */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Protocolos Realizados</h3>
          {filteredHistory.map((result) => {
            const quiz = quizzes.find(q => q.id === result.quizId);
            if (!quiz) return null;

            return (
              <Card key={result.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-serif mb-1">{quiz.title}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest">
                    {new Date(result.completedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => onSelectQuiz(quiz, result)}
                    className="flex items-center gap-2 border-white/5 hover:bg-white/5"
                  >
                    <Play className="w-4 h-4" />
                    Abrir
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveToDocs(result, quiz)}
                    disabled={savingId === result.id}
                    className="flex items-center gap-2 border-gold/20 text-gold hover:bg-gold hover:text-black"
                  >
                    {savingId === result.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Exportar
                  </Button>

                  {onDeleteUserResult && (
                    <DeleteButton 
                      id={result.id} 
                      onDelete={onDeleteUserResult} 
                      label="protocolo" 
                      confirmDeleteId={confirmDeleteId}
                      setConfirmDeleteId={setConfirmDeleteId}
                    />
                  )}
                </div>
              </Card>
            );
          })}
          {filteredHistory.length === 0 && (
            <div className="text-center py-10 glass rounded-3xl border-dashed border-white/5 text-white/20">
              Nenhum protocolo neste espaço.
            </div>
          )}
        </section>

        {/* Matrix Results */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Histórico de Checkpoints</h3>
          {filteredMatrixHistory.map((result) => {
            const matrix = MATRICES.find(m => m.id === result.matrixId);
            if (!matrix) return null;

            return (
              <Card key={result.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-gold/10">
                <div className="flex-1">
                  <h3 className="text-xl font-serif mb-1">{matrix.title}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest">
                    {new Date(result.completedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => onViewMatrixResult(matrix, result)}
                    className="flex items-center gap-2 border-white/5 hover:bg-white/5"
                  >
                    <Play className="w-4 h-4" />
                    Abrir
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveMatrixToDocs(result)}
                    disabled={savingId === result.id}
                    className="flex items-center gap-2 border-gold/20 text-gold hover:bg-gold hover:text-black"
                  >
                    {savingId === result.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Exportar
                  </Button>

                  {onDeleteMatrixResult && (
                    <DeleteButton 
                      id={result.id} 
                      onDelete={onDeleteMatrixResult} 
                      label="checkpoint" 
                      confirmDeleteId={confirmDeleteId}
                      setConfirmDeleteId={setConfirmDeleteId}
                    />
                  )}
                </div>
              </Card>
            );
          })}
          {filteredMatrixHistory.length === 0 && (
            <div className="text-center py-10 glass rounded-3xl border-dashed border-white/5 text-white/20">
              Nenhum checkpoint neste espaço.
            </div>
          )}
        </section>
        </>)}

        {/* Protocol Results */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 ml-2">Processamentos em Protocolo</h3>
          {filteredProtocolHistory.map((result) => {
            const protocol = PROTOCOLS.find(p => p.id === result.protocolId);
            if (!protocol) return null;

            return (
              <Card key={result.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.02] border-gold/5">
                <div className="flex-1">
                  <div className="text-[10px] uppercase font-bold text-gold/60 mb-1">{protocol.code}</div>
                  <h3 className="text-xl font-serif mb-1">{protocol.title}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest">
                    {new Date(result.completedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {onSelectProtocol && (
                    <Button 
                      variant="outline" 
                      onClick={() => onSelectProtocol(protocol, result)}
                      className="flex items-center gap-2 border-white/5 hover:bg-white/5"
                    >
                      <Play className="w-4 h-4" />
                      Abrir
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveProtocolToDocs(result)}
                    disabled={savingId === result.id}
                    className="flex items-center gap-2 border-gold/20 text-gold hover:bg-gold hover:text-black"
                  >
                    {savingId === result.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Exportar
                  </Button>

                  {onDeleteProtocolResult && (
                    <DeleteButton 
                      id={result.id} 
                      onDelete={onDeleteProtocolResult} 
                      label="processamento" 
                      confirmDeleteId={confirmDeleteId}
                      setConfirmDeleteId={setConfirmDeleteId}
                    />
                  )}
                </div>
              </Card>
            );
          })}
          {filteredProtocolHistory.length === 0 && (
            <div className="text-center py-10 glass rounded-3xl border-dashed border-white/5 text-white/20">
              Nenhum processamento neste espaço.
            </div>
          )}
        </section>
      </div>

      {/* Plan Summary Modal */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-black border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-luxury-black/90 backdrop-blur-md p-6 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-gold" />
                <h3 className="text-2xl font-serif">Mapa das Alianças Familiares</h3>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSavePlanToDocs(viewingPlan)}
                  disabled={savingId === viewingPlan.id}
                  className="border-gold/30 hover:bg-gold/10 text-gold text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  {savingId === viewingPlan.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  Exportar Relatório
                </Button>
                <button 
                  onClick={() => setViewingPlan(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Fase 1 Blocks */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold/60">Fase 1: A Contabilidade Familiar</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: '1. SACRIFÍCIO NÃO RECONHECIDO', data: viewingPlan.fase1?.sacrificio },
                    { title: '2. INJUSTIÇA NÃO REPARADA', data: viewingPlan.fase1?.injustica },
                    { title: '3. DOR NÃO PROCESSADA', data: viewingPlan.fase1?.dor },
                    { title: '4. RENÚNCIA / EXCLUÍDO', data: viewingPlan.fase1?.renuncia }
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                      <h5 className="font-serif text-gold text-sm font-semibold">{item.title}</h5>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-white/30">Áreas:</span>
                        <div className="flex flex-wrap gap-1">
                          {(item.data?.areas || []).map((area: string) => (
                            <span key={area} className="text-[9px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold">
                              {area}
                            </span>
                          ))}
                          {(item.data?.areas || []).length === 0 && (
                            <span className="text-[9px] text-white/20 italic">Nenhuma área selecionada</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-white/30">Familiar:</span>
                        <p className="text-xs text-white/80">{item.data?.familiar || <span className="italic text-white/25">Não informado</span>}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-white/30">Fatos:</span>
                        <p className="text-xs text-white/60 line-clamp-3">{item.data?.fatos || <span className="italic text-white/25">Não informado</span>}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fase 2: Diagnóstico de Sintomas & Subleis do Espelho da Vida */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold/60">
                  Fase 2: Diagnóstico de Sintomas & Subleis do Espelho da Vida
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: '1. SACRIFÍCIO', items: resolveSubLawTexts(viewingPlan.sintomas?.sacrificio, SUBLEIS_SACRIFICIO) },
                    { title: '2. INJUSTIÇA', items: resolveSubLawTexts(viewingPlan.sintomas?.injustica, SUBLEIS_INJUSTICA) },
                    { title: '3. DOR', items: resolveSubLawTexts(viewingPlan.sintomas?.dor, SUBLEIS_DOR) },
                    { title: '4. RENÚNCIA', items: resolveSubLawTexts(viewingPlan.sintomas?.renuncia, SUBLEIS_RENUNCIA) }
                  ].map((cat, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="font-serif text-gold text-sm font-semibold">{cat.title}</h5>
                        <span className="text-[9px] bg-gold/10 text-gold px-2.5 py-0.5 rounded-full font-bold">
                          {cat.items.length} subleis ativas
                        </span>
                      </div>
                      {cat.items.length > 0 ? (
                        <ul className="space-y-1.5 pt-1">
                          {cat.items.map((sub, sIdx) => (
                            <li key={sIdx} className="text-xs text-white/80 flex items-start gap-2">
                              <span className="text-gold shrink-0 mt-0.5">•</span>
                              <span className="leading-relaxed">{sub}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-white/30 italic py-1">Nenhuma sublei ativada nesta lei.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentença Block */}
              <div className="border border-gold/30 p-5 rounded-2xl bg-gold/5 space-y-2">
                <h4 className="text-xs font-serif font-bold text-gold tracking-widest uppercase">A SENTENÇA ONTO-SISTÊMICA</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  A sua estagnação atual não é um problema de mentalidade ou competência. Os quadrantes que você mapeou provam que o seu sistema nervoso transformou a história da sua família em um <strong>Acordo Biológico</strong>. Ele registrou que o sacrifício e a dor deles representam o território <strong>FAMILIAR (seguro)</strong>, e que a sua prosperidade autoral é <strong>NÃO-FAMILIAR</strong>. Você está limitando a sua identidade para não trair a Contabilidade Familiar da linhagem.
                </p>
              </div>

              {/* Mapa Clínico do Acordo Biológico (History) */}
              {viewingPlan.clinicalMap && (() => {
                // Compute temporary values based on viewingPlan
                const selectedSymptomTexts: string[] = [];
                if (viewingPlan.sintomas) {
                  const { sacrificio = [], injustica = [], dor = [], renuncia = [] } = viewingPlan.sintomas;
                  sacrificio.forEach((idx: any) => {
                    const num = Number(idx);
                    if (SUBLEIS_SACRIFICIO[num]) selectedSymptomTexts.push(SUBLEIS_SACRIFICIO[num]);
                  });
                  injustica.forEach((idx: any) => {
                    const num = Number(idx);
                    if (SUBLEIS_INJUSTICA[num]) selectedSymptomTexts.push(SUBLEIS_INJUSTICA[num]);
                  });
                  dor.forEach((idx: any) => {
                    const num = Number(idx);
                    if (SUBLEIS_DOR[num]) selectedSymptomTexts.push(SUBLEIS_DOR[num]);
                  });
                  renuncia.forEach((idx: any) => {
                    const num = Number(idx);
                    if (SUBLEIS_RENUNCIA[num]) selectedSymptomTexts.push(SUBLEIS_RENUNCIA[num]);
                  });
                }

                const getSomaticSensations = () => {
                  const somaticList: string[] = [];
                  if (viewingPlan.sintomas) {
                    const { sacrificio = [], injustica = [], dor = [], renuncia = [] } = viewingPlan.sintomas;
                    const sacIdx = sacrificio.map(Number);
                    const injIdx = injustica.map(Number);
                    const dorIdx = dor.map(Number);
                    const renIdx = renuncia.map(Number);
                    
                    if (sacIdx.includes(66)) somaticList.push("Adoecimento por hipervigilância");
                    if (sacIdx.includes(67)) somaticList.push("Tensão crônica no pescoço/mandíbula");
                    if (sacIdx.includes(68)) somaticList.push("Fadiga crônica ignorada");
                    if (sacIdx.includes(69)) somaticList.push("Bloqueio da respiração na alegria");
                    if (injIdx.includes(95)) somaticList.push("Hipervigilância corporal crônica");
                    if (injIdx.includes(96)) somaticList.push("Sintomas físicos (bruxismo, gastrite)");
                    if (injIdx.includes(97)) somaticList.push("Sintomas físicos em momentos de sucesso");
                    if (injIdx.includes(98)) somaticList.push("Supressão de dor física");
                    if (dorIdx.includes(110)) somaticList.push("Alarme somático de perigo ao receber");
                    if (dorIdx.includes(122)) somaticList.push("Adoecimento solidário sistêmico");
                    if (dorIdx.includes(123)) somaticList.push("Exaustão por supressão emocional");
                    if (dorIdx.includes(124)) somaticList.push("Armadura corporal rígida");
                    if (dorIdx.includes(125)) somaticList.push("Nódulo ou bloqueio na garganta");
                    if (dorIdx.includes(126)) somaticList.push("Imunidade baixa após conquistas");
                    if (dorIdx.includes(127)) somaticList.push("Respiração curta");
                    if (renIdx.includes(149)) somaticList.push("Cansaço existencial profundo");
                    if (renIdx.includes(150)) somaticList.push("Postura encolhida");
                    if (renIdx.includes(151)) somaticList.push("Perda de voz ou tom autoral");
                    if (renIdx.includes(153)) somaticList.push("Adoecimento ao iniciar projetos próprios");
                  }
                  return somaticList.length > 0 ? somaticList.join(', ') : '';
                };

                const getLoyalPeople = () => {
                  const list: string[] = [];
                  if (viewingPlan.fase1) {
                    const { sacrificio, injustica, dor, renuncia } = viewingPlan.fase1;
                    if (sacrificio?.familiar) list.push(`${sacrificio.familiar} (Sacrifício)`);
                    if (injustica?.familiar) list.push(`${injustica.familiar} (Injustiça)`);
                    if (dor?.familiar) list.push(`${dor.familiar} (Dor)`);
                    if (renuncia?.familiar) list.push(`${renuncia.familiar} (Renúncia)`);
                  }
                  return list.length > 0 ? list.join('; ') : "Não especificado";
                };

                const getSilentContracts = () => {
                  const contracts: string[] = [];
                  if (viewingPlan.fase1) {
                    const { sacrificio, injustica, dor, renuncia } = viewingPlan.fase1;
                    if (sacrificio?.familiar && sacrificio?.fatos) {
                      const areasStr = (sacrificio.areas || []).length > 0 ? sacrificio.areas.join('/') : 'minha vida';
                      contracts.push(`Para honrar o sacrifício de ${sacrificio.familiar}, eu me comprometo a sofrer e me exaurir no(a) ${areasStr} (${sacrificio.fatos}).`);
                    }
                    if (injustica?.familiar && injustica?.fatos) {
                      const areasStr = (injustica.areas || []).length > 0 ? injustica.areas.join('/') : 'minha vida';
                      contracts.push(`Para compensar a injustiça vivida por ${injustica.familiar}, eu me comprometo a abrir mão da prosperidade no(a) ${areasStr} (${injustica.fatos}).`);
                    }
                    if (dor?.familiar && dor?.fatos) {
                      const areasStr = (dor.areas || []).length > 0 ? dor.areas.join('/') : 'minha vida';
                      contracts.push(`Para carregar a dor de ${dor.familiar}, meu corpo e mente repetirão o padrão de sofrimento no(a) ${areasStr} (${dor.fatos}).`);
                    }
                    if (renuncia?.familiar && renuncia?.fatos) {
                      const areasStr = (renuncia.areas || []).length > 0 ? renuncia.areas.join('/') : 'minha vida';
                      contracts.push(`Para não ofuscar ou trair a exclusão de ${renuncia.familiar}, eu renuncio ao meu brilho e destaque no(a) ${areasStr} (${renuncia.fatos}).`);
                    }
                  }
                  return contracts;
                };

                return (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold/60">Mapa Clínico do Seu Acordo Biológico</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* COL 1: Acordo Somato-Sistêmico */}
                      <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gold/60 border-b border-white/10 pb-2 block">
                          1. A DOR & O ACORDO (DO SINTOMA À ALIANÇA)
                        </span>
                        <div className="space-y-4 text-xs leading-relaxed">
                          {/* Sintoma Mapeado */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Sintoma Mapeado:
                            </div>
                            <div className="pl-5 text-white/80 font-medium font-serif italic max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                              {selectedSymptomTexts.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-1">
                                  {selectedSymptomTexts.map((txt, index) => (
                                    <li key={index}>{txt}</li>
                                  ))}
                                </ul>
                              ) : (
                                "Nenhum sintoma selecionado nas etapas anteriores."
                              )}
                            </div>
                          </div>

                          {/* Visceralidade Corporal */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Visceralidade Corporal:
                            </div>
                            <p className="pl-5 text-white/90 font-serif italic">
                              {viewingPlan.clinicalMap.visceralSensation || getSomaticSensations() || "Tensão muscular involuntária e padrão de hipervigilância sistêmica."}
                            </p>
                          </div>

                          {/* Pessoa de Lealdade */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Pessoa de Lealdade:
                            </div>
                            <div className="pl-5 text-white/90 font-medium">
                              {getLoyalPeople() !== "Não especificado" ? (
                                <div className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-gold/90 font-serif">
                                  {getLoyalPeople()}
                                </div>
                              ) : (
                                <div className="p-2 bg-white/[0.01] border border-dashed border-white/10 rounded-lg text-white/40 text-center italic">
                                  Nenhuma pessoa mapeada em Fase 1.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* O Contrato Silencioso */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> O Contrato Silencioso:
                            </div>
                            <div className="pl-5 space-y-2">
                              {getSilentContracts().length > 0 ? (
                                getSilentContracts().map((contract, i) => (
                                  <div key={i} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-white/80 font-serif italic">
                                    “{contract}”
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 bg-white/[0.01] border border-dashed border-white/10 rounded-lg text-white/40 text-center italic">
                                  Aguardando preenchimento dos fatos em Fase 1.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* COL 2: Engenharia do Desbloqueio */}
                      <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gold/60 border-b border-white/10 pb-2 block">
                          2. A TRAVA & A LIBERAÇÃO (DA ENGENHARIA À AÇÃO)
                        </span>
                        <div className="space-y-4 text-xs leading-relaxed">
                          {viewingPlan.clinicalMap.mabiInputs && (
                            <div className="p-3 bg-gold/10 border border-gold/20 rounded-xl space-y-1.5 mb-2">
                              <span className="text-[9px] uppercase tracking-wider font-mono text-gold font-bold block">Matriz de Aliança Familiar</span>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-white/80">
                                <div><span className="text-white/40">Culpa:</span> {viewingPlan.clinicalMap.mabiInputs.culpa}</div>
                                <div><span className="text-white/40">Arquitetura:</span> {viewingPlan.clinicalMap.mabiInputs.arquitetura}</div>
                                <div><span className="text-white/40">Medo:</span> {viewingPlan.clinicalMap.mabiInputs.medo}</div>
                                <div><span className="text-white/40">Somática:</span> {viewingPlan.clinicalMap.mabiInputs.somatica}</div>
                                <div className="col-span-2"><span className="text-white/40">Livro Razão:</span> {viewingPlan.clinicalMap.mabiInputs.livro_razao_tipo}</div>
                                {viewingPlan.clinicalMap.mabiInputs.sinalClinico && (
                                  <div className="col-span-2"><span className="text-white/40">Sinal Clínico:</span> {viewingPlan.clinicalMap.mabiInputs.sinalClinico}</div>
                                )}
                                {viewingPlan.clinicalMap.mabiInputs.credor_acessivel !== undefined && (
                                  <div className="col-span-2"><span className="text-white/40">Credor Acessível:</span> {viewingPlan.clinicalMap.mabiInputs.credor_acessivel ? 'Sim' : 'Não'}</div>
                                )}
                              </div>
                            </div>
                          )}
                          {viewingPlan.clinicalMap.scenario && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-gold uppercase tracking-wider text-[10px] font-bold">
                                <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Cenário Clínico:
                              </div>
                              <p className="pl-5 text-gold/90 font-medium font-serif italic">
                                {viewingPlan.clinicalMap.scenario}
                              </p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 uppercase tracking-wider text-[10px] font-bold">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Alarme Visceral (SMAD):
                            </div>
                            <p className="pl-5 text-white/90 font-medium">
                              {viewingPlan.clinicalMap.smadAlarm || "Culpa do Sobrevivente / Alerta de Perigo de Sucesso"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 uppercase tracking-wider text-[10px] font-bold">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Papel Dramático:
                            </div>
                            <p className="pl-5 text-white/90 font-medium font-serif italic">
                              {viewingPlan.clinicalMap.dramaticRole || "O Salvador Sistêmico"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 uppercase tracking-wider text-[10px] font-bold">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Ação Tática:
                            </div>
                            <p className="pl-5 text-white/80 whitespace-pre-wrap">
                              {viewingPlan.clinicalMap.tacticalAction || "Ação não preenchida."}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-white/40 uppercase tracking-wider text-[10px] font-bold">
                              <CornerDownRight className="w-3.5 h-3.5 text-gold/60" /> Plano de Execução:
                            </div>
                            <p className="pl-5 text-white/80 whitespace-pre-wrap font-medium">
                              {viewingPlan.clinicalMap.executionPlan || "Plano não preenchido."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
