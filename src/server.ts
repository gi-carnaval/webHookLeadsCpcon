import 'dotenv/config'
import app from './app.js';

// app.use(bodyParser.json());

const PORT = process.env.PORT

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}\n\nAcesse em http://localhost:${PORT}`);
});