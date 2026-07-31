import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Webhook, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  UserPlus, 
  UserMinus, 
  Clock, 
  ChevronRight,
  Code
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface WebhookLog {
  id: string;
  provider: 'kiwify' | 'hotmart';
  event: string;
  buyerEmail: string;
  buyerName: string;
  productName: string;
  status: 'paid' | 'approved' | 'refunded' | 'canceled' | 'unknown';
  actionTaken: 'grant_access' | 'revoke_access' | 'ignored';
  timestamp: string;
  rawPayload: any;
  success: boolean;
  message: string;
}

export function WebhookManagerView() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedKiwify, setCopiedKiwify] = useState(false);
  const [copiedHotmart, setCopiedHotmart] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  // Simulator Form State
  const [simProvider, setSimProvider] = useState<'kiwify' | 'hotmart'>('kiwify');
  const [simEventType, setSimEventType] = useState<'approved' | 'refunded'>('approved');
  const [simBuyerName, setSimBuyerName] = useState('Maria Silva');
  const [simBuyerEmail, setSimBuyerEmail] = useState('maria.silva@exemplo.com');
  const [simProductName, setSimProductName] = useState('Protocolo 5 Alianças Familiares');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const appUrl = window.location.origin;
  const kiwifyUrl = `${appUrl}/api/webhooks/kiwify`;
  const hotmartUrl = `${appUrl}/api/webhooks/hotmart`;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/webhooks/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Error loading webhook logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, provider: 'kiwify' | 'hotmart') => {
    navigator.clipboard.writeText(text);
    if (provider === 'kiwify') {
      setCopiedKiwify(true);
      setTimeout(() => setCopiedKiwify(false), 2000);
    } else {
      setCopiedHotmart(true);
      setTimeout(() => setCopiedHotmart(false), 2000);
    }
  };

  const handleRunSimulator = async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await fetch('/api/webhooks/test-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: simProvider,
          eventType: simEventType,
          buyerName: simBuyerName,
          buyerEmail: simBuyerEmail,
          productName: simProductName
        })
      });
      const data = await res.json();
      setSimResult(data);
      fetchLogs();
    } catch (err: any) {
      setSimResult({ success: false, error: err.message });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gold/20 via-gold/5 to-transparent border border-gold/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/10 rounded-2xl text-gold border border-gold/20">
                <Webhook className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Integração Automática</span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white">Webhooks Hotmart & Kiwify</h3>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
              Sistema de alta confiabilidade para liberação e revogação instantânea de acesso aos alunos quando uma compra ou estorno é realizado nas plataformas Hotmart ou Kiwify.
            </p>
          </div>

          <Button 
            onClick={fetchLogs} 
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold hover:text-black gap-2 shrink-0 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Logs
          </Button>
        </div>
      </div>

      {/* Webhook Endpoint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kiwify Endpoint */}
        <Card className="p-6 border-white/10 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-lg font-bold font-mono text-white">Webhook Kiwify</h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              Pronto para Uso
            </span>
          </div>

          <p className="text-xs text-white/50 leading-relaxed">
            Cadastre esta URL na Kiwify em <b>Configurações &gt; Webhooks</b> para processar eventos de compras aprovadas e reembolsos.
          </p>

          <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 font-mono text-xs">
            <span className="text-gold truncate select-all">{kiwifyUrl}</span>
            <button 
              onClick={() => copyToClipboard(kiwifyUrl, 'kiwify')}
              className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all shrink-0 flex items-center gap-1.5 text-[11px]"
            >
              {copiedKiwify ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-sans">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="font-sans">Copiar URL</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-white/40 flex items-center gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Suporta eventos: <b>order_approved</b> (libera), <b>order_refunded</b> (bloqueia).</span>
          </div>
        </Card>

        {/* Hotmart Endpoint */}
        <Card className="p-6 border-white/10 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
              <h4 className="text-lg font-bold font-mono text-white">Webhook Hotmart</h4>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
              Pronto para Uso
            </span>
          </div>

          <p className="text-xs text-white/50 leading-relaxed">
            Cadastre esta URL no Hotmart Webhook (Ferramentas &gt; Webhook) para receber notificações de compra aprovada e cancelamento.
          </p>

          <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 font-mono text-xs">
            <span className="text-gold truncate select-all">{hotmartUrl}</span>
            <button 
              onClick={() => copyToClipboard(hotmartUrl, 'hotmart')}
              className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all shrink-0 flex items-center gap-1.5 text-[11px]"
            >
              {copiedHotmart ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-sans">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="font-sans">Copiar URL</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-white/40 flex items-center gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Suporta validação de <b>Hottok</b> de segurança e eventos de aprovação/estorno.</span>
          </div>
        </Card>
      </div>

      {/* Interactive Webhook Event Simulator */}
      <Card className="p-6 sm:p-8 border-gold/20 bg-black/40 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-gold" />
            <div>
              <h4 className="text-xl font-serif text-white">Simulador de Eventos Webhook</h4>
              <p className="text-xs text-white/40">Teste o envio de payloads em tempo real sem precisar realizar uma compra real.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Plataforma</label>
            <select 
              value={simProvider}
              onChange={(e) => setSimProvider(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold/50"
            >
              <option value="kiwify" className="bg-luxury-black text-white">Kiwify</option>
              <option value="hotmart" className="bg-luxury-black text-white">Hotmart</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Tipo de Evento</label>
            <select 
              value={simEventType}
              onChange={(e) => setSimEventType(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold/50"
            >
              <option value="approved" className="bg-luxury-black text-white">Compra Aprovada (Liberar Acesso)</option>
              <option value="refunded" className="bg-luxury-black text-white">Estorno / Reembolso (Revogar Acesso)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">E-mail do Comprador</label>
            <input 
              type="email"
              value={simBuyerEmail}
              onChange={(e) => setSimBuyerEmail(e.target.value)}
              placeholder="aluno@exemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Nome do Comprador</label>
            <input 
              type="text"
              value={simBuyerName}
              onChange={(e) => setSimBuyerName(e.target.value)}
              placeholder="Nome do aluno"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Nome do Produto</label>
            <input 
              type="text"
              value={simProductName}
              onChange={(e) => setSimProductName(e.target.value)}
              placeholder="Nome do curso/plano"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Button 
            onClick={handleRunSimulator}
            disabled={simulating || !simBuyerEmail}
            className="w-full sm:w-auto bg-gold text-black font-bold hover:bg-gold/90 px-8 py-3.5 gap-2"
          >
            <Send className="w-4 h-4" />
            {simulating ? 'Simulando Envio...' : 'Simular Webhook Agora'}
          </Button>

          {simResult && (
            <div className={`text-xs px-4 py-3 rounded-xl border flex items-center gap-2 ${
              simResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}>
              {simResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              <span>{simResult.message || (simResult.success ? 'Webhook processado com sucesso!' : 'Erro na simulação')}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Received Webhook Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-serif text-white">Histórico de Webhooks Recebidos ({logs.length})</h4>
          <span className="text-xs text-white/40">Atualizado automaticamente a cada 5s</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl text-white/40 text-sm">
            Nenhum evento de Webhook recebido ainda. Use o simulador acima para gerar o primeiro evento.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card 
                key={log.id} 
                className="p-5 border-white/10 hover:border-gold/30 transition-all bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                    log.actionTaken === 'grant_access'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : log.actionTaken === 'revoke_access'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                    {log.actionTaken === 'grant_access' ? (
                      <UserPlus className="w-5 h-5" />
                    ) : log.actionTaken === 'revoke_access' ? (
                      <UserMinus className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-md font-bold ${
                        log.provider === 'kiwify' 
                          ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' 
                          : 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                      }`}>
                        {log.provider}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {log.event}
                      </span>
                      <span className="text-white/30 text-xs">•</span>
                      <span className="text-xs text-white/40 font-mono">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <h5 className="text-base font-semibold text-white mt-1">
                      {log.buyerName} <span className="text-white/40 font-normal">({log.buyerEmail})</span>
                    </h5>
                    <p className="text-xs text-white/50">
                      Produto: <span className="text-gold/90">{log.productName}</span> — {log.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedLog(log)}
                    className="text-xs py-2 px-3 border-white/10 text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                  >
                    <Code className="w-3.5 h-3.5 text-gold" />
                    Ver JSON Payload
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* How it works Architecture Guide */}
      <Card className="p-6 sm:p-8 border-white/10 space-y-6">
        <h4 className="text-xl font-serif text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gold" />
          Como Funciona o Fluxo Completo de Acesso por Webhook?
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-mono text-sm">
              1
            </div>
            <h5 className="font-bold text-white text-sm">1. O Aluno Compra</h5>
            <p className="text-xs text-white/50 leading-relaxed">
              O comprador faz o pagamento na sua página da Kiwify ou Hotmart. O gateway processa o cartão ou PIX.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-mono text-sm">
              2
            </div>
            <h5 className="font-bold text-white text-sm">2. Notificação Webhook</h5>
            <p className="text-xs text-white/50 leading-relaxed">
              A plataforma envia um POST HTTP com o JSON contendo nome, e-mail do comprador e status da transação.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-mono text-sm">
              3
            </div>
            <h5 className="font-bold text-white text-sm">3. Liberação Instantânea</h5>
            <p className="text-xs text-white/50 leading-relaxed">
              O backend cria a conta no Firestore com permissão ativa. O aluno já pode logar com o mesmo e-mail!
            </p>
          </div>
        </div>
      </Card>

      {/* JSON Payload Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-luxury-black border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-gold" />
                  <h4 className="text-lg font-bold text-white font-serif">Payload Bruto do Webhook</h4>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-black/60 rounded-2xl p-4 border border-white/10 font-mono text-xs text-emerald-400 leading-relaxed">
                <pre>{JSON.stringify(selectedLog.rawPayload, null, 2)}</pre>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setSelectedLog(null)} variant="outline" className="border-white/10">
                  Fechar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
