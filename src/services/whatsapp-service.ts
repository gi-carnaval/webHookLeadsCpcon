import twilio from "twilio";
import { logWebhook } from "../utils/logger.js";
import { FormatLeadMessageProps } from "../types/notification.js";
import { NOTIFICATION_NUMBERS } from "../config/notifications.js";

const PHONE_NUMBER_TWILIO = 'whatsapp:+17752599824'

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const sendWhatsappNotification = async (to: string, message: FormatLeadMessageProps) => {
  console.log("Mensagem: ", message)
  logWebhook(`Entrou no sendWhatsappNotification com o form: ${message}\n`);
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

  const { fields } = message

  try {
    await client.messages
      .create({
        from: PHONE_NUMBER_TWILIO,
        contentSid: 'HX0e39c0c1db630906c59b7b7ceda46d71',
        contentVariables: JSON.stringify({ 1: message.formName, 2: fields.name, 3: fields.email, 4: fields.phone, 5: fields.objective, 6: fields.comments, 7: fields.link }),
        to: `whatsapp:${to}`
      });
    logWebhook(`Sucesso na mensagem\n`);
    return { success: true, data: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logWebhook(`Erro ao enviar notificação: ${error.message}\n`);
      return { success: false, error: `Erro ao enviar notificação: ${error.message}` };
    }
    logWebhook(`Erro desconhecido ao enviar notificação.\n`);
    return { success: false, error: "Erro desconhecido ao enviar notificação." };
  }
}

const sendBulkNotification = async (numbers: string[], message: FormatLeadMessageProps) => {
  try {
    await Promise.all(numbers.map(number => sendWhatsappNotification(number, message)))
    logWebhook(`Sucesso no envio em massa\n`);
    return { success: true, data: null }
  } catch (error) {
    logWebhook(`Erro no envio em massa\n`);
    return { success: false, error: "Erro ao enviar mensagem em massa." };
  }
}

const sendMessages = async (whatsappMessage: FormatLeadMessageProps) => {
  const { success, error } = await sendBulkNotification(NOTIFICATION_NUMBERS, whatsappMessage);
  if (!success) {
    return { success: false, error };
  }
  return { success: true, error: null };
};

export default { sendWhatsappNotification, sendBulkNotification, sendMessages }