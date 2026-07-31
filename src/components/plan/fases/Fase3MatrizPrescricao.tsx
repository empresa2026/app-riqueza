import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crown, Printer, CornerDownRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { cn } from '../../../lib/utils';
import { 
  AREAS, 
  SUBLEIS_SACRIFICIO, 
  SUBLEIS_INJUSTICA, 
  SUBLEIS_DOR, 
  SUBLEIS_RENUNCIA 
} from '../../../data/planConstants';
import { getMabiRecommendation } from '../../../lib/mabiEngine';
import { CULPAS_INFO, MEDOS_INFO } from '../../journey/MabiDiagnosticMatrix';
import { Fase1Data } from './Fase1Contabilidade';
import { SintomasData } from './Fase2Sintomas';

export const MATRIZ_LEIS = {
  sacrificio: {
    label: "1. A LEI DO SACRIFÍCIO",
    subLabel: "Dívida de Esforço & Exaustão",
    DINHEIRO: "Se eu não estiver exausto, o dinheiro é imoral ou ilegítimo.",
    AMOR: "O amor verdadeiro exige aguentar o insuportável e esquecer de mim.",
    SAÚDE: "A saúde é secundária; o corpo só serve para trabalhar e aguentar o tranco.",
    CARREIRA: "Trabalhar com leveza é trair a luta e a suada história da minha família."
  },
  injustica: {
    label: "2. A LEI DA INJUSTIÇA",
    subLabel: "Dívida de Mérito & Julgamento",
    DINHEIRO: "Se eu ganhar mais do que eles, estou sendo injusto com quem sofreu.",
    AMOR: "Relacionamentos leves são suspeitos; o amor tem que ser um acerto de contas.",
    SAÚDE: "Meu corpo carrega a dor e a amargura de quem foi injustiçado antes.",
    CARREIRA: "O sucesso de verdade é perigoso; atrai traição, inveja ou roubo."
  },
  dor: {
    label: "3. A LEI DA DOR",
    subLabel: "Dívida de Luto & Sofrimento",
    DINHEIRO: "A alegria financeira atrai desgraça; é preciso sofrer para compensar.",
    AMOR: "Eu só sei amar na dor, no luto, no resgate ou na separação traumática.",
    SAÚDE: "Adoecer é a minha forma silenciosa de honrar o sofrimento da minha linhagem.",
    CARREIRA: "Triunfar sem dor é uma afronta ao luto e às perdas dos meus antepassados."
  },
  renuncia: {
    label: "4. A LEI DA RENÚNCIA",
    subLabel: "Dívida de Pertencimento & Invisibilidade",
    DINHEIRO: "Preciso abrir mão da minha riqueza para não me afastar de quem ficou para trás.",
    AMOR: "Eu renuncio ao meu brilho e à minha voz para que o outro não se sinta ofuscado.",
    SAÚDE: "Meu corpo se encolhe e perde a vitalidade para não chamar atenção.",
    CARREIRA: "Ocupar o topo é perigoso; prefiro ser invisível para continuar pertencendo."
  }
};

interface Fase3Props {
  fase1: Fase1Data;
  sintomas: SintomasData;
  customVisceralSensation: string;
  setCustomVisceralSensation: (val: string) => void;
  tacticalAction: string;
  setTacticalAction: (val: string) => void;
  actionCompleted: boolean;
  setActionCompleted: (val: boolean) => void;
  autoInputs: {
    culpa: string;
    arquitetura: string;
    medo: string;
    somatica: string;
    livroTipo: string;
    sinalClinico: string;
    credorAcessivel: boolean;
  };
  onBack: (prevStep: any) => void;
  onFinish: () => void;
  onPrint: () => void;
  saving: boolean;
}

export const Fase3MatrizPrescricao: React.FC<Fase3Props> = ({
  fase1,
  sintomas,
  customVisceralSensation,
  setCustomVisceralSensation,
  tacticalAction,
  setTacticalAction,
  actionCompleted,
  setActionCompleted,
  autoInputs,
  onBack,
  onFinish,
  onPrint,
  saving
}) => {
  const isCellActive = (lawKey: keyof typeof MATRIZ_LEIS, areaId: string) => {
    const hasArea = fase1[lawKey]?.areas?.includes(areaId);
    const hasSymptom = (sintomas[lawKey]?.length || 0) > 0;
    return Boolean(hasArea || hasSymptom);
  };

  const selectedSymptomTexts: string[] = [];
  sintomas.sacrificio.forEach(idx => selectedSymptomTexts.push(SUBLEIS_SACRIFICIO[idx]));
  sintomas.injustica.forEach(idx => selectedSymptomTexts.push(SUBLEIS_INJUSTICA[idx]));
  sintomas.dor.forEach(idx => selectedSymptomTexts.push(SUBLEIS_DOR[idx]));
  sintomas.renuncia.forEach(idx => selectedSymptomTexts.push(SUBLEIS_RENUNCIA[idx]));

  const getSomaticSensations = () => {
    const somaticList: string[] = [];
    if (sintomas.sacrificio.includes(66)) somaticList.push("Adoecimento por hipervigilância");
    if (sintomas.sacrificio.includes(67)) somaticList.push("Tensão crônica no pescoço/mandíbula");
    if (sintomas.sacrificio.includes(68)) somaticList.push("Fadiga crônica ignorada");
    if (sintomas.sacrificio.includes(69)) somaticList.push("Bloqueio da respiração na alegria");
    if (sintomas.injustica.includes(95)) somaticList.push("Hipervigilância corporal crônica");
    if (sintomas.injustica.includes(96)) somaticList.push("Sintomas físicos (bruxismo, gastrite)");
    if (sintomas.injustica.includes(97)) somaticList.push("Sintomas físicos em momentos de sucesso");
    if (sintomas.injustica.includes(98)) somaticList.push("Supressão de dor física");
    if (sintomas.dor.includes(110)) somaticList.push("Alarme somático de perigo ao receber");
    if (sintomas.dor.includes(122)) somaticList.push("Adoecimento solidário sistêmico");
    if (sintomas.dor.includes(123)) somaticList.push("Exaustão por supressão emocional");
    if (sintomas.dor.includes(124)) somaticList.push("Armadura corporal rígida");
    if (sintomas.dor.includes(125)) somaticList.push("Nódulo ou bloqueio na garganta");
    if (sintomas.dor.includes(126)) somaticList.push("Imunidade baixa após conquistas");
    if (sintomas.dor.includes(127)) somaticList.push("Respiração curta");
    if (sintomas.renuncia.includes(149)) somaticList.push("Cansaço existencial profundo");
    if (sintomas.renuncia.includes(150)) somaticList.push("Postura encolhida");
    if (sintomas.renuncia.includes(151)) somaticList.push("Perda de voz ou tom autoral");
    if (sintomas.renuncia.includes(153)) somaticList.push("Adoecimento ao iniciar projetos próprios");
    return somaticList.length > 0 ? somaticList.join(', ') : '';
  };

  const getLoyalPeople = () => {
    const list: string[] = [];
    if (fase1.sacrificio.familiar) list.push(`${fase1.sacrificio.familiar} (Sacrifício)`);
    if (fase1.injustica.familiar) list.push(`${fase1.injustica.familiar} (Injustiça)`);
    if (fase1.dor.familiar) list.push(`${fase1.dor.familiar} (Dor)`);
    if (fase1.renuncia.familiar) list.push(`${fase1.renuncia.familiar} (Renúncia)`);
    return list.length > 0 ? list.join('; ') : "Não especificado";
  };

  const getSilentContracts = () => {
    const contracts: string[] = [];
    if (fase1.sacrificio.familiar && fase1.sacrificio.fatos) {
      const areasStr = fase1.sacrificio.areas.length > 0 ? fase1.sacrificio.areas.join('/') : 'minha vida';
      contracts.push(`Para honrar o sacrifício de ${fase1.sacrificio.familiar}, eu me comprometo a sofrer e me exaurir no(a) ${areasStr} (${fase1.sacrificio.fatos}).`);
    }
    if (fase1.injustica.familiar && fase1.injustica.fatos) {
      const areasStr = fase1.injustica.areas.length > 0 ? fase1.injustica.areas.join('/') : 'minha vida';
      contracts.push(`Para compensar a injustiça vivida por ${fase1.injustica.familiar}, eu me comprometo a abrir mão da prosperidade no(a) ${areasStr} (${fase1.injustica.fatos}).`);
    }
    if (fase1.dor.familiar && fase1.dor.fatos) {
      const areasStr = fase1.dor.areas.length > 0 ? fase1.dor.areas.join('/') : 'minha vida';
      contracts.push(`Para carregar a dor de ${fase1.dor.familiar}, meu corpo e mente repetirão o padrão de sofrimento no(a) ${areasStr} (${fase1.dor.fatos}).`);
    }
    if (fase1.renuncia.familiar && fase1.renuncia.fatos) {
      const areasStr = fase1.renuncia.areas.length > 0 ? fase1.renuncia.areas.join('/') : 'minha vida';
      contracts.push(`Para não ofuscar ou trair a exclusão de ${fase1.renuncia.familiar}, eu renuncio ao meu brilho e destaque no(a) ${areasStr} (${fase1.renuncia.fatos}).`);
    }
    return contracts;
  };

  const activeCulpa = autoInputs.culpa;
  const activeArquitetura = autoInputs.arquitetura;
  const activeMedo = autoInputs.medo;
  const activeSomatica = autoInputs.somatica;
  const activeLivroRazao = autoInputs.livroTipo;
  const activeSinalClinico = autoInputs.sinalClinico;
  const activeCredorAcessivel = autoInputs.credorAcessivel;

  const rec = getMabiRecommendation({
    culpa: activeCulpa,
    arquitetura: activeArquitetura,
    medo: activeMedo,
    somatica: activeSomatica,
    livro_razao_tipo: activeLivroRazao,
    sinalClinico: activeSinalClinico,
    credor_acessivel: activeCredorAcessivel
  });

  const riskColor = 
    rec.risco === 'Baixo' || rec.risco === 'Baixo-Médio'
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : rec.risco === 'Médio'
      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : "bg-rose-500/10 text-rose-400 border border-rose-500/20";

  return (
    <motion.div
      key="f3_matriz"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 print-container font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 no-print">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">
            FASE 2: DIAGNÓSTICO ESTRUTURAL
          </span>
          <h2 className="text-2xl font-serif font-medium uppercase mt-1 text-white">
            A MATRIZ DAS LEIS PRÉ-CONFIGURADAS
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onPrint} className="text-white/50 hover:text-white">
            <Printer className="w-4 h-4 mr-2" /> Imprimir
          </Button>
          <span className="text-xs font-mono text-white/40 py-2">Folha 5/5</span>
        </div>
      </div>

      {/* Matrix Card Grid */}
      <div className="space-y-4">
        <p className="text-xs text-white/50 italic leading-relaxed no-print">
          Sua biologia automatizou e vinculou suas lealdades às áreas abaixo. Células em destaque dourado foram identificadas como ativas no seu diagnóstico familiar:
        </p>

        <div className="grid gap-6">
          {(Object.keys(MATRIZ_LEIS) as Array<keyof typeof MATRIZ_LEIS>).map((lawKey) => {
            const law = MATRIZ_LEIS[lawKey];
            return (
              <Card key={lawKey} className="bg-black/50 border-white/5 p-5 print-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-gold font-medium">{law.label}</h3>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{law.subLabel}</span>
                  </div>
                  <div className="text-xs text-gold/80 font-mono mt-1 md:mt-0">
                    {sintomas[lawKey].length} sintomas ativos
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  {AREAS.map((area) => {
                    const isActive = isCellActive(lawKey, area.id);
                    return (
                      <div
                        key={area.id}
                        className={cn(
                          "p-3 rounded-xl border text-left space-y-1.5 transition-all print-matrix-cell",
                          isActive 
                            ? "bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(218,165,32,0.1)] print-matrix-active" 
                            : "bg-white/[0.01] border-white/5 text-white/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[9px] font-bold tracking-wider uppercase",
                            isActive ? "text-gold" : "text-white/30"
                          )}>
                            {area.label}
                          </span>
                          {isActive && <Check className="w-3 h-3 text-gold" />}
                        </div>
                        <p className={cn(
                          "text-[11px] leading-relaxed font-sans",
                          isActive ? "text-white/90" : "text-white/40"
                        )}>
                          {law[area.id as 'DINHEIRO' | 'AMOR' | 'SAÚDE' | 'CARREIRA']}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SENTENÇA ONTO SISTÊMICA BLOCK */}
      <div className="border-2 border-gold p-6 rounded-2xl bg-gold/5 space-y-4 print-card">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-gold" />
          <h3 className="font-serif text-xl text-gold font-medium uppercase tracking-wider">
            A SENTENÇA ONTO-SISTÊMICA
          </h3>
        </div>
        <p className="text-xs md:text-sm text-white/80 leading-relaxed font-sans print-text">
          A sua estagnação atual não é um problema de mentalidade ou competência. Os quadrantes que você mapeou provam que o seu sistema nervoso transformou a história da sua família em um <strong className="text-gold font-bold font-serif italic">Acordo Biológico</strong>. Ele registrou que o sacrifício e a dor deles representam o território <span className="text-gold font-bold">FAMILIAR (seguro)</span>, e que a sua prosperidade autoral é <span className="text-gold font-bold">NÃO-FAMILIAR</span> (uma ameaça de exclusão familiar). Você está limitando a sua identidade para não trair a Contabilidade Familiar da linhagem.
        </p>
      </div>

      {/* Dynamic Clinical Map View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">DIAGNÓSTICO INTEGRADO</span>
            <h3 className="text-xl font-serif text-white font-medium">MAPA CLÍNICO DO ACORDO BIOLÓGICO</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* COL 1 */}
          <Card className="p-5 border-white/5 bg-white/[0.005] space-y-4 print-card">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold/60 border-b border-white/5 pb-2 block">
              1. A Anatomia do Bloqueio (Lealdade Inconsciente)
            </span>
            <div className="space-y-4 text-xs leading-relaxed">
              {/* Sintoma Mapeado */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                  <CornerDownRight className="w-3.5 h-3.5 text-gold/40" />
                  Sintoma Mapeado:
                </div>
                <div className="pl-5 text-white/80 font-medium font-serif italic max-h-[140px] overflow-y-auto custom-scrollbar pr-1 print-text">
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
                  <CornerDownRight className="w-3.5 h-3.5 text-gold/40" />
                  Visceralidade Corporal:
                </div>
                <div className="pl-5">
                  <input
                    type="text"
                    value={customVisceralSensation || getSomaticSensations() || "Tensão muscular involuntária e padrão de hipervigilância sistêmica."}
                    onChange={(e) => setCustomVisceralSensation(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/90 focus:outline-none focus:border-gold/50 print-text"
                    placeholder="Ex: Aperto no peito e cansaço constante"
                  />
                </div>
              </div>

              {/* Pessoa de Lealdade */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                  <CornerDownRight className="w-3.5 h-3.5 text-gold/40" />
                  Pessoa de Lealdade:
                </div>
                <div className="pl-5 text-white/90 font-medium">
                  {getLoyalPeople() !== "Não especificado" ? (
                    <div className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-gold/90 font-serif print-text">
                      {getLoyalPeople()}
                    </div>
                  ) : (
                    <div className="p-2 bg-white/[0.01] border border-dashed border-white/10 rounded-lg text-white/40 text-center italic print-text">
                      Nenhuma pessoa mapeada em Fase 1.
                    </div>
                  )}
                </div>
              </div>

              {/* O Contrato Silencioso */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-white/40 font-bold uppercase tracking-wider text-[10px]">
                  <CornerDownRight className="w-3.5 h-3.5 text-gold/40" />
                  O Contrato Silencioso:
                </div>
                <div className="pl-5 space-y-2">
                  {getSilentContracts().length > 0 ? (
                    getSilentContracts().map((contract, i) => (
                      <div key={i} className="p-2 bg-white/[0.02] border border-white/5 rounded-lg text-white/80 font-serif italic print-text">
                        “{contract}”
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-white/[0.01] border border-dashed border-white/10 rounded-lg text-white/40 text-center italic print-text">
                      Aguardando preenchimento dos fatos em Fase 1.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* COL 2 */}
          <Card className="p-5 border-white/5 bg-white/[0.005] space-y-4 print-card">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold/60 border-b border-white/5 pb-2 block">
              2. A Trava & A Liberação (Da Engenharia à Ação)
            </span>
            <div className="space-y-4 text-xs leading-relaxed">
              {/* BLOCO 1 - DIAGNÓSTICO */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Seu Contrato Ativo</span>
                </div>
                <p className="text-base font-bold text-white font-serif leading-snug">
                  {CULPAS_INFO[activeCulpa]?.nome || activeCulpa} + {MEDOS_INFO[activeMedo]?.nome || activeMedo}
                </p>
              </div>

              {/* BLOCO 2 - AÇÃO */}
              <div className="bg-slate-900 border border-white/5 rounded-xl p-5 shadow-lg space-y-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Prescrição</span>
                    <h3 className="text-base font-bold text-white mt-0.5 font-serif">{rec.modalidade}</h3>
                  </div>
                  <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider shrink-0", riskColor)}>
                    Risco {rec.risco || 'Baixo'}
                  </span>
                </div>
                
                <p className="text-xs text-white/80 leading-relaxed">
                  {rec.acao}
                </p>

                {/* ÚNICO campo de ação */}
                <div className="bg-black/30 border border-white/5 rounded-lg p-4 space-y-3">
                  <label className="text-xs font-medium text-white/70 block">
                    Meu ato de hoje:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: cobrar 20% a mais de 1 cliente"
                    value={tacticalAction}
                    onChange={(e) => setTacticalAction(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-xs focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none transition-all placeholder-white/20 print-text"
                  />
                  <button 
                    type="button"
                    onClick={() => setActionCompleted(!actionCompleted)}
                    className={cn(
                      "w-full text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2",
                      actionCompleted 
                        ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400" 
                        : "bg-teal-600 hover:bg-teal-500 text-white"
                    )}
                  >
                    {actionCompleted ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3px]" />
                        ✓ Ato Concluído com Sucesso!
                      </>
                    ) : (
                      "Marcar como feito"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-6 border-t border-white/5 no-print">
        <Button
          variant="ghost"
          onClick={() => onBack('f2_renuncia')}
          className="text-white/40 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Padrões
        </Button>

        <Button
          onClick={onFinish}
          disabled={saving}
          className="bg-gold text-black hover:bg-gold/80 flex items-center gap-2 font-bold px-8 py-3 text-sm"
        >
          {saving ? 'Salvando...' : 'Salvar e Concluir Diagnóstico Completo'}
          <Check className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
