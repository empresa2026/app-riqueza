import { TrendingUp, Heart, Activity, Briefcase } from 'lucide-react';

export const AREAS = [
  { id: 'DINHEIRO', label: 'DINHEIRO', icon: TrendingUp },
  { id: 'AMOR', label: 'AMOR', icon: Heart },
  { id: 'SAÚDE', label: 'SAÚDE', icon: Activity },
  { id: 'CARREIRA', label: 'CARREIRA', icon: Briefcase }
];

export const resolveSubLawTexts = (selectedArray: any[] | undefined, subLawsList: string[]): string[] => {
  if (!selectedArray || selectedArray.length === 0) return [];
  return selectedArray.map(item => {
    if (typeof item === 'number') {
      return subLawsList[item] || `Sublei #${item}`;
    }
    if (typeof item === 'string') {
      const num = Number(item);
      if (!isNaN(num) && subLawsList[num]) {
        return subLawsList[num];
      }
      return item;
    }
    return String(item);
  }).filter(Boolean);
};

export const SUBLEIS_SACRIFICIO = [
  "Só me sinto moralmente merecedor do sucesso se eu estiver exausto.",
  "Saboto oportunidades e negócios que chegam de forma muito fluida ou 'fácil'.",
  "Escondo ou minimizo minhas conquistas financeiras quando estou perto da família.",
  "Bato em um 'teto invisível': crio imprevistos logo após ganhar muito dinheiro.",
  "Sinto uma culpa sistêmica e irracional ao relaxar enquanto prospero.",
  "Acredito intimamente que o lucro extremo atrai inveja, punição ou desastre.",
  "Confundo amor com a capacidade de suportar fardos ou carregar o peso do outro.",
  "Destruo relacionamentos leves porque a paz conjugal me soa suspeita ou tediosa.",
  "Atraio pessoas dependentes, confirmando que o amor exige minha anulação.",
  "Sinto que aproveitar a vida é uma ofensa grave a quem lutou e perdeu na minha origem.",
  "Meu corpo adoece pela hipervigilância, pagando o preço somático do sacrifício.",
  "A tensão no pescoço/mandíbula é a minha 'temperatura normal' no trabalho.",
  "Ignoro os sinais de fadiga e colapso físico; meu corpo não tem permissão de parar.",
  "Prendo a respiração em momentos de alegria; a vitalidade plena parece perigosa.",
  "Recuso ajuda sistemicamente; preciso sofrer e resolver tudo sozinho para ter valor.",
  "Trabalho de graça ou cobro abaixo da tabela para não me sentir 'ganancioso'.",
  "Recuo ou evito posições de liderança para não ofuscar quem veio antes de mim.",
  "Tenho extrema dificuldade de delegar porque ninguém 'sofre' executando tão bem quanto eu.",
  "Acredito que o meu crescimento exige sempre um pedágio de dor ou perda equivalente.",
  "Minha mente bloqueia a visualização de um futuro grandioso sem exaustão brutal."
];

export const SUBLEIS_INJUSTICA = [
  "Vivo em estado de alerta financeiro, prevendo fraudes, golpes ou calotes a qualquer instante.",
  "Desconfio de propostas e parcerias justas; procuro a 'pegadinha' oculta em tudo.",
  "Gasto energia excessiva provando que fui injustiçado em vez de seguir em frente.",
  "Acumulo mágoas financeiras de sócios, clientes ou ex-parceiros do passado.",
  "Prevejo traição em contratos e acordos de negócios, sabotando parcerias antes de nascerem.",
  "Atraio situações de calote ou perda de dinheiro para validar minha tese de injustiça.",
  "Fico paralisado pela necessidade de punir quem me prejudicou no passado.",
  "Recuso ajuda ou crédito porque aceitar apoio me faz sentir vulnerável ao abuso.",
  "Percebo qualquer crítica profissional como uma humilhação injusta e intolerável.",
  "Acredito que o mundo é intrinsecamente desonesto e que a ética limita meus resultados.",
  "Tenho ciúmes violentos no amor, antecipando traição ou abandono moral.",
  "Provoco brigas conjugais para 'testar' a lealdade do meu parceiro até ele me deixar.",
  "Assumo o papel de vítima indefesa para garantir proteção e atenção no relacionamento.",
  "Exijo garantias absolutas e impossíveis de lealdade antes de me entregar ao amor.",
  "Acuso o parceiro de intenções ocultas mesmo quando ele demonstra afeto genuíno.",
  "Hipervigilância corporal crônica (bruxismo, estômago travado, ombros erguidos).",
  "Aparecimento de sintomas físicos recorrentes sempre que o sucesso profissional se aproxima.",
  "Sensação somática de que o chão vai sumir quando tudo está calmo e próspero.",
  "Bloqueio da garganta e supressão da voz diante de autoridades ou figuras de poder.",
  "Gasto excessivo de energia vital em defesas desnecessárias e disputas de razão."
];

export const SUBLEIS_DOR = [
  "Associo o prazer e a celebração à iminência de uma tragédia ou perda dolorosa.",
  "Interrompo momentos de alegria genuína com pensamentos catastróficos automáticos.",
  "Mantenho uma postura somática defensiva e contraída mesmo em ambientes seguros.",
  "Evito me apaixonar ou me aprofundar em conexões para não sofrer o luto da perda.",
  "Tenho pavor de sentir orgulho do meu trabalho, temendo a inveja ou a 'queda'.",
  "Sinto um alarme visceral de perigo físico sempre que recebo um elogio ou prêmio.",
  "Normalizo a exaustão emocional como se viver exigisse um estado crônico de sofrimento.",
  "Fujo do descanso porque no silêncio a dor reprimida e o vazio vêm à tona.",
  "Atraio relacionamentos abusivos ou frios que replicam a dor da minha infância.",
  "Bloqueio a intuição e a criatividade por medo de acessar memórias dolorosas.",
  "Adoto hábitos autodestrutivos (compulsões, vícios) para anestesiar dores sistêmicas.",
  "Adoecimento solidário: fico doente quando um familiar amado entra em crise.",
  "Dificuldade de respirar profundamente; tórax rígido e respiração rasa constante.",
  "Sintomas gastrointestinais ou enxaquecas em momentos cruciais de decisão.",
  "Recusa em consultar médicos ou cuidar do próprio corpo por desvalorização somática.",
  "Desenvolvo rigidez articular e muscular como uma armadura contra a dor do afeto.",
  "Imunidade baixa crônica logo após atingir metas importantes na vida ou carreira.",
  "Sensação de nó permanente no peito ou garganta ao tentar expressar vulnerabilidade.",
  "Uso a dor e a vulnerabilidade física como única forma legítima de pedir amor.",
  "Sentimento de que a minha felicidade é uma traição à dor não curada dos meus pais."
];

export const SUBLEIS_RENUNCIA = [
  "Abandono projetos e negócios promissores exatamente na etapa final de concretização.",
  "Dou minhas melhores ideias para outros executarem e levarem o crédito pelo sucesso.",
  "Mantenho-me invisível no mercado, evitando produzir conteúdo ou me posicionar.",
  "Aceito remuneração miserável por trabalhos brilhantes, renunciando ao valor real.",
  "Recuso oportunidades de expansão internacional ou crescimento por medo da exposição.",
  "Saboto minha autoridade profissional agindo como eterno aprendiz ou estagiário.",
  "Cedo minha parte em heranças, sociedade ou lucros para evitar conflitos familiares.",
  "Vivo a vida e os sonhos de outra pessoa, renunciando completamente à minha vocação.",
  "Cancelo compromissos profissionais importantes por razões banais ou autossabotagem.",
  "Sinto que me posicionar com firmeza é uma agressão aos outros; prefiro a omissão.",
  "Renuncio à vida amorosa para ser a 'coluna de apoio' de pais ou irmãos adultos.",
  "Aceito um papel secundário no relacionamento, anulando meus desejos e opiniões.",
  "Fujo de relacionamentos maduros, preferindo amores impossíveis ou à distância.",
  "Rompo parcerias afetivas logo que o nível de compromisso e intimidade aumenta.",
  "Acredito que não nasci para ser feliz no amor e aceito a solidão como destino.",
  "Postura física encolhida, ombros caídos e tom de voz inaudível ou hesitante.",
  "Cansaço existencial profundo sem causa médica explicável; falta de energia vital.",
  "Adoecimento de pele ou cordas vocais ao tentar se expressar publicamente.",
  "Negação de necessidades básicas de sono, alimentação e lazer em prol dos outros.",
  "Sensação de que sou um 'espectador' da minha própria vida, sem presença física real."
];
