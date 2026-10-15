// Os 4 Padrões (Sacrifício, Perda/Injustiça, Dor, Renúncia) e as possíveis
// manifestações no corpo associadas a cada um. Os ids seguem as leis do diagnóstico
// (fase1 / sintomas do EnjoymentPlan).

export type PadraoId = 'sacrificio' | 'injustica' | 'dor' | 'renuncia';

// sinal: sinais e tensões do corpo
// cronica: condições crônicas ou recorrentes (com acompanhamento)
// grave: condições que exigem tratamento médico
export type TipoManifestacao = 'sinal' | 'cronica' | 'grave';

export interface ManifestacaoCorpo {
  nome: string;
  gatilho: string;
  tipo: TipoManifestacao;
}

export interface Padrao {
  id: PadraoId;
  numero: string;
  nome: string;
  sequestra: string;
  gatilho: string;
  emocao: string;
  comportamento: string;
  cor: string;
  mapaCorporal: string[];
  lastro: string[];
  crencas: string[];
  manifestacoes: ManifestacaoCorpo[];
}

export const TIPOS_MANIFESTACAO: Record<TipoManifestacao, { titulo: string; nota?: string }> = {
  sinal: { titulo: 'Sinais e tensões do corpo' },
  cronica: {
    titulo: 'Condições crônicas ou recorrentes',
    nota: 'Mantenha o acompanhamento com seu médico.'
  },
  grave: {
    titulo: 'Condições que exigem tratamento médico',
    nota: 'Leitura de padrão, não de causa. Nenhum protocolo substitui o seu tratamento médico.'
  }
};

export const PADROES: Padrao[] = [
  {
    id: 'sacrificio',
    numero: '01',
    nome: 'SACRIFÍCIO',
    sequestra: 'TER MAIS',
    gatilho: 'CULPA',
    emocao: 'Culpa • Ansiedade por agradar • Controle',
    comportamento: 'Esforço extremo • Carregar outros • Provar valor pelo sofrimento',
    cor: '#E0A030',
    mapaCorporal: ['Ombros', 'Estômago', 'Costas média/inferior', 'Braços', 'Coluna', 'Mãos', 'Varizes', 'Tornozelo', 'Fadiga', 'Cãibras'],
    lastro: [
      'Cherofobia (medo da alegria)',
      'Young — Esquema de Autossacrifício',
      'Boszormenyi-Nagy — Lealdade Invisível',
      'Porges — Fawn / agradar para sobreviver'
    ],
    crencas: [
      'Se eu descansar sou folgado / vagabundo',
      'Preciso carregar todos senão tudo desmorona',
      'Ter mais prazer que meu sistema é trair',
      'Dinheiro só vem com exaustão extrema',
      'Se eu não segurar, sou culpado',
      'Não posso ter mais que meus pais',
      'Descansar dá culpa física',
      'Preciso provar valor pelo esforço',
      'Alegria precisa ser merecida com sofrimento',
      'Se eu disser não, sou egoísta',
      'Meu valor está no quanto aguento',
      'Preciso controlar tudo para não dar errado',
      'Se eu soltar, serei julgado',
      'Não mereço leveza',
      'Amor se compra com sacrifício',
      'Parar é fracassar',
      'Se eu tiver mais, tiro de alguém',
      'Meu corpo só pode parar quando quebrar',
      'Culpa é bússola de responsabilidade',
      'Carregar o fardo é meu papel na família'
    ],
    manifestacoes: [
      { nome: 'Cabelos brancos', gatilho: 'Tensão crônica por carregar', tipo: 'sinal' },
      { nome: 'Calvície', gatilho: 'Controle', tipo: 'sinal' },
      { nome: 'Cãibras abdominais', gatilho: 'Retenção', tipo: 'sinal' },
      { nome: 'Braços', gatilho: 'Sobrecarga de segurar', tipo: 'sinal' },
      { nome: 'Dor nas costas (região média)', gatilho: 'Culpa passada', tipo: 'sinal' },
      { nome: 'Dor lombar', gatilho: 'Medo de faltar', tipo: 'sinal' },
      { nome: 'Mãos', gatilho: 'Dificuldade de soltar', tipo: 'sinal' },
      { nome: 'Tornozelo', gatilho: 'Medo de direção', tipo: 'sinal' },
      { nome: 'Ombros caídos', gatilho: 'Fardo', tipo: 'sinal' },
      { nome: 'Unha encravada', gatilho: 'Culpa por avançar', tipo: 'sinal' },
      { nome: 'Fadiga persistente', gatilho: 'Resistência', tipo: 'sinal' },
      { nome: 'Inchaço / prisão de ventre', gatilho: 'Retenção', tipo: 'sinal' },
      { nome: 'Coluna — desvios, escoliose, lordose, hérnia de disco', gatilho: 'Falta de apoio', tipo: 'cronica' },
      { nome: 'Dor aguda ou contínua', gatilho: 'Busca de castigo', tipo: 'cronica' },
      { nome: 'Colesterol alto', gatilho: 'Bloqueio da alegria', tipo: 'cronica' },
      { nome: 'Varizes', gatilho: 'Sobrecarga', tipo: 'cronica' },
      { nome: 'Úlcera péptica', gatilho: 'Autoataque', tipo: 'cronica' },
      { nome: 'Infecções sexualmente transmissíveis', gatilho: 'Culpa sexual', tipo: 'grave' },
      { nome: 'Distrofia muscular', gatilho: 'Hipercontrole', tipo: 'grave' },
      { nome: 'Coração — distúrbios, infarto', gatilho: 'Endurecimento por esforço', tipo: 'grave' }
    ]
  },
  {
    id: 'injustica',
    numero: '02',
    nome: 'PERDA / INJUSTIÇA',
    sequestra: 'SER GRANDE',
    gatilho: 'PERDA DE ESPAÇO, DIREITO, VOZ',
    emocao: 'Ressentimento • Raiva contida • Indignação',
    comportamento: 'Submissão passivo-agressiva • Medo de conflito • Engolir calado',
    cor: '#3FB57A',
    mapaCorporal: ['Mandíbula', 'Pescoço / Garganta', 'Dentes / Siso', 'Tireoide', 'Ouvidos', 'Maxilar', 'Nódulos', 'Febres'],
    lastro: [
      'Goulding — Decisão de Não Ser Importante',
      'Kegan — Lealdade à não-autoria',
      'Porges — Colapso dorsal / submissão',
      'Young — Subjugação + Inibição Emocional'
    ],
    crencas: [
      'Meu espaço foi retirado',
      'Meu direito não foi reconhecido',
      'Se eu reivindicar vou perder vínculo',
      'Preciso engolir desaforo pra pertencer',
      'Não posso dizer não senão serei punido',
      'Fui passado pra trás',
      'Engoli calado por anos',
      'Se eu me posicionar vão me excluir',
      'Minha voz não tem peso',
      'Justiça nunca chega pra mim',
      'Preciso aceitar migalhas',
      'Reclamar é ser ingrato',
      'Meu limite será visto como agressão',
      'Fui silenciado',
      'Se eu cobrar, sou difícil',
      'Tenho que sorrir enquanto me invadem',
      'Não tenho direito de ocupar meu lugar',
      'Falar o que penso quebra a aliança',
      'Fui desrespeitado e precisei normalizar',
      'Meu não é punido, meu sim é explorado'
    ],
    manifestacoes: [
      { nome: 'Dentes / siso incluso', gatilho: 'Falta de espaço', tipo: 'sinal' },
      { nome: 'Mandíbula / maxilar travado (bruxismo)', gatilho: 'Aperto', tipo: 'sinal' },
      { nome: 'Gagueira', gatilho: 'Voz travada', tipo: 'sinal' },
      { nome: 'Hemorroidas', gatilho: 'Retenção de raiva', tipo: 'sinal' },
      { nome: 'Tontura / enjoo em veículo / ronco', gatilho: 'Impotência espacial', tipo: 'sinal' },
      { nome: 'Artrite / artrite reumatoide', gatilho: 'Ressentimento crônico', tipo: 'cronica' },
      { nome: 'Bócio', gatilho: 'Voz suprimida', tipo: 'cronica' },
      { nome: 'Bursite', gatilho: 'Raiva engolida', tipo: 'cronica' },
      { nome: 'Candidíase', gatilho: 'Frustração relacional', tipo: 'cronica' },
      { nome: 'Ouvidos — dor, surdez, mastoidite', gatilho: 'Não querer ouvir desaforo', tipo: 'cronica' },
      { nome: 'Nódulos', gatilho: 'Ego ferido', tipo: 'cronica' },
      { nome: 'Fibrose / miomas', gatilho: 'Impotência', tipo: 'cronica' },
      { nome: 'Enxaqueca', gatilho: 'Imposição', tipo: 'cronica' },
      { nome: 'Rinite alérgica', gatilho: 'Invasão emocional', tipo: 'cronica' },
      { nome: 'Rins / infecção urinária / nefrite', gatilho: 'Crítica', tipo: 'cronica' },
      { nome: 'Tireoide — hipo / hiper', gatilho: 'Humilhação', tipo: 'cronica' },
      { nome: 'Trismo / febres recorrentes', gatilho: 'Raiva contida que queima', tipo: 'cronica' },
      { nome: 'Câncer', gatilho: 'Mágoa longa', tipo: 'grave' },
      { nome: 'Osteomielite', gatilho: 'Estrutura invadida', tipo: 'grave' },
      { nome: 'Reumatismo / tumores', gatilho: 'Vitimização', tipo: 'grave' }
    ]
  },
  {
    id: 'dor',
    numero: '03',
    nome: 'DOR',
    sequestra: 'ESTAR BEM',
    gatilho: 'DOR • CAOS • TRAGÉDIA',
    emocao: 'Terror • Vício em estresse • Luto não processado',
    comportamento: 'Autossabotagem dramática • Compulsão • Reativação de estresse • Drama',
    cor: '#D2693F',
    mapaCorporal: ['Peito', 'Azia', 'Coração', 'Estômago', 'Baço', 'Bexiga', 'Pâncreas', 'Náuseas', 'Intestino'],
    lastro: [
      'Van der Kolk — O corpo guarda as marcas',
      'Kaufman — Vergonha tóxica + repetição',
      'Gabor Maté — Quando o corpo diz não',
      'Porges — Hiperativação simpática crônica'
    ],
    crencas: [
      'Se eu ficar bem algo ruim acontece',
      'Paz é perigosa',
      'Não posso ficar em paz sem culpa',
      'Alegria vem seguida de tragédia',
      'Se eu for feliz vou pagar preço',
      'Não resta doçura pra mim',
      'Felicidade é prelúdio de perda',
      'Se eu relaxar, o caos volta',
      'Estar bem é trair quem sofreu',
      'Amor e dor são inseparáveis',
      'Eu não sei existir sem drama',
      'Calma me dá pânico',
      'Preciso recriar a crise pra me sentir vivo',
      'Se não dói, não é verdadeiro',
      'Meu corpo precisa gritar pra eu ser visto',
      'Alegria me torna vulnerável',
      'Quando tudo acalma, eu saboto',
      'Sofrer é familiar, paz é estranha',
      'Não confio no bem-estar',
      'Bem-estar cobra juros'
    ],
    manifestacoes: [
      { nome: 'Azia', gatilho: 'Aperto', tipo: 'sinal' },
      { nome: 'Bexiga', gatilho: 'Retenção ansiosa', tipo: 'sinal' },
      { nome: 'Diarreia', gatilho: 'Fuga', tipo: 'sinal' },
      { nome: 'Gastrite / indigestão', gatilho: 'Inflamação emocional', tipo: 'sinal' },
      { nome: 'Insônia / distúrbios do sono', gatilho: 'Hipervigilância', tipo: 'sinal' },
      { nome: 'Náuseas / nervosismo', gatilho: 'Rejeição', tipo: 'sinal' },
      { nome: 'Tensão pré-menstrual', gatilho: 'Confusão', tipo: 'sinal' },
      { nome: 'Crises de falta de ar', gatilho: 'Pânico de bem-estar', tipo: 'cronica' },
      { nome: 'Baço', gatilho: 'Obsessão', tipo: 'cronica' },
      { nome: 'Bronquite', gatilho: 'Inflamação familiar', tipo: 'cronica' },
      { nome: 'Colite / intestino / gases', gatilho: 'Não digerir a dor', tipo: 'cronica' },
      { nome: 'Doenças crônicas em geral', gatilho: 'Resistência à mudança', tipo: 'cronica' },
      { nome: 'Coração — distúrbios, infarto, trombose', gatilho: 'Falta de doçura', tipo: 'grave' },
      { nome: 'Derrame (AVC)', gatilho: 'Desistência', tipo: 'grave' },
      { nome: 'Diabetes / hiperglicemia / hipoglicemia', gatilho: 'Perda de doçura', tipo: 'grave' },
      { nome: 'Enurese noturna / epilepsia', gatilho: 'Terror', tipo: 'grave' },
      { nome: 'Pneumonia / tuberculose', gatilho: 'Exaustão de dor', tipo: 'grave' },
      { nome: 'Laringite / meningite', gatilho: 'Caos familiar', tipo: 'grave' },
      { nome: 'Esclerose múltipla', gatilho: 'Rigidez para não sentir', tipo: 'grave' }
    ]
  },
  {
    id: 'renuncia',
    numero: '04',
    nome: 'RENÚNCIA',
    sequestra: 'IR ALÉM',
    gatilho: 'RENÚNCIA • VERGONHA DE BRILHAR',
    emocao: 'Vergonha de se destacar • Medo de exclusão • Invisibilidade',
    comportamento: 'Apagamento • Invisibilidade • Castração do brilho • Autoria sabotada',
    cor: '#9AA5B8',
    mapaCorporal: ['Cabeça', 'Garganta', 'Pescoço', 'Pés', 'Pernas', 'Joelhos', 'Quadril', 'Ombros', 'Rosto', 'Olhos', 'Nariz', 'Ouvidos', 'Tireoide'],
    lastro: [
      'Winnicott — Falso self',
      'Kaufman — Vergonha tóxica de ser visto',
      'Goulding — Não Seja Grande',
      'Kegan — Imunidade à expansão'
    ],
    crencas: [
      'Se eu aparecer serei expulso',
      'Não posso cobrar o que valho',
      'Brilhar é perigoso',
      'Melhor ficar no bastidor',
      'Se eu for excelente vão me rejeitar',
      'Não é seguro ser eu mesmo',
      'Ser visto é ser atacado',
      'Se eu for grande, fico sozinho',
      'Minha potência ameaça',
      'É melhor me diminuir pra caber',
      'Autoria é arrogância',
      'Quem sou eu pra ensinar?',
      'Se eu avançar, perco amor',
      'Não mereço palco',
      'Preciso me esconder pra pertencer',
      'Mostrar meu trabalho é me expor',
      'Minha voz é demais',
      'Se eu brilhar, causo inveja',
      'Invisível é mais seguro',
      'Ir além é trair minhas raízes'
    ],
    manifestacoes: [
      { nome: 'Ansiedade / apatia', gatilho: 'Desconfiança', tipo: 'sinal' },
      { nome: 'Aperto na garganta / pescoço / torcicolo', gatilho: 'Trava de expressão', tipo: 'sinal' },
      { nome: 'Apetite em excesso ou em falta', gatilho: 'Proteção', tipo: 'sinal' },
      { nome: 'Celulite', gatilho: 'Medo de direção própria', tipo: 'sinal' },
      { nome: 'Dor de cabeça', gatilho: 'Autoinvalidação', tipo: 'sinal' },
      { nome: 'Dor nas costas (região alta)', gatilho: 'Falta de apoio', tipo: 'sinal' },
      { nome: 'Quadril / pernas / pés / joelhos', gatilho: 'Medo de ir além', tipo: 'sinal' },
      { nome: 'Rosto / nariz / sinusite', gatilho: 'Vergonha de aparecer', tipo: 'sinal' },
      { nome: 'Roer unhas / urticária / verrugas / compulsões', gatilho: 'Autoataque por brilho', tipo: 'sinal' },
      { nome: 'Amigdalite', gatilho: 'Criatividade sufocada', tipo: 'cronica' },
      { nome: 'Saúde feminina — miomas, ovários, útero, vaginite', gatilho: 'Rejeição da criação', tipo: 'cronica' },
      { nome: 'Olhos — astigmatismo, catarata, conjuntivite, glaucoma', gatilho: 'Medo de ver-se grande', tipo: 'cronica' },
      { nome: 'Tireoide / suprarrenais / labirintite', gatilho: 'Exaustão de se conter', tipo: 'cronica' },
      { nome: 'Infertilidade', gatilho: 'Desistência de si', tipo: 'cronica' },
      { nome: 'Amnésia', gatilho: 'Fuga', tipo: 'grave' },
      { nome: 'Anorexia', gatilho: 'Autorrejeição', tipo: 'grave' },
      { nome: 'Tumor cerebral / síndrome de Cushing', gatilho: 'Hiperprodução mental', tipo: 'grave' },
      { nome: 'Desmaios', gatilho: 'Apagamento', tipo: 'grave' },
      { nome: 'Lúpus / leucemia', gatilho: 'Desistência de si', tipo: 'grave' }
    ]
  }
];

export const getPadrao = (id: PadraoId) => PADROES.find(p => p.id === id)!;
