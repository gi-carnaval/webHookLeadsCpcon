import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import webhookController from './controller/webhookController.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const PORT = process.env.PORT

app.get('/', (req, res) => {
  const { form_id } = req.query
  res.status(200).send(`Hello Server on CPANEL ${form_id}`)
})

// Endpoint do Webhook
app.post('/webhook', webhookController.processWebhook)

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta 3000\n\nAcesse em http://localhost:${PORT}`);
});