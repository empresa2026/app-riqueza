import React from 'react';
import { motion } from 'motion/react';
import { Trophy, X, CornerDownRight } from 'lucide-react';
import { 
  SUBLEIS_SACRIFICIO, 
  SUBLEIS_INJUSTICA, 
  SUBLEIS_DOR, 
  SUBLEIS_RENUNCIA, 
  resolveSubLawTexts 
} from '../../data/planConstants';
import { CULPAS_INFO, MEDOS_INFO } from '../journey/MabiDiagnosticMatrix';
import { getMabiRecommendation } from '../../lib/mabiEngine';

interface PlanDetailsModalProps {
  viewingPlanDetail: any;
  selectedUserDisplayName?: string;
  onClose: () => void;
}

export const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  viewingPlanDetail,
  selectedUserDisplayName,
  onClose
}) => {
  if (!viewingPlanDetail) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-gold" />
            <div>
              <h3 className="text-xl sm:text-2xl font-serif text-white">
                Alianças de {selectedUserDisplayName || 'Membro'}
              </h3>
              <p className="text-xs text-white/40 uppercase tracking-widest font-sans">
                {new Date(viewingPlanDetail.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 font-sans">
          {/* Fase 1 Blocks */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold/60">Fase 1: A Contabilidade Familiar</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: '1. SACRIFÍCIO NÃO RECONHECIDO', data: viewingPlanDetail.fase1?.sacrificio },
                { title: '2. INJUSTIÇA NÃO REPARADA', data: viewingPlanDetail.fase1?.injustica },
                { title: '3. DOR NÃO PROCESSADA', data: viewingPlanDetail.fase1?.dor },
                { title: '4. RENÚNCIA / EXCLUÍDO', data: viewingPlanDetail.fase1?.renuncia }
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
                    <span className="text-[9px] uppercase font-bold text-white/30 font-sans">Familiar:</span>
                    <p className="text-xs text-white/80">{item.data?.familiar || <span className="italic text-white/25 font-sans">Não informado</span>}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-white/30 font-sans">Fatos:</span>
                    <p className="text-xs text-white/60 line-clamp-3">{item.data?.fatos || <span className="italic text-white/25 font-sans">Não informado</span>}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fase 2: Diagnóstico de Sintomas & Subleis */}
          <div className="space-y-4 font-sans">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold/60 font-sans">
              Fase 2: Diagnóstico de Sintomas & Subleis do Espelho da Vida
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: '1. SACRIFÍCIO', items: resolveSubLawTexts(viewingPlanDetail.sintomas?.sacrificio, SUBLEIS_SACRIFICIO) },
                { title: '2. INJUSTIÇA', items: resolveSubLawTexts(viewingPlanDetail.sintomas?.injustica, SUBLEIS_INJUSTICA) },
                { title: '3. DOR', items: resolveSubLawTexts(viewingPlanDetail.sintomas?.dor, SUBLEIS_DOR) },
                { title: '4. RENÚNCIA', items: resolveSubLawTexts(viewingPlanDetail.sintomas?.renuncia, SUBLEIS_RENUNCIA) }
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
          <div className="border border-gold/30 p-5 rounded-2xl bg-gold/5 space-y-2 font-sans">
            <h4 className="text-xs font-serif font-bold text-gold tracking-widest uppercase">A SENTENÇA ONTO-SISTÊMICA</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              A sua estagnação atual não é um problema de mentalidade ou competência. Os quadrantes que você mapeou provam que o seu sistema nervoso transformou a história da sua família em um <strong>Acordo Biológico</strong>. Ele registrou que o sacrifício e a dor deles representam o território <strong>FAMILIAR (seguro)</strong>, e que a sua prosperidade autoral é <strong>NÃO-FAMILIAR</strong>. Você está limitando a sua identidade para não trair a Contabilidade Familiar da linhagem.
            </p>
          </div>

          {/* Mapa Clínico do Acordo Biológico (Admin view) */}
          {viewingPlanDetail.clinicalMap && (() => {
            const selectedSymptomTexts: string[] = [];
            if (viewingPlanDetail.sintomas) {
              const { sacrificio = [], injustica = [], dor = [], renuncia = [] } = viewingPlanDetail.sintomas;
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
              if (viewingPlanDetail.sintomas) {
                const { sacrificio = [], injustica = [], dor = [], renuncia = [] } = viewingPlanDetail.sintomas;
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
              if (viewingPlanDetail.fase1) {
                const { sacrificio, injustica, dor, renuncia } = viewingPlanDetail.fase1;
                if (sacrificio?.familiar) list.push(`${sacrificio.familiar} (Sacrifício)`);
                if (injustica?.familiar) list.push(`${injustica.familiar} (Injustiça)`);
                if (dor?.familiar) list.push(`${dor.familiar} (Dor)`);
                if (renuncia?.familiar) list.push(`${renuncia.familiar} (Renúncia)`);
              }
              return list.length > 0 ? list.join('; ') : "Não especificado";
            };

            const getSilentContracts = () => {
              const contracts: string[] = [];
              if (viewingPlanDetail.fase1) {
                const { sacrificio, injustica, dor, renuncia } = viewingPlanDetail.fase1;
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

            const mi = viewingPlanDetail.clinicalMap.mabiInputs || {};

            return (
              <div className="space-y-4 font-sans">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold/60">Mapa Clínico do Acordo Biológico</h4>
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
                          {viewingPlanDetail.clinicalMap.visceralSensation || getSomaticSensations() || "Tensão muscular involuntária e padrão de hipervigilância sistêmica."}
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

                  {/* COL 2: A Trava & A Liberação */}
                  <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gold/60 border-b border-white/10 pb-2 block">
                      2. A TRAVA & A LIBERAÇÃO
                    </span>
                    <div className="space-y-4 text-xs leading-relaxed">
                      {mi.culpa && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-left">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                            Contrato M.A.B.I. Ativo
                          </span>
                          <p className="text-sm font-bold text-white font-serif">
                            {CULPAS_INFO[mi.culpa]?.nome || mi.culpa} + {MEDOS_INFO[mi.medo]?.nome || mi.medo}
                          </p>
                        </div>
                      )}

                      {viewingPlanDetail.clinicalMap.tacticalAction && (
                        <div className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2">
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                            Ação Tática Prescrita
                          </span>
                          <p className="text-xs text-white/80">
                            {viewingPlanDetail.clinicalMap.tacticalAction}
                          </p>
                          {viewingPlanDetail.clinicalMap.actionCompleted !== undefined && (
                            <div className="pt-2 flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                viewingPlanDetail.clinicalMap.actionCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-white/10 text-white/50'
                              }`}>
                                {viewingPlanDetail.clinicalMap.actionCompleted ? '✓ Ato Concluído' : 'Ato Pendente'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </div>
  );
};
