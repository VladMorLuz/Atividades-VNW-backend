const express = require('express');
const router = express.Router();
const db = require('./database');

// GET /atendimentos?paciente_id=&data_inicio=&data_fim=
router.get('/', (req, res) => {
  try {
    const { paciente_id, data_inicio, data_fim } = req.query;
    let sql = `
      SELECT a.*, p.nome as paciente_nome
      FROM atendimentos a
      JOIN pacientes p ON p.id = a.paciente_id
      WHERE 1=1
    `;
    const params = [];

    if (paciente_id) { sql += ' AND a.paciente_id = ?'; params.push(paciente_id); }
    if (data_inicio) { sql += ' AND a.data >= ?'; params.push(data_inicio); }
    if (data_fim)    { sql += ' AND a.data <= ?'; params.push(data_fim); }

    sql += ' ORDER BY a.data DESC, a.horario_inicio DESC';

    const atendimentos = db.query(sql, params);
    res.json({ sucesso: true, dados: atendimentos });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// GET /atendimentos/:id
router.get('/:id', (req, res) => {
  try {
    const [atendimento] = db.query(`
      SELECT a.*, p.nome as paciente_nome
      FROM atendimentos a
      JOIN pacientes p ON p.id = a.paciente_id
      WHERE a.id = ?
    `, [req.params.id]);
    if (!atendimento) return res.status(404).json({ sucesso: false, erro: 'Atendimento não encontrado' });
    res.json({ sucesso: true, dados: atendimento });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// POST /atendimentos
router.post('/', (req, res) => {
  try {
    const { paciente_id, data, horario_inicio, horario_fim,
            atividades_realizadas, medicamentos, humor_paciente,
            intercorrencias, observacoes } = req.body;

    if (!paciente_id || !data) {
      return res.status(400).json({ sucesso: false, erro: 'paciente_id e data são obrigatórios' });
    }

    const result = db.run(
      `INSERT INTO atendimentos (paciente_id, data, horario_inicio, horario_fim,
        atividades_realizadas, medicamentos, humor_paciente, intercorrencias, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paciente_id, data, horario_inicio, horario_fim,
       atividades_realizadas, medicamentos, humor_paciente, intercorrencias, observacoes]
    );
    const [novo] = db.query('SELECT * FROM atendimentos WHERE id = ?', [result.lastID]);
    res.status(201).json({ sucesso: true, mensagem: 'Atendimento registrado', dados: novo });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// PUT /atendimentos/:id
router.put('/:id', (req, res) => {
  try {
    const { data, horario_inicio, horario_fim, atividades_realizadas,
            medicamentos, humor_paciente, intercorrencias, observacoes } = req.body;

    db.run(
      `UPDATE atendimentos SET data=?, horario_inicio=?, horario_fim=?, atividades_realizadas=?,
        medicamentos=?, humor_paciente=?, intercorrencias=?, observacoes=? WHERE id=?`,
      [data, horario_inicio, horario_fim, atividades_realizadas,
       medicamentos, humor_paciente, intercorrencias, observacoes, req.params.id]
    );
    const [atualizado] = db.query('SELECT * FROM atendimentos WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Atendimento atualizado', dados: atualizado });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// DELETE /atendimentos/:id
router.delete('/:id', (req, res) => {
  try {
    db.run('DELETE FROM atendimentos WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Atendimento removido' });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

module.exports = router;
