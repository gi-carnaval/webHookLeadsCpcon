"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const twilio_1 = __importDefault(require("twilio"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Credenciais do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const PORT = process.env.PORT;
console.log(accountSid, authToken);
app.get('/', (req, res) => {
    const leadData = req.body;
    console.log();
    const whatsappMessage = `🚨 *Novo lead recebido!* 🚨\n\n`;
    res.send("Hello World").status(200);
});
// Endpoint do Webhook
app.post('/webhook', (req, res) => {
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
        .then((message) => { console.log(message.sid); });
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
        .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).send('Erro ao enviar mensagem.');
    });
});
// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta 3000\n\nAcesse em http://localhost:${PORT}`);
});
