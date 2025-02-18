import fs from "fs";
import path from "path";

import { Request, Response } from "express";
import whatsappService from "../services/whatsappService.js";
import leadService from "../services/leadService.js";
import notificationService from "../services/notificationService.js";
import { fileURLToPath } from "url";
import { mapFormData } from "../services/formService.js";
import { NOTIFICATION_NUMBERS } from "../config/notifications.js";
import { handleError } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, "../..", "logs", "webhook.log");

export const logWebhook = (message: string) => {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
};

const processWebhook = async (req: Request, res: Response) => {
  logWebhook(`-----------------------New Lead's data received.--------------------- \n\n`);

  try {
    const { form_id } = req.query
    if (!form_id) return handleError(res, "Form id not provided", "Form id not provided.")

    const parsedFormId = form_id.toString()
    logWebhook(`📩 Recebido webhook: ${JSON.stringify(req.body)} - form_id: ${parsedFormId}`);

    const formFormatted = mapFormData(parsedFormId, req.body);
    if (!formFormatted.success || !formFormatted.data) {
      return handleError(res, "Error on map", `❌ Error mapping data - form_id: ${parsedFormId}`);
    }

    const formData = formFormatted.data
    logWebhook(`📑 Mapped form data: ${JSON.stringify(formData)}`);

    const lead = await leadService.createLead(formData)
    if (!lead.success) {
      return handleError(res, "Error creating lead", `❌ Error creating lead: ${lead.error}`);
    }

    const whatsappMessage = notificationService.formatLeadMessage(formData, parsedFormId, lead.data!.id);
    const { success, error } = await whatsappService.sendBulkNotification(NOTIFICATION_NUMBERS, whatsappMessage)

    if (!success) {
      return res.status(200).json({ error });
    }

    res.status(200).json({ message: "📲 Mensagens enviadas com sucesso." });
  } catch (error) {
    handleError(res, "Internal Server Error", `❌ Unexpected error: ${error}`);
  } finally {
    logWebhook(`\n----------------------- End of Lead's data processing ---------------------\n`);
  }
}

export default { processWebhook }






//   logWebhook(`Recebido webhook: ${JSON.stringify(req.body)} - form_id: ${parsedFormId}\n\n`);
//   console.log("Recebido webhook: ", JSON.stringify(req.body), " - form_id: ", parsedFormId, "\n\n")

//   const formFormatted = mapFormData(parsedFormId, req.body)

//   if (!formFormatted.success || formFormatted.data == null) {
//     res.status(200).send("Error on map")
//     logWebhook(`Error on formmat datas - form_id: ${parsedFormId}\n\n`);
//     console.log("Error on formmat datas - form_id: ", parsedFormId, "\n\n")
//     return;
//   }

//   const formData = formFormatted.data

//   logWebhook(`formData webhook: ${JSON.stringify(formData)}\n\n`);
//   console.log("formData webhook: ", formData, "\n\n")

//   const lead = await leadService.createLead(formData)

//   if (!lead.success) {
//     logWebhook(`Error on create new lead: ${lead.error}\n\n`);
//     console.log("Error on create new lead: ", lead.error, "\n\n")
//     return;
//   }

//   const whatsappMessage = notificationService.formatLeadMessage(formData, parsedFormId, lead.data!.id)

//   const sendMessages = async () => {
//     const { success, error } = await whatsappService.sendBulkNotification(NOTIFICATION_NUMBERS, whatsappMessage)

//     if (!success) {
//       res.status(200).json({ error });
//     }
//     res.status(200).json({ message: "Mensagens enviadas com sucesso." })
//     return
//   }

//   sendMessages()
//   logWebhook(`-----------------------End of Lead's data received.--------------------- \n\n`);
// }

// export default { processWebhook }