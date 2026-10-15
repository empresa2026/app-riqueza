import { PADROES, PadraoId } from '../data/padroesCorpo';

export type PapelPadrao = 'dominante' | 'secundario' | 'presente' | 'ausente';

export interface PadraoPontuacao {
  id: PadraoId;
  sinais: number;
  areas: number;
  intensidade: number;
  papel: PapelPadrao;
}

const SINAIS_POR_PADRAO = 20;
const AREAS_DA_VIDA = 4;
const MAX_SECUNDARIOS = 2;

type ListaPorPadrao = Partial<Record<PadraoId, unknown[]>>;
type Fase1PorPadrao = Partial<Record<PadraoId, { areas?: unknown[] }>>;

// Intensidade (0–100): 80% vem dos sinais marcados em Padrões (de 20 por padrão)
// e 20% das áreas da vida marcadas em Alianças (de 4 por padrão).
// Dominante: maior intensidade. Secundários: até 2 padrões com pelo menos 3 sinais
// e intensidade de no mínimo 60% da dominante.
export function calcularPerfilPadroes(sintomas?: ListaPorPadrao, fase1?: Fase1PorPadrao): PadraoPontuacao[] {
  const pontuacoes = PADROES.map(({ id }) => {
    const sinais = Math.min(new Set(sintomas?.[id] || []).size, SINAIS_POR_PADRAO);
    const areas = Math.min(fase1?.[id]?.areas?.length || 0, AREAS_DA_VIDA);
    const intensidade = Math.round(100 * (0.8 * sinais / SINAIS_POR_PADRAO + 0.2 * areas / AREAS_DA_VIDA));
    return { id, sinais, areas, intensidade, papel: 'ausente' as PapelPadrao };
  });

  pontuacoes.sort((a, b) => b.intensidade - a.intensidade || b.sinais - a.sinais);

  const dominante = pontuacoes[0];
  if (dominante.sinais === 0) return pontuacoes;
  dominante.papel = 'dominante';

  let secundarios = 0;
  for (const p of pontuacoes.slice(1)) {
    if (p.intensidade === 0) continue;
    const ehSecundario = secundarios < MAX_SECUNDARIOS && p.sinais >= 3 && p.intensidade >= dominante.intensidade * 0.6;
    p.papel = ehSecundario ? 'secundario' : 'presente';
    if (ehSecundario) secundarios++;
  }
  return pontuacoes;
}
