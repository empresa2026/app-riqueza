import { EnjoymentPlanResult, ProtocolResult } from '../types';
import { PadraoId } from '../data/padroesCorpo';
import { contratoDaLei, DIAS_PARA_REAVALIAR, PROTOCOLO_POR_LEI } from '../data/intervencao';
import { calcularPerfilPadroes, PapelPadrao } from './perfilPadroes';

export interface PessoaDoMapa {
  lei: PadraoId;
  nome: string;
  papelFamiliar: string;
  fatos: string;
  contrato: string;
  papelPadrao: PapelPadrao;
  protocoloId: string;
  protocoloMedoId?: string;
  ultimoProtocolo?: ProtocolResult;
}

const temRespostas = (plano: EnjoymentPlanResult, campo: 'fase1' | 'sintomas') =>
  Object.values(plano[campo] || {}).some((v: any) =>
    campo === 'sintomas' ? (v?.length || 0) > 0 : !!(v?.familiar || v?.fatos || v?.areas?.length)
  );

// planHistory vem ordenado do mais recente para o mais antigo
export const ultimoPlanoComAliancas = (planos: EnjoymentPlanResult[]) => planos.find(p => temRespostas(p, 'fase1'));
export const ultimoPlanoComPadroes = (planos: EnjoymentPlanResult[]) => planos.find(p => temRespostas(p, 'sintomas'));
export const primeiroPlanoComPadroes = (planos: EnjoymentPlanResult[]) => [...planos].reverse().find(p => temRespostas(p, 'sintomas'));

// O role é usado pelo protocolo para escrever "minha mãe" / "meu pai"
function papelPeloNome(nome: string): string {
  const n = nome.trim().toLowerCase();
  if (['mãe', 'mae', 'minha mãe', 'minha mae'].includes(n)) return 'mae';
  if (['pai', 'meu pai'].includes(n)) return 'pai';
  return 'familiar';
}

export const resultadosDaPessoa = (historico: ProtocolResult[], lei: PadraoId, nome: string) =>
  historico.filter(r => r.answers?.targetPersonLaw === lei && r.answers?.targetPersonName === nome);

// Uma entrada por lei respondida em Alianças, na ordem do perfil (dominante primeiro)
export function montarPessoasDoMapa(planos: EnjoymentPlanResult[], historico: ProtocolResult[]): PessoaDoMapa[] {
  const aliancas = ultimoPlanoComAliancas(planos);
  if (!aliancas) return [];
  const padroes = ultimoPlanoComPadroes(planos);
  const perfil = calcularPerfilPadroes(padroes?.sintomas as any, aliancas.fase1 as any);

  return perfil.flatMap(({ id: lei, papel }) => {
    const dados = aliancas.fase1?.[lei];
    if (!dados || !(dados.familiar || dados.fatos || dados.areas?.length)) return [];
    const nome = dados.familiar?.trim() || 'Alguém do meu sistema';
    const [ultimoProtocolo] = resultadosDaPessoa(historico, lei, nome);
    return [{
      lei,
      nome,
      papelFamiliar: papelPeloNome(nome),
      fatos: dados.fatos || '',
      contrato: contratoDaLei(lei, nome, dados.areas || [], dados.fatos || ''),
      papelPadrao: papel,
      protocoloId: PROTOCOLO_POR_LEI[lei].culpa,
      protocoloMedoId: PROTOCOLO_POR_LEI[lei].medo,
      ultimoProtocolo
    }];
  });
}

export const diasDesde = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
export const diasParaReavaliar = (iso: string) => Math.max(0, DIAS_PARA_REAVALIAR - diasDesde(iso));
