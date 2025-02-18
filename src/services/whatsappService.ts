import twilio from "twilio";
import { logWebhook } from "../controller/webhookController.js";

const PHONE_NUMBER_TWILIO = 'whatsapp:+17752599824'

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const sendWhatsappNotification = async (to: string, message: { formName: string, message: string }) => {
  console.log("Mensagem: ", message.message)
  logWebhook(`Entrou no sendWhatsappNotification com o form: ${message.message}\n`);
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
  try {
    await client.messages
      .create({
        from: PHONE_NUMBER_TWILIO,
        contentSid: 'HX0ee35663117838f1fc096c4f5512efb1',
        contentVariables: JSON.stringify({ 1: message.formName, 2: message.message }),
        to: `whatsapp:${to}`
      });
    logWebhook(`Sucesso na mensagem\n`);
    return { success: true, data: '' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logWebhook(`Erro ao enviar notificação: ${error.message}\n`);
      return { success: false, error: `Erro ao enviar notificação: ${error.message}` };
    }
    logWebhook(`Erro desconhecido ao enviar notificação.\n`);
    return { success: false, error: "Erro desconhecido ao enviar notificação." };
  }
}

const sendBulkNotification = async (numbers: string[], message: { formName: string, message: string }) => {
  try {
    await Promise.all(numbers.map(number => sendWhatsappNotification(number, message)))
    logWebhook(`Sucesso no envio em massa\n`);
    return { success: true, data: '' }
  } catch (error) {
    logWebhook(`Erro no envio em massa\n`);
    return { success: false, error: "Erro ao enviar mensagem." };
  }
}

export default { sendWhatsappNotification, sendBulkNotification }