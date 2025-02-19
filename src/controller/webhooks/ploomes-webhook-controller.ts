import { Request, Response } from "express";
import { handleError, logWebhook } from "../../utils/logger.js";
import ploomesWebhookService from "../../services/ploomes-webhook-service.js";
import leadService from "../../services/lead-service.js";
import notificationService from "../../services/notificationService.js";
import whatsappService from "../../services/whatsapp-service.js";

const processPloomesWebhook = async (req: Request, res: Response) => {
  logWebhook(`📩 [Ploomes] Recebendo webhook: ${JSON.stringify(req.body)}`)

  try {
    const result = await ploomesWebhookService.processDeal(req.body)
    if (!result.success || !result.lead) return handleError(res, "Error processing deal", `❌ ${result.error}`)

    const lead = await leadService.createLead(result.lead)
    if (!lead.success || !lead.data) {
      handleError(res, "Erro ao criar lead", `❌ ${lead.error}`)
      return
    }

    const notificationMessage = notificationService.formatLeadMessage(result.lead, "form_ploomes", lead.data.id)

    const { success, error } = await whatsappService.sendMessages(notificationMessage)
    if (!success) {
      handleError(res, "Erro ao enviar mesagens", `❌ ${error}`)
    }

    res.status(200).json({ message: "Lead da Plooms processado e cadastrado com sucesso." })
  } catch (error) {
    handleError(res, "Internal Server Error", `❌ Erro inesperado (Ploomes): ${error}`);
  }
}

export default { processPloomesWebhook }