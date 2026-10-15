export interface TargetPersonInfo {
  name: string;
  role: string;
  roleLabel?: string;
  activeGuilt?: string;
  activeFear?: string;
  contractStatement?: string;
}

export interface ProtocolFieldOption {
  value: string;
  label: string;
}

export interface ProtocolField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: ProtocolFieldOption[];
}

export interface ProtocolStep {
  title: string;
  description?: string;
  type?: string;
  fields?: ProtocolField[];
}

export const BODY_PARTS = [
  { 
    id: 'cabeca', 
    label: 'Cabeça', 
    fatiaCode: 'FATIA.01', 
    x: 36,
    y: 16,
    width: 128,
    height: 38,
    textY: 35, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'mandibula', 
    label: 'Mandíbula', 
    fatiaCode: 'FATIA.02', 
    x: 36,
    y: 60,
    width: 128,
    height: 38,
    textY: 79, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'pescoco', 
    label: 'Pescoço / Garganta', 
    fatiaCode: 'FATIA.03', 
    x: 36,
    y: 104,
    width: 128,
    height: 38,
    textY: 123, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'ombros', 
    label: 'Ombros', 
    fatiaCode: 'FATIA.04', 
    x: 36,
    y: 148,
    width: 128,
    height: 38,
    textY: 167, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'peito', 
    label: 'Peito', 
    fatiaCode: 'FATIA.05', 
    x: 36,
    y: 192,
    width: 128,
    height: 38,
    textY: 211, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'estomago', 
    label: 'Estômago', 
    fatiaCode: 'FATIA.06', 
    x: 36,
    y: 236,
    width: 128,
    height: 38,
    textY: 255, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  },
  { 
    id: 'barriga', 
    label: 'Barriga', 
    fatiaCode: 'FATIA.07', 
    x: 36,
    y: 280,
    width: 128,
    height: 38,
    textY: 299, 
    leftLine: { x1: 6, x2: 32 }, 
    rightLine: { x1: 168, x2: 194 } 
  }
];

  export function getProtocolStepsForId(protocolId: string, protocolTitle: string = "") {
    switch (protocolId) {
      case 'culpa_sobrevivente':
        return [
          {
            title: 'Folha 1 — O que eu não me permito viver?',
            description: 'Identifique as áreas e sensações de impedimento no seu sistema.',
            fields: [
              {
                id: 'e1_area',
                type: 'multiselect',
                label: '1. Hoje, em que área da minha vida eu sinto que não posso ter mais, viver melhor ou sofrer menos do que alguém do meu sistema?',
                options: [
                  { value: 'dinheiro', label: 'Dinheiro' },
                  { value: 'trabalho', label: 'Trabalho' },
                  { value: 'relacionamento', label: 'Relacionamento' },
                  { value: 'descanso', label: 'Descanso' },
                  { value: 'corpo_saude', label: 'Corpo / saúde' },
                  { value: 'prazer', label: 'Prazer' },
                  { value: 'liberdade', label: 'Liberdade' },
                  { value: 'visibilidade_sucesso', label: 'Visibilidade / sucesso' },
                  { value: 'outra', label: 'Outra área' }
                ]
              },
              {
                id: 'e1_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra área...'
              },
              {
                id: 'e1_o_que_nao_permite',
                type: 'textarea',
                label: '2. O que exatamente eu sinto que não posso viver?',
                placeholder: 'Ex: Não me permito descansar aos finais de semana, ou ganhar mais dinheiro que meus pais...'
              },
              {
                id: 'e1_sensacao',
                type: 'multiselect',
                label: '3. Se eu me permitir viver isso, parece que estou:',
                options: [
                  { value: 'egoista', label: 'Sendo egoísta' },
                  { value: 'abandonando', label: 'Abandonando alguém' },
                  { value: 'humilhando', label: 'Humilhando alguém' },
                  { value: 'desrespeitando_sacrificio', label: 'Desrespeitando o sacrifício de alguém' },
                  { value: 'traindo_familia', label: 'Traindo minha família' },
                  { value: 'esquecendo_quem_sofreu', label: 'Esquecendo quem sofreu' },
                  { value: 'acima_de_alguem', label: 'Me colocando acima de alguém' },
                  { value: 'outra_coisa', label: 'Outra coisa' }
                ]
              },
              {
                id: 'e1_outra_sensacao_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva a outra sensação...'
              },
              {
                id: 'e1_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Se eu me permitir [escreva aqui]..."',
                placeholder: 'viver com abundância / descansar em paz...'
              },
              {
                id: 'e1_frase_parte2',
                type: 'text',
                label: '"...parece que estou [escreva aqui]."',
                placeholder: 'traindo a história de esforço da minha mãe...'
              }
            ]
          },
          {
            title: 'Folha 2 — De onde aprendi e o que ficou inacabado',
            description: 'Conecte-se com a memória de peso, sacrifício e o que ficou inacabado no seu sistema.',
            fields: [
              {
                id: 'e2_quem_pagou',
                type: 'textarea',
                label: '1. Quem, na minha família, viveu com muito peso, escassez, exaustão, renúncia ou sofrimento?',
                placeholder: 'Ex: Meu pai que trabalhava de sol a sol, ou minha avó que foi abandonada...'
              },
              {
                id: 'e2_o_que_sacrificou',
                type: 'textarea',
                label: '2. O que essa pessoa perdeu, suportou ou sacrificou?',
                placeholder: 'Ex: Perdeu a juventude, sacrificou a própria saúde, suportou humilhações...'
              },
              {
                id: 'e2_o_que_parece_mais_facil',
                type: 'textarea',
                label: '3. O que em mim hoje parece "mais fácil", "mais leve" ou "melhor" do que foi para essa pessoa?',
                placeholder: 'Ex: Eu posso trabalhar em escritório climatizado, tenho mais opções de lazer...'
              },
              {
                id: 'e2_mecanismo_evitar',
                type: 'multiselect',
                label: '4. O que eu sinto que preciso fazer para não ultrapassar essa pessoa?',
                options: [
                  { value: 'me_limitar', label: 'Me limitar' },
                  { value: 'me_cansar_mais', label: 'Me cansar mais' },
                  { value: 'me_cobrar_mais', label: 'Me cobrar mais' },
                  { value: 'nao_crescer_demais', label: 'Não crescer demais' },
                  { value: 'nao_descansar', label: 'Não descansar' },
                  { value: 'nao_aproveitar', label: 'Não aproveitar' },
                  { value: 'nao_ganhar_mais', label: 'Não ganhar mais' },
                  { value: 'nao_ser_feliz_demais', label: 'Não ser feliz demais' },
                  { value: 'outra_coisa', label: 'Outra coisa' }
                ]
              },
              {
                id: 'e2_outra_mecanismo_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que sente que precisa fazer...'
              },
              {
                id: 'e2_frase_parte1',
                type: 'text',
                label: '5. Complete a frase: "Para não ultrapassar [escreva aqui]..."',
                placeholder: 'o sofrimento do meu pai / a escassez da minha família...'
              },
              {
                id: 'e2_frase_parte2',
                type: 'text',
                label: '"...eu sinto que preciso [escreva aqui]."',
                placeholder: 'me sabotar no trabalho / viver exausto...'
              }
            ]
          },
          {
            title: 'Folha 3 — Regra Invisível',
            description: 'Qual é a regra invisível que aprendi? Desvele as leis ocultas de lealdade familiar.',
            fields: [
              {
                id: 'e3_regra_invisivel',
                type: 'multiselect',
                label: '1. Na minha história, qual parece ser a regra?',
                options: [
                  { value: 'se_foi_dificil_nao_pode_ser_leve', label: '“Se foi difícil para eles, não pode ser leve para mim.”' },
                  { value: 'preciso_pagar_de_volta_com_esforco', label: '“Se alguém se sacrificou, eu preciso pagar de volta com esforço.”' },
                  { value: 'descansar_enquanto_outros_sofreram_errado', label: '“Descansar enquanto outros sofreram é errado.”' },
                  { value: 'ter_mais_do_que_eles_deslealdade', label: '“Ter mais do que eles é deslealdade.”' },
                  { value: 'se_ficar_bem_estou_esquecendo', label: '“Se eu ficar bem demais, estou esquecendo quem sofreu.”' },
                  { value: 'so_mereco_se_me_cansar', label: '“Eu só mereço se eu me cansar.”' },
                  { value: 'outra', label: 'Outra regra' }
                ]
              },
              {
                id: 'e3_outra_regra_desc',
                type: 'text',
                label: 'Se selecionou "Outra regra", descreva:',
                placeholder: 'Escreva a outra regra...'
              },
              {
                id: 'e3_regra_propria_palavra',
                type: 'textarea',
                label: '2. Escreva com suas palavras a regra invisível que governa essa culpa:',
                placeholder: 'Como essa regra opera na sua mente?'
              },
              {
                id: 'e3_comportamentos_atuais',
                type: 'multiselect',
                label: '3. Em quais comportamentos essa regra aparece hoje?',
                options: [
                  { value: 'trabalho_demais', label: 'Trabalho demais' },
                  { value: 'nao_descanso_em_paz', label: 'Não descanso em paz' },
                  { value: 'me_saboto_ao_crescer', label: 'Me saboto quando começo a crescer' },
                  { value: 'culpa_ganhar_dinheiro', label: 'Sinto culpa ao ganhar dinheiro' },
                  { value: 'minimizo_conquistas', label: 'Minimizo minhas conquistas' },
                  { value: 'crio_problemas_quando_tudo_da_certo', label: 'Crio problemas quando tudo começa a dar certo' },
                  { value: 'me_sobrecarrego_para_merecer', label: 'Me sobrecarrego para "merecer"' },
                  { value: 'nao_usufruo', label: 'Não usufruo do que conquisto' },
                  { value: 'outra_coisa', label: 'Outra coisa' }
                ]
              },
              {
                id: 'e3_outra_comportamento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o comportamento...'
              }
            ]
          },
          {
            title: 'Folha 4 — Função + O que é meu e o que não é meu',
            description: 'Compreenda a intenção positiva protetora e separe os destinos de forma saudável.',
            fields: [
              {
                id: 'e4_o_que_devo',
                type: 'textarea',
                label: '1. O que eu sinto que devo ao meu sistema ou a essa pessoa?',
                placeholder: 'Ex: Sinto que devo lealdade à infelicidade dela, sinto que devo o meu esforço constante...'
              },
              {
                id: 'e4_como_pago_hoje',
                type: 'multiselect',
                label: '2. Como eu pago essa dívida hoje?',
                options: [
                  { value: 'me_esgotando', label: 'Me esgotando' },
                  { value: 'me_limitando', label: 'Me limitando' },
                  { value: 'adiando_crescimento', label: 'Adiando meu crescimento' },
                  { value: 'recusando_prazer', label: 'Recusando prazer' },
                  { value: 'nao_descansando', label: 'Não descansando' },
                  { value: 'carregando_peso_demais', label: 'Carregando peso demais' },
                  { value: 'me_punindo_quando_da_certo', label: 'Me punindo quando algo dá certo' },
                  { value: 'nao_ficando_maior', label: 'Não ficando maior do que "posso"' },
                  { value: 'outra_coisa', label: 'Outra coisa' }
                ]
              },
              {
                id: 'e4_outra_pagamento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva como você paga essa dívida...'
              },
              {
                id: 'e4_o_que_faco_comigo',
                type: 'textarea',
                label: '3. O que eu faço comigo quando começo a ter mais leveza, prazer, dinheiro, amor ou liberdade?',
                placeholder: 'Ex: Fico doente, arrumo uma discussão, perco dinheiro, começo a me cobrar excessivamente...'
              },
              {
                id: 'e4_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Quando a vida começa a melhorar, eu costumo [escreva aqui]..."',
                placeholder: 'me sabotar ou criar um problema...'
              },
              {
                id: 'e4_frase_parte2',
                type: 'text',
                label: '"...para não ficar \"melhor demais\" do que [escreva aqui]."',
                placeholder: 'meu irmão que está desempregado...'
              },
              {
                id: 'e5_o_que_aconteceria_se_permitisse',
                type: 'multiselect',
                label: '5. Se eu realmente me permitisse viver melhor, o que parece que aconteceria?',
                options: [
                  { value: 'me_sentiria_culpado', label: 'Eu me sentiria culpado' },
                  { value: 'pareceria_injusto', label: 'Pareceria injusto' },
                  { value: 'sentiria_abandonou', label: 'Sentiria que abandonei alguém' },
                  { value: 'desrespeitando_historia_familia', label: 'Sentiria que estou desrespeitando a história da minha família' },
                  { value: 'me_afastando_demais', label: 'Sentiria que estou me afastando demais' },
                  { value: 'medo_perder_pertencimento', label: 'Teria medo de perder pertencimento' },
                  { value: 'medo_ser_punido', label: 'Teria medo de ser punido' },
                  { value: 'outra_coisa', label: 'Outra coisa' }
                ]
              },
              {
                id: 'e5_outra_acontecimento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que aconteceria...'
              },
              {
                id: 'e5_o_que_culpa_impede',
                type: 'multiselect',
                label: '6. O que essa culpa tenta impedir?',
                options: [
                  { value: 'ultrapasse_alguem', label: 'Que eu ultrapasse alguém' },
                  { value: 'descanse', label: 'Que eu descanse' },
                  { value: 'tenha_mais', label: 'Que eu tenha mais' },
                  { value: 'seja_feliz_sem_pagar', label: 'Que eu seja feliz sem pagar' },
                  { value: 'cresca_sem_sofrer', label: 'Que eu cresça sem sofrer' },
                  { value: 'viva_diferente', label: 'Que eu viva diferente da minha família' },
                  { value: 'outra_coisa', label: 'Outra coisa' }
                ]
              },
              {
                id: 'e5_outra_impedimento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que ela tenta impedir...'
              },
              {
                id: 'e5_frase_parte1',
                type: 'text',
                label: '7. Complete a frase: "Essa culpa tenta me impedir de [escreva aqui]..."',
                placeholder: 'ganhar dinheiro com facilidade...'
              },
              {
                id: 'e5_frase_parte2',
                type: 'text',
                label: '"...porque parece perigoso / errado / desleal viver isso sem [escreva aqui]."',
                placeholder: 'sofrer ou fazer muito esforço físico...'
              },
              {
                id: 'e6_pertence_a_quem',
                type: 'textarea',
                label: '8. O sofrimento, o sacrifício ou a limitação dessa pessoa pertencem a quem?',
                placeholder: 'Ex: Pertence exclusivamente à jornada e ao destino do meu pai...'
              },
              {
                id: 'e6_responsabilidade_hoje',
                type: 'textarea',
                label: '9. O que realmente é minha responsabilidade hoje?',
                placeholder: 'Ex: Cuidar do meu próprio progresso, ser feliz e manter minha saúde...'
              },
              {
                id: 'e6_nao_responsabilidade',
                type: 'textarea',
                label: '10. O que não é minha responsabilidade carregar, pagar ou repetir?',
                placeholder: 'Ex: Não é minha responsabilidade pagar pela escassez passada ou repetir a exaustão...'
              },
              {
                id: 'e6_frase1',
                type: 'text',
                label: '11. Complete: "O que é meu é [escreva aqui]..."',
                placeholder: 'a minha própria vida, minhas escolhas, meu sucesso e meu descanso...'
              },
              {
                id: 'e6_frase2',
                type: 'text',
                label: '"O que não é meu é [escreva aqui]..."',
                placeholder: 'o peso do destino, os sacrifícios e as dores daqueles que vieram antes de mim...'
              }
            ]
          },
          {
            title: 'Folha 5 — Frase de Correção com Áudio e Registro de Leveza',
            description: 'Sinta a força das palavras de liberação. Coloque a mão na região de tensão corporal e leia devagar.',
            fields: [
              {
                id: 'e7_frase1_parte1',
                type: 'text',
                label: '1. Complete: "O sofrimento de [escreva aqui]..."',
                placeholder: 'minha mãe / meu avô...'
              },
              {
                id: 'e7_frase1_parte2',
                type: 'text',
                label: '"...pertence à história de [escreva aqui]."',
                placeholder: 'vida dela / superação dele...'
              },
              {
                id: 'e7_frase2',
                type: 'text',
                label: '2. Complete: "Eu não preciso repetir [escreva aqui] para honrar / amar / pertencer."',
                placeholder: 'a escassez / a solidão / o sacrifício contínuo...'
              },
              {
                id: 'e7_frase3',
                type: 'text',
                label: '3. Complete: "Me limitar não repara [escreva aqui]."',
                placeholder: 'o passado / o que ela sofreu / as perdas da família...'
              },
              {
                id: 'e7_frase4',
                type: 'text',
                label: '4. Complete: "Me punir não devolve [escreva aqui]."',
                placeholder: 'a saúde do meu pai / a felicidade que eles não tiveram...'
              },
              {
                id: 'e7_frase5',
                type: 'text',
                label: '5. Complete: "Hoje, o que me cabe é [escreva aqui]."',
                placeholder: 'viver plenamente, prosperar e desfrutar...'
              }
            ]
          },
          {
            title: 'Folha 6 — Ato com Duplo Check',
            description: 'Determine sua atitude na matéria para quebrar o padrão e registrá-lo.',
            fields: [
              {
                id: 'e8_parar_de_fazer',
                type: 'textarea',
                label: '1. O que eu preciso parar de fazer para não continuar pagando essa culpa?',
                placeholder: 'Ex: Parar de trabalhar até a exaustão sem necessidade, parar de reclamar de dinheiro...'
              },
              {
                id: 'e8_permitir_viver',
                type: 'textarea',
                label: '2. O que eu preciso começar a me permitir viver?',
                placeholder: 'Ex: Descansar no domingo sem culpa, usufruir de jantares agradáveis...'
              }
            ]
          }
        ];
      case 'culpa_separacao':
        return [
          {
            title: 'Folha 1 — O que eu não me permito viver?',
            description: 'Mapeie com honestidade as áreas de impedimento para se diferenciar do seu sistema.',
            fields: [
              {
                id: 'e1_area',
                type: 'multiselect',
                label: '1. Hoje, em que área da minha vida eu sinto que não posso me diferenciar, escolher por mim ou viver algo que meu sistema não viveu?',
                options: [
                  { value: 'dinheiro', label: 'Dinheiro' },
                  { value: 'trabalho', label: 'Trabalho' },
                  { value: 'relacionamento', label: 'Relacionamento' },
                  { value: 'corpo_aparencia', label: 'Corpo / aparência' },
                  { value: 'cidade_distancia', label: 'Cidade / distância física' },
                  { value: 'rotina_estilo_vida', label: 'Rotina / estilo de vida' },
                  { value: 'fe_visao_mundo', label: 'Fé / visão de mundo' },
                  { value: 'posicionamento_visibilidade', label: 'Posicionamento / visibilidade' },
                  { value: 'liberdade_autonomia', label: 'Liberdade / autonomia' },
                  { value: 'outra', label: 'Outra área' }
                ]
              },
              {
                id: 'e1_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra área...'
              },
              {
                id: 'e1_o_que_nao_permite',
                type: 'textarea',
                label: '2. O que exatamente eu sinto que não posso fazer, escolher, ter ou viver?',
                placeholder: 'Ex: Fazer um intercâmbio, ter sucesso financeiro fora do padrão familiar, expressar minha fé...'
              },
              {
                id: 'e1_sensacao',
                type: 'multiselect',
                label: '3. Se eu me permitir viver isso, parece que estou:',
                options: [
                  { value: 'abandonando', label: 'abandonando alguém' },
                  { value: 'traindo_familia', label: 'traindo minha família' },
                  { value: 'deixando_atras', label: 'deixando alguém para trás' },
                  { value: 'virando_outro', label: 'virando outra pessoa' },
                  { value: 'ingrato', label: 'sendo ingrato' },
                  { value: 'rompendo_pacto', label: 'rompendo um pacto invisível' },
                  { value: 'desrespeitando_sacrificio', label: 'desrespeitando quem abriu mão da própria vida' },
                  { value: 'grande_demais', label: 'ficando "grande demais" para continuar pertencendo' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e1_outra_sensacao_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva a outra sensação...'
              },
              {
                id: 'e1_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Se eu me permitir [escreva aqui]..."',
                placeholder: 'me diferenciar / prosperar profissionalmente / viver meu próprio estilo de vida...'
              },
              {
                id: 'e1_frase_parte2',
                type: 'text',
                label: '"...parece que estou [escreva aqui]."',
                placeholder: 'traindo minha família / abandonando minha mãe...'
              }
            ]
          },
          {
            title: 'Folha 2 — De onde aprendi e o que ficou inacabado',
            description: 'Conecte-se com a memória de peso, sacrifício e o que ficou inacabado no seu sistema.',
            fields: [
              {
                id: 'e2_quem_nao_afasta',
                type: 'textarea',
                label: '1. De qual pessoa, vínculo ou lugar da família eu sinto que não posso me separar de verdade?',
                placeholder: 'Ex: Da minha mãe, do meu pai, do papel de cuidador de todos...'
              },
              {
                id: 'e2_o_que_aconteceria',
                type: 'textarea',
                label: '2. O que eu sinto que aconteceria com essa pessoa ou com esse vínculo se eu me diferenciasse mais?',
                placeholder: 'Ex: Ela ficaria desamparada, o vínculo se romperia, haveria conflitos...'
              },
              {
                id: 'e2_o_que_preservar',
                type: 'multiselect',
                label: '3. O que eu sinto que preciso preservar para continuar pertencendo?',
                options: [
                  { value: 'proximidade', label: 'proximidade' },
                  { value: 'aprovacao', label: 'aprovação' },
                  { value: 'dependencia', label: 'dependência' },
                  { value: 'semelhanca', label: 'semelhança' },
                  { value: 'disponibilidade', label: 'disponibilidade' },
                  { value: 'obediencia', label: 'obediência' },
                  { value: 'sofrimento_parecido', label: 'sofrimento parecido' },
                  { value: 'estilo_vida_parecido', label: 'estilo de vida parecido' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e2_outra_preservar_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que precisa preservar...'
              },
              {
                id: 'e2_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Se eu me afastar / me diferenciar de [escreva aqui]..."',
                placeholder: 'meu pai / minha família / minha mãe...'
              },
              {
                id: 'e2_frase_parte2',
                type: 'text',
                label: '"...parece que [escreva aqui]."',
                placeholder: 'ela não vai suportar / serei excluído e rejeitado...'
              },
              {
                id: 'e3_quem_renunciou',
                type: 'textarea',
                label: '5. Quem, na minha família, renunciou à própria vida, abriu mão de algo importante ou ficou preso a uma vida menor do que queria?',
                placeholder: 'Ex: Minha mãe renunciou ao curso superior, meu avô abriu mão das terras...'
              },
              {
                id: 'e3_renunciou_ao_que',
                type: 'multiselect',
                label: '6. Ao que essa pessoa renunciou?',
                options: [
                  { value: 'relacionamento', label: 'relacionamento' },
                  { value: 'trabalho_carreira', label: 'trabalho / carreira' },
                  { value: 'dinheiro', label: 'dinheiro' },
                  { value: 'estudo', label: 'estudo' },
                  { value: 'cidade_mudanca', label: 'cidade / mudança' },
                  { value: 'liberdade', label: 'liberdade' },
                  { value: 'prazer', label: 'prazer' },
                  { value: 'descanso', label: 'descanso' },
                  { value: 'expressao_voz', label: 'expressão / voz' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e3_outra_renuncia_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que mais renunciou...'
              },
              {
                id: 'e3_o_que_nao_pode_viver',
                type: 'textarea',
                label: '7. O que eu sinto que não posso viver porque essa pessoa não viveu?',
                placeholder: 'Ex: Estudar fora, ganhar muito dinheiro, ter um casamento leve e feliz...'
              },
              {
                id: 'e3_frase_parte1',
                type: 'text',
                label: '8. Complete a frase: "Como [escreva quem] não pôde viver [escreva o que ela não viveu]..."',
                placeholder: 'minha mãe / uma carreira acadêmica de sucesso...'
              },
              {
                id: 'e3_frase_parte2',
                type: 'text',
                label: '"...eu sinto que também não posso [escreva o que você se priva]."',
                placeholder: 'estudar fora / crescer profissionalmente...'
              }
            ]
          },
          {
            title: 'Folha 3 — Regra Invisível',
            description: 'Qual é a regra invisível que aprendi? Desvele as leis ocultas de lealdade familiar.',
            fields: [
              {
                id: 'e4_regra_invisivel',
                type: 'multiselect',
                label: '1. Na minha história, qual parece ser a regra?',
                options: [
                  { value: 'se_for_mais_longe_traio', label: '“Se eu for mais longe, eu traio.”' },
                  { value: 'se_crescer_separo', label: '“Se eu crescer demais, eu me separo.”' },
                  { value: 'se_viver_diferente_nao_pertenço', label: '“Se eu viver diferente, deixo de pertencer.”' },
                  { value: 'se_escolher_abandono', label: '“Se eu escolher por mim, abandono os meus.”' },
                  { value: 'se_me_tornar_alguem_sofre', label: '“Se eu me tornar quem eu sou, alguém vai sofrer.”' },
                  { value: 'continuar_amado_parecido', label: '“Para continuar amado, preciso continuar parecido.”' },
                  { value: 'nao_viver_o_que_outro_nao_viveu', label: '“Não posso viver o que alguém importante não viveu.”' },
                  { value: 'outra', label: 'Outra regra' }
                ]
              },
              {
                id: 'e4_outra_regra_desc',
                type: 'text',
                label: 'Se selecionou "Outra regra", descreva:',
                placeholder: 'Escreva a regra invisível...'
              },
              {
                id: 'e4_regra_propria_palavra',
                type: 'textarea',
                label: '2. Escreva com suas palavras a regra invisível que governa essa culpa:',
                placeholder: 'Como você explicaria essa lei invisível em sua mente?'
              },
              {
                id: 'e4_comportamentos_atuais',
                type: 'multiselect',
                label: '3. Em quais comportamentos essa regra aparece hoje?',
                options: [
                  { value: 'peço_permissao', label: 'peço permissão para tudo' },
                  { value: 'adio_decisoes', label: 'adio decisões importantes' },
                  { value: 'escondo_quer', label: 'escondo o que realmente quero' },
                  { value: 'volto_atras', label: 'volto atrás quando começo a me afirmar' },
                  { value: 'saboto_autonomia', label: 'saboto relacionamentos, dinheiro ou autonomia' },
                  { value: 'evito_expor', label: 'evito me expor para não me diferenciar' },
                  { value: 'proximidade_excessiva', label: 'mantenho proximidade excessiva' },
                  { value: 'nao_sustento_nao', label: 'não consigo sustentar um “não”' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e4_outra_comportamento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o comportamento...'
              }
            ]
          },
          {
            title: 'Folha 4 — Função + O que é meu e o que não é meu',
            description: 'Compreenda a intenção positiva protetora e separe os destinos de forma saudável.',
            fields: [
              {
                id: 'e5_o_que_deixa_viver',
                type: 'textarea',
                label: '1. O que eu deixo de viver para não me afastar do sistema?',
                placeholder: 'Ex: Minha independência financeira, morar fora da cidade natal...'
              },
              {
                id: 'e5_o_que_esconde_sabota',
                type: 'multiselect',
                label: '2. O que eu escondo, diminuo ou saboto em mim para não “ir longe demais”?',
                options: [
                  { value: 'sucesso', label: 'meu sucesso' },
                  { value: 'dinheiro', label: 'meu dinheiro' },
                  { value: 'talento', label: 'meu talento' },
                  { value: 'opiniao', label: 'minha opinião' },
                  { value: 'relacionamento', label: 'meu relacionamento' },
                  { value: 'felicidade', label: 'minha felicidade' },
                  { value: 'autonomia', label: 'minha autonomia' },
                  { value: 'desejo_mudanca', label: 'meu desejo de mudança' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_esconde_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que esconde ou sabota...'
              },
              {
                id: 'e5_quando_comeco_faco',
                type: 'multiselect',
                label: '3. Quando começo a me diferenciar, o que eu costumo fazer?',
                options: [
                  { value: 'recuo', label: 'recuo' },
                  { value: 'me_explico_demais', label: 'me explico demais' },
                  { value: 'peço_desculpas', label: 'peço desculpas' },
                  { value: 'me_saboto', label: 'me saboto' },
                  { value: 'volto_agradar', label: 'volto a agradar' },
                  { value: 'assumo_culpa', label: 'assumo culpa' },
                  { value: 'aproximo_aliviar_tensao', label: 'me aproximo de novo para aliviar a tensão' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_faco_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que costuma fazer...'
              },
              {
                id: 'e5_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Para continuar pertencendo, eu me mantenho [escreva aqui]..."',
                placeholder: 'pequeno profissionalmente / dependente financeiramente...'
              },
              {
                id: 'e5_frase_parte2',
                type: 'text',
                label: '"...e deixo de viver [escreva aqui]."',
                placeholder: 'minha independência total e meu brilho profissional...'
              },
              {
                id: 'e6_o_que_aconteceria_separasse',
                type: 'multiselect',
                label: '5. Se eu realmente me separasse mais, o que parece que aconteceria?',
                options: [
                  { value: 'alguem_sofreria', label: 'alguém sofreria' },
                  { value: 'sentiria_abandonado', label: 'alguém se sentiria abandonado' },
                  { value: 'visto_como_ingrato', label: 'eu seria visto como ingrato' },
                  { value: 'perderia_amor', label: 'eu perderia o amor de alguém' },
                  { value: 'deixaria_pertencer', label: 'eu deixaria de pertencer' },
                  { value: 'sentiria_sozinho', label: 'eu me sentiria sozinho' },
                  { value: 'viraria_outro', label: 'eu viraria “outra pessoa”' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e6_outra_separasse_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que aconteceria...'
              },
              {
                id: 'e6_o_que_culpa_impede',
                type: 'multiselect',
                label: '6. O que essa culpa tenta impedir?',
                options: [
                  { value: 'me_diferencie', label: 'que eu me diferencie' },
                  { value: 'cresca_alem', label: 'que eu cresça além do sistema' },
                  { value: 'construa_vida_propria', label: 'que eu construa uma vida própria' },
                  { value: 'ame_diferente', label: 'que eu ame diferente' },
                  { value: 'ganhe_mais', label: 'que eu ganhe mais' },
                  { value: 'afaste_fisicamente', label: 'que eu me afaste fisicamente' },
                  { value: 'pare_servir_emocionalmente', label: 'que eu pare de servir emocionalmente' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e6_outra_impede_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que ela impede...'
              },
              {
                id: 'e6_frase_parte1',
                type: 'text',
                label: '7. Complete a frase: "Essa culpa tenta me impedir de [escreva aqui]..."',
                placeholder: 'ganhar mais dinheiro / morar em outra cidade...'
              },
              {
                id: 'e6_frase_parte2',
                type: 'text',
                label: '"...porque parece perigoso / egoísta / desleal viver isso sem [escreva aqui]."',
                placeholder: 'a aprovação deles / fazer o mesmo esforço que eles...'
              },
              {
                id: 'e7_dor_pertence_quem',
                type: 'textarea',
                label: '8. A dor, a renúncia ou a limitação dessa pessoa pertencem a quem?',
                placeholder: 'Ex: Pertence exclusivamente à história de vida e escolhas da minha mãe...'
              },
              {
                id: 'e7_responsabilidade_hoje',
                type: 'textarea',
                label: '9. O que realmente é minha responsabilidade hoje?',
                placeholder: 'Ex: Fazer bom uso das oportunidades que tenho, buscar meu bem-estar...'
              },
              {
                id: 'e7_nao_responsabilidade',
                type: 'textarea',
                label: '10. O que não é minha responsabilidade carregar, compensar ou repetir?',
                placeholder: 'Ex: Não é minha responsabilidade carregar a frustração ou solidão de outros...'
              },
              {
                id: 'e7_frase1',
                type: 'text',
                label: '11. Complete: "O que é meu é [escreva aqui]..."',
                placeholder: 'minha vida, meu futuro, minhas escolhas profissionais...'
              },
              {
                id: 'e7_frase2',
                type: 'text',
                label: '"O que não é meu é [escreva aqui]..."',
                placeholder: 'o sacrifício alheio, as dores e renúncias do passado...'
              }
            ]
          },
          {
            title: 'Folha 5 — Frase de Correção com Áudio e Registro de Leveza',
            description: 'Sinta a força das palavras de liberação. Coloque a mão na região de tensão corporal e leia devagar.',
            fields: [
              {
                id: 'e8_frase1_parte1',
                type: 'text',
                label: '1. Complete: "A renúncia / dor / limitação de [escreva aqui]..."',
                placeholder: 'meu pai / minha avó...'
              },
              {
                id: 'e8_frase1_parte2',
                type: 'text',
                label: '"...pertence à história de [escreva aqui]."',
                placeholder: 'vida dele / superação dela...'
              },
              {
                id: 'e8_frase2',
                type: 'text',
                label: '2. Complete: "Eu não preciso repetir [escreva aqui] para continuar pertencendo."',
                placeholder: 'a escassez financeira / a dependência emocional / a insatisfação profissional...'
              },
              {
                id: 'e8_frase3',
                type: 'text',
                label: '3. Complete: "Me limitar não salva [escreva aqui]."',
                placeholder: 'o casamento deles / a frustração dos meus pais...'
              },
              {
                id: 'e8_frase4',
                type: 'text',
                label: '4. Complete: "Me sabotar não repara [escreva aqui]."',
                placeholder: 'o passado / as perdas financeiras de antes...'
              },
              {
                id: 'e8_frase5',
                type: 'text',
                label: '5. Complete: "Hoje, o que me cabe é [escreva aqui]."',
                placeholder: 'seguir em frente, expandir e viver com plenitude...'
              }
            ]
          },
          {
            title: 'Folha 6 — Ato com Duplo Check',
            description: 'Determine sua atitude na matéria para quebrar o padrão e registrá-lo.',
            fields: [
              {
                id: 'e9_parar_de_fazer',
                type: 'textarea',
                label: '1. O que eu preciso parar de fazer para não continuar preso a essa culpa?',
                placeholder: 'Ex: Parar de pedir autorização para comprar coisas simples, parar de esconder minhas conquistas...'
              },
              {
                id: 'e9_permitir_viver',
                type: 'textarea',
                label: '2. O que eu preciso começar a me permitir viver?',
                placeholder: 'Ex: Tomar decisões profissionais por conta própria, dizer "não" de forma clara...'
              }
            ]
          }
        ];
      case 'culpa_responsabilidade':
        return [
          {
            title: 'Folha 1 — O que eu não me permito viver?',
            description: 'Identifique o que você carrega de forma desequilibrada no seu sistema.',
            fields: [
              {
                id: 'e1_area',
                type: 'multiselect',
                label: '1. Hoje, em que área da minha vida eu sinto que preciso segurar algo que não deveria depender só de mim?',
                options: [
                  { value: 'dinheiro', label: 'Dinheiro' },
                  { value: 'familia', label: 'Família' },
                  { value: 'relacionamento', label: 'Relacionamento' },
                  { value: 'trabalho', label: 'Trabalho' },
                  { value: 'saude_corpo', label: 'Saúde / corpo' },
                  { value: 'emocoes_outros', label: 'Emoções de outras pessoas' },
                  { value: 'conflitos_casa', label: 'Conflitos da casa' },
                  { value: 'decisoes_outros', label: 'Decisões dos outros' },
                  { value: 'paz_ambiente', label: 'Paz do ambiente' },
                  { value: 'outra', label: 'Outra área' }
                ]
              },
              {
                id: 'e1_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra área...'
              },
              {
                id: 'e1_o_que_sustentar',
                type: 'textarea',
                label: '2. O que exatamente eu sinto que preciso sustentar, consertar, resolver ou impedir?',
                placeholder: 'Ex: Preciso sustentar as despesas de casa sozinho, ou evitar brigas entre meus pais...'
              },
              {
                id: 'e1_se_nao_fizer',
                type: 'multiselect',
                label: '3. Se eu não fizer isso, parece que:',
                options: [
                  { value: 'tudo_desmorona', label: 'tudo desmorona' },
                  { value: 'alguem_sofrera', label: 'alguém vai sofrer' },
                  { value: 'alguem_se_perdera', label: 'alguém vai se perder' },
                  { value: 'serei_culpado', label: 'eu serei culpado' },
                  { value: 'sendo_omisso', label: 'estarei sendo omisso' },
                  { value: 'abandonando_alguem', label: 'estarei abandonando alguém' },
                  { value: 'falhando_moralmente', label: 'estarei falhando moralmente' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e1_outra_se_nao_fizer_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que parece que acontecerá...'
              },
              {
                id: 'e1_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Se eu não [escreva aqui]..."',
                placeholder: 'resolver todos os problemas financeiros...'
              },
              {
                id: 'e1_frase_parte2',
                type: 'text',
                label: '"...parece que [escreva aqui]."',
                placeholder: 'tudo vai desmoronar e serei o culpado...'
              }
            ]
          },
          {
            title: 'Folha 2 — De onde aprendi e o que ficou inacabado',
            description: 'Conecte-se com o alvo da sua sobrecarga e a ferida histórica que você tenta compensar.',
            fields: [
              {
                id: 'e2_quem_excessivo',
                type: 'textarea',
                label: '1. De quem eu me sinto responsável de um jeito excessivo?',
                placeholder: 'Ex: Da minha mãe, que sempre foi infeliz, ou do meu irmão desempregado...'
              },
              {
                id: 'e2_o_que_fazer',
                type: 'multiselect',
                label: '2. O que eu sinto que preciso fazer por essa pessoa ou por esse sistema?',
                options: [
                  { value: 'proteger', label: 'proteger' },
                  { value: 'acalmar', label: 'acalmar' },
                  { value: 'sustentar', label: 'sustentar' },
                  { value: 'resolver', label: 'resolver' },
                  { value: 'mediar', label: 'mediar' },
                  { value: 'impedir_sofra', label: 'impedir que sofra' },
                  { value: 'impedir_erre', label: 'impedir que erre' },
                  { value: 'impedir_desmorone', label: 'impedir que desmorone' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e2_outra_fazer_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que sente que precisa fazer...'
              },
              {
                id: 'e2_deixar_lidar',
                type: 'textarea',
                label: '3. O que eu sinto que aconteceria se eu deixasse essa pessoa lidar com a própria vida, dor ou consequência?',
                placeholder: 'Ex: Ela iria se afundar na depressão, ou o casamento dela acabaria de vez...'
              },
              {
                id: 'e2_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Eu me sinto responsável por [escreva quem]..."',
                placeholder: 'minha mãe / meu sistema...'
              },
              {
                id: 'e2_frase_parte2',
                type: 'text',
                label: '"...porque parece que, se eu não [escreva o que precisa fazer]..."',
                placeholder: 'sustentar o humor dela / intermediar as brigas...'
              },
              {
                id: 'e2_frase_parte3',
                type: 'text',
                label: '"...[escreva o que aconteceria]."',
                placeholder: 'ela vai desmoronar e eu não vou aguentar a culpa...'
              },
              {
                id: 'e3_quem_sofreu',
                type: 'textarea',
                label: '5. Quem, no meu sistema, sofreu algo injusto, pesado ou desproporcional?',
                placeholder: 'Ex: Meu avô que perdeu todos os bens, ou minha mãe que foi maltratada pelo meu pai...'
              },
              {
                id: 'e3_o_que_aconteceu',
                type: 'textarea',
                label: '6. O que aconteceu com essa pessoa?',
                placeholder: 'Ex: Foi abandonada grávida, passou fome na infância, foi humilhada...'
              },
              {
                id: 'e3_compensar_corrigir',
                type: 'textarea',
                label: '7. O que em mim tenta compensar, corrigir ou equilibrar isso até hoje?',
                placeholder: 'Ex: Tento ser perfeito em tudo, ou assumo toda a carga financeira para ninguém mais passar aperto...'
              },
              {
                id: 'e3_frase_parte1',
                type: 'text',
                label: '8. Complete a frase: "Como [escreva quem] viveu [escreva o sofrimento]..."',
                placeholder: 'minha mãe / a humilhação do abandonment...'
              },
              {
                id: 'e3_frase_parte2',
                type: 'text',
                label: '"...eu sinto que preciso [escreva sua sobrecarga de compensação]."',
                placeholder: 'ser o pilar inabalável de todos / salvar a família da pobreza...'
              }
            ]
          },
          {
            title: 'Folha 3 — Regra Invisível',
            description: 'Qual é a regra invisível que aprendi? Traga luz às ordens inconscientes que comandam seu cansaço.',
            fields: [
              {
                id: 'e4_regra_invisivel',
                type: 'multiselect',
                label: '1. Na minha história, qual parece ser a regra?',
                options: [
                  { value: 'se_nao_segurar_cai', label: '“Se eu não segurar, tudo cai.”' },
                  { value: 'funcao_impedir_sofrimento', label: '“É minha função impedir o sofrimento dos outros.”' },
                  { value: 'equilibrar_injusto', label: '“Eu preciso equilibrar o que foi injusto.”' },
                  { value: 'se_relaxar_ruim_acontece', label: '“Se eu relaxar, algo ruim acontece.”' },
                  { value: 'assumir_nao_assumem', label: '“Eu preciso assumir o que os outros não assumem.”' },
                  { value: 'se_nao_resolver_culpado', label: '“Se eu não resolver, serei culpado.”' },
                  { value: 'evitar_o_pior', label: '“Eu preciso evitar o pior.”' },
                  { value: 'outra', label: 'Outra regra' }
                ]
              },
              {
                id: 'e4_outra_regra_desc',
                type: 'text',
                label: 'Se selecionou "Outra regra", descreva:',
                placeholder: 'Escreva a regra invisível...'
              },
              {
                id: 'e4_regra_propria_palavra',
                type: 'textarea',
                label: '2. Escreva com suas palavras a regra invisível que governa essa culpa:',
                placeholder: 'Ex: Eu sou responsável pela felicidade da minha mãe, se ela estiver triste eu não posso ser feliz...'
              },
              {
                id: 'e4_comportamentos_atuais',
                type: 'multiselect',
                label: '3. Em quais comportamentos essa regra aparece hoje?',
                options: [
                  { value: 'carrego_peso_demais', label: 'carrego peso demais' },
                  { value: 'resolvo_problemas_alheios', label: 'resolvo problemas que não são meus' },
                  { value: 'tomo_frente', label: 'tomo a frente de tudo' },
                  { value: 'assumo_tarefas_sem_pedir', label: 'assumo tarefas que ninguém me pediu' },
                  { value: 'culpa_quando_descanso', label: 'sinto culpa quando descanso' },
                  { value: 'vigio_outros_evitar_erros', label: 'vigio os outros para evitar erros' },
                  { value: 'tento_controlar_resultados', label: 'tento controlar resultados' },
                  { value: 'mediador_compulsivo', label: 'me torno mediador compulsivo' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e4_outra_comportamento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o comportamento...'
              }
            ]
          },
          {
            title: 'Folha 4 — Função + O que é meu e o que não é meu',
            description: 'Observe o fardo diário, o que essa culpa tenta evitar, e trace uma fronteira saudável.',
            fields: [
              {
                id: 'e5_o_que_faco_nao_cabe',
                type: 'textarea',
                label: '1. O que eu faço pelos outros que talvez não me caiba fazer?',
                placeholder: 'Ex: Pagar as contas de parentes saudáveis que não trabalham, planejar a vida do meu parceiro...'
              },
              {
                id: 'e5_o_que_tento_evitar',
                type: 'multiselect',
                label: '2. O que eu tento evitar ou controlar o tempo todo?',
                options: [
                  { value: 'conflitos', label: 'conflitos' },
                  { value: 'sofrimento_alheio', label: 'sofrimento alheio' },
                  { value: 'erro_outros', label: 'erro dos outros' },
                  { value: 'rejeicao', label: 'rejeição' },
                  { value: 'colapso_emocional', label: 'colapso emocional de alguém' },
                  { value: 'perdas', label: 'perdas' },
                  { value: 'caos', label: 'caos' },
                  { value: 'fracasso', label: 'fracasso' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_evitar_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que tenta evitar...'
              },
              {
                id: 'e5_assumo_antes_pedirem',
                type: 'textarea',
                label: '3. O que eu assumo antes mesmo de me pedirem?',
                placeholder: 'Ex: Organizar as reuniões de família, resolver pendências burocráticas de terceiros...'
              },
              {
                id: 'e5_nao_consigo_resolver',
                type: 'multiselect',
                label: '4. Quando eu não consigo resolver, o que acontece em mim?',
                options: [
                  { value: 'culpa', label: 'culpa' },
                  { value: 'ansiedade', label: 'ansiedade' },
                  { value: 'vergonha', label: 'vergonha' },
                  { value: 'raiva_mim', label: 'raiva de mim' },
                  { value: 'sensacao_fracasso', label: 'sensação de fracasso' },
                  { value: 'medo_punicao', label: 'medo de punição' },
                  { value: 'falha_moral', label: 'sensação de que falhei moralmente' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_nao_consigo_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que acontece...'
              },
              {
                id: 'e5_frase_parte1',
                type: 'text',
                label: '5. Complete a frase: "Hoje eu continuo tentando controlar / resolver / sustentar [escreva o que]..."',
                placeholder: 'a estabilidade financeira de todos / a harmonia da casa...'
              },
              {
                id: 'e5_frase_parte2',
                type: 'text',
                label: '"...para evitar [escreva o que tem medo]."',
                placeholder: 'brigas agressivas ou que me culpem por tudo...'
              },
              {
                id: 'e6_se_largasse_peso',
                type: 'multiselect',
                label: '6. Se eu largasse esse peso, o que parece que aconteceria?',
                options: [
                  { value: 'alguem_sofreria', label: 'alguém sofreria' },
                  { value: 'alguem_culparia', label: 'alguém me culparia' },
                  { value: 'sentiria_egoista', label: 'eu me sentiria egoísta' },
                  { value: 'deixando_na_mao', label: 'eu estaria “deixando na mão”' },
                  { value: 'sairia_controle', label: 'algo importante sairia do controle' },
                  { value: 'seria_irresponsavel', label: 'eu seria irresponsável' },
                  { value: 'repetindo_abandono', label: 'eu estaria repetindo um abandono' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e6_outra_largasse_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que aconteceria...'
              },
              {
                id: 'e6_o_que_culpa_impede',
                type: 'multiselect',
                label: '7. O que essa culpa tenta impedir?',
                options: [
                  { value: 'alguem_sofra', label: 'que alguém sofra' },
                  { value: 'alguem_desorganize', label: 'que alguém se desorganize' },
                  { value: 'algo_saia_controle', label: 'que algo saia do controle' },
                  { value: 'visto_como_omisso', label: 'que eu seja visto como omisso' },
                  { value: 'contato_impotencia', label: 'que eu entre em contato com minha impotência' },
                  { value: 'aceite_nem_tudo_depende', label: 'que eu aceite que nem tudo depende de mim' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e6_outra_impede_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que ela impede...'
              },
              {
                id: 'e6_frase_parte1',
                type: 'text',
                label: '8. Complete a frase: "Essa culpa tenta me impedir de [escreva aqui]..."',
                placeholder: 'descansar no final de semana / dizer não...'
              },
              {
                id: 'e6_frase_parte2',
                type: 'text',
                label: '"...porque parece perigoso / errado / irresponsável deixar [escreva quem / o que] seguir sem meu controle."',
                placeholder: 'meu irmão desempregado resolver a vida dele...'
              },
              {
                id: 'e7_problema_pertence_quem',
                type: 'textarea',
                label: '9. O problema, a dor ou a responsabilidade principal pertencem a quem?',
                placeholder: 'Ex: À vida, às escolhas e ao destino do meu pai, ou à capacidade da minha mãe...'
              },
              {
                id: 'e7_responsabilidade_hoje',
                type: 'textarea',
                label: '10. O que realmente é minha responsabilidade hoje?',
                placeholder: 'Ex: Minha saúde, minha paz de espírito, gerenciar meu próprio trabalho...'
              },
              {
                id: 'e7_nao_responsabilidade',
                type: 'textarea',
                label: '11. O que não é minha responsabilidade sustentar, resolver ou impedir?',
                placeholder: 'Ex: Salvar o casamento de parentes, resolver conflitos emocionais alheios...'
              },
              {
                id: 'e7_frase1',
                type: 'text',
                label: '12. Complete: "O que é meu é [escreva aqui]..."',
                placeholder: 'minha própria vida, minhas escolhas e minha paz de espírito...'
              },
              {
                id: 'e7_frase2',
                type: 'text',
                label: '"...O que não é meu é [escreva aqui]..."',
                placeholder: 'o fardo emocional, os vícios e os problemas insolúveis dos outros...'
              }
            ]
          },
          {
            title: 'Folha 5 — Frase de Correção com Áudio e Registro de Leveza',
            description: 'Sinta a força das palavras de liberação. Coloque a mão na região de tensão corporal e leia devagar.',
            fields: [
              {
                id: 'e8_frase1_parte1',
                type: 'text',
                label: '1. Complete: "O peso / dor / problema de [escreva o nome]..."',
                placeholder: 'minha mãe / minha família...'
              },
              {
                id: 'e8_frase1_parte2',
                type: 'text',
                label: '"...pertence à história de [escreva quem]."',
                placeholder: 'ela mesma / deles...'
              },
              {
                id: 'e8_frase2',
                type: 'text',
                label: '2. Complete: "Eu não tenho o poder nem a obrigação de resolver [escreva o quê] no lugar de [escreva o nome]."',
                placeholder: 'o desemprego / a infelicidade / o vício...'
              },
              {
                id: 'e8_frase3',
                type: 'text',
                label: '3. Complete: "Assumir mais do que me cabe não repara [escreva aqui]."',
                placeholder: 'o sofrimento do passado / o erro de ninguém...'
              },
              {
                id: 'e8_frase4',
                type: 'text',
                label: '4. Complete: "Me sobrecarregar não impede [escreva o que teme]."',
                placeholder: 'que eles sofram ou que o pior aconteça se for o destino...'
              },
              {
                id: 'e8_frase5',
                type: 'text',
                label: '5. Complete: "Hoje, o que me cabe é [escreva seu papel saudável]."',
                placeholder: 'cuidar da minha vida, fazer apenas a minha parte e soltar o restante...'
              }
            ]
          },
          {
            title: 'Folha 6 — Ato com Duplo Check',
            description: 'Determine sua atitude na matéria para quebrar o padrão e registrá-lo.',
            fields: [
              {
                id: 'e9_parar_de_fazer',
                type: 'textarea',
                label: '1. O que eu preciso parar de fazer para não continuar sustentando o que não é meu?',
                placeholder: 'Ex: Parar de pagar as faturas dos outros, parar de me intrometer em discussões de casal...'
              },
              {
                id: 'e9_comecar_devolver',
                type: 'textarea',
                label: '2. O que eu preciso começar a devolver, soltar ou deixar sob responsabilidade de quem pertence?',
                placeholder: 'Ex: Deixar meu irmão resolver suas entrevistas de emprego, deixar meu pai lidar com suas dívidas...'
              }
            ]
          }
        ];
      case 'culpa_auto_odio':
        return [
          {
            title: 'Folha 1 — O que não me permito',
            description: 'Identifique os aspectos de si mesmo que você costuma condenar.',
            fields: [
              {
                id: 'e1_aspecto_errado',
                type: 'multiselect',
                label: '1. Hoje, o que em mim eu mais trato como algo errado, insuficiente, vergonhoso ou defeituoso?',
                options: [
                  { value: 'corpo', label: 'meu corpo' },
                  { value: 'personalidade', label: 'minha personalidade' },
                  { value: 'historia', label: 'minha história' },
                  { value: 'jeito_sentir', label: 'meu jeito de sentir' },
                  { value: 'jeito_relacionar', label: 'meu jeito de me relacionar' },
                  { value: 'desempenho', label: 'meu desempenho' },
                  { value: 'passado', label: 'meu passado' },
                  { value: 'erros', label: 'meus erros' },
                  { value: 'necessidades', label: 'minhas necessidades' },
                  { value: 'outra', label: 'outra coisa' }
                ]
              },
              {
                id: 'e1_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra coisa...'
              },
              {
                id: 'e1_condeno_rejeito',
                type: 'textarea',
                label: '2. O que exatamente eu condeno, rejeito ou tento corrigir em mim?',
                placeholder: 'Ex: Condeno minha ansiedade ou rejeito o fato de não ser produtivo o tempo todo...'
              },
              {
                id: 'e1_significado',
                type: 'multiselect',
                label: '3. Quando isso aparece, parece que significa que eu sou:',
                options: [
                  { value: 'fraco', label: 'fraco' },
                  { value: 'inadequado', label: 'inadequado' },
                  { value: 'quebrado', label: 'quebrado' },
                  { value: 'insuficiente', label: 'insuficiente' },
                  { value: 'egoista', label: 'egoísta' },
                  { value: 'dificil_amar', label: 'difícil de amar' },
                  { value: 'problematico', label: 'problemático' },
                  { value: 'decepcionante', label: 'decepcionante' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e1_outra_significado_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que parece significar...'
              },
              {
                id: 'e1_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Quando eu percebo [escreva aqui] em mim..."',
                placeholder: 'minha vulnerabilidade / minha impaciência...'
              },
              {
                id: 'e1_frase_parte2',
                type: 'text',
                label: '"...parece que isso prova que eu sou [escreva aqui]."',
                placeholder: 'fraco e insuficiente para ser amado...'
              }
            ]
          },
          {
            title: 'Folha 2 — De onde aprendi e o que ficou inacabado',
            description: 'Busque na história as origens da voz autocrítica.',
            fields: [
              {
                id: 'e2_quem_fez_sentir',
                type: 'textarea',
                label: '1. Na minha história, quem mais me fez sentir que eu era um problema, um peso, uma decepção ou alguém errado?',
                placeholder: 'Ex: Meu pai, que sempre me criticava, ou os professores na escola...'
              },
              {
                id: 'e2_como_acontecia',
                type: 'multiselect',
                label: '2. Como isso acontecia?',
                options: [
                  { value: 'criticas_constantes', label: 'críticas constantes' },
                  { value: 'rejeicao', label: 'rejeição' },
                  { value: 'humilhacao', label: 'humilhação' },
                  { value: 'comparacao', label: 'comparação' },
                  { value: 'frieza', label: 'frieza' },
                  { value: 'ausencia_emocional', label: 'ausência emocional' },
                  { value: 'exigencia_impossivel', label: 'exigência impossível' },
                  { value: 'invalidacao', label: 'invalidação' },
                  { value: 'silencio_indiferenca', label: 'silêncio / indiferença' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e2_outra_como_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva como acontecia...'
              },
              {
                id: 'e2_errado_ambiente',
                type: 'textarea',
                label: '3. O que parecia estar sempre errado em mim naquele ambiente?',
                placeholder: 'Ex: Meu ritmo mais calmo, minha sensibilidade, meu corpo...'
              },
              {
                id: 'e2_frase',
                type: 'textarea',
                label: '4. Complete a frase: "No meu sistema, eu aprendi que havia algo errado em mim porque [escreva aqui]."',
                placeholder: 'eu era criticado por não atender às expectativas perfeccionistas deles...'
              }
            ]
          },
          {
            title: 'Folha 3 — Regra Invisível',
            description: 'Qual é a regra invisível que aprendi? Traga luz às ordens inconscientes que comandam seu auto-ataque.',
            fields: [
              {
                id: 'e3_regra_invisivel',
                type: 'multiselect',
                label: '1. Na minha história, qual parece ser a regra?',
                options: [
                  { value: 'corrigir_tempo_todo', label: '“Se eu não me corrigir o tempo todo, eu viro um problema.”' },
                  { value: 'ser_duro_comigo', label: '“Eu preciso ser duro comigo para não falhar.”' },
                  { value: 'erro_minha_culpa', label: '“Se algo dá errado, a culpa é minha.”' },
                  { value: 'nao_relaxar_defeito', label: '“Eu não posso relaxar porque há algo defeituoso em mim.”' },
                  { value: 'vigiar_nao_decepcionar', label: '“Eu preciso me vigiar para não dececionar.”' },
                  { value: 'se_aceitar_acomoda', label: '“Se eu me aceitar, vou me acomodar e piorar.”' },
                  { value: 'algo_punido', label: '“Há algo em mim que precisa ser punido.”' },
                  { value: 'outra', label: 'Outra regra' }
                ]
              },
              {
                id: 'e3_outra_regra_desc',
                type: 'text',
                label: 'Se selecionou "Outra regra", descreva:',
                placeholder: 'Escreva a outra regra...'
              },
              {
                id: 'e3_regra_propria',
                type: 'textarea',
                label: '2. Escreva com suas palavras a regra invisível que governa esse auto-ódio:',
                placeholder: 'Ex: Só tenho valor se for perfeito; errar é imperdoável...'
              },
              {
                id: 'e3_comportamentos',
                type: 'multiselect',
                label: '3. Em quais comportamentos essa regra aparece hoje?',
                options: [
                  { value: 'autocritica_constante', label: 'autocrítica constante' },
                  { value: 'perfeccionismo', label: 'perfeccionismo' },
                  { value: 'culpa_errar', label: 'culpa por errar' },
                  { value: 'vergonha_precisar', label: 'vergonha de precisar de algo' },
                  { value: 'dificuldade_descansar', label: 'dificuldade de descansar' },
                  { value: 'punicao_apos_falha', label: 'punição depois de falhar' },
                  { value: 'sabotagem_sucesso', label: 'sabotagem quando algo vai bem' },
                  { value: 'comparacao_compulsiva', label: 'comparação compulsiva' },
                  { value: 'esconder_fragilidade', label: 'esconder fragilidade' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e3_outra_comportamento_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o comportamento...'
              }
            ]
          },
          {
            title: 'Folha 4 — Função + O que é meu e o que não é meu',
            description: 'Identifique os mecanismos inconscientes de punição ativa, sua intenção positiva e separe sua identidade real da história herdada.',
            fields: [
              {
                id: 'e4_faco_quando_erro',
                type: 'textarea',
                label: '1. O que eu faço comigo quando erro, falho, me exponho ou me sinto vulnerável?',
                placeholder: 'Ex: Fico remoendo por dias, me isolo das pessoas, me sobrecarrego...'
              },
              {
                id: 'e4_trato_por_dentro',
                type: 'multiselect',
                label: '2. Como eu me trato por dentro?',
                options: [
                  { value: 'humilho', label: 'me humilho' },
                  { value: 'xingo', label: 'me xingo' },
                  { value: 'comparo', label: 'me comparo' },
                  { value: 'diminuo', label: 'me diminuo' },
                  { value: 'retiro_prazer_descanso', label: 'retiro prazer / descanso' },
                  { value: 'sobrecarrego', label: 'me sobrecarrego' },
                  { value: 'isolo', label: 'me isolo' },
                  { value: 'saboto', label: 'me saboto' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e4_outra_trato_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva como se trata...'
              },
              {
                id: 'e4_nao_me_permito',
                type: 'multiselect',
                label: '3. O que eu não me permito por sentir que não mereço?',
                options: [
                  { value: 'descanso', label: 'descanso' },
                  { value: 'prazer', label: 'prazer' },
                  { value: 'amor', label: 'amor' },
                  { value: 'visibilidade', label: 'visibilidade' },
                  { value: 'dinheiro', label: 'dinheiro' },
                  { value: 'leveza', label: 'leveza' },
                  { value: 'erro_humano', label: 'erro humano' },
                  { value: 'cuidado', label: 'cuidado' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e4_outra_nao_permito_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que não se permite...'
              },
              {
                id: 'e4_frase_parte1',
                type: 'text',
                label: '4. Complete: "Quando eu me sinto [escreva aqui]..."',
                placeholder: 'rejeitado / imperfeito / improdutivo...'
              },
              {
                id: 'e4_frase_parte2',
                type: 'text',
                label: '"...eu costumo me punir através de [escreva aqui]."',
                placeholder: 'trabalhar sem parar / me xingar mentalmente...'
              },
              {
                id: 'e5_se_parasse',
                type: 'multiselect',
                label: '5. Se eu parasse de me vigiar, me corrigir ou me punir, o que parece que aconteceria?',
                options: [
                  { value: 'tornaria_pior', label: 'eu me tornaria pior' },
                  { value: 'perderia_controle', label: 'eu perderia o controle' },
                  { value: 'repetiria_erros', label: 'eu repetiria erros' },
                  { value: 'seria_rejeitado', label: 'eu seria rejeitado' },
                  { value: 'decepcionaria_pessoas', label: 'eu decepcionaria as pessoas' },
                  { value: 'acomodaria', label: 'eu me acomodaria' },
                  { value: 'provaria_inadequado', label: 'eu provaria que sou inadequado' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_se_parasse_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que aconteceria...'
              },
              {
                id: 'e5_impedir',
                type: 'multiselect',
                label: '6. O que esse auto-ódio tenta impedir?',
                options: [
                  { value: 'erro', label: 'erro' },
                  { value: 'rejeicao', label: 'rejeição' },
                  { value: 'fracasso', label: 'fracasso' },
                  { value: 'humilhacao', label: 'humilhação' },
                  { value: 'perda_valor', label: 'perda de valor' },
                  { value: 'relaxamento', label: 'relaxamento' },
                  { value: 'vulnerabilidade', label: 'vulnerabilidade' },
                  { value: 'necessidade', label: 'necessidade' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_impedir_desc',
                type: 'text',
                label: 'Se selecionou "Outra coisa", descreva:',
                placeholder: 'Descreva o que tenta impedir...'
              },
              {
                id: 'e5_frase',
                type: 'textarea',
                label: '7. Complete a frase: "Eu continuo me atacando porque parece perigoso / errado / irresponsável parar de [escreva aqui]."',
                placeholder: 'me cobrar incansavelmente / achar que sou defeituoso...'
              },
              {
                id: 'e6_defeito_absorvido',
                type: 'textarea',
                label: '8. O que eu trato como defeito meu, mas pode ter sido uma mensagem absorvida do ambiente?',
                placeholder: 'Ex: Sentir que sou "sensível demais" ou "lento" apenas porque não correspondia ao ritmo deles...'
              },
              {
                id: 'e6_identidade_vs_dor',
                type: 'textarea',
                label: '9. O que eu carrego como se fosse identidade, mas pode ser consequência de dor, crítica, rejeição ou desorganização do sistema?',
                placeholder: 'Ex: A autopunição constante, a mania de me esconder para não incomodar...'
              },
              {
                id: 'e6_meu_cuidar',
                type: 'textarea',
                label: '10. O que realmente é meu hoje para cuidar e desenvolver?',
                placeholder: 'Ex: Minhas escolhas profissionais, minha saúde física, a maneira como falo comigo...'
              },
              {
                id: 'e6_marca_historia',
                type: 'textarea',
                label: '11. O que não é uma prova de defeito, mas uma marca de história, contexto ou aprendizado?',
                placeholder: 'Ex: Minhas cicatrizes emocionais, minha necessidade temporária de segurança...'
              },
              {
                id: 'e6_frase1',
                type: 'text',
                label: '12. Complete: "O que é meu para cuidar é [escreva aqui]..."',
                placeholder: 'meu auto-acolhimento, minha profissão e minhas escolhas de vida...'
              },
              {
                id: 'e6_frase2',
                type: 'text',
                label: '"...O que não define meu valor é [escreva aqui]..."',
                placeholder: 'a incapacidade que eles tiveram de me aprovar ou valorizar...'
              }
            ]
          },
          {
            title: 'Folha 5 — Frase de Correção com Áudio e Registro de Leveza',
            description: 'Sinta a força das palavras de liberação. Coloque a mão na região de tensão corporal e leia devagar.',
            fields: [
              {
                id: 'e7_frase1_parte1',
                type: 'text',
                label: '1. Complete: "O modo como eu fui tratado / visto / corrigido em [escreva local / contexto]..."',
                placeholder: 'minha infância / minha casa antiga...'
              },
              {
                id: 'e7_frase1_parte2',
                type: 'text',
                label: '"...não define quem eu sou."',
                placeholder: 'e nem limita o meu direito de prosperar e me amar...'
              },
              {
                id: 'e7_frase2',
                type: 'text',
                label: '2. Complete: "O que eu aprendi a odiar em mim foi moldado por [escreva quem / o que]."',
                placeholder: 'exigências perfeccionistas e incompreensão alheia...'
              },
              {
                id: 'e7_frase3',
                type: 'text',
                label: '3. Complete: "Me punir não corrige [escreva o fato do passado]."',
                placeholder: 'os erros cometidos ou as expectativas não atendidas...'
              },
              {
                id: 'e7_frase4',
                type: 'text',
                label: '4. Complete: "Me atacar não repara [escreva aqui]."',
                placeholder: 'a dor de quem me feriu...'
              },
              {
                id: 'e7_frase5',
                type: 'text',
                label: '5. Complete: "Hoje, o que me cabe é [escreva seu novo caminho saudável]."',
                placeholder: 'me acolher, agir com maturidade e me dar o direito de errar...'
              }
            ]
          },
          {
            title: 'Folha 6 — Ato com Duplo Check',
            description: 'Determine sua atitude na matéria para quebrar o padrão e registrá-lo.',
            fields: [
              {
                id: 'e8_parar_fazer',
                type: 'textarea',
                label: '1. O que eu preciso parar de fazer comigo quando me sinto inadequado, culpado ou falho?',
                placeholder: 'Ex: Parar de me insultar em pensamento ou parar de trabalhar até a exaustão como punição...'
              },
              {
                id: 'e8_comecar_fazer',
                type: 'textarea',
                label: '2. O que eu preciso começar a fazer de diferente comigo?',
                placeholder: 'Ex: Falar comigo com tom de voz mental acolhedor, fazer pausas conscientes para respirar...'
              }
            ]
          }
        ];
      case 'culpa':
        return [
          {
            title: 'Resumo Inicial',
            description: 'Identifique o peso que você carrega.',
            fields: [
              { id: 'all_guilts', type: 'textarea', label: 'Liste as culpas que você carrega atualmente:', placeholder: 'Ex: Fui ríspido com minha mãe, Não cuidei da minha saúde...' },
              { id: 'target_guilt', type: 'textarea', label: 'Selecione UMA que mais pesa hoje para trabalharmos:', placeholder: 'Descreva a culpa escolhida...' }
            ]
          },
          {
            title: 'Mapeamento da Culpa',
            description: 'Vamos entender os envolvidos e o contexto.',
            fields: [
              { id: 'envolved', type: 'text', label: 'QUEM está envolvido nessa culpa?', placeholder: 'Pessoa ou situação...' },
              { id: 'other_feeling', type: 'text', label: 'O que essa pessoa sente ou sentia? (sua percepção)', placeholder: 'A culpa percebida...' },
              { id: 'event_context', type: 'textarea', label: 'Por causa de que acontecimento?', placeholder: 'Descreva o fato...' },
              { id: 'when_appears', type: 'text', label: 'Quando você sente essa culpa?', placeholder: 'Em que momento ela aparece?' }
            ]
          },
          {
            title: 'Análise Objetiva',
            description: 'Apenas os fatos, sem interpretações.',
            fields: [
              { id: 'objective_facts', type: 'textarea', label: 'Descreva o que aconteceu de forma objetiva:', placeholder: 'Só os fatos...' },
              { id: 'who_acted', type: 'text', label: 'Quem fez ou deixou de fazer?', placeholder: 'Foi você? Outro? Quem mais?' },
              { id: 'reason', type: 'textarea', label: 'Qual foi o motivo ou explicação para o ocorrido?', placeholder: 'A razão percebida...' }
            ]
          },
          {
             title: 'Raiz da Verdade',
             description: 'Identificando o tipo de culpa.',
             fields: [
                { 
                  id: 'guilt_type', 
                  type: 'select', 
                  label: 'Essa culpa que você sente é:',
                  options: [
                    { value: 'legitima', label: 'Culpa Legítima (Eu errei de verdade, havia escolha e não fiz)' },
                    { value: 'ilegitima', label: 'Culpa Ilegítima (Me culpo por algo fora do meu controle)' },
                    { value: 'transferida', label: 'Culpa Transferida (Carrego a culpa de outro que não assumiu)' },
                    { value: 'herdada', label: 'Culpa Herdada (Aprendi na família que devo me sentir culpado)' }
                  ]
                },
                { id: 'protection', type: 'textarea', label: 'O que essa culpa protege ou evita?', placeholder: 'Culpa recorrente sempre tem uma função...' },
                { id: 'better_truth', type: 'select', label: 'O que está mais próximo da verdade?', options: [
                  { value: 'liberacao', label: 'Eu errei, já fiz o que podia/posso reparar, me libero agora.' },
                  { value: 'reparacao_pendente', label: 'Eu errei, ainda tenho algo concreto a fazer, vou fazer e me liberar.' },
                  { value: 'nao_era_minha', label: 'Não errei, carreguei uma culpa que não era minha.' },
                  { value: 'padrao_familiar', label: 'Aprendi a me culpar, é um padrão que quero mudar.' }
                ]}
             ]
          },
          {
            title: 'V.I.D.A.',
            description: 'Consolidando a visão e ação.',
            fields: [
              { id: 'vida_visao', type: 'textarea', label: 'V — VISÃO: O que você enxerga sobre si mesmo após este protocolo?' },
              { id: 'vida_intencao', type: 'textarea', label: 'I — INTENÇÃO: O que você decide mudar ou assumir a partir de agora?' },
              { id: 'vida_direcao', type: 'textarea', label: 'D — DIREÇÃO: Para onde você vai? Qual o caminho que escolhe?' },
              { id: 'vida_acao', type: 'textarea', label: 'A — AÇÃO: Qual o primeiro passo concreto nos próximos 7 dias?' }
            ]
          }
        ];
      case 'dependencia':
        return [
          {
            title: 'Mapeamento Inicial',
            description: 'Identifique a pessoa com quem você tem dependência emocional.',
            fields: [
              { id: 'person_link', type: 'text', label: 'Quem é essa pessoa e qual o vínculo? (parceiro, ex, amigo, pai...)', placeholder: 'Ex: Meu ex-namorado' },
              { id: 'time_exists', type: 'text', label: 'Há quanto tempo esse vínculo existe?', placeholder: 'Ex: 5 anos' },
              { id: 'intensification', type: 'textarea', label: 'Quando essa dependência se intensificou? (houve um evento específico?)', placeholder: 'Descreva o momento...' },
              { id: 'feeling_no_contact', type: 'textarea', label: 'O que você sente quando fica sem contato com essa pessoa?', placeholder: 'Descreva seu sentimento...' }
            ]
          },
          {
            title: 'Diagnóstico do Vínculo',
            description: 'Reflexões sobre a qualidade da relação.',
            fields: [
              { id: 'tried_reduce', type: 'select', label: 'Você já tentou reduzir o contato ou se afastar e não conseguiu?', options: [{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}, {value: 'as_vezes', label: 'Às Vezes'}] },
              { id: 'presence_defines_day', type: 'select', label: 'A presença ou ausência dessa pessoa define como você se sente no dia?', options: [{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}, {value: 'as_vezes', label: 'Às Vezes'}] },
              { id: 'sacrifices_values', type: 'select', label: 'Você abre mão dos seus próprios valores ou desejos para manter essa relação?', options: [{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}, {value: 'as_vezes', label: 'Às Vezes'}] },
              { id: 'incapable_happy', type: 'select', label: 'Você sente que sem essa pessoa seria incapaz de ser feliz?', options: [{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}, {value: 'as_vezes', label: 'Às Vezes'}] }
            ]
          },
          {
            title: 'Raiz da Dependência',
            description: 'Olhando para a origem afetiva.',
            fields: [
              { id: 'childhood_availability', type: 'select', label: 'Quando criança, como era a disponibilidade emocional de quem cuidou de você?', options: [
                { value: 'consistente', label: 'Consistente — me sentia seguro e amado' },
                { value: 'inconsistente', label: 'Inconsistente — as vezes estava lá, as vezes não' },
                { value: 'ausente', label: 'Ausente — raramente recebi presença ou cuidado' },
                { value: 'condicional', label: 'Condicional — era amado quando me comportava de certa forma' }
              ]},
              { id: 'learned_about_love', type: 'textarea', label: 'O que você aprendeu sobre amor nessa fase?', placeholder: 'Aprendi que ser amado significa...' },
              { id: 'similarity_to_caregiver', type: 'textarea', label: 'Em que essa pessoa atual se parece com quem te criou?', placeholder: 'Mesmo que de forma sutil...' }
            ]
          },
          {
            title: 'O que falta em você',
            description: 'Identificando o vazio que a relação tenta preencher.',
            fields: [
              { id: 'what_searches', type: 'select', label: 'O que você busca nessa pessoa que ainda não encontrou em si mesmo?', options: [
                { value: 'validacao', label: 'Validação — preciso que ela diga que eu sou suficiente' },
                { value: 'seguranca', label: 'Segurança — só me sinto seguro quando ela está por perto' },
                { value: 'identidade', label: 'Identidade — sem ela não sei quem eu sou' },
                { value: 'valor', label: 'Valor — só me sinto valioso quando ela me escolhe' },
                { value: 'pertencimento', label: 'Pertencimento — sem ela me sinto sozinho no mundo' }
              ]},
              { id: 'give_to_self', type: 'textarea', label: 'Se você pudesse dar para si mesmo o que busca nela, como seria?', placeholder: 'Descreva aqui...' },
              { id: 'investment_ratio', type: 'text', label: 'O quanto você investe em se conhecer (0-10) vs quanto investe nessa relação?', placeholder: 'Ex: 2 vs 9' }
            ]
          },
          {
            title: 'V.I.D.A.',
            description: 'Seu compromisso com a autonomia.',
            fields: [
              { id: 'vida_visao', type: 'textarea', label: 'V — VISÃO: O que você enxerga sobre si mesmo após este protocolo?' },
              { id: 'vida_intencao', type: 'textarea', label: 'I — INTENÇÃO: O que você decide mudar ou assumir a partir de agora?' },
              { id: 'vida_direcao', type: 'textarea', label: 'D — DIREÇÃO: Para onde você vai? Qual o caminho que escolhe?' },
              { id: 'vida_acao', type: 'textarea', label: 'A — AÇÃO: Qual o primeiro passo concreto nos próximos 7 dias?' }
            ]
          }
        ];
      case 'medo':
        return [
          {
            title: 'Identificando o Medo',
            description: 'Vamos dar um nome ao que te paralisa.',
            fields: [
              { id: 'precise_fear', type: 'textarea', label: 'Descreva o medo com precisão (quanto mais específico, melhor):', placeholder: 'Ex: Medo de ser demitido e passar fome' },
              { id: 'fear_situations', type: 'textarea', label: 'Em que situações esse medo aparece?', placeholder: 'Ex: Quando meu chefe me chama para uma reunião' },
              { id: 'fear_reaction', type: 'textarea', label: 'O que você faz quando ele aparece? (foge, paralisa, ataca, evita?)', placeholder: 'Minha reação é...' },
              { id: 'fear_prevention', type: 'textarea', label: 'O que você deixa de fazer por causa desse medo?', placeholder: 'O que o medo te impede...' }
            ]
          },
          {
            title: 'A Origem do Medo',
            description: 'Buscando a primeira memória.',
            fields: [
              { id: 'first_time', type: 'textarea', label: 'Quando foi a primeira vez que você sentiu esse medo? O que estava acontecendo?', placeholder: 'Caso não lembre, escreva o que imagina...' },
              { id: 'fear_source', type: 'select', label: 'Esse medo veio de:', options: [
                { value: 'propria', label: 'Uma experiência própria dolorosa ou assustadora' },
                { value: 'alguem_proximo', label: 'Uma experiência de alguém próximo que eu observei' },
                { value: 'repetida_familia', label: 'Mensagem repetida na família (cuidado com X, X é perigoso)' },
                { value: 'crença_formada', label: 'Uma crença formada aos poucos, sem evento específico' }
              ]}
            ]
          },
          {
            title: 'A Crença por Baixo',
            description: 'Desvendando o cenário catastrófico.',
            fields: [
              { id: 'fear_belief', type: 'textarea', label: 'Complete a frase: "Tenho medo de [X] porque acredito que se acontecer..."', placeholder: 'Escreva o cenário que sua mente projeta...' },
              { id: 'happened_before', type: 'select', label: 'Esse cenário que você descreveu já aconteceu de verdade na sua vida?', options: [{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}, {value: 'as_vezes', label: 'Às Vezes'}] },
              { id: 'fear_probability', type: 'text', label: 'De 1 a 10, quão provável é desse cenário acontecer agora?', placeholder: 'Ex: 3' },
              { id: 'worst_case_deal', type: 'textarea', label: 'Se o pior acontecesse — o que você faria? Como lidaria?', placeholder: 'Sua estratégia de superação...' }
            ]
          },
          {
            title: 'Ressignificando',
            description: 'Transformando o medo em proteção.',
            fields: [
              { id: 'fear_protects', type: 'textarea', label: 'O que esse medo está tentando proteger em você? Qual o valor por baixo dele?', placeholder: 'Ex: Medo de falhar protege o desejo de dignidade' },
              { id: 'admiration_action', type: 'textarea', label: 'Existe alguém que você admira que enfrenta esse mesmo medo e age mesmo assim? O que ela faz?', placeholder: 'Sua referência...' },
              { id: 'next_step_fear', type: 'textarea', label: 'Se você agisse APESAR do medo, qual seria o primeiro passo?', placeholder: 'Um passo com medo, mas um passo...' }
            ]
          },
          {
            title: 'V.I.D.A.',
            description: 'Seu plano de avanço.',
            fields: [
              { id: 'vida_visao', type: 'textarea', label: 'V — VISÃO: O que você enxerga sobre si mesmo após este protocolo?' },
              { id: 'vida_intencao', type: 'textarea', label: 'I — INTENÇÃO: O que você decide mudar ou assumir a partir de agora?' },
              { id: 'vida_direcao', type: 'textarea', label: 'D — DIREÇÃO: Para onde você vai? Qual o caminho que escolhe?' },
              { id: 'vida_acao', type: 'textarea', label: 'A — AÇÃO: Qual o primeiro passo concreto nos próximos 7 dias?' }
            ]
          }
        ];
      case 'autoestima':
        return [
          {
            title: 'Diagnóstico Inicial',
            description: 'Como está sua percepção de valor próprio.',
            fields: [
              { id: 'self_esteem_rate', type: 'text', label: 'De 1 a 10, como você avalia sua autoestima hoje?', placeholder: 'Sendo 1 muito baixa e 10 muito alta' },
              { id: 'area_impact', type: 'select', label: 'A baixa autoestima aparece mais em qual área?', options: [
                { value: 'aparencia', label: 'Aparência — não me sinto fisicamente suficiente' },
                { value: 'capacidade', label: 'Capacidade — não me sinto competente ou inteligente' },
                { value: 'valor', label: 'Valor — não me sinto merecedor de amor ou sucesso' },
                { value: 'pertencimento', label: 'Pertencimento — não me sinto digno nos grupos' },
                { value: 'todas', label: 'Em todas as áreas igualmente' }
              ]},
              { id: 'main_criticisms', type: 'textarea', label: 'O que você mais critica em si mesmo? (Liste até 3 críticas)', placeholder: 'Ex: Sou enrolado, Sou feio...' }
            ]
          },
          {
            title: 'A Origem da Voz Crítica',
            description: 'Identificando de onde veio essa "verdade".',
            fields: [
              { id: 'voice_resemblance', type: 'text', label: 'Essa voz crítica se parece com a voz de alguém específico?', placeholder: 'Quem era essa pessoa?' },
              { id: 'what_she_did', type: 'textarea', label: 'O que essa pessoa dizia ou fazia que plantou essa crença?', placeholder: 'Descreva as sementes da crítica...' },
              { id: 'self_conclusion', type: 'textarea', label: 'Que conclusão você tirou sobre si mesmo a partir disso?', placeholder: 'Sua percepção formada...' },
              { id: 'start_age', type: 'text', label: 'Com que idade aproximadamente isso começou?', placeholder: 'Ex: 7 anos' }
            ]
          },
          {
            title: 'Disputando a Voz Crítica',
            description: 'Analisando a objetividade da sua autocrítica.',
            fields: [
              { id: 'painful_criticism', type: 'textarea', label: 'Escolha a crítica mais dolorosa que você se faz e escreva aqui:', placeholder: 'A crítica principal...' },
              { id: 'real_evidence_for', type: 'textarea', label: 'Qual a evidência REAL (fatos concretos) que sustenta essa crítica?', placeholder: 'Só fatos, sem interpretações...' },
              { id: 'real_evidence_against', type: 'textarea', label: 'Qual a evidência REAL que CONTRADIZ essa crítica?', placeholder: 'O que você já fez que prova o contrário?' },
              { id: 'friend_advice', type: 'textarea', label: 'Se um amigo dissesse isso dele mesmo, o que você diria para ele?', placeholder: 'Seu conselho compassivo...' }
            ]
          },
          {
            title: 'Construindo Valor Real',
            description: 'Reconhecendo o que já existe.',
            fields: [
              { id: 'genuine_qualities', type: 'textarea', label: 'Liste 3 qualidades genuínas suas (mesmo que pequenas):', placeholder: 'O que as pessoas valorizam em você?' },
              { id: 'healthy_version', type: 'textarea', label: 'O que uma versão sua com autoestima saudável faria de diferente esta semana?', placeholder: 'Seja específico...' }
            ]
          },
          {
            title: 'V.I.D.A.',
            description: 'Seu manifesto de valor.',
            fields: [
              { id: 'vida_visao', type: 'textarea', label: 'V — VISÃO: O que você enxerga sobre si mesmo após este protocolo?' },
              { id: 'vida_intencao', type: 'textarea', label: 'I — INTENÇÃO: O que você decide mudar ou assumir a partir de agora?' },
              { id: 'vida_direcao', type: 'textarea', label: 'D — DIREÇÃO: Para onde você vai? Qual o caminho que escolhe?' },
              { id: 'vida_acao', type: 'textarea', label: 'A — AÇÃO: Qual o primeiro passo concreto nos próximos 7 dias?' }
            ]
          }
        ];
      case 'ressentimento':
        return [
          {
            title: 'Identificando o Ressentimento',
            description: 'Dando nome à mágoa que você carrega.',
            fields: [
              { id: 'resentment_target', type: 'text', label: 'Quem é a pessoa ou qual é a situação que você ressente?', placeholder: 'Ex: Meu antigo sócio' },
              { id: 'what_happened', type: 'textarea', label: 'O que aconteceu especificamente? (fatos sem interpretação)', placeholder: 'Descreva a cena...' },
              { id: 'carry_time', type: 'text', label: 'Quanto tempo você carrega isso?', placeholder: 'Ex: 3 anos' },
              { id: 'daily_presence', type: 'textarea', label: 'Como esse ressentimento aparece no seu dia a dia?', placeholder: 'Pensamentos, emoções, comportamentos...' }
            ]
          },
          {
            title: 'Análise do que Aconteceu',
            description: 'Ampliando a visão sobre o outro.',
            fields: [
              { id: 'other_action_type', type: 'select', label: 'O que essa pessoa fez foi:', options: [
                { value: 'intencional', label: 'Uma ação intencional para me prejudicar' },
                { value: 'irresponsavel', label: 'Uma ação irresponsável ou descuidada — sem intenção' },
                { value: 'dor', label: 'Uma ação motivada pela própria dor — feridas ferem' },
                { value: 'interpretado', label: 'Uma ação que eu interpretei, mas pode não ter sido a intenção' },
                { value: 'combinacao', label: 'Uma combinação das opções acima' }
              ]},
              { id: 'other_perspective', type: 'textarea', label: 'Se você tentasse entender o que levou ela a agir assim — o que poderia explicar?', placeholder: 'Entender não é aceitar, é se libertar...' }
            ]
          },
          {
            title: 'A Função do Ressentimento',
            description: 'Por que ainda é difícil soltar?',
            fields: [
              { id: 'resentment_protection', type: 'textarea', label: 'O que o ressentimento está protegendo em você?', placeholder: 'Ex: Me protege de ser magoado de novo' },
              { id: 'resentment_help', type: 'select', label: 'Guardar esse ressentimento está te ajudando a:', options: [
                { value: 'distancia', label: 'Manter distância de alguém que me machucou' },
                { value: 'evitar_perdao', label: 'Evitar perdoar e ter que me abrir novamente' },
                { value: 'conexao', label: 'Manter uma conexão com essa pessoa — mesmo que dolorosa' },
                { value: 'punir', label: 'Punir essa pessoa — mesmo que ela não saiba' },
                { value: 'justificar', label: 'Justificar minha própria inação ou sofrimento' }
              ]}
            ]
          },
          {
            title: 'O Perdão',
            description: 'A decisão de se libertar.',
            fields: [
              { id: 'disposed_forgive', type: 'select', label: 'Você está disposto a considerar o perdão — pelo seu bem?', options: [{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}, {value: 'as_vezes', label: 'Às Vezes'}] },
              { id: 'forgive_meaning', type: 'textarea', label: 'O que o perdão precisaria significar para você sem parecer traição a si mesmo?', placeholder: 'Sua definição de libertação...' },
              { id: 'liberation_gain', type: 'textarea', label: 'O que você ganha ao se libertar desse ressentimento?', placeholder: 'Seja concreto — o que muda na sua vida?' }
            ]
          },
          {
            title: 'V.I.D.A.',
            description: 'Seu passo em direção à paz.',
            fields: [
              { id: 'vida_visao', type: 'textarea', label: 'V — VISÃO: O que você enxerga sobre si mesmo após este protocolo?' },
              { id: 'vida_intencao', type: 'textarea', label: 'I — INTENÇÃO: O que você decide mudar ou assumir a partir de agora?' },
              { id: 'vida_direcao', type: 'textarea', label: 'D — DIREÇÃO: Para onde você vai? Qual o caminho que escolhe?' },
              { id: 'vida_acao', type: 'textarea', label: 'A — AÇÃO: Qual o primeiro passo concreto nos próximos 7 dias?' }
            ]
          }
        ];
      case 'medo_ultrapassar':
        return [
          {
            title: 'Etapa 1 — O que eu tenho medo de viver melhor?',
            description: 'Identifique as áreas e sensações do seu medo de prosperar.',
            fields: [
              {
                id: 'e1_area',
                type: 'multiselect',
                label: '1. Hoje, em que área da minha vida eu sinto MEDO de ter mais, viver melhor ou sofrer menos do que alguém do meu mapa familiar?',
                options: [
                  { value: 'dinheiro', label: 'Dinheiro' },
                  { value: 'trabalho', label: 'Trabalho' },
                  { value: 'relacionamento', label: 'Relacionamento' },
                  { value: 'descanso', label: 'Descanso' },
                  { value: 'corpo_saude', label: 'Corpo / saúde' },
                  { value: 'prazer', label: 'Prazer' },
                  { value: 'liberdade', label: 'Liberdade' },
                  { value: 'visibilidade_sucesso', label: 'Visibilidade / sucesso' },
                  { value: 'outra', label: 'Outra' }
                ]
              },
              {
                id: 'e1_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra área...'
              },
              {
                id: 'e1_o_que_medo_viver',
                type: 'textarea',
                label: '2. O que exatamente eu tenho medo de viver?',
                placeholder: 'Ex: Tenho medo de viver um relacionamento feliz ou ter muito dinheiro...'
              },
              {
                id: 'e1_o_que_acontece',
                type: 'multiselect',
                label: '3. Se eu me permitir viver isso, parece que vai acontecer:',
                options: [
                  { value: 'serei_punido', label: 'serei punido' },
                  { value: 'vou_perder_pertencimento', label: 'vou perder pertencimento' },
                  { value: 'vou_humilhar_alguem', label: 'vou humilhar alguém' },
                  { value: 'vou_desrespeitar_sacrificio', label: 'vou desrespeitar o sacrifício de alguém' },
                  { value: 'vou_ser_rejeitado', label: 'vou ser rejeitado' },
                  { value: 'vou_causar_dor', label: 'vou causar dor em quem sofreu' },
                  { value: 'vou_me_sentir_em_perigo', label: 'vou me sentir em perigo' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e1_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva a outra consequência...'
              },
              {
                id: 'e1_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Se eu me permitir [escreva aqui]..."',
                placeholder: 'ganhar mais dinheiro / ter paz...'
              },
              {
                id: 'e1_frase_parte2',
                type: 'text',
                label: '"...tenho medo de [escreva aqui]."',
                placeholder: 'ser punido ou perder o amor deles...'
              }
            ]
          },
          {
            title: 'Etapa 2 — Quem eu tenho medo de ultrapassar?',
            description: 'Identifique de quem vem a história de peso e sofrimento.',
            fields: [
              {
                id: 'e2_quem_viveu',
                type: 'textarea',
                label: '1. Quem, na minha família, viveu com muito peso, escassez, exaustão, renúncia ou sofrimento?',
                placeholder: 'Ex: Meu pai que trabalhava exaustivamente sem parar, ou minha mãe...'
              },
              {
                id: 'e2_o_que_perdeu',
                type: 'textarea',
                label: '2. O que essa pessoa perdeu, suportou ou sacrificou?',
                placeholder: 'Ex: Sacrificou a saúde, perdeu a alegria de viver, suportou humilhações...'
              },
              {
                id: 'e2_o_que_parece_mais_facil',
                type: 'textarea',
                label: '3. O que em mim hoje parece “mais fácil”, “mais leve” ou “melhor” do que foi para essa pessoa?',
                placeholder: 'Ex: Eu posso descansar nos finais de semana, tenho uma carreira intelectual...'
              },
              {
                id: 'e2_preciso_fazer_nao_ter_mais',
                type: 'multiselect',
                label: '4. O que eu sinto que preciso fazer para NÃO ter mais que essa pessoa?',
                options: [
                  { value: 'me_limitar', label: 'me limitar' },
                  { value: 'me_cansar_mais', label: 'me cansar mais' },
                  { value: 'me_cobrar_mais', label: 'me cobrar mais' },
                  { value: 'nao_crescer_demais', label: 'não crescer demais' },
                  { value: 'nao_descansar', label: 'não descansar' },
                  { value: 'nao_aproveitar', label: 'não aproveitar' },
                  { value: 'nao_ganhar_mais', label: 'não ganhar mais' },
                  { value: 'nao_ser_feliz_demais', label: 'não ser feliz demais' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e2_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o que sente que precisa fazer...'
              },
              {
                id: 'e2_frase_parte1',
                type: 'text',
                label: '5. Complete a frase: "Para não ultrapassar [escreva aqui]..."',
                placeholder: 'a história difícil do meu pai / a exaustão da minha mãe...'
              },
              {
                id: 'e2_frase_parte2',
                type: 'text',
                label: '"...eu tenho medo e por isso [escreva aqui]."',
                placeholder: 'me saboto e vivo cansado...'
              }
            ]
          },
          {
            title: 'Etapa 3 — Qual é a ameaça invisível que eu aprendi?',
            description: 'Nomeie a lei de sobrevivência oculta em sua mente.',
            fields: [
              {
                id: 'e3_regra',
                type: 'multiselect',
                label: '1. Na minha história, qual parece ser a regra do medo?',
                options: [
                  { value: 'foi_dificil_nao_leve', label: '“Se foi difícil para eles, não pode ser leve para mim.”' },
                  { value: 'tiver_mais_alguem_sofre', label: '“Se eu tiver mais, alguém vai sofrer.”' },
                  { value: 'descansar_perigoso', label: '“Descansar enquanto outros sofreram é perigoso.”' },
                  { value: 'ter_mais_desleal', label: '“Ter mais do que eles é ser desleal.”' },
                  { value: 'ficar_bem_excluido', label: '“Se eu ficar bem demais, vou ser excluído.”' },
                  { value: 'seguro_se_cansar', label: '“Eu só estou seguro se eu me cansar.”' },
                  { value: 'outra', label: 'Outra' }
                ]
              },
              {
                id: 'e3_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra regra...'
              },
              {
                id: 'e3_ameaca_palavras',
                type: 'textarea',
                label: '2. Escreva com suas palavras a ameaça invisível que governa esse medo:',
                placeholder: 'Como essa ameaça secreta fala no seu pensamento?'
              },
              {
                id: 'e3_comportamentos',
                type: 'multiselect',
                label: '3. Em quais comportamentos esse medo aparece hoje?',
                options: [
                  { value: 'trabalho_demais', label: 'trabalho demais' },
                  { value: 'nao_descanso_paz', label: 'não descanso em paz' },
                  { value: 'me_saboto_crescer', label: 'me saboto quando começo a crescer' },
                  { value: 'ansiedade_dinheiro', label: 'sinto ansiedade ao ganhar dinheiro' },
                  { value: 'minimizo_conquistas', label: 'minimizo minhas conquistas' },
                  { value: 'crio_problemas', label: 'crio problemas quando tudo começa a dar certo' },
                  { value: 'me_sobrecarrego', label: 'me sobrecarrego para “merecer”' },
                  { value: 'nao_usufruo', label: 'não usufruo do que conquisto' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e3_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o comportamento...'
              }
            ]
          },
          {
            title: 'Etapa 4 — Como eu me protejo desse medo?',
            description: 'Reconheça as defesas inconscientes que te paralisam.',
            fields: [
              {
                id: 'e4_o_que_faco',
                type: 'textarea',
                label: '1. O que eu faço para me proteger de ultrapassar?',
                placeholder: 'Ex: Trabalho demais, fujo de novos projetos ou convites, evito falar de conquistas...'
              },
              {
                id: 'e4_como_pago',
                type: 'multiselect',
                label: '2. Como eu pago essa “proteção” hoje?',
                options: [
                  { value: 'me_esgotando', label: 'me esgotando' },
                  { value: 'me_limitando', label: 'me limitando' },
                  { value: 'adiando_crescimento', label: 'adiando meu crescimento' },
                  { value: 'recusando_prazer', label: 'recusando prazer' },
                  { value: 'nao_descansando', label: 'não descansando' },
                  { value: 'carregando_peso_demais', label: 'carregando peso demais' },
                  { value: 'me_punindo_quando_da_certo', label: 'me punindo quando algo dá certo' },
                  { value: 'nao_ficando_maior', label: 'não ficando maior do que “posso”' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e4_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva como você se sabota...'
              },
              {
                id: 'e4_quando_comeca_faco',
                type: 'textarea',
                label: '3. O que eu faço comigo quando começo a ter mais leveza, prazer, dinheiro, amor ou liberdade?',
                placeholder: 'Ex: Crio uma discussão, fico doente, gasto dinheiro sem controle ou me sobrecarrego...'
              },
              {
                id: 'e4_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Quando a vida começa a melhorar, eu costumo [escreva aqui]..."',
                placeholder: 'me cobrar excessivamente ou adiar o descanso...'
              },
              {
                id: 'e4_frase_parte2',
                type: 'text',
                label: '"...para não ficar “melhor demais” do que [escreva aqui]."',
                placeholder: 'meus pais que viveram com escassez...'
              }
            ]
          },
          {
            title: 'Etapa 5 — O que esse medo está tentando evitar?',
            description: 'Entenda a intenção positiva protetora que te mantém na escassez.',
            fields: [
              {
                id: 'e5_sem_exaustao_aconteceria',
                type: 'multiselect',
                label: '1. Se eu realmente me permitisse viver melhor SEM exaustão, o que parece que aconteceria?',
                options: [
                  { value: 'seria_punido', label: 'eu seria punido' },
                  { value: 'pareceria_injusto', label: 'pareceria injusto' },
                  { value: 'sentiria_abandonei', label: 'sentiria que abandonei alguém' },
                  { value: 'sentiria_desrespeitando', label: 'sentiria que estou desrespeitando a história da minha família' },
                  { value: 'afastando_demais', label: 'sentiria que estou me afastando demais' },
                  { value: 'perder_pertencimento', label: 'teria medo de perder pertencimento' },
                  { value: 'ser_rejeitado', label: 'teria medo de ser rejeitado' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o que aconteceria...'
              },
              {
                id: 'e5_medo_tentar_impedir',
                type: 'multiselect',
                label: '2. O que esse medo tenta impedir?',
                options: [
                  { value: 'ultrapasse_alguem', label: 'que eu ultrapasse alguém' },
                  { value: 'descanse', label: 'que eu descanse' },
                  { value: 'tenha_mais', label: 'que eu tenha mais' },
                  { value: 'feliz_sem_pagar', label: 'que eu seja feliz sem pagar' },
                  { value: 'cresca_sem_sofrer', label: 'que eu cresça sem sofrer' },
                  { value: 'viva_diferente', label: 'que eu viva diferente da minha família' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_impedir_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o que ele impede...'
              },
              {
                id: 'e5_frase_parte1',
                type: 'text',
                label: '3. Complete a frase: "Esse medo tenta me impedir de [escreva aqui]..."',
                placeholder: 'trabalhar de forma mais produtiva e leve...'
              },
              {
                id: 'e5_frase_parte2',
                type: 'text',
                label: '"...porque parece perigoso viver isso sem [escreva aqui]."',
                placeholder: 'exaustão e muito esforço...'
              }
            ]
          },
          {
            title: 'Etapa 6 — O que é perigo real e o que é memória?',
            description: 'Trace uma linha clara entre o presente e o passado familiar.',
            fields: [
              {
                id: 'e6_sofrimento_pertence',
                type: 'textarea',
                label: '1. O sofrimento, o sacrifício ou a limitação dessa pessoa pertencem a quem?',
                placeholder: 'Ex: Pertencem à história de vida e escolhas difíceis da minha avó...'
              },
              {
                id: 'e6_perigo_hoje',
                type: 'textarea',
                label: '2. O que realmente é um perigo hoje se eu prosperar?',
                placeholder: 'Ex: No presente real de hoje, não há perigo físico ou de sobrevivência, apenas um desconforto interno...'
              },
              {
                id: 'e6_apenas_memoria',
                type: 'textarea',
                label: '3. O que é apenas memória do mapa familiar que eu continuo carregando?',
                placeholder: 'Ex: A memória de que ganhar dinheiro atrai perigo ou de que descansar é proibido...'
              },
              {
                id: 'e6_frase1',
                type: 'text',
                label: '4. Complete: "O que é perigo real hoje é [escreva aqui]..."',
                placeholder: 'inexistente, hoje estou seguro para progredir...'
              },
              {
                id: 'e6_frase2',
                type: 'text',
                label: '"O que é apenas memória é [escreva aqui]..."',
                placeholder: 'a sensação de que se eu estiver bem estarei traindo a minha mãe...'
              }
            ]
          },
          {
            title: 'Etapa 7 — Frase de Correção',
            description: 'Sinta o alívio e a autorização interna profunda.',
            fields: [
              {
                id: 'e7_sofrimento_de',
                type: 'text',
                label: '1. Complete: "O sofrimento de [escreva aqui]..."',
                placeholder: 'meu pai / minha mãe...'
              },
              {
                id: 'e7_pertence_historia',
                type: 'text',
                label: '"...pertence à história de [escreva aqui]."',
                placeholder: 'vida dele / sacrifício dela...'
              },
              {
                id: 'e7_medo_repetir',
                type: 'text',
                label: '2. Complete: "Eu não preciso ter medo de repetir [escreva aqui] para honrar / amar / pertencer."',
                placeholder: 'a escassez / a exaustão física e mental...'
              },
              {
                id: 'e7_limitar_protege',
                type: 'text',
                label: '3. Complete: "Me limitar não protege [escreva aqui]."',
                placeholder: 'o passado deles / a história da minha família...'
              },
              {
                id: 'e7_punir_evita',
                type: 'text',
                label: '4. Complete: "Me punir não evita [escreva aqui]."',
                placeholder: 'a dor que eles passaram...'
              },
              {
                id: 'e7_cabe_permitir',
                type: 'text',
                label: '5. Complete: "Hoje, o que me cabe é me permitir [escreva aqui] sem exaustão."',
                placeholder: 'viver bem, prosperar e ter abundância...'
              }
            ]
          }
        ];
      case 'medo_separacao':
        return [
          {
            title: 'Etapa 1 — O que eu tenho medo de viver separado?',
            description: 'Identifique as áreas e sensações do seu medo de se separar e diferenciar.',
            fields: [
              {
                id: 'e1_area',
                type: 'multiselect',
                label: '1. Hoje, em que área da minha vida eu sinto MEDO de me diferenciar, ser autônomo ou viver diferente de alguém do meu mapa familiar?',
                options: [
                  { value: 'relacionamento', label: 'Relacionamento' },
                  { value: 'trabalho_carreira', label: 'Trabalho / carreira' },
                  { value: 'dinheiro', label: 'Dinheiro' },
                  { value: 'liberdade', label: 'Liberdade' },
                  { value: 'opinioes_valores', label: 'Opiniões / valores' },
                  { value: 'estilo_vida', label: 'Estilo de vida' },
                  { value: 'descanso', label: 'Descanso' },
                  { value: 'prazer', label: 'Prazer' },
                  { value: 'outra', label: 'Outra' }
                ]
              },
              {
                id: 'e1_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra área...'
              },
              {
                id: 'e1_o_que_medo_viver',
                type: 'textarea',
                label: '2. O que exatamente eu tenho medo de viver se eu me separar?',
                placeholder: 'Ex: Tenho medo de ser muito bem sucedido e não ter assunto com eles...'
              },
              {
                id: 'e1_o_que_acontece',
                type: 'multiselect',
                label: '3. Se eu me permitir ser diferente, parece que vai acontecer:',
                options: [
                  { value: 'vou_perder_amor', label: 'vou perder amor' },
                  { value: 'vou_ser_rejeitado', label: 'vou ser rejeitado' },
                  { value: 'vou_ser_excluido', label: 'vou ser excluído' },
                  { value: 'vou_magoar_alguem', label: 'vou magoar alguém' },
                  { value: 'vou_abandonar_quem_precisa', label: 'vou abandonar quem precisa de mim' },
                  { value: 'vou_ser_visto_traidor', label: 'vou ser visto como traidor' },
                  { value: 'vou_ficar_sozinho', label: 'vou ficar sozinho' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e1_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva a outra consequência...'
              },
              {
                id: 'e1_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Se eu me permitir [escreva aqui]..."',
                placeholder: 'ter meu próprio estilo de vida / escolher minhas opiniões...'
              },
              {
                id: 'e1_frase_parte2',
                type: 'text',
                label: '"...tenho medo de [escreva aqui]."',
                placeholder: 'ser excluído ou perder o amor do meu mapa familiar...'
              }
            ]
          },
          {
            title: 'Etapa 2 — De quem eu tenho medo de me separar?',
            description: 'Identifique a pessoa do seu mapa de quem você teme se diferenciar ou decepcionar.',
            fields: [
              {
                id: 'e2_quem_nao_posso_deixar',
                type: 'textarea',
                label: '1. Quem, na minha família, eu sinto que não posso deixar, decepcionar ou ser diferente?',
                placeholder: 'Ex: Minha mãe, meu irmão, meu pai...'
              },
              {
                id: 'e2_o_que_espera',
                type: 'textarea',
                label: '2. O que essa pessoa espera de mim (mesmo sem dizer)?',
                placeholder: 'Ex: Espera que eu more perto, que concorde com as mesmas ideias, que não a supere...'
              },
              {
                id: 'e2_o_que_seria_separacao',
                type: 'textarea',
                label: '3. O que em mim hoje seria considerado “separação” ou “deslealdade” para essa pessoa?',
                placeholder: 'Ex: Mudar de cidade, ter muito sucesso financeiro, casar e ter minha própria rotina...'
              },
              {
                id: 'e2_preciso_fazer_nao_separar',
                type: 'multiselect',
                label: '4. O que eu sinto que preciso fazer para NÃO me separar dessa pessoa?',
                options: [
                  { value: 'me_manter_igual', label: 'me manter igual' },
                  { value: 'nao_crescer_demais', label: 'não crescer demais' },
                  { value: 'nao_ter_opiniao_diferente', label: 'não ter opinião diferente' },
                  { value: 'nao_ter_sucesso_diferente', label: 'não ter sucesso diferente' },
                  { value: 'nao_ter_relacionamento_leve', label: 'não ter relacionamento leve' },
                  { value: 'pedir_permissao', label: 'pedir permissão' },
                  { value: 'me_diminuir', label: 'me diminuir' },
                  { value: 'ficar_perto_me_anulando', label: 'ficar por perto mesmo me anulando' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e2_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o que sente que precisa fazer...'
              },
              {
                id: 'e2_frase_parte1',
                type: 'text',
                label: '5. Complete a frase: "Para não me separar de [escreva aqui]..."',
                placeholder: 'minha mãe / meu pai...'
              },
              {
                id: 'e2_frase_parte2',
                type: 'text',
                label: '"...eu tenho medo e por isso [escreva aqui]."',
                placeholder: 'evito crescer financeiramente ou me diminuo...'
              }
            ]
          },
          {
            title: 'Etapa 3 — Qual é a ameaça invisível que eu aprendi?',
            description: 'Identifique la regra inconsciente que bloqueia sua individuação.',
            fields: [
              {
                id: 'e3_regra',
                type: 'multiselect',
                label: '1. Na minha história, qual parece ser a regra do medo?',
                options: [
                  { value: 'diferente_perder_amor', label: '“Se eu for diferente, vou perder amor.”' },
                  { value: 'autonomia_abandono', label: '“Autonomia é abandono.”' },
                  { value: 'crescer_deixar_atras', label: '“Crescer significa deixar para trás.”' },
                  { value: 'leal_ficar_igual', label: '“Ser leal é ficar igual.”' },
                  { value: 'separar_alguem_sofrer', label: '“Se eu me separar, alguém vai sofrer.”' },
                  { value: 'individuacao_traicao', label: '“Individuação é traição.”' },
                  { value: 'outra', label: 'Outra' }
                ]
              },
              {
                id: 'e3_outra_desc',
                type: 'text',
                label: 'Se selecionou "Outra", descreva:',
                placeholder: 'Descreva a outra regra...'
              },
              {
                id: 'e3_ameaca_palavras',
                type: 'textarea',
                label: '2. Escreva com suas palavras a ameaça invisível que governa esse medo:',
                placeholder: 'Ex: Sinto que se eu for feliz serei desleal à infelicidade de minha mãe...'
              },
              {
                id: 'e3_comportamentos',
                type: 'multiselect',
                label: '3. Em quais comportamentos esse medo aparece hoje?',
                options: [
                  { value: 'nao_tomo_decisoes_sem_aprovacao', label: 'não tomo decisões sem aprovação' },
                  { value: 'escondo_minhas_conquistas', label: 'escondo minhas conquistas' },
                  { value: 'me_sinto_culpado_dizer_nao', label: 'me sinto culpado ao dizer não' },
                  { value: 'mantenho_relacionamentos_obrigacao', label: 'mantenho relacionamentos por obrigação' },
                  { value: 'evito_conflitos_me_ferindo', label: 'evito conflitos mesmo me ferindo' },
                  { value: 'volto_atras_diferenciar', label: 'volto atrás quando começo a me diferenciar' },
                  { value: 'medo_visto_egoista', label: 'tenho medo de ser visto como egoísta' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e3_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o comportamento...'
              }
            ]
          },
          {
            title: 'Etapa 4 — Como eu me protejo desse medo?',
            description: 'Identifique os mecanismos de defesa que impedem sua autonomia.',
            fields: [
              {
                id: 'e4_o_que_faco',
                type: 'textarea',
                label: '1. O que eu faço para me proteger de me separar?',
                placeholder: 'Ex: Me anulo, permaneço morando na mesma casa/bairro mesmo querendo ir, fujo de decisões...'
              },
              {
                id: 'e4_como_pago',
                type: 'multiselect',
                label: '2. Como eu pago essa “proteção” hoje?',
                options: [
                  { value: 'me_anulando', label: 'me anulando' },
                  { value: 'me_mantendo_pequeno', label: 'me mantendo pequeno' },
                  { value: 'nao_escolhendo_por_mim', label: 'não escolhendo por mim' },
                  { value: 'ficando_em_relacoes_limitam', label: 'ficando em relações que me limitam' },
                  { value: 'pedindo_permissao_viver', label: 'pedindo permissão para viver' },
                  { value: 'evitando_autonomia', label: 'evitando autonomia' },
                  { value: 'sentindo_culpado_diferente', label: 'me sentindo culpado ao ser diferente' },
                  { value: 'nao_sustentando_escolhas', label: 'não sustentando minhas escolhas' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e4_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva como você se sabota...'
              },
              {
                id: 'e4_quando_comeca_faco',
                type: 'textarea',
                label: '3. O que eu faço comigo quando começo a me diferenciar, escolher por mim ou viver do meu jeito?',
                placeholder: 'Ex: Ligo para pedir conselhos de coisas simples, volto atrás nas minhas decisões...'
              },
              {
                id: 'e4_frase_parte1',
                type: 'text',
                label: '4. Complete a frase: "Quando começo a me separar, eu costumo [escreva aqui]..."',
                placeholder: 'me sabotar ou pedir conselhos de aprovação...'
              },
              {
                id: 'e4_frase_parte2',
                type: 'text',
                label: '"...para voltar a ficar igual a [escreva aqui]."',
                placeholder: 'eles e não me sentir desleal...'
              }
            ]
          },
          {
            title: 'Etapa 5 — O que esse medo está tentando evitar?',
            description: 'Identifique os temores de abandono e rejeição que alimentam este bloqueio.',
            fields: [
              {
                id: 'e5_sem_culpa_aconteceria',
                type: 'multiselect',
                label: '1. Se eu realmente me permitisse ser autônomo SEM culpa, o que parece que aconteceria?',
                options: [
                  { value: 'perderia_amor', label: 'eu perderia amor' },
                  { value: 'seria_rejeitado', label: 'seria rejeitado' },
                  { value: 'pareceria_traicao', label: 'pareceria traição' },
                  { value: 'alguem_sofreria', label: 'alguem sofreria por minha causa' },
                  { value: 'ficaria_sozinho', label: 'eu ficaria sozinho' },
                  { value: 'excluido_familia', label: 'eu seria excluído da família' },
                  { value: 'sentiria_desleal', label: 'eu me sentiria desleal' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_coisa_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o que aconteceria...'
              },
              {
                id: 'e5_medo_tentar_impedir',
                type: 'multiselect',
                label: '2. O que esse medo tenta impedir?',
                options: [
                  { value: 'me_diferencie', label: 'que eu me diferencie' },
                  { value: 'tenha_vida_propria', label: 'que eu tenha vida própria' },
                  { value: 'escolha_diferente', label: 'que eu escolha diferente' },
                  { value: 'cresca_separado', label: 'que eu cresça separado' },
                  { value: 'feliz_meu_jeito', label: 'que eu seja feliz do meu jeito' },
                  { value: 'quebre_lealdade', label: 'que eu quebre a lealdade invisível' },
                  { value: 'outra_coisa', label: 'outra coisa' }
                ]
              },
              {
                id: 'e5_outra_impedir_desc',
                type: 'text',
                label: 'Se selecionou "outra coisa", descreva:',
                placeholder: 'Descreva o que ele impede...'
              },
              {
                id: 'e5_frase_parte1',
                type: 'text',
                label: '3. Complete a frase: "Esse medo tenta me impedir de [escreva aqui]..."',
                placeholder: 'viver de forma autônoma e livre...'
              },
              {
                id: 'e5_frase_parte2',
                type: 'text',
                label: '"...porque parece perigoso viver isso sem [escreva aqui]."',
                placeholder: 'a aprovação constante deles...'
              }
            ]
          },
          {
            title: 'Etapa 6 — O que é perigo real e o que é memória?',
            description: 'Separe as memórias infantis de dependência dos fatos do seu presente real.',
            fields: [
              {
                id: 'e6_fusao_pertence',
                type: 'textarea',
                label: '1. A necessidade de fusão ou dependência dessa pessoa pertence a quem?',
                placeholder: 'Ex: Pertence à história de carência ou insegurança da minha mãe...'
              },
              {
                id: 'e6_perigo_hoje',
                type: 'textarea',
                label: '2. O que realmente é um perigo hoje se eu me diferenciar?',
                placeholder: 'Ex: No presente real, nenhum. Eu sou um adulto capaz de me sustentar e cuidar de mim...'
              },
              {
                id: 'e6_apenas_memoria',
                type: 'textarea',
                label: '3. O que é apenas memória de lealdade infantil que eu continuo carregando?',
                placeholder: 'Ex: A memória de que para pertencer eu preciso me anular ou ser igual...'
              },
              {
                id: 'e6_frase1',
                type: 'text',
                label: '4. Complete: "O que é perigo real hoje é [escreva aqui]..."',
                placeholder: 'inexistente, hoje sou livre e seguro...'
              },
              {
                id: 'e6_frase2',
                type: 'text',
                label: '"O que é apenas memória é [escreva aqui]..."',
                placeholder: 'a ilusão de que serei abandonado por não ser igual a eles...'
              }
            ]
          },
          {
            title: 'Etapa 7 — Frase de Correção',
            description: 'Conclua com a libertação e a validação do seu próprio caminho de autonomia.',
            fields: [
              {
                id: 'e7_fusao_de',
                type: 'text',
                label: '1. Complete: "A necessidade de fusão de [escreva aqui]..."',
                placeholder: 'minha mãe / meu pai...'
              },
              {
                id: 'e7_pertence_historia',
                type: 'text',
                label: '"...pertence à história de [escreva aqui]."',
                placeholder: 'vida dela / dependência dele...'
              },
              {
                id: 'e7_medo_separar_de',
                type: 'text',
                label: '2. Complete: "Eu não preciso ter medo de me separar de [escreva aqui] para honrar / amar / pertencer."',
                placeholder: 'meu pai / minha mãe...'
              },
              {
                id: 'e7_anular_protege',
                type: 'text',
                label: '3. Complete: "Me anular não protege [escreva aqui]."',
                placeholder: 'a história ou o sofrimento deles...'
              },
              {
                id: 'e7_manter_igual_evita',
                type: 'text',
                label: '4. Complete: "Me manter igual não evita [escreva aqui]."',
                placeholder: 'os problemas que eles viveram...'
              },
              {
                id: 'e7_cabe_permitir',
                type: 'text',
                label: '5. Complete: "Hoje, o que me cabe é me permitir [escreva aqui] com autonomia."',
                placeholder: 'viver meu próprio caminho e minhas escolhas...'
              }
            ]
          }
        ];
      default:
        // Generic structure for others while not fully implemented
        return [
           {
             title: 'Identificação',
             description: `Vamos iniciar o processamento de ${protocolTitle || "deste protocolo"}.`,
             fields: [
                { id: 'initial_list', type: 'textarea', label: 'Liste o que incomoda nesta área:', placeholder: 'Descreva aqui...' },
                { id: 'main_target', type: 'text', label: 'Foco principal:', placeholder: 'Escolha um ponto para trabalhar agora...' }
             ]
           },
           {
            title: 'Análise de Impacto',
            description: 'Como isso afeta sua vida hoje?',
            fields: [
               { id: 'impact_self', type: 'textarea', label: 'Como isso impacta você?' },
               { id: 'impact_others', type: 'textarea', label: 'Como impacta suas relações?' },
               { id: 'impact_results', type: 'textarea', label: 'Como afeta seus resultados?' }
            ]
           },
           {
            title: 'V.I.D.A.',
            description: 'Consolidação final.',
            fields: [
              { id: 'vida_visao', type: 'textarea', label: 'V — VISÃO: O que você enxerga sobre si mesmo?' },
              { id: 'vida_intencao', type: 'textarea', label: 'I — INTENÇÃO: O que você decide assumir?' },
              { id: 'vida_direcao', type: 'textarea', label: 'D — DIREÇÃO: Qual o caminho escolhido?' },
              { id: 'vida_acao', type: 'textarea', label: 'A — AÇÃO: Primeiro passo concreto (7 dias)?' }
            ]
          }
        ];
    }
  };

export   const applyTargetPersonPersonalization = (steps: any[], person: TargetPersonInfo | null | undefined) => {
    const activePerson = person;
    if (!activePerson || !activePerson.name) return steps;

    const role = (activePerson.role || '').toLowerCase();
    const name = activePerson.name || '';
    const lowerName = name.toLowerCase();

    const isFeminine = role === 'mae' || lowerName === 'mãe' || lowerName === 'mae' || lowerName.includes('avó') || lowerName.includes('avoa') || lowerName.includes('tia') || lowerName.includes('irmã') || lowerName.includes('irma');

    let possessive = name;
    if (role === 'mae' || lowerName === 'mãe' || lowerName === 'mae') {
      possessive = 'minha mãe';
    } else if (role === 'pai' || lowerName === 'pai') {
      possessive = 'meu pai';
    } else if (role === 'ancestral') {
      possessive = (name && name !== 'Ancestral da Linhagem' && name !== 'Ancestral Mapeado') ? name : 'meu ancestral';
    } else if (role === 'credor') {
      possessive = (name && name !== 'Credor Moral') ? name : 'meu credor moral';
    } else if (role === 'parceiro') {
      possessive = (name && name !== 'Parceiro(a) / Ex-Parceiro(a)') ? name : 'meu/minha parceiro(a)';
    } else if (lowerName.includes('avó') || lowerName.includes('avoa')) {
      possessive = lowerName.startsWith('minha') ? name : `minha ${name}`;
    } else if (lowerName.includes('avô') || lowerName.includes('avo')) {
      possessive = lowerName.startsWith('meu') ? name : `meu ${name}`;
    } else if (lowerName.includes('tio')) {
      possessive = lowerName.startsWith('meu') ? name : `meu ${name}`;
    } else if (lowerName.includes('tia')) {
      possessive = lowerName.startsWith('minha') ? name : `minha ${name}`;
    } else if (lowerName.includes('irmão') || lowerName.includes('irmao')) {
      possessive = lowerName.startsWith('meu') ? name : `meu ${name}`;
    } else if (lowerName.includes('irmã') || lowerName.includes('irma')) {
      possessive = lowerName.startsWith('minha') ? name : `minha ${name}`;
    }

    const singularPronoun = isFeminine ? 'ela' : 'ele';
    const singularOf = isFeminine ? 'dela' : 'dele';
    const singularWith = isFeminine ? 'com ela' : 'com ele';
    const singularFor = isFeminine ? 'para ela' : 'para ele';
    const singularBy = isFeminine ? 'por ela' : 'por ele';

    const replaceInString = (str: string): string => {
      if (!str || typeof str !== 'string') return str;

      return str
        .replace(/que meu sistema não viveu/gi, `que ${possessive} não viveu`)
        .replace(/que o sistema não viveu/gi, `que ${possessive} não viveu`)
        .replace(/que seu sistema não viveu/gi, `que ${possessive} não viveu`)
        .replace(/\[escreva aqui\]/gi, possessive)
        .replace(/minha mãe \/ meu pai/gi, possessive)
        .replace(/meu pai \/ minha mãe/gi, possessive)
        .replace(/minha mãe\/pai/gi, possessive)
        .replace(/meu pai\/mãe/gi, possessive)
        .replace(/mãe\/pai/gi, possessive)
        .replace(/pai\/mãe/gi, possessive)
        .replace(/dessa pessoa/gi, `de ${possessive}`)
        .replace(/da pessoa/gi, `de ${possessive}`)
        .replace(/para essa pessoa/gi, `para ${possessive}`)
        .replace(/para a pessoa/gi, `para ${possessive}`)
        .replace(/com essa pessoa/gi, `com ${possessive}`)
        .replace(/com a pessoa/gi, `com ${possessive}`)
        .replace(/sobre essa pessoa/gi, `sobre ${possessive}`)
        .replace(/sobre a pessoa/gi, `sobre ${possessive}`)
        .replace(/por essa pessoa/gi, `por ${possessive}`)
        .replace(/por a pessoa/gi, `por ${possessive}`)
        .replace(/essa pessoa/gi, name || possessive)
        .replace(/a pessoa/gi, possessive)
        .replace(/meu sistema/gi, possessive)
        .replace(/o sistema/gi, possessive)
        .replace(/meu clã familiar/gi, possessive)
        .replace(/meu clã/gi, possessive)
        .replace(/mapa familiar/gi, `mapa (${possessive})`)
        .replace(/minha família/gi, `minha história com ${possessive}`)
        .replace(/do ancestral/gi, `de ${possessive}`)
        .replace(/ao ancestral/gi, `a ${possessive}`)
        .replace(/com o ancestral/gi, `com ${possessive}`)
        .replace(/o ancestral/gi, name || possessive)
        .replace(/meus pais que/gi, `${possessive} que`)
        .replace(/meus pais/gi, possessive)
        .replace(/para eles/gi, singularFor)
        .replace(/com eles/gi, singularWith)
        .replace(/por eles/gi, singularBy)
        .replace(/do que eles/gi, `do que ${singularPronoun}`)
        .replace(/deles/gi, singularOf)
        .replace(/eles viveram/gi, `${singularPronoun} viveu`)
        .replace(/eles sofreram/gi, `${singularPronoun} sofreu`);
    };

    return steps.map(stepObj => {
      const newStep = { ...stepObj };
      if (newStep.title) newStep.title = replaceInString(newStep.title);
      if (newStep.description) newStep.description = replaceInString(newStep.description);

      if (Array.isArray(newStep.fields)) {
        newStep.fields = newStep.fields.map((field: any) => {
          const newField = { ...field };
          if (newField.label) newField.label = replaceInString(newField.label);
          if (['envolved', 'person_link', 'resentment_target', 'e2_quem_viveu', 'e1_pessoa'].includes(field.id)) {
            newField.label = `Pessoa Mapeada no Espelho / Quadrante (${possessive}):`;
            newField.placeholder = `Confirmado no seu mapa: ${possessive}`;
          }
          if (newField.placeholder) {
            newField.placeholder = replaceInString(newField.placeholder);
            if (activePerson.contractStatement && (field.id === 'e3_ameaca_palavras' || field.id === 'e1_o_que_aconteceu' || field.id === 'e1_contrato')) {
              newField.placeholder = `Aliança Mapeada: "${activePerson.contractStatement}" — Descreva como se manifesta na sua vida...`;
            }
          }
          if (Array.isArray(newField.options)) {
            newField.options = newField.options.map((opt: any) => ({
              ...opt,
              label: replaceInString(opt.label)
            }));
          }
          return newField;
        });
      }
      return newStep;
    });
  };
