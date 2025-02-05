import twilio from "twilio";

const PHONE_NUMBER_TWILIO = 'whatsapp:+14155238886'

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const sendWhatsappNotification = async (to: string, message: string) => {
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
  try {
    await client.messages
      .create({
        from: PHONE_NUMBER_TWILIO,
        to: `whatsapp:${to}`,
        body: message
      });
    return { success: true, data: '' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: `Erro ao enviar notificação: ${error.message}` };
    }
    return { success: false, error: "Erro desconhecido ao enviar notificação." };
  }
}

const sendBulkNotification = async (numbers: string[], message: string) => {
  try {
    await Promise.all(numbers.map(number => sendWhatsappNotification(number, message)))
    return { success: true, data: '' }
  } catch (error) {
    return { success: false, error: "Erro ao enviar mensagem." };
  }
}

export default { sendWhatsappNotification, sendBulkNotification }