import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // ----------------------------------------------------
  // PRATELEIRA L - LEALDADES (Ataca Coluna 1 - O Contrato Invisível)
  // ----------------------------------------------------
  {
    id: "L01",
    nome: "Quem eu carrego? (Mapeamento de Linha de Dor)",
    prateleira: "L",
    ataca_coluna: 1,
    aliança_alvo: ["parentificação"],
    culpa_alvo: ["sobrevivente", "responsavel"],
    medo_alvo: ["isolamento", "subjugacao"],
    corpo_alvo: ["exaustão", "submissão"],
    duração_min: 10,
    risco: "baixo",
    instruções: [
      "1. Feche os olhos por 1 minuto e sinta o peso dos ombros.",
      "2. Escreva o nome do ancestral de quem você herdou o fardo ou a missão.",
      "3. Diga em voz alta: 'Eu carrego isso por amor, mas agora eu vejo que este peso é seu e eu sou apenas o filho.'",
      "4. Respire fundo e sinta o esvaziamento dos ombros por 2 minutos."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["E01", "C01"]
  },
  {
    id: "L02",
    nome: "Árvore de Alianças Invisíveis",
    prateleira: "L",
    ataca_coluna: 1,
    aliança_alvo: ["fusão"],
    culpa_alvo: ["deslealdade"],
    medo_alvo: ["separação", "isolamento"],
    corpo_alvo: ["paralisia", "dissociação"],
    duração_min: 12,
    risco: "baixo",
    instruções: [
      "1. Desenhe uma linha vertical dividindo uma folha. Escreva 'Minha família' à esquerda e 'Eu' à direita.",
      "2. Liste 3 regras invisíveis que você cumpre para não se destacar (Ex: 'Não ganhar mais que meu pai').",
      "3. Olhe para as regras e declare: 'Eu pertenço mesmo fazendo escolhas diferentes. Eu desato o nó da fusão.'",
      "4. Faça um risco sobre as regras da esquerda e expire demoradamente."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["E03", "C02"]
  },
  {
    id: "L03",
    nome: "Carta de Devolução Rápida",
    prateleira: "L",
    ataca_coluna: 1,
    aliança_alvo: ["parentificação", "fusão coercitiva"],
    culpa_alvo: ["responsável onipotente", "responsavel"],
    medo_alvo: ["isolamento"],
    corpo_alvo: ["submissão", "exaustão"],
    duração_min: 8,
    risco: "baixo",
    instruções: [
      "1. Escreva em 3 linhas o fardo emocional que você tomou para salvar seus pais.",
      "2. Leia em voz alta com a mão no peito.",
      "3. Rasgue a folha ou apague as palavras, declarando mentalmente: 'Isso é seu. Eu devolvo com amor e respeito.'",
      "4. Permaneça em silêncio por 2 minutos assimilando a leveza."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["E02", "M02"]
  },
  {
    id: "L04",
    nome: "Corte de Triângulo Sistêmico",
    prateleira: "L",
    ataca_coluna: 1,
    aliança_alvo: ["triângulo"],
    culpa_alvo: ["deslealdade", "sobrevivente"],
    medo_alvo: ["exposição", "isolamento"],
    corpo_alvo: ["hiper", "dissociação"],
    duração_min: 15,
    risco: "médio",
    instruções: [
      "1. Imagine seus pais ou parceiros em conflito à sua frente.",
      "2. Dê um passo atrás fisicamente, saindo do meio deles.",
      "3. Diga mentalmente: 'O conflito de vocês pertence a vocês. Eu não sou o juiz, o mediador ou o prêmio. Eu sou pequeno.'",
      "4. Sinta o alívio de não ter que tomar partido ou apagar fogos."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["E04", "C04"]
  },

  // ----------------------------------------------------
  // PRATELEIRA E - ESPELHO (Ataca Coluna 4 - Corpo e Somática)
  // ----------------------------------------------------
  {
    id: "E01",
    nome: "Espelho 60 segundos (Corte de Paralisia)",
    prateleira: "E",
    ataca_coluna: 4,
    aliança_alvo: ["parentificação", "fusão"],
    culpa_alvo: ["auto_odio", "sobrevivente"],
    medo_alvo: ["exposição", "imperfeição"],
    corpo_alvo: ["submissão", "paralisia"],
    duração_min: 3,
    risco: "baixo",
    instruções: [
      "1. Olhe fixamente nos seus próprios olhos em frente ao espelho por 60 segundos.",
      "2. Não desvie o olhar, mesmo se sentir desconforto ou vontade de rir.",
      "3. Diga em voz alta com firmeza: 'Eu vejo você. Você não precisa mais se esconder para ser aceito.'",
      "4. Sinta a musculatura facial relaxar e dê um sorriso sincero para si mesmo."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["L03", "C03"]
  },
  {
    id: "E02",
    nome: "Scan Somático 3 Pontos (Desligamento de Alerta)",
    prateleira: "E",
    ataca_coluna: 4,
    aliança_alvo: ["parentificação"],
    culpa_alvo: ["responsavel", "sobrevivente"],
    medo_alvo: ["subjugacao", "isolamento"],
    corpo_alvo: ["hiper", "exaustão"],
    duração_min: 5,
    risco: "baixo",
    instruções: [
      "1. Foque sua atenção em 3 pontos de tensão física: garganta, peito e estômago.",
      "2. Respire inflando o abdômen e solte o ar fazendo um som suave de suspiro ('Ah...').",
      "3. À medida que solta o ar, ordene mentalmente que esses 3 pontos amoleçam.",
      "4. Repita por 5 ciclos completos até sentir o tônus muscular diminuir."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["L01", "C01"]
  },
  {
    id: "E03",
    nome: "Ancoragem do Nervo Vago (Integração Rápida)",
    prateleira: "E",
    ataca_coluna: 4,
    aliança_alvo: ["fusão", "triângulo"],
    culpa_alvo: ["deslealdade", "auto_odio"],
    medo_alvo: ["invasão", "separação"],
    corpo_alvo: ["dissociação", "hiper"],
    duração_min: 6,
    risco: "baixo",
    instruções: [
      "1. Coloque a mão direita sobre a nuca e a mão esquerda sobre o estômago.",
      "2. Respire de forma lenta, contando 4 segundos para inspirar e 6 segundos para expirar.",
      "3. Olhe com os olhos (sem girar a cabeça) totalmente para a direita até bocejar ou suspirar.",
      "4. Depois, repita olhando totalmente para a esquerda para resetar o alarme somático."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["L02", "M02"]
  },
  {
    id: "E04",
    nome: "Descompressão Muscular de Choque",
    prateleira: "E",
    ataca_coluna: 4,
    aliança_alvo: ["triângulo"],
    culpa_alvo: ["auto_odio"],
    medo_alvo: ["imperfeição", "exposição"],
    corpo_alvo: ["paralisia", "exaustão"],
    duração_min: 4,
    risco: "baixo",
    instruções: [
      "1. Fique em pé e contraia todos os músculos do corpo (feche punhos, aperte olhos e ombros) com força máxima por 10 segundos.",
      "2. Solte o ar de uma vez pela boca, soltando todo o corpo instantaneamente.",
      "3. Sacuda os braços e as pernas como se estivesse limpando poeira acumulada.",
      "4. Sinta o formigamento do sangue fluindo livremente pelas extremidades."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["L04", "M03"]
  },

  // ----------------------------------------------------
  // PRATELEIRA C - CULPA (Ataca Coluna 2 - Nomeando o Conflito)
  // ----------------------------------------------------
  {
    id: "C01",
    nome: "Protocolo Culpa Sobrevivente (Permissão de Brilho)",
    prateleira: "C",
    ataca_coluna: 2,
    aliança_alvo: ["parentificação", "fusão"],
    culpa_alvo: ["sobrevivente"],
    medo_alvo: ["ultrapassar", "isolamento"],
    corpo_alvo: ["submissão", "exaustão"],
    duração_min: 15,
    risco: "baixo",
    instruções: [
      "1. Feche os olhos e imagine as gerações passadas da sua família atrás de você.",
      "2. Sinta a dor e as perdas que eles vivenciaram sem tentar mudá-las.",
      "3. Olhe para trás e diga: 'Eu honro sua dor sendo feliz. Meu sofrimento não alivia o de vocês.'",
      "4. Sinta a força dos ancestrais empurrando você para frente, autorizando seu brilho."
    ],
    métrica_saída: "clareza 0-10",
    próximo_sugerido: ["M03", "E02"]
  },
  {
    id: "C02",
    nome: "Protocolo Culpa de Deslealdade (Diferenciação Crítica)",
    prateleira: "C",
    ataca_coluna: 2,
    aliança_alvo: ["fusão", "triângulo"],
    culpa_alvo: ["deslealdade"],
    medo_alvo: ["separação", "isolamento"],
    corpo_alvo: ["dissociação", "paralisia"],
    duração_min: 15,
    risco: "médio",
    instruções: [
      "1. Escreva 3 escolhas de vida que contradizem a tradição familiar (Ex: carreira, relacionamento, finanças).",
      "2. Sinta a onda de culpa no peito ao ler essa lista e respire através dela sem fugir.",
      "3. Repita em voz alta: 'Eu sou diferente de vocês nesta escolha, mas ainda assim eu pertenço.'",
      "4. Sustente a sensação física da culpa por 2 minutos até que ela perca a força de travamento."
    ],
    métrica_saída: "clareza 0-10",
    próximo_sugerido: ["M01", "E03"]
  },
  {
    id: "C03",
    nome: "Protocolo Culpa Onipotente (Devolução de Salvação)",
    prateleira: "C",
    ataca_coluna: 2,
    aliança_alvo: ["parentificação", "fusão coercitiva"],
    culpa_alvo: ["responsavel", "responsável onipotente"],
    medo_alvo: ["subjugacao", "isolamento"],
    corpo_alvo: ["exaustão", "submissão"],
    duração_min: 18,
    risco: "médio",
    instruções: [
      "1. Liste as pessoas da sua família que você está tentando 'salvar' ou resolver a vida.",
      "2. Encare cada nome e reconheça: 'Você é grande. Eu sou pequeno. Eu não posso salvar você da sua própria jornada.'",
      "3. Visualize-se entregando as chaves do destino de cada um de volta em suas mãos.",
      "4. Respire fundo e sinta o peso saindo das suas costas."
    ],
    métrica_saída: "clareza 0-10",
    próximo_sugerido: ["M02", "E02"]
  },
  {
    id: "C04",
    nome: "Protocolo Auto-Ódio e Cobrança Rígida",
    prateleira: "C",
    ataca_coluna: 2,
    aliança_alvo: ["triângulo", "parentificação"],
    culpa_alvo: ["auto_odio"],
    medo_alvo: ["imperfeição", "exposição"],
    corpo_alvo: ["paralisia", "hiper"],
    duração_min: 20,
    risco: "alto",
    instruções: [
      "1. Escreva a pior crítica que você faz a si mesmo quando falha (Ex: 'Você é um fracasso').",
      "2. Feche os olhos e localize de quem é a voz ou o olhar severo que sustenta esse julgamento.",
      "3. Diga a essa voz externa: 'Seu julgamento não me protege mais. Eu escolho caminhar sob meu próprio olhar compassivo.'",
      "4. Rasgue o papel da crítica e repita: 'Eu me permito errar e continuar sendo bom o suficiente.'"
    ],
    métrica_saída: "clareza 0-10",
    próximo_sugerido: ["M04", "E04"]
  },

  // ----------------------------------------------------
  // PRATELEIRA M - MEDO (Ataca Coluna 3 - Descondicionamento Neural)
  // ----------------------------------------------------
  {
    id: "M01",
    nome: "Protocolo Medo de Isolamento (O Banimento)",
    prateleira: "M",
    ataca_coluna: 3,
    aliança_alvo: ["parentificação", "fusão"],
    culpa_alvo: ["deslealdade", "sobrevivente"],
    medo_alvo: ["isolamento"],
    corpo_alvo: ["submissão", "paralisia"],
    duração_min: 10,
    risco: "baixo",
    instruções: [
      "1. Feche os olhos e imagine-se sendo banido ou excluído pelo clã por fazer suas próprias escolhas.",
      "2. Sinta o frio na barriga decorrente do pânico de solidão primitiva.",
      "3. Diga ao seu corpo: 'É apenas um alarme. Eu sou adulto agora, eu posso me acolher e me sustentar.'",
      "4. Sinta o chão firme sob seus pés e perceba que você sobreviveu ao fantasma do banimento."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["C02", "E01"]
  },
  {
    id: "M02",
    nome: "Protocolo Medo de Invasão (A Barreira Forte)",
    prateleira: "M",
    ataca_coluna: 3,
    aliança_alvo: ["parentificação", "fusão coercitiva"],
    culpa_alvo: ["responsavel"],
    medo_alvo: ["invasão"],
    corpo_alvo: ["dissociação", "hiper"],
    duração_min: 12,
    risco: "baixo",
    instruções: [
      "1. Fique em pé e estenda os braços à sua frente com as palmas das mãos voltadas para fora, criando um escudo virtual.",
      "2. Imagine o sistema invasor ou exigente à sua frente, batendo na barreira dos seus braços.",
      "3. Diga em voz alta com tom de voz firme e calmo: 'Até aqui você pode vir. Daqui para dentro, mando eu.'",
      "4. Sinta a firmeza muscular do seu abdômen e permaneça sustentando seu espaço por 3 minutos."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["C03", "E03"]
  },
  {
    id: "M03",
    nome: "Protocolo Medo de Ultrapassar (O Sucesso Seguro)",
    prateleira: "M",
    ataca_coluna: 3,
    aliança_alvo: ["parentificação", "triângulo"],
    culpa_alvo: ["sobrevivente", "auto_odio"],
    medo_alvo: ["ultrapassar"],
    corpo_alvo: ["exaustão", "paralisia"],
    duração_min: 15,
    risco: "médio",
    instruções: [
      "1. Visualize a conquista que você mais deseja (Ex: independência financeira total).",
      "2. Perceba o aperto no peito que surge como se um teto invisível de segurança estivesse bloqueando seu crescimento.",
      "3. Diga mentalmente: 'Minha felicidade não diminui ninguém. Eu me autorizo a ir além com a bênção do meu clã.'",
      "4. Expire profundamente imaginando o teto de vidro se partindo em pedacinhos de luz."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["C01", "E04"]
  },
  {
    id: "M04",
    nome: "Protocolo Medo de Exposição (O Brilho Desinibido)",
    prateleira: "M",
    ataca_coluna: 3,
    aliança_alvo: ["triângulo"],
    culpa_alvo: ["auto_odio", "deslealdade"],
    medo_alvo: ["exposição", "imperfeição"],
    corpo_alvo: ["hiper", "dissociação"],
    duração_min: 12,
    risco: "alto",
    instruções: [
      "1. Imagine-se sob um holofote de luz dourada, sendo visto e apreciado por centenas de pessoas.",
      "2. Sinta a onda de calor ou tremor no corpo ao ser o centro das atenções.",
      "3. Sustente a postura ereta, respire fundo e declare: 'É seguro ser visto. Meu brilho é uma homenagem à vida.'",
      "4. Permaneça na luz dourada sentindo-se relaxado e preenchido por 3 minutos."
    ],
    métrica_saída: "alívio 0-10",
    próximo_sugerido: ["C04", "E01"]
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.id === id);
}

// Track builder: compiles a daily trail (E -> L -> C -> M) based on diagnostic parameters
export function compileMabiTrail(params: {
  alianca: string;
  corpo: string;
  culpa: string;
  medo: string;
}): string[] {
  // We need to pick:
  // 1 from E (corpo match)
  // 1 from L (alianca match)
  // 1 from C (culpa match)
  // 1 from M (medo match)
  
  // 1. Filter E
  let eCandidates = EXERCISES.filter(x => x.prateleira === 'E' && x.corpo_alvo.includes(params.corpo));
  if (eCandidates.length === 0) eCandidates = EXERCISES.filter(x => x.prateleira === 'E');
  
  // 2. Filter L
  let lCandidates = EXERCISES.filter(x => x.prateleira === 'L' && x.aliança_alvo.includes(params.alianca));
  if (lCandidates.length === 0) lCandidates = EXERCISES.filter(x => x.prateleira === 'L');
  
  // 3. Filter C
  let cCandidates = EXERCISES.filter(x => x.prateleira === 'C' && x.culpa_alvo.includes(params.culpa));
  if (cCandidates.length === 0) cCandidates = EXERCISES.filter(x => x.prateleira === 'C');
  
  // 4. Filter M
  let mCandidates = EXERCISES.filter(x => x.prateleira === 'M' && x.medo_alvo.includes(params.medo));
  if (mCandidates.length === 0) mCandidates = EXERCISES.filter(x => x.prateleira === 'M');
  
  return [
    eCandidates[0]?.id || 'E01',
    lCandidates[0]?.id || 'L01',
    cCandidates[0]?.id || 'C01',
    mCandidates[0]?.id || 'M01'
  ];
}
