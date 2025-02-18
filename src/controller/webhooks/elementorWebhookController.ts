import { Request, Response } from "express";
import { handleError, logWebhook } from "../../utils/logger.js"
import elementorWebhookService from "../../services/elementorWebhookService.js";

const processElementorWebhook = async (req: Request, res: Response) => {
  logWebhook(`📩 [Elementor] Recebendo webhook: ${JSON.stringify(req.body)}`)

  try {
    const { form_id } = req.query
    if (!form_id) return handleError(res, "Form id not provided", "❌ Form id não informado.")

    const result = await elementorWebhookService.processLead(form_id.toString(), req.body)
    if (!result.success) return handleError(res, "Error processing lead", `❌ ${result.error}`)

    res.status(200).json({ message: "Lead do Elementor processado com sucesso." })


  } catch (error) {
    handleError(res, "Internal Server Error", `❌ Erro inesperado (Elementor): ${error}`);
  }
}

export default { processElementorWebhook }