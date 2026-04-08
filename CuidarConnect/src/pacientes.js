const express = require('express');
const router = express.Router();
const db = require('./database');

// GET /pacientes - listar todos
router.get('/', (req, res) => {
  try {
    const pacientes = db.query(`
      SELECT p.*, 
        COUNT(a.id) as total_atendimentos,
        MAX(a.data) as ultimo_atendimento
      FROM pacientes p
      LEFT JOIN atendimentos a ON a.paciente_id = p.id
      GROUP BY p.id
      ORDER BY p.nome
    `);
    res.json({ sucesso: true, dados: pacientes });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// GET /pacientes/:id - detalhes de um paciente
router.get('/:id', (req, res) => {
  try {
    const [paciente] = db.query('SELECT * FROM pacientes WHERE id = ?', [req.params.id]);
    if (!paciente) return res.status(404).json({ sucesso: false, erro: 'Paciente não encontrado' });

    const rotinas = db.query('SELECT * FROM rotinas WHERE paciente_id = ? ORDER BY dia_semana', [req.params.id]);
    const medicamentos = db.query('SELECT * FROM medicamentos WHERE paciente_id = ? AND ativo = 1', [req.params.id]);
    const atendimentos = db.query(
      'SELECT * FROM atendimentos WHERE paciente_id = ? ORDER BY data DESC, horario_inicio DESC LIMIT 10',
      [req.params.id]
    );

    res.json({ sucesso: true, dados: { ...paciente, rotinas, medicamentos, atendimentos_recentes: atendimentos } });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// POST /pacientes - cadastrar
router.post('/', (req, res) => {
  try {
    const { nome, data_nascimento, endereco, telefone_familiar, nome_familiar,
            condicoes_saude, nivel_autonomia, observacoes } = req.body;
    if (!nome) return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });

    const result = db.run(
      `INSERT INTO pacientes (nome, data_nascimento, endereco, telefone_familiar, nome_familiar,
        condicoes_saude, nivel_autonomia, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, data_nascimento, endereco, telefone_familiar, nome_familiar,
       condicoes_saude, nivel_autonomia, observacoes]
    );
    const [novo] = db.query('SELECT * FROM pacientes WHERE id = ?', [result.lastID]);
    res.status(201).json({ sucesso: true, mensagem: 'Paciente cadastrado', dados: novo });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// PUT /pacientes/:id - atualizar
router.put('/:id', (req, res) => {
  try {
    const { nome, data_nascimento, endereco, telefone_familiar, nome_familiar,
            condicoes_saude, nivel_autonomia, observacoes } = req.body;

    db.run(
      `UPDATE pacientes SET nome=?, data_nascimento=?, endereco=?, telefone_familiar=?,
        nome_familiar=?, condicoes_saude=?, nivel_autonomia=?, observacoes=? WHERE id=?`,
      [nome, data_nascimento, endereco, telefone_familiar, nome_familiar,
       condicoes_saude, nivel_autonomia, observacoes, req.params.id]
    );
    const [atualizado] = db.query('SELECT * FROM pacientes WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Paciente atualizado', dados: atualizado });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// DELETE /pacientes/:id
router.delete('/:id', (req, res) => {
  try {
    db.run('DELETE FROM pacientes WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Paciente removido' });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

module.exports = router;
