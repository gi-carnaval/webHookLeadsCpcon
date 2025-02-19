import { Request, Response } from "express";
import { handleError, logWebhook } from "../../utils/logger.js"
import elementorWebhookService from "../../services/elementor-webhook-service.js";
import leadService from "../../services/lead-service.js";
import whatsappService from "../../services/whatsapp-service.js";
import notificationService from "../../services/notificationService.js";

const processElementorWebhook = async (req: Request, res: Response) => {
  logWebhook(`📩 [Elementor] Recebendo webhook: ${JSON.stringify(req.body)}`)

  try {
    const { form_id } = req.query
    if (!form_id) return handleError(res, "Form id not provided", "❌ Form id não informado.")

    const result = await elementorWebhookService.processLead(form_id.toString(), req.body)
    if (!result.success || !result.lead) return handleError(res, "Error processing lead", `❌ ${result.error}`)

    const lead = await leadService.createLead(result.lead)
    if (!lead.success || !lead.data) {
      handleError(res, "Erro ao criar lead", `❌ ${lead.error}`)
      return
    }

    const notificationMessage = notificationService.formatLeadMessage(result.lead, form_id.toString(), lead.data.id)

    const { success, error } = await whatsappService.sendMessages(notificationMessage)
    if (!success) {
      handleError(res, "Erro ao enviar mesagens", `❌ ${error}`)
    }

    res.status(200).json({ message: "Lead do Elementor processado e cadastrado com sucesso." })
  } catch (error) {
    handleError(res, "Internal Server Error", `❌ Erro inesperado (Elementor): ${error}`);
  }
}

export default { processElementorWebhook }