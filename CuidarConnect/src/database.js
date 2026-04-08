const initSqlJs = require('../node_modules/sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'cuidar.db');

let db;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  criarTabelas();
  return db;
}

function salvarDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, buffer);
}

function criarTabelas() {
  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data_nascimento TEXT,
      endereco TEXT,
      telefone_familiar TEXT,
      nome_familiar TEXT,
      condicoes_saude TEXT,
      nivel_autonomia TEXT CHECK(nivel_autonomia IN ('alto', 'medio', 'baixo')),
      observacoes TEXT,
      criado_em TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS rotinas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      dia_semana TEXT NOT NULL,
      horario_inicio TEXT,
      horario_fim TEXT,
      descricao TEXT,
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS atendimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      horario_inicio TEXT,
      horario_fim TEXT,
      atividades_realizadas TEXT,
      medicamentos TEXT,
      humor_paciente TEXT CHECK(humor_paciente IN ('otimo', 'bom', 'regular', 'agitado', 'triste')),
      intercorrencias TEXT,
      observacoes TEXT,
      criado_em TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      dosagem TEXT,
      horarios TEXT,
      via_administracao TEXT,
      prescrito_por TEXT,
      ativo INTEGER DEFAULT 1,
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    );
  `);
}

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  db.run(sql, params);
  const result = db.exec("SELECT last_insert_rowid() as id");
  salvarDb();
  const lastID = result[0]?.values[0]?.[0] ?? 0;
  return { lastID };
}

module.exports = { getDb, query, run };
