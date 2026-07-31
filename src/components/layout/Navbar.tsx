import React from 'react';
import { 
  Crown, 
  Activity, 
  Map, 
  Flame, 
  ShieldAlert, 
  Plus,
  FolderOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavbarProps {
  view: 'library' | 'admin' | 'quiz' | 'history' | 'matrices' | 'plan' | 'protocols' | 'journeys' | 'padroes' | 'ativacao' | 'estacoes';
  setView: (view: 'library' | 'admin' | 'quiz' | 'history' | 'matrices' | 'plan' | 'protocols' | 'journeys' | 'padroes' | 'ativacao' | 'estacoes') => void;
  isAdmin: boolean;
}

export function Navbar({ view, setView, isAdmin }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-2 py-3 sm:p-4 z-50">
      <div className="max-w-xl mx-auto flex justify-between items-center gap-1">
        
        {/* ALIANÇAS */}
        <button 
          onClick={() => setView('plan')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
            view === 'plan' ? "text-gold animate-pulse" : "text-white/20 hover:text-white/40"
          )}
        >
          <Crown className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
            Alianças
          </span>
        </button>


        {/* PADROES */}
        <button 
          onClick={() => setView('padroes')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
            view === 'padroes' ? "text-gold" : "text-white/20 hover:text-white/40"
          )}
        >
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
            Padrões
          </span>
        </button>

        {/* MAPA (anteriormente AÇOES) */}
        <button 
          onClick={() => setView('matrices')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
            view === 'matrices' ? "text-gold" : "text-white/20 hover:text-white/40"
          )}
        >
          <Map className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
            Mapa
          </span>
        </button>

        {/* AÇÕES (anteriormente ATIVAÇÃO) */}
        <button 
          onClick={() => setView('ativacao')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
            view === 'ativacao' ? "text-gold" : "text-white/20 hover:text-white/40"
          )}
        >
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
            Ações
          </span>
        </button>

        {/* ESTAÇÕES */}
        <button 
          onClick={() => setView('estacoes')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
            view === 'estacoes' ? "text-gold" : "text-white/20 hover:text-white/40"
          )}
        >
          <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
            Estações
          </span>
        </button>

        {/* PROTOCOLOS */}
        <button 
          onClick={() => setView('protocols')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
            view === 'protocols' ? "text-gold" : "text-white/20 hover:text-white/40"
          )}
        >
          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
            Protocolos
          </span>
        </button>

        {/* GESTÃO (ADMIN) */}
        {isAdmin && (
          <button 
            onClick={() => setView('admin')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center",
              view === 'admin' ? "text-gold" : "text-white/20 hover:text-white/40"
            )}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-tight truncate w-full max-w-full px-0.5">
              Gestão
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
