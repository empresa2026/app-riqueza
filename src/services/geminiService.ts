import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, JourneyStep } from "../types";
import { MATRICES } from "../data/matrices";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PROTOCOL_SYSTEM_INSTRUCTION = `
Você é um especialista em psicologia profunda e auto-investigação terapêutica.
Sua tarefa é gerar um "Protocolo de Auto-Investigação" baseado em um tema/termo fornecido.

ESTRUTURA FIXA DO PROTOCOLO:
1. ESTRUTURA IDENTIFICADA: Mapeie a Ferida Primária, Domínio de Dor, Máscara do Ego e Modo Operante relacionados ao tema.
2. ESTABELECIMENTO DE EIXO: Um texto de ancoragem profundo e uma instrução de leitura (ex: "Leia em voz alta, sentindo o peso de cada palavra").
3. SEÇÕES DE INVESTIGAÇÃO: Divida a jornada em seções (ex: 1. A ORIGEM, 2. O PADRÃO, O SALTO). Cada seção deve ter perguntas introspectivas com 4 opções de resposta que representam diferentes níveis de consciência ou padrões de comportamento. NÃO use a palavra "BLOCO" nos títulos.
4. ORAÇÃO FINAL: Um texto de renúncia e entrega para encerrar o protocolo.

TOM E ESTILO:
- Linguagem sofisticada, poética e direta.
- Foco em revelação e transformação.
- Evite clichês; busque a raiz psicológica do tema.
`;

export async function generateQuizFromPrompt(instructions: string, topic: string): Promise<Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Tema do Protocolo: ${topic}\n\nInstruções Adicionais: ${instructions}`,
    config: {
      systemInstruction: PROTOCOL_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título impactante do protocolo" },
          identifiedStructure: {
            type: Type.OBJECT,
            properties: {
              ferida: { type: Type.STRING },
              dominio: { type: Type.STRING },
              mascara: { type: Type.STRING },
              modo: { type: Type.STRING }
            },
            required: ["ferida", "dominio", "mascara", "modo"]
          },
          axisEstablishment: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              instruction: { type: Type.STRING }
            },
            required: ["text", "instruction"]
          },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Ex: 1. A ORIGEM" },
                intro: { type: Type.STRING, description: "Texto introdutório da seção" },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "4 opções de resposta"
                      }
                    },
                    required: ["question", "options"]
                  }
                }
              },
              required: ["title", "questions"]
            }
          },
          finalPrayer: { type: Type.STRING, description: "Oração Final de Renúncia" }
        },
        required: ["title", "identifiedStructure", "axisEstablishment", "sections", "finalPrayer"]
      }
    }
  });

  return JSON.parse(response.text);
}

const JOURNEY_PLANNER_SYSTEM_PROMPT = `
Você é o Arquiteto Clínico do Método M.A.B.I. Sua função é organizar a jornada do paciente estritamente dentro do fluxo de quatro fases do método, removendo qualquer complexidade desnecessária e focando na execução da cura.

ESTRUTURA OBRIGATÓRIA DA JORNADA:

 1. FASE 1: CONTABILIDADE FAMILIAR (O Passado)
- Foco: Identificar a dívida sistêmica, o sacrifício não reconhecido e o 'Livro-Razão' da linhagem.
- Diretriz: O paciente deve entender que o que ele carrega hoje não é dele, é um contrato de sobrevivência familiar.

2. FASE 2: ALIANÇAS E PADRÕES (O Presente)
- Foco: Mapear o sintoma atual (bloqueio na meta, autosabotagem, exaustão) e conectar como isso é o reflexo direto da Contabilidade (Fase 1) operando no corpo hoje.
- Diretriz: Usar o mapeamento de 'Padrões de Sobrevivência' para identificar o padrão ativo, sem abstrações.

3. FASE 3: PROCESSOS FAMILIARES (O Confronto)
- Foco: Mapear os bloqueadores reais que atuam como alarmes no corpo (Nível de Risco Sistêmico, o Juiz Interno/Culpa e o Alarme de Medo).
- Diretriz: Descrever a engrenagem profunda baseada em processos inconscientes de segurança biológica (S.M.A.D.).

4. FASE 4: AÇÕES DE DESENGAJAMENTO (O Futuro)
- Foco: Definir a microação tática prática (teste de segurança de 10% de desengajamento) que o paciente usará no mundo real para romper a lealdade.
- Diretriz: O objetivo final é desativar os alarmes no corpo através do agir diferenciado.

Para criar o plano personalizado do paciente, escolha matrizes que correlacionem com esta ordem exata de fluxo: Meta -> Contabilidade -> Padrões -> Processo -> Ação.

MATRIZES DISPONÍVEIS:
${MATRICES.map(m => `- ${m.id}: ${m.title} (${m.concept})`).join('\n')}

DIRETRIZES DE RETORNO:
1. Analise o problema do usuário sob a ótica sistêmica do Método M.A.B.I.
2. Escolha de 3 a 5 matrizes aplicáveis que guiem o paciente nesta sequência estruturada.
3. Para cada passo, descreva a necessidade clínica e crie um "contextPrompt" clínico de questionamento profundo para o paciente.
`;

export async function generateJourneyPlan(problemDescription: string): Promise<Omit<JourneyStep, 'order'>[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Problema do Usuário: ${problemDescription}`,
    config: {
      systemInstruction: JOURNEY_PLANNER_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["matrix"], description: "Por enquanto use apenas matrix" },
                id: { type: Type.STRING, description: "ID exato da matriz escolhida" },
                title: { type: Type.STRING },
                description: { type: Type.STRING, description: "Por que este passo é importante agora?" },
                contextPrompt: { type: Type.STRING, description: "Pergunta inicial personalizada vinculando o problema do usuário a esta matriz" }
              },
              required: ["type", "id", "title", "description", "contextPrompt"]
            }
          }
        },
        required: ["steps"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return result.steps;
}

export async function summarizeContext(currentContext: string, newDiscovery: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Contexto Atual: ${currentContext}\n\nNova Descoberta/Respostas: ${newDiscovery}\n\nResuma o que aprendemos sobre o bloqueio do usuário em um parágrafo curto e denso, focando no "quem", "o que" e "por que" do bloqueio.`,
    config: {
      temperature: 0.3
    }
  });

  return response.text?.trim() || currentContext;
}

export interface ClinicalSummaryInput {
  patientName: string;
  goalTitle: string;
  goalTarget: string;
  symptoms: string[];
  visceralSensation: string;
  safetyScore: number;
  sensationType: string;
  judgmentOwner: string;
  guiltPhrase: string;
  survivalFear: string;
  activeCulpa: string;
  activeMedo: string;
  activeSomatica: string;
  activeLivroRazao: string;
  ancestorName?: string;
  selectedDebts?: string[];
  contractStatement?: string;
  selectedActionType?: string;
  actionPlan?: string;
}

export async function generateClinicalSummary(input: ClinicalSummaryInput): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const prompt = `
Você é um psicoterapeuta sistêmico experiente, especializado em constelações familiares, psicossomática e reprogramação neural de crenças.
Sua tarefa é redigir um "Parecer Clínico Psicanalítico Profundo" para o prontuário de auto-investigação do paciente.

DADOS COLETADOS DO PACIENTE:
- Nome do Paciente: ${input.patientName}
- Foco do Bloqueio: ${input.goalTitle}
- Alvo/Meta do Paciente (O que ele quer): "${input.goalTarget}"

FASE 1 - A DOR (Sintomas de Superfície):
- Sintomas Mapeados: ${input.symptoms.join(', ')}
- Tensão Corporal Visceral: Nível ${input.safetyScore}/10
- Sensação Física Relatada: "${input.visceralSensation}"

FASE 2 - ANCESTRALIDADE (Aliança Invisível):
- Ancestral de Referência: ${input.ancestorName || 'Não identificado'}
- Contratos de Dívida Sistêmica: ${(input.selectedDebts || []).join(', ')}
- Declaração do Contrato Inconsciente: "${input.contractStatement || ''}"

FASE 3 - A TRAVA (A Engrenagem da Paralisia):
- Alarme Visceral (SMAD) ao se aproximar da meta: "${input.sensationType}"
- Dono do Olhar / Quem julga: "${input.judgmentOwner}"
- Frase da Culpa Interna: "${input.guiltPhrase}"
- Pior Cenário Temido (Fantasia de Aniquilação): "${input.survivalFear}"
- Pilares M.A.B.I. Ativos: Culpa ${input.activeCulpa}, Medo Primitivo ${input.activeMedo}, Resposta Somática ${input.activeSomatica}, Livro Razão ${input.activeLivroRazao}

FASE 4 - DESENGAJAMENTO (Ação Corretiva):
- Tipo de Intervenção: ${input.selectedActionType || ''}
- Plano de Ação Prescrito: "${input.actionPlan || ''}"

DIRETRIZES PARA A REDAÇÃO DO PARECER:
1. Conecte de forma cirúrgica e profunda a "Dor" da Fase 1 (os sintomas atuais e a sensação física de bloqueio) com a "Trava" da Fase 3 (o alarme de segurança, o olhar julgador e a fantasia de aniquilação). Explique o mecanismo de "ganho secundário inconsciente": como o sintoma de dor de hoje na verdade protege o paciente de enfrentar o medo primitivo da trava (lealdade familiar).
2. Use tom elegante, sério, empático, sofisticado e acadêmico-clínico (linguagem terapêutica humanista e sistêmica refinada).
3. Seja conciso e denso (máximo 3 parágrafos).
4. Escreva em Português do Brasil.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.4,
    }
  });

  return response.text?.trim() || "";
}

