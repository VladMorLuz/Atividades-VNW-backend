const express = require("express");
const app = express();
const filmesRoutes = require("./routes/filmes");

app.use(express.json());

app.use("/filmes", filmesRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "🎬 API de Filmes funcionando! Acesse /filmes" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
