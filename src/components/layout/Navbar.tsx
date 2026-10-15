import React from 'react';
import { Compass, Users, TrendingDown, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export type AppView = 'diagnostico' | 'intervencao' | 'evolucao' | 'protocols' | 'admin';

interface NavbarProps {
  view: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
}

const ABAS: { view: AppView; label: string; icon: React.ElementType }[] = [
  { view: 'diagnostico', label: 'Diagnóstico', icon: Compass },
  { view: 'intervencao', label: 'Intervenção', icon: Users },
  { view: 'evolucao', label: 'Evolução', icon: TrendingDown }
];

export function Navbar({ view, setView, isAdmin }: NavbarProps) {
  const abas = isAdmin ? [...ABAS, { view: 'admin' as AppView, label: 'Gestão', icon: Plus }] : ABAS;
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-2 py-3 sm:p-4 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center gap-1">
        {abas.map(({ view: alvo, label, icon: Icon }) => {
          const ativa = view === alvo || (alvo === 'intervencao' && view === 'protocols');
          return (
            <button
              key={alvo}
              onClick={() => setView(alvo)}
              className={cn(
                'flex flex-col items-center gap-1 transition-all min-w-0 flex-1 text-center',
                ativa ? 'text-gold' : 'text-white/30 hover:text-white/50'
              )}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-tight truncate w-full">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
