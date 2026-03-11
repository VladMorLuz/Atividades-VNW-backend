# 🎬 API de Filmes — Projeto Backend Fullstack

API REST desenvolvida com **Node.js + Express** para cadastro e listagem de filmes.

---

## 🚀 Como rodar o projeto

### 1. Instale as dependências
```bash
npm install
```

### 2. Inicie o servidor
```bash
# Modo normal
npm start

# Modo desenvolvimento (com nodemon — reinicia ao salvar)
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
api-filmes/
├── server.js            # Arquivo principal — configura e inicia o Express
├── routes/
│   └── filmes.js        # Rotas da API de filmes
├── package.json
└── README.md
```

---

## 🛣️ Rotas disponíveis

| Método | Rota          | Descrição                        |
|--------|---------------|----------------------------------|
| GET    | `/`           | Verifica se a API está no ar     |
| GET    | `/filmes`     | Lista todos os filmes            |
| GET    | `/filmes/:id` | Busca um filme pelo ID           |
| POST   | `/filmes`     | Cadastra um novo filme           |

---

## 🧪 Testando com o Postman

### ✅ GET — Listar todos os filmes
- **Método:** GET  
- **URL:** `http://localhost:3000/filmes`  
- Nenhum corpo necessário.

**Resposta esperada:**
```json
{
  "total": 3,
  "filmes": [...]
}
```

---

### ✅ GET — Buscar filme por ID
- **Método:** GET  
- **URL:** `http://localhost:3000/filmes/1`  

**Resposta esperada:**
```json
{
  "id": 1,
  "titulo": "O Poderoso Chefão",
  "genero": "Drama",
  "ano": 1972,
  "diretor": "Francis Ford Coppola",
  "nota": 9.2
}
```

---

### ✅ POST — Cadastrar novo filme
- **Método:** POST  
- **URL:** `http://localhost:3000/filmes`  
- **Headers:** `Content-Type: application/json`  
- **Body (raw → JSON):**

```json
{
  "titulo": "Interstellar",
  "genero": "Ficção Científica",
  "ano": 2014,
  "diretor": "Christopher Nolan",
  "nota": 8.7
}
```

**Resposta esperada (status 201):**
```json
{
  "mensagem": "Filme cadastrado com sucesso! 🎬",
  "filme": {
    "id": 4,
    "titulo": "Interstellar",
    "genero": "Ficção Científica",
    "ano": 2014,
    "diretor": "Christopher Nolan",
    "nota": 8.7
  }
}
```

---

## 💡 Conceitos aplicados

- ✅ **express.json()** — Middleware para interpretar JSON no corpo das requisições
- ✅ **GET /filmes** — Listagem de recursos
- ✅ **GET /filmes/:id** — Parâmetro de rota para busca específica
- ✅ **POST /filmes** — Cadastro de novos recursos
- ✅ **Rotas organizadas** em arquivo separado (`routes/filmes.js`)
- ✅ **Códigos HTTP corretos** — 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found)
