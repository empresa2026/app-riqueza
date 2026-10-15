import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  User, 
  Heart, 
  ShieldAlert, 
  Flame, 
  Zap, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Lock, 
  RefreshCw,
  Activity,
  Briefcase,
  Crosshair,
  Compass,
  X
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Journey, Protocol, ProtocolResult } from '../../types';
import { PROTOCOLS } from '../../data/protocols';

export interface MabiPerson {
  id: string;
  role: 'mae' | 'pai' | 'ancestral' | 'credor' | 'parceiro' | 'autoridade' | 'outro';
  roleLabel: string;
  name: string;
  activeGuilt: string;
  activeFear: string;
  contractStatement: string;
  somaticLocation: string;
  protocolId: string;
  protocolTitle: string;
  completedCount: number;
}

interface MabiPersonMapProps {
  journey?: Journey;
  planHistory?: any[];
  protocolHistory?: ProtocolResult[];
  onStartPersonProtocol: (person: MabiPerson, protocol: Protocol) => void;
  onStartDailyProtocol: (eventName: string, personRole?: string) => void;
}

export function MabiPersonMap({
  journey,
  planHistory,
  protocolHistory = [],
  onStartPersonProtocol,
  onStartDailyProtocol
}: MabiPersonMapProps) {
  const latestPlan = planHistory && planHistory.length > 0 ? planHistory[0] : null;
  const mAnswers = journey?.mabiAnswers || {};

  // Extract names or figures from journey or latest plan
  const ancestorName = mAnswers.passo1?.ancestorName || latestPlan?.fase1?.sacrificio?.ancestorName || 'Ancestral Mapeado';
  const judgmentOwner = mAnswers.passo3?.judgmentOwner || 'Figura de Autoridade';
  const activeCulpa = mAnswers.passo4?.mabiInputs?.culpa || 'Sobrevivente';
  const activeMedo = mAnswers.passo4?.mabiInputs?.medo || 'Exposicao';

  // Base list of persons mapped from the user's Alianças & Padrões
  const [persons, setPersons] = useState<MabiPerson[]>(() => {
    const list: MabiPerson[] = [];

    // 1. MÃE (Lealdade Materna & Separação)
    list.push({
      id: 'p_mae',
      role: 'mae',
      roleLabel: 'Mãe (Lealdade Materna)',
      name: 'Mãe',
      activeGuilt: 'Culpa de Separação / Deslealdade',
      activeFear: 'Medo de Ultrapassar / Viver Melhor',
      contractStatement: 'Proibição de viver uma vida mais leve e próspera sem carregar a mesma dor maternal.',
      somaticLocation: 'Garganta / Peito',
      protocolId: 'culpa_separacao',
      protocolTitle: 'Protocolo de Desvinculação Maternal',
      completedCount: protocolHistory.filter(p => p.answers?.targetPersonRole === 'mae').length
    });

    // 2. PAI (Lealdade Paterna & Sobrevivência)
    list.push({
      id: 'p_pai',
      role: 'pai',
      roleLabel: 'Pai (Lealdade Paterna)',
      name: 'Pai',
      activeGuilt: 'Culpa de Sobrevivente',
      activeFear: 'Medo de Exposição / Julgamento',
      contractStatement: 'Incapacidade inconsciente de faturar mais ou sobressair sem sentir que apequena o pai.',
      somaticLocation: 'Ombros / Mandíbula',
      protocolId: 'culpa_sobrevivente',
      protocolTitle: 'Protocolo de Honra sem Sacrifício',
      completedCount: protocolHistory.filter(p => p.answers?.targetPersonRole === 'pai').length
    });

    // 3. ANCESTRAL OCULTO / EXCLUÍDO
    list.push({
      id: 'p_ancestral',
      role: 'ancestral',
      roleLabel: 'Ancestral Oculto / Excluído',
      name: ancestorName !== 'Ancestral Mapeado' ? ancestorName : 'Ancestral da Linhagem',
      activeGuilt: 'Culpa de Deslealdade / Omissão',
      activeFear: 'Medo de Aniquilação / Perda de Pertencimento',
      contractStatement: 'Repetição cega da ruína ou dor do ancestral para garantir vaga no sistema familiar.',
      somaticLocation: 'Estômago / Lombar',
      protocolId: 'medo_ultrapassar',
      protocolTitle: 'Protocolo de Devolução ao Ancestral',
      completedCount: protocolHistory.filter(p => p.answers?.targetPersonRole === 'ancestral').length
    });

    // 4. CREDOR ACESSÍVEL / FIGURA DE COBRANÇA
    list.push({
      id: 'p_credor',
      role: 'credor',
      roleLabel: 'Credor / Pendência Moral',
      name: judgmentOwner !== 'Figura de Autoridade' ? judgmentOwner : 'Credor Moral',
      activeGuilt: 'Culpa de Responsabilidade Onipotente',
      activeFear: 'Medo de Subjugação / Punição',
      contractStatement: 'Necessidade compulsiva de pagar juros de sofrimento e trabalhar exaustivamente para compensar o outro.',
      somaticLocation: 'Pescoço / Cabeça',
      protocolId: 'culpa_responsabilidade',
      protocolTitle: 'Protocolo de Des-triangulação e Quitação',
      completedCount: protocolHistory.filter(p => p.answers?.targetPersonRole === 'credor').length
    });

    // 5. PARCEIRO(A) / CONJUGAL
    list.push({
      id: 'p_parceiro',
      role: 'parceiro',
      roleLabel: 'Parceiro(a) / Relação Conjugal',
      name: 'Parceiro(a) / Ex-Parceiro(a)',
      activeGuilt: 'Culpa de Auto-Ódio / Imperfeição',
      activeFear: 'Medo de Abandonar / Ser Rejeitado',
      contractStatement: 'Sabotagem da harmonia no relacionamento para testar a lealdade ou reencenar a separação dos pais.',
      somaticLocation: 'Peito / Barriga',
      protocolId: 'medo_separacao',
      protocolTitle: 'Protocolo de Autonomia Afetiva',
      completedCount: protocolHistory.filter(p => p.answers?.targetPersonRole === 'parceiro').length
    });

    return list;
  });

  // Modal State to Add Custom Person
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState<'mae' | 'pai' | 'ancestral' | 'credor' | 'parceiro' | 'autoridade' | 'outro'>('outro');
  const [newPersonContract, setNewPersonContract] = useState('');

  // Daily Event Selection
  const [selectedDailyEvent, setSelectedDailyEvent] = useState<string | null>(null);
  const [selectedLinkedPerson, setSelectedLinkedPerson] = useState<string>('mae');

  const handleAddCustomPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName) return;

    const roleLabels: Record<string, string> = {
      mae: 'Mãe',
      pai: 'Pai',
      ancestral: 'Ancestral',
      credor: 'Credor Moral',
      parceiro: 'Parceiro(a)',
      autoridade: 'Figura de Autoridade / Chefe',
      outro: 'Pessoa do Mapa'
    };

    const newP: MabiPerson = {
      id: `p_custom_${Date.now()}`,
      role: newPersonRole,
      roleLabel: roleLabels[newPersonRole] || 'Pessoa Mapeada',
      name: newPersonName,
      activeGuilt: 'Culpa Sistêmica Correspondente',
      activeFear: 'Medo de Desconexão / Traição',
      contractStatement: newPersonContract || 'Repetição inconsciente de padrões comportamentais com esta pessoa.',
      somaticLocation: 'Tensão Corporal Geral',
      protocolId: newPersonRole === 'mae' ? 'culpa_separacao' : newPersonRole === 'pai' ? 'culpa_sobrevivente' : 'culpa_responsabilidade',
      protocolTitle: `Protocolo Específico: ${newPersonName}`,
      completedCount: 0
    };

    setPersons(prev => [...prev, newP]);
    setNewPersonName('');
    setNewPersonContract('');
    setShowAddModal(false);
  };

  const dailyEventTriggers = [
    {
      id: 'e_faturar',
      icon: Briefcase,
      title: 'Tensão ao Cobrar, Vender ou Faturar',
      desc: 'Medo visceral de ter mais dinheiro, receber um valor alto ou ultrapassar a escassez familiar.',
      suggestedProtocolId: 'medo_ultrapassar',
      protocolName: 'Protocolo — Liberdade de Sobressair'
    },
    {
      id: 'e_discussao',
      icon: Heart,
      title: 'Discussão / Medo de Rejeição e Abandono',
      desc: 'Tensão em conversas difíceis ou sensação de ansiedade antes de se posicionar com o parceiro ou família.',
      suggestedProtocolId: 'medo_separacao',
      protocolName: 'Protocolo — Autonomia e Paz Relacional'
    },
    {
      id: 'e_exaustao',
      icon: Activity,
      title: 'Cansaço Súbito e Sobrecarga Inexplicável',
      desc: 'Sensação de estar carregando o mundo nas costas ou assumindo a responsabilidade por problemas alheios.',
      suggestedProtocolId: 'culpa_responsabilidade',
      protocolName: 'Protocolo — Devolução de Fardos'
    },
    {
      id: 'e_procrastinacao',
      icon: ShieldAlert,
      title: 'Procrastinação e Sabotagem perto do Resultado',
      desc: 'Criar imprevistos ou travar exatamente quando tudo está caminhando para dar certo.',
      suggestedProtocolId: 'culpa_sobrevivente',
      protocolName: 'Protocolo — Extração do Teto Invisível'
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: MAPA DE PESSOAS SISTÊMICAS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              <h3 className="text-2xl font-serif text-white">Mapa de Pessoas &amp; Lealdades Sistêmicas</h3>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Para cada pessoa identificada na sua história, execute o protocolo específico correspondente para desfazer o vínculo de culpa e medo.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold hover:text-black gap-2 text-xs self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Adicionar Pessoa ao Mapa
          </Button>
        </div>

        {/* Person Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {persons.map((person) => {
            const linkedProtocol = PROTOCOLS.find(p => p.id === person.protocolId) || PROTOCOLS[0];
            const isCompleted = person.completedCount > 0;

            return (
              <Card 
                key={person.id}
                className="p-6 border-white/10 hover:border-gold/40 transition-all bg-gradient-to-b from-white/[0.03] to-transparent flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Background Badge glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all pointer-events-none" />

                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gold/10 text-gold rounded-2xl border border-gold/20 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold/80 block">
                          {person.roleLabel}
                        </span>
                        <h4 className="text-lg font-serif font-bold text-white leading-tight">
                          {person.name}
                        </h4>
                      </div>
                    </div>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {person.completedCount}x Feito
                      </span>
                    )}
                  </div>

                  {/* Active Contrato / Lealdade */}
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 space-y-1.5 text-xs">
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest block font-bold">
                      Contrato Inconsciente
                    </span>
                    <p className="text-white/80 italic leading-relaxed">
                      "{person.contractStatement}"
                    </p>
                  </div>

                  {/* Active Guilt & Fear */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] uppercase font-bold text-rose-300/80 block">Culpa Ativa</span>
                      <span className="text-white/70 font-medium truncate block">{person.activeGuilt}</span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] uppercase font-bold text-amber-300/80 block">Medo Vinculado</span>
                      <span className="text-white/70 font-medium truncate block">{person.activeFear}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-6 mt-4 border-t border-white/5">
                  <Button
                    onClick={() => onStartPersonProtocol(person, linkedProtocol)}
                    className="w-full bg-gold text-black font-bold hover:bg-gold/90 text-xs py-3 gap-2 shadow-lg shadow-gold/5"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    Executar Protocolo com {person.name}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: PROTOCOLOS DO DIA A DIA (GATILHOS DO COTIDIANO) */}
      <Card className="p-6 sm:p-8 border-gold/20 bg-gradient-to-br from-black via-luxury-black to-black space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-gold animate-pulse" />
              <h3 className="text-2xl font-serif text-white">Protocolos do Dia a Dia (Eventos &amp; Repetições)</h3>
            </div>
            <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
              Viveu um evento desafiador hoje no trabalho, nas finanças ou nos relacionamentos? Selecione o gatilho cotidiano para fazer uma extração somática de 3 minutos em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shrink-0 self-start md:self-auto">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-xs text-white/70 font-mono">Reset Rápido (3-5 min)</span>
          </div>
        </div>

        {/* Daily Event Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyEventTriggers.map((evt) => {
            const IconComp = evt.icon;
            const isSelected = selectedDailyEvent === evt.id;

            return (
              <div 
                key={evt.id}
                onClick={() => setSelectedDailyEvent(evt.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected 
                    ? 'bg-gold/10 border-gold text-white shadow-lg shadow-gold/10' 
                    : 'bg-white/[0.02] border-white/10 hover:border-gold/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-gold text-black' : 'bg-white/10 text-gold'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-white">{evt.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed pl-1">
                    {evt.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-gold/90 font-mono text-[11px]">{evt.protocolName}</span>
                  <div className="flex items-center gap-1 text-gold font-bold">
                    <span>Selecionar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Person Linker for Daily Event */}
        {selectedDailyEvent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 border border-gold/30 rounded-2xl p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold block">
                  Conexão Sistêmica do Evento
                </span>
                <h5 className="text-sm font-bold text-white">
                  Este evento de hoje ecoa a memória de quem do seu mapa?
                </h5>
              </div>

              <select 
                value={selectedLinkedPerson}
                onChange={(e) => setSelectedLinkedPerson(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              >
                {persons.map(p => (
                  <option key={p.id} value={p.role} className="bg-luxury-black text-white">
                    {p.name} ({p.roleLabel})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={() => {
                const triggerObj = dailyEventTriggers.find(t => t.id === selectedDailyEvent);
                onStartDailyProtocol(triggerObj?.suggestedProtocolId || 'medo_ultrapassar', selectedLinkedPerson);
              }}
              className="w-full bg-gold text-black font-bold hover:bg-gold/90 py-3.5 text-xs gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              Iniciar Reset do Cotidiano Conectado ao Mapa
            </Button>
          </motion.div>
        )}
      </Card>

      {/* MODAL TO ADD NEW PERSON */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-luxury-black border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  <h4 className="text-xl font-serif text-white">Adicionar Nova Pessoa ao Mapa</h4>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-white/40 hover:text-white p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomPerson} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                    Nome da Pessoa ou Vínculo
                  </label>
                  <input 
                    type="text"
                    required
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Ex: Avó Rosa, Ex-sócio Carlos, Tio Mário..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                    Papel Sistêmico
                  </label>
                  <select 
                    value={newPersonRole}
                    onChange={(e) => setNewPersonRole(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold"
                  >
                    <option value="mae" className="bg-luxury-black text-white">Mãe / Linha Materna</option>
                    <option value="pai" className="bg-luxury-black text-white">Pai / Linha Paterna</option>
                    <option value="ancestral" className="bg-luxury-black text-white">Ancestral Oculto / Excluído</option>
                    <option value="credor" className="bg-luxury-black text-white">Credor Moral / Cobrança</option>
                    <option value="parceiro" className="bg-luxury-black text-white">Parceiro(a) / Ex-Parceiro(a)</option>
                    <option value="autoridade" className="bg-luxury-black text-white">Figura de Autoridade / Chefe / Sócio</option>
                    <option value="outro" className="bg-luxury-black text-white">Outro Membro Familiar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                    Contrato ou O que você sente que deve / repete com essa pessoa?
                  </label>
                  <textarea 
                    rows={3}
                    value={newPersonContract}
                    onChange={(e) => setNewPersonContract(e.target.value)}
                    placeholder="Ex: Sinto que preciso sofrer financeiramente para provar lealdade ou não posso ter um relacionamento feliz se essa pessoa não teve."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="border-white/10 text-white/70"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gold text-black font-bold hover:bg-gold/90"
                  >
                    Salvar no Mapa
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
