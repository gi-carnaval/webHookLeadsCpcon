import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import twilio from "twilio";
import 'dotenv/config'
import { ContactFormBrasil } from './types/forms';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Credenciais do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const PORT = process.env.PORT

console.log(accountSid, authToken)

app.post('/', (req, res) => {
  console.log("req.body: ", req.body)

  const formData: ContactFormBrasil = req.body

  const whatsappMessage = `🚨 *Novo lead recebido!* 🚨\n\n`
    + `*Nome:* ${formData['Nome do Contato']}\n`
    + `*E-mail:* ${formData.email}\n`
    + `*Telefone:* ${formData.telefone}\n`
    + `*Objetivo:* ${formData.objetivo}\n\n`
    + `📌 Entre em contato com o lead o mais rápido possível!`;

  client.messages
    .create({
      from: 'whatsapp:+14155238886',
      body: whatsappMessage,
      to: 'whatsapp:+5514981668995'
    })
    .then(() => {
      console.log('Mensagem enviada com sucesso ao comercial.');
      res.status(200).send('Mensagem enviada com sucesso.');
    })
    .catch((error: any) => {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).send('Erro ao enviar mensagem.');
    })
})

// Endpoint do Webhook
app.post('/webhook', (req: Request, res: Response) => {
  const data = req.body;

  // Campos do formulário do Elementor
  const name = data.fields.nome || 'Nome não informado';
  const email = data.fields.email || 'Email não informado';
  const phone = data.fields.telefone || 'Telefone não informado';
  const message = data.fields.mensagem || 'Mensagem não informada';

  // Cria o texto da notificação
  const whatsappMessage = `🚨 *Novo lead recebido!* 🚨\n\n`
    + `*Nome:* ${name}\n`
    + `*E-mail:* ${email}\n`
    + `*Telefone:* ${phone}\n`
    + `*Mensagem:* ${message}\n\n`
    + `📌 Entre em contato com o lead o mais rápido possível!`;

  client.messages
    .create({
      from: 'whatsapp:+14155238886',
      body: whatsappMessage,
      to: 'whatsapp:+5514981668995'
    })
    .then((message) => { console.log(message.sid) })

  // Envia a mensagem para o WhatsApp do comercial
  client.messages
    .create({
      from: 'whatsapp:+14155238886', // Número padrão do Twilio para WhatsApp
      to: 'whatsapp:+5514981668995', // Número do comercial
      body: whatsappMessage,
    })
    .then(() => {
      console.log('Mensagem enviada com sucesso ao comercial.');
      res.status(200).send('Mensagem enviada com sucesso.');
    })
    .catch((error: any) => {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).send('Erro ao enviar mensagem.');
    });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta 3000\n\nAcesse em http://localhost:${PORT}`);
});