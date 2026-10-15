import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, X } from 'lucide-react';
import { Protocol } from '../../types';
import { PROTOCOLS } from '../../data/protocols';
import { SITUACOES_SOS } from '../../data/intervencao';

interface SosButtonProps {
  onIniciarProtocolo: (protocol: Protocol) => void;
}

export function SosButton({ onIniciarProtocolo }: SosButtonProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        aria-label="Aconteceu agora"
        className="fixed right-4 bottom-24 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-luxury-black border border-gold/40 text-gold text-xs font-bold shadow-lg shadow-black/50 hover:bg-gold hover:text-black transition-colors"
      >
        <LifeBuoy className="w-4 h-4" /> SOS
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setAberto(false)}
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-luxury-black border border-white/10 rounded-3xl p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif">Aconteceu agora?</h3>
                  <p className="text-white/40 text-xs mt-1">Escolha o que está acontecendo. O protocolo certo abre na hora.</p>
                </div>
                <button onClick={() => setAberto(false)} aria-label="Fechar" className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {SITUACOES_SOS.map(situacao => (
                  <button
                    key={situacao.id}
                    onClick={() => {
                      const protocolo = PROTOCOLS.find(p => p.id === situacao.protocoloId);
                      if (!protocolo) return;
                      setAberto(false);
                      onIniciarProtocolo(protocolo);
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-gold/40 transition-colors"
                  >
                    <div className="text-sm font-bold">{situacao.titulo}</div>
                    <div className="text-[11px] text-white/40 mt-1">{situacao.descricao}</div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-white/30">Em sofrimento intenso, ligue 188 (CVV).</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
