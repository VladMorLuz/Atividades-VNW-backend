# CuidarConnect 🩺

> API de gestão de cuidados individuais para cuidadoras autônomas

---

## O Problema Identificado

A cuidadora autônoma **enfrenta uma fragmentação de informações** sobre seus pacientes: dados em cadernos, mensagens para familiares e memória. Isso gera:

- Dificuldade em recuperar histórico de atendimentos
- Falta de visão clara da evolução de cada paciente
- Esforço excessivo para responder familiares com atualizações
- Risco de falhas na administração de medicamentos

## A Solução

O **CuidarConnect** centraliza todas as informações em uma API REST que permite:

- Cadastrar e acompanhar pacientes individualmente
- Registrar cada atendimento com detalhes clínicos e comportamentais
- Gerenciar medicamentos e rotinas semanais por paciente
- Gerar relatórios de evolução consolidados por paciente

---

## Tecnologias

- **Node.js** — runtime JavaScript
- **Express** — framework HTTP
- **SQLite via sql.js** — banco de dados relacional embutido (sem instalação de binários)

---

## Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Popular com dados de exemplo (opcional)

```bash
node scripts/seed.js
```

### 3. Iniciar a API

```bash
node index.js
```

A API estará disponível em: `http://localhost:3000`

---

## Estrutura de Dados

```
pacientes
├── id, nome, data_nascimento
├── endereco, telefone_familiar, nome_familiar
├── condicoes_saude, nivel_autonomia (alto/medio/baixo)
└── observacoes

atendimentos
├── id, paciente_id (FK), data
├── horario_inicio, horario_fim
├── atividades_realizadas, medicamentos
├── humor_paciente (otimo/bom/regular/agitado/triste)
└── intercorrencias, observacoes

medicamentos
├── id, paciente_id (FK), nome, dosagem
├── horarios, via_administracao, prescrito_por
└── ativo (1=ativo / 0=desativado)

rotinas
├── id, paciente_id (FK), dia_semana
├── horario_inicio, horario_fim
└── descricao
```

---

## Endpoints da API

### Pacientes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/pacientes` | Lista todos os pacientes com total de atendimentos |
| GET | `/pacientes/:id` | Detalhes + rotinas + medicamentos + atendimentos recentes |
| POST | `/pacientes` | Cadastrar novo paciente |
| PUT | `/pacientes/:id` | Atualizar dados do paciente |
| DELETE | `/pacientes/:id` | Remover paciente |

### Atendimentos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/atendimentos` | Listar atendimentos (filtros: paciente_id, data_inicio, data_fim) |
| GET | `/atendimentos/:id` | Detalhes de um atendimento |
| POST | `/atendimentos` | Registrar novo atendimento |
| PUT | `/atendimentos/:id` | Editar atendimento |
| DELETE | `/atendimentos/:id` | Remover atendimento |

### Medicamentos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/medicamentos?paciente_id=` | Listar medicamentos ativos |
| POST | `/medicamentos` | Cadastrar medicamento |
| DELETE | `/medicamentos/:id` | Desativar medicamento |

### Rotinas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/rotinas?paciente_id=` | Listar rotina semanal |
| POST | `/rotinas` | Cadastrar entrada de rotina |
| DELETE | `/rotinas/:id` | Remover entrada de rotina |

### Relatório

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/relatorio/:paciente_id` | Relatório completo de evolução do paciente |

---

## Exemplos de Uso

### Cadastrar paciente
```bash
curl -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dona Gertrudes Silva",
    "data_nascimento": "1945-06-10",
    "condicoes_saude": "Hipertensão",
    "nivel_autonomia": "medio",
    "nome_familiar": "João (filho)",
    "telefone_familiar": "(31) 99000-1111"
  }'
```

### Registrar atendimento
```bash
curl -X POST http://localhost:3000/atendimentos \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": 1,
    "data": "2025-03-25",
    "horario_inicio": "07:30",
    "horario_fim": "12:00",
    "atividades_realizadas": "Banho, café, caminhada, almoço",
    "medicamentos": "Losartana 08:00 ✓ | Metformina 08:00 ✓",
    "humor_paciente": "otimo",
    "observacoes": "Paciente muito bem disposta hoje."
  }'
```

### Consultar relatório de evolução
```bash
curl http://localhost:3000/relatorio/1
```

### Filtrar atendimentos por período
```bash
curl "http://localhost:3000/atendimentos?paciente_id=1&data_inicio=2025-03-01&data_fim=2025-03-31"
```

---

## Decisões de Projeto

### Por que sql.js ao invés de better-sqlite3?
`sql.js` é uma compilação do SQLite para WebAssembly que não precisa de binários nativos, funcionando em qualquer ambiente Node.js sem configuração adicional.

### Por que separar medicamentos da tabela de atendimentos?
O campo `medicamentos` em atendimentos registra **o que foi administrado** naquele dia. A tabela `medicamentos` guarda a **prescrição permanente**. São informações distintas com ciclos de vida diferentes.

### Por que registrar humor do paciente?
Permite identificar padrões ao longo do tempo e facilita a comunicação com familiares ("ela está bem" tem mais credibilidade quando apoiada em dados).

---

## Estrutura de Arquivos

```
cuidar-connect/
├── index.js              ← entrada da aplicação
├── src/
│   ├── database.js       ← inicialização e helpers do banco
│   ├── pacientes.js      ← rotas de pacientes
│   ├── atendimentos.js   ← rotas de atendimentos
│   └── extras.js         ← rotas de medicamentos e rotinas
├── scripts/
│   └── seed.js           ← dados fictícios para demonstração
├── database/
│   └── cuidar.db         ← arquivo SQLite (gerado automaticamente)
└── package.json
```
