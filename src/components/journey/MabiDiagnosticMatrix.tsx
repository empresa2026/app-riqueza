import React from 'react';

export const CULPAS_INFO: Record<string, { nome: string }> = {
  Sobrevivente: { nome: 'Culpa de Sobrevivente' },
  Separacao: { nome: 'Culpa de Separação' },
  Responsabilidade: { nome: 'Culpa de Responsabilidade' },
  AutoOdio: { nome: 'Auto-Ódio' },
  Deslealdade: { nome: 'Culpa de Deslealdade' }
};

export const MEDOS_INFO: Record<string, { nome: string }> = {
  Exposicao: { nome: 'Medo de Exposição' },
  Exclusao: { nome: 'Medo de Exclusão' },
  Morte: { nome: 'Medo de Morte' },
  Aniquilacao: { nome: 'Medo de Aniquilação' },
  Perda: { nome: 'Medo de Perda' }
};

export function MabiDiagnosticMatrix() {
  return null;
}
