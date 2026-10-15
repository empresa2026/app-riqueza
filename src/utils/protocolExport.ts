import { Protocol, ProtocolResult, Matrix, MatrixResult, Quiz, UserResult } from '../types';
import { 
  BODY_PARTS, 
  getProtocolStepsForId, 
  applyTargetPersonPersonalization, 
  TargetPersonInfo,
  ProtocolStep
} from '../data/protocolSteps';

/**
 * Downloads a string content directly as a file in the browser.
 */
export function downloadTextFile(filename: string, content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Formats a completed Protocol result into a comprehensive, beautifully structured
 * export document that includes both the original/personalized questions and the
 * user's answers, grouped by Folha/Etapa, including Somatic and Action steps.
 */
export function formatProtocolResultForExport(
  protocol: Protocol,
  result: ProtocolResult,
  targetPerson?: TargetPersonInfo | null
): string {
  const rawSteps = getProtocolStepsForId(protocol.id, protocol.title);
  const steps = applyTargetPersonPersonalization(rawSteps, targetPerson);
  const answers = result.answers || {};

  let doc = '';
  doc += `================================================================================\n`;
  doc += `PROTOCOLO: ${protocol.title.toUpperCase()}\n`;
  doc += `Código: ${protocol.code}\n`;
  doc += `Data de Conclusão: ${new Date(result.completedAt).toLocaleString('pt-BR')}\n`;
  if (protocol.quote) {
    doc += `Frase-Âncora: "${protocol.quote}"\n`;
  }
  if (protocol.description) {
    doc += `Objetivo: ${protocol.description}\n`;
  }
  if (targetPerson?.name) {
    doc += `Alvo Sistêmico Mapeado: ${targetPerson.name} (${targetPerson.roleLabel || targetPerson.role || 'ancestral'})\n`;
    if (targetPerson.contractStatement) {
      doc += `Aliança / Acordo Mapeado: "${targetPerson.contractStatement}"\n`;
    }
  }
  doc += `================================================================================\n\n`;

  const processedKeys = new Set<string>();
  const internalKeys = new Set([
    'targetPersonName',
    'targetPersonRole',
    'targetPersonContract',
    'person_link',
    'envolved',
    'resentment_target'
  ]);

  // 1. Process standard steps (Folhas)
  steps.forEach((step: ProtocolStep, stepIdx: number) => {
    const fields = step.fields || [];
    const answeredFields = fields.filter((f) => {
      const val = answers[f.id];
      return val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
    });

    if (answeredFields.length > 0) {
      doc += `--------------------------------------------------------------------------------\n`;
      doc += `[ ${step.title || `ETAPA ${stepIdx + 1}`} ]\n`;
      if (step.description) {
        doc += `${step.description}\n`;
      }
      doc += `--------------------------------------------------------------------------------\n\n`;

      answeredFields.forEach((field) => {
        processedKeys.add(field.id);
        const rawValue = answers[field.id];
        let displayAnswer = '';

        if (Array.isArray(rawValue)) {
          const labels = rawValue.map((val) => {
            const opt = field.options?.find((o) => o.value === val);
            return opt ? opt.label : String(val);
          });
          displayAnswer = labels.join(', ');
        } else if (typeof rawValue === 'boolean') {
          displayAnswer = rawValue ? 'Sim / Concluído' : 'Não';
        } else if (field.options && typeof rawValue === 'string') {
          const opt = field.options.find((o) => o.value === rawValue);
          displayAnswer = opt ? opt.label : rawValue;
        } else {
          displayAnswer = String(rawValue);
        }

        doc += `• Pergunta: ${field.label || field.id}\n`;
        doc += `  Resposta: ${displayAnswer}\n\n`;
      });
    }
  });

  // 2. Somatic awareness and body check
  const hasSomatic = 
    answers.local_tensao_mapa !== undefined || 
    answers.tempo_60s_cumprido !== undefined || 
    answers.sensacao_pos_mao !== undefined || 
    answers.texto_mudanca_corpo !== undefined || 
    answers.audio_frase_tocado !== undefined ||
    answers.audio_testemunha_tocado !== undefined;

  if (hasSomatic) {
    doc += `--------------------------------------------------------------------------------\n`;
    doc += `[ CONSCIÊNCIA CORPORAL & LIBERAÇÃO SOMÁTICA ]\n`;
    doc += `Localização visceral da tensão e reprogramação sensorial.\n`;
    doc += `--------------------------------------------------------------------------------\n\n`;

    if (answers.local_tensao_mapa) {
      processedKeys.add('local_tensao_mapa');
      const bodyPart = BODY_PARTS.find((p) => p.id === answers.local_tensao_mapa);
      const partName = bodyPart ? `${bodyPart.label} (${bodyPart.fatiaCode})` : answers.local_tensao_mapa;
      doc += `• Pergunta: Onde no corpo aperta quando você se conecta com essa regra/aliança?\n`;
      doc += `  Resposta: ${partName}\n\n`;
    }

    if (answers.tempo_60s_cumprido !== undefined) {
      processedKeys.add('tempo_60s_cumprido');
      doc += `• Pergunta: Permanência com a mão sobre a região de tensão por 60 segundos:\n`;
      doc += `  Resposta: ${answers.tempo_60s_cumprido ? 'Concluído com atenção plena' : 'Não concluído'}\n\n`;
    }

    if (answers.sensacao_pos_mao !== undefined) {
      processedKeys.add('sensacao_pos_mao');
      const sens = Array.isArray(answers.sensacao_pos_mao) 
        ? answers.sensacao_pos_mao.join(', ') 
        : answers.sensacao_pos_mao;
      doc += `• Pergunta: Sensação corporal após o contato manual:\n`;
      doc += `  Resposta: ${sens}\n\n`;
    }

    if (answers.audio_frase_tocado !== undefined) {
      processedKeys.add('audio_frase_tocado');
      doc += `• Pergunta: Frase de Liberação e Quebra de Lealdade falada em voz alta:\n`;
      doc += `  Resposta: ${answers.audio_frase_tocado ? 'Ouvida e repetida com firmeza' : 'Não registrada'}\n\n`;
    }

    if (answers.audio_testemunha_tocado !== undefined) {
      processedKeys.add('audio_testemunha_tocado');
      doc += `• Pergunta: Áudio da testemunha / presença do observador:\n`;
      doc += `  Resposta: ${answers.audio_testemunha_tocado ? 'Ouvido com atenção' : 'Não registrado'}\n\n`;
    }

    if (answers.texto_mudanca_corpo) {
      processedKeys.add('texto_mudanca_corpo');
      doc += `• Pergunta: O que mudou no corpo ao falar a frase de liberação com a mão no ponto de tensão?\n`;
      doc += `  Resposta: ${answers.texto_mudanca_corpo}\n\n`;
    }
  }

  // 3. Action / Concretization
  const hasAction = 
    answers.check_usuario_feito !== undefined || 
    answers.leveza_pos_ato !== undefined || 
    answers.observacao_pos_ato;

  if (hasAction) {
    doc += `--------------------------------------------------------------------------------\n`;
    doc += `[ ATO DE CONCRETIZAÇÃO & INTEGRAÇÃO NA VIDA REAL ]\n`;
    doc += `Ação prática de diferenciação e quebra de padrão.\n`;
    doc += `--------------------------------------------------------------------------------\n\n`;

    if (answers.check_usuario_feito !== undefined) {
      processedKeys.add('check_usuario_feito');
      const dateText = typeof answers.check_usuario_feito === 'string' 
        ? ` (Registrado em ${new Date(answers.check_usuario_feito).toLocaleString('pt-BR')})` 
        : '';
      doc += `• Pergunta: Execução do ato de diferenciação no mundo real:\n`;
      doc += `  Resposta: Realizado com sucesso${dateText}\n\n`;
    }

    if (answers.leveza_pos_ato !== undefined && answers.leveza_pos_ato !== null) {
      processedKeys.add('leveza_pos_ato');
      doc += `• Pergunta: Escala de alívio e leveza após o ato (0 a 5):\n`;
      doc += `  Resposta: ${answers.leveza_pos_ato} / 5\n\n`;
    }

    if (answers.observacao_pos_ato) {
      processedKeys.add('observacao_pos_ato');
      doc += `• Pergunta: Observações e registros pós-ação:\n`;
      doc += `  Resposta: ${answers.observacao_pos_ato}\n\n`;
    }
  }

  // 4. Any remaining answers that weren't mapped above
  const remainingKeys = Object.keys(answers).filter((k) => 
    !processedKeys.has(k) && 
    !internalKeys.has(k) &&
    answers[k] !== undefined && 
    answers[k] !== null && 
    answers[k] !== '' &&
    !(Array.isArray(answers[k]) && answers[k].length === 0)
  );

  if (remainingKeys.length > 0) {
    doc += `--------------------------------------------------------------------------------\n`;
    doc += `[ REGISTROS ADICIONAIS & COMPLEMENTARES ]\n`;
    doc += `--------------------------------------------------------------------------------\n\n`;

    remainingKeys.forEach((key) => {
      const val = answers[key];
      const formattedVal = Array.isArray(val) 
        ? val.join(', ') 
        : (typeof val === 'boolean' ? (val ? 'Sim' : 'Não') : String(val));
      
      const humanLabel = key
        .replace(/^e[0-9]+_/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      doc += `• Registro (${humanLabel}):\n`;
      doc += `  Resposta: ${formattedVal}\n\n`;
    });
  }

  doc += `================================================================================\n`;
  doc += `DOCUMENTO GERADO VIA ESTAÇÕES — SISTEMA DE ALIANÇAS FAMILIARES\n`;
  doc += `================================================================================\n`;

  return doc;
}

/**
 * Formats a Matrix (Checkpoint) result into an exportable document.
 */
export function formatMatrixResultForExport(matrix: Matrix, result: MatrixResult): string {
  let doc = '';
  doc += `================================================================================\n`;
  doc += `CHECKPOINT DE INVESTIGAÇÃO: ${matrix.title.toUpperCase()}\n`;
  doc += `Sigla: ${matrix.acronym} | Autor: ${matrix.author}\n`;
  doc += `Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}\n`;
  doc += `Conceito: ${matrix.concept}\n`;
  doc += `================================================================================\n\n`;

  const processedLabels = new Set<string>();

  matrix.fields.forEach((field) => {
    const answer = result.answers[field.label] || result.answers[field.letter] || result.answers[field.description];
    if (answer) {
      processedLabels.add(field.label);
      processedLabels.add(field.letter);
      processedLabels.add(field.description);

      doc += `--------------------------------------------------------------------------------\n`;
      doc += `[ ${field.letter} — ${field.label.toUpperCase()} ]\n`;
      doc += `• Pergunta: ${field.description}\n`;
      if (field.details) {
        doc += `  Contexto Teórico: ${field.details}\n`;
      }
      doc += `  Resposta:\n${answer}\n\n`;
    }
  });

  const remaining = Object.entries(result.answers).filter(
    ([k, v]) => !processedLabels.has(k) && v && String(v).trim() !== ''
  );

  if (remaining.length > 0) {
    doc += `--------------------------------------------------------------------------------\n`;
    doc += `[ ANOTAÇÕES ADICIONAIS ]\n`;
    doc += `--------------------------------------------------------------------------------\n\n`;
    remaining.forEach(([key, val]) => {
      doc += `• Pergunta / Campo: ${key}\n`;
      doc += `  Resposta:\n${val}\n\n`;
    });
  }

  doc += `================================================================================\n`;
  return doc;
}

/**
 * Formats a Quiz (Protocolo Clássico) result into an exportable document.
 */
export function formatQuizResultForExport(quiz: Quiz, result: UserResult): string {
  let doc = '';
  doc += `================================================================================\n`;
  doc += `PROTOCOLO: ${quiz.title.toUpperCase()}\n`;
  doc += `Data: ${new Date(result.completedAt).toLocaleString('pt-BR')}\n\n`;
  
  if (quiz.identifiedStructure) {
    doc += `ESTRUTURA IDENTIFICADA\n`;
    doc += `Ferida: ${quiz.identifiedStructure.ferida}\n`;
    doc += `Domínio: ${quiz.identifiedStructure.dominio}\n`;
    doc += `Máscara: ${quiz.identifiedStructure.mascara}\n`;
    doc += `Modo: ${quiz.identifiedStructure.modo}\n\n`;
  }

  doc += `================================================================================\n`;
  doc += `PERGUNTAS & RESPOSTAS\n`;
  doc += `================================================================================\n\n`;

  quiz.sections.forEach((section, sIdx) => {
    doc += `[ ${section.title} ]\n`;
    if (section.intro) {
      doc += `${section.intro}\n`;
    }
    doc += `\n`;

    section.questions.forEach((q, qIdx) => {
      const answerIdx = result.answers[`${sIdx}-${qIdx}`];
      const answer = answerIdx !== undefined && q.options[answerIdx] !== undefined 
        ? q.options[answerIdx] 
        : 'Não respondida';

      doc += `• Pergunta: ${q.question}\n`;
      doc += `  Resposta: ${answer}\n\n`;
    });
  });

  if (quiz.finalPrayer) {
    doc += `--------------------------------------------------------------------------------\n`;
    doc += `ORAÇÃO FINAL / FRASE DE INTEGRAÇÃO\n`;
    doc += `${quiz.finalPrayer}\n\n`;
  }

  doc += `================================================================================\n`;
  return doc;
}
