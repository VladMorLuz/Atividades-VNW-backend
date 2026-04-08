const { getDb, query, run } = require('../src/database');

async function seed() {
  await getDb();
  console.log('🌱 Populando banco de dados com dados de exemplo...\n');

  // Pacientes fictícios
  const p1 = run(`INSERT INTO pacientes (nome, data_nascimento, endereco, telefone_familiar,
    nome_familiar, condicoes_saude, nivel_autonomia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Dona Maria Aparecida', '1942-03-15', 'Rua das Flores, 45 - Centro',
     '(31) 99811-2233', 'Carlos (filho)', 'Hipertensão, diabetes tipo 2', 'baixo',
     'Gosta de ouvir rádio pela manhã. Prefere banho antes das 9h.']);

  const p2 = run(`INSERT INTO pacientes (nome, data_nascimento, endereco, telefone_familiar,
    nome_familiar, condicoes_saude, nivel_autonomia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Sr. Antônio Ferreira', '1938-11-20', 'Av. Brasil, 112 - Bairro Novo',
     '(31) 98722-5544', 'Júlia (filha)', 'Artrite, dificuldade de locomoção', 'medio',
     'Faz fisioterapia às terças e quintas pela tarde.']);

  const p3 = run(`INSERT INTO pacientes (nome, data_nascimento, endereco, telefone_familiar,
    nome_familiar, condicoes_saude, nivel_autonomia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Dona Lúcia Mendes', '1950-07-08', 'Rua Ipê Amarelo, 88 - Jardim Verde',
     '(31) 97633-9900', 'Paula (neta)', 'Alzheimer leve, hipotireoidismo', 'baixo',
     'Pode se sentir desorientada à tarde. Sempre apresentar-se pelo nome.']);

  // Medicamentos
  run(`INSERT INTO medicamentos (paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [p1.lastID, 'Metformina', '500mg', '08:00 e 20:00', 'oral', 'Dr. Renato']);
  run(`INSERT INTO medicamentos (paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [p1.lastID, 'Losartana', '50mg', '08:00', 'oral', 'Dr. Renato']);
  run(`INSERT INTO medicamentos (paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [p2.lastID, 'Ibuprofeno', '400mg', 'quando necessário', 'oral', 'Dra. Fernanda']);
  run(`INSERT INTO medicamentos (paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [p3.lastID, 'Donepezila', '5mg', '21:00', 'oral', 'Dr. Márcio']);
  run(`INSERT INTO medicamentos (paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [p3.lastID, 'Levotiroxina', '50mcg', '07:00 (em jejum)', 'oral', 'Dra. Camila']);

  // Rotinas
  const diasDona = ['segunda', 'quarta', 'sexta'];
  diasDona.forEach(dia => {
    run(`INSERT INTO rotinas (paciente_id, dia_semana, horario_inicio, horario_fim, descricao) VALUES (?, ?, ?, ?, ?)`,
      [p1.lastID, dia, '07:30', '12:00', 'Banho, medicação, café da manhã, exercícios leves e almoço']);
  });

  run(`INSERT INTO rotinas (paciente_id, dia_semana, horario_inicio, horario_fim, descricao) VALUES (?, ?, ?, ?, ?)`,
    [p2.lastID, 'segunda', '08:00', '11:00', 'Higiene, café, passeio curto no jardim']);
  run(`INSERT INTO rotinas (paciente_id, dia_semana, horario_inicio, horario_fim, descricao) VALUES (?, ?, ?, ?, ?)`,
    [p2.lastID, 'quarta', '13:00', '17:00', 'Acompanhamento na fisioterapia + retorno']);
  run(`INSERT INTO rotinas (paciente_id, dia_semana, horario_inicio, horario_fim, descricao) VALUES (?, ?, ?, ?, ?)`,
    [p2.lastID, 'quinta', '13:00', '17:00', 'Acompanhamento na fisioterapia + retorno']);

  ['terca', 'quinta', 'sabado'].forEach(dia => {
    run(`INSERT INTO rotinas (paciente_id, dia_semana, horario_inicio, horario_fim, descricao) VALUES (?, ?, ?, ?, ?)`,
      [p3.lastID, dia, '08:00', '13:00', 'Higiene, medicação em jejum, café, atividades cognitivas (leitura/música)']);
  });

  // Atendimentos históricos
  const atendimentos = [
    { pid: p1.lastID, data: '2025-03-10', hi: '07:35', hf: '11:55', humor: 'bom',
      ativ: 'Banho assistido, café da manhã, caminhada no quintal 15min, almoço',
      meds: 'Metformina 08:00 ✓ | Losartana 08:00 ✓', inter: null, obs: 'Paciente animada, conversou muito.' },
    { pid: p1.lastID, data: '2025-03-12', hi: '07:40', hf: '12:10', humor: 'regular',
      ativ: 'Banho, café, ficou mais recolhida, almoço',
      meds: 'Metformina 08:00 ✓ | Losartana 08:00 ✓', inter: 'Relatou tontura leve pela manhã. Avisado filho Carlos.', obs: null },
    { pid: p1.lastID, data: '2025-03-14', hi: '07:30', hf: '12:00', humor: 'otimo',
      ativ: 'Banho, café, exercícios, ouviu rádio, almoço',
      meds: 'Metformina 08:00 ✓ | Losartana 08:00 ✓', inter: null, obs: 'Tontura não retornou. Ótimo dia.' },

    { pid: p2.lastID, data: '2025-03-11', hi: '08:05', hf: '11:00', humor: 'bom',
      ativ: 'Higiene, café, passeio no jardim 20min',
      meds: 'Ibuprofeno não necessário hoje', inter: null, obs: 'Menos dor nos joelhos hoje.' },
    { pid: p2.lastID, data: '2025-03-13', hi: '13:00', hf: '17:00', humor: 'regular',
      ativ: 'Fisioterapia, lanche durante espera, retorno',
      meds: 'Ibuprofeno 400mg antes da sessão ✓', inter: 'Fisioterapeuta Dra. Beatriz recomendou aumentar sessões.', obs: null },

    { pid: p3.lastID, data: '2025-03-11', hi: '08:00', hf: '13:00', humor: 'bom',
      ativ: 'Higiene, levotiroxina em jejum 07:00, café 07:30, leitura com jornal impresso, almoço',
      meds: 'Levotiroxina 07:00 ✓ | Donepezila será às 21h pelo familiar', inter: null, obs: 'Reconheceu cuidadora rapidamente.' },
    { pid: p3.lastID, data: '2025-03-13', hi: '08:10', hf: '12:55', humor: 'agitado',
      ativ: 'Higiene, café, tentativa de leitura — não conseguiu se concentrar, música relaxante',
      meds: 'Levotiroxina 07:00 ✓', inter: 'Episódio de desorientação ~09:30. Acalmou com música. Neta Paula informada.', obs: 'Monitorar nos próximos dias.' },
  ];

  atendimentos.forEach(a => {
    run(`INSERT INTO atendimentos (paciente_id, data, horario_inicio, horario_fim,
         atividades_realizadas, medicamentos, humor_paciente, intercorrencias, observacoes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.pid, a.data, a.hi, a.hf, a.ativ, a.meds, a.humor, a.inter, a.obs]);
  });

  console.log('✅ Dados inseridos com sucesso!\n');
  console.log('Pacientes cadastrados:');
  query('SELECT id, nome, nivel_autonomia FROM pacientes').forEach(p =>
    console.log(`  [${p.id}] ${p.nome} — autonomia: ${p.nivel_autonomia}`)
  );
  console.log(`\nTotal de atendimentos: ${query('SELECT COUNT(*) as n FROM atendimentos')[0].n}`);
  console.log(`Total de medicamentos: ${query('SELECT COUNT(*) as n FROM medicamentos')[0].n}`);
  console.log(`Total de rotinas:      ${query('SELECT COUNT(*) as n FROM rotinas')[0].n}`);
  console.log('\n🚀 Inicie a API com: node index.js');
}

seed().catch(console.error);
