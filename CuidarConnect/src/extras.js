const express = require('express');
const router = express.Router();
const db = require('./database');

// ─── MEDICAMENTOS ──────────────────────────────────────────────

// GET /medicamentos?paciente_id=
router.get('/medicamentos', (req, res) => {
  try {
    const { paciente_id } = req.query;
    let sql = `SELECT m.*, p.nome as paciente_nome FROM medicamentos m JOIN pacientes p ON p.id = m.paciente_id WHERE 1=1`;
    const params = [];
    if (paciente_id) { sql += ' AND m.paciente_id = ?'; params.push(paciente_id); }
    sql += ' ORDER BY m.nome';
    res.json({ sucesso: true, dados: db.query(sql, params) });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// POST /medicamentos
router.post('/medicamentos', (req, res) => {
  try {
    const { paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por } = req.body;
    if (!paciente_id || !nome) return res.status(400).json({ sucesso: false, erro: 'paciente_id e nome obrigatórios' });
    const result = db.run(
      `INSERT INTO medicamentos (paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por) VALUES (?, ?, ?, ?, ?, ?)`,
      [paciente_id, nome, dosagem, horarios, via_administracao, prescrito_por]
    );
    const [novo] = db.query('SELECT * FROM medicamentos WHERE id = ?', [result.lastID]);
    res.status(201).json({ sucesso: true, mensagem: 'Medicamento cadastrado', dados: novo });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// DELETE /medicamentos/:id (desativa)
router.delete('/medicamentos/:id', (req, res) => {
  try {
    db.run('UPDATE medicamentos SET ativo = 0 WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Medicamento desativado' });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// ─── ROTINAS ──────────────────────────────────────────────────

// GET /rotinas?paciente_id=
router.get('/rotinas', (req, res) => {
  try {
    const { paciente_id } = req.query;
    let sql = `SELECT r.*, p.nome as paciente_nome FROM rotinas r JOIN pacientes p ON p.id = r.paciente_id WHERE 1=1`;
    const params = [];
    if (paciente_id) { sql += ' AND r.paciente_id = ?'; params.push(paciente_id); }
    sql += ' ORDER BY r.dia_semana, r.horario_inicio';
    res.json({ sucesso: true, dados: db.query(sql, params) });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// POST /rotinas
router.post('/rotinas', (req, res) => {
  try {
    const { paciente_id, dia_semana, horario_inicio, horario_fim, descricao } = req.body;
    if (!paciente_id || !dia_semana) return res.status(400).json({ sucesso: false, erro: 'paciente_id e dia_semana obrigatórios' });
    const result = db.run(
      `INSERT INTO rotinas (paciente_id, dia_semana, horario_inicio, horario_fim, descricao) VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, dia_semana, horario_inicio, horario_fim, descricao]
    );
    const [nova] = db.query('SELECT * FROM rotinas WHERE id = ?', [result.lastID]);
    res.status(201).json({ sucesso: true, mensagem: 'Rotina cadastrada', dados: nova });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// DELETE /rotinas/:id
router.delete('/rotinas/:id', (req, res) => {
  try {
    db.run('DELETE FROM rotinas WHERE id = ?', [req.params.id]);
    res.json({ sucesso: true, mensagem: 'Rotina removida' });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

module.exports = router;
