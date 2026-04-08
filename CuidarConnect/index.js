const express = require('express');
const { getDb } = require('./src/database');

const app = express();
app.use(express.json());

// ─── Inicializar banco antes de subir o servidor ───────────────
getDb().then(() => {
  const pacientes    = require('./src/pacientes');
  const atendimentos = require('./src/atendimentos');
  const extras       = require('./src/extras');

  app.use('/pacientes',    pacientes);
  app.use('/atendimentos', atendimentos);
  app.use('/',             extras);

  // ─── Rota de resumo / relatório por paciente ──────────────────
  const db = require('./src/database');

  app.get('/relatorio/:paciente_id', (req, res) => {
    try {
      const [paciente] = db.query('SELECT * FROM pacientes WHERE id = ?', [req.params.paciente_id]);
      if (!paciente) return res.status(404).json({ sucesso: false, erro: 'Paciente não encontrado' });

      const atendimentos = db.query(
        'SELECT * FROM atendimentos WHERE paciente_id = ? ORDER BY data DESC',
        [req.params.paciente_id]
      );
      const medicamentos = db.query(
        'SELECT * FROM medicamentos WHERE paciente_id = ? AND ativo = 1',
        [req.params.paciente_id]
      );
      const rotinas = db.query(
        'SELECT * FROM rotinas WHERE paciente_id = ? ORDER BY dia_semana',
        [req.params.paciente_id]
      );

      const total = atendimentos.length;
      const humores = atendimentos.reduce((acc, a) => {
        if (a.humor_paciente) acc[a.humor_paciente] = (acc[a.humor_paciente] || 0) + 1;
        return acc;
      }, {});

      res.json({
        sucesso: true,
        dados: {
          paciente,
          resumo: {
            total_atendimentos: total,
            primeiro_atendimento: atendimentos[total - 1]?.data || null,
            ultimo_atendimento: atendimentos[0]?.data || null,
            distribuicao_humor: humores
          },
          medicamentos_ativos: medicamentos,
          rotina_semanal: rotinas,
          historico_atendimentos: atendimentos
        }
      });
    } catch (e) {
      res.status(500).json({ sucesso: false, erro: e.message });
    }
  });

  // ─── Rota raiz com informações da API ─────────────────────────
  app.get('/', (req, res) => {
    res.json({
      api: 'CuidarConnect',
      versao: '1.0.0',
      descricao: 'API de gestão de cuidados individuais para cuidadores autônomos',
      rotas: {
        pacientes:    'GET|POST /pacientes  |  GET|PUT|DELETE /pacientes/:id',
        atendimentos: 'GET|POST /atendimentos  |  GET|PUT|DELETE /atendimentos/:id',
        medicamentos: 'GET|POST /medicamentos  |  DELETE /medicamentos/:id',
        rotinas:      'GET|POST /rotinas  |  DELETE /rotinas/:id',
        relatorio:    'GET /relatorio/:paciente_id'
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ CuidarConnect rodando em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao inicializar banco:', err);
  process.exit(1);
});
