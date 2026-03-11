const express = require("express");
const router = express.Router();

let filmes = [
  {
    id: 1,
    titulo: "O Poderoso Chefão",
    genero: "Drama",
    ano: 1972,
    diretor: "Francis Ford Coppola",
    nota: 9.2,
  },
  {
    id: 2,
    titulo: "Pulp Fiction",
    genero: "Crime",
    ano: 1994,
    diretor: "Quentin Tarantino",
    nota: 8.9,
  },
  {
    id: 3,
    titulo: "De Volta para o Futuro",
    genero: "Aventura",
    ano: 1985,
    diretor: "Robert Zemeckis",
    nota: 8.5,
  },
];

router.get("/", (req, res) => {
  res.status(200).json({
    total: filmes.length,
    filmes: filmes,
  });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find((f) => f.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado." });
  }

  res.status(200).json(filme);
});

router.post("/", (req, res) => {
  const { titulo, genero, ano, diretor, nota } = req.body;

  if (!titulo || !genero || !ano || !diretor) {
    return res.status(400).json({
      mensagem: "Campos obrigatórios: titulo, genero, ano, diretor.",
    });
  }

  const novoFilme = {
    id: filmes.length + 1,
    titulo,
    genero,
    ano,
    diretor,
    nota: nota || null,
  };

  filmes.push(novoFilme);

  res.status(201).json({
    mensagem: "Filme cadastrado com sucesso! 🎬",
    filme: novoFilme,
  });
});

module.exports = router;
