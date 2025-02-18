import { Request, Response } from "express";
import { handleError, logWebhook } from "../../utils/logger.js";
import ploomesWebhookService from "../../services/ploomesWebhookService.js";

const processPloomesWebhook = async (req: Request, res: Response) => {
  logWebhook(`📩 [Ploomes] Recebendo webhook: ${JSON.stringify(req.body)}`)

  try {
    const result = await ploomesWebhookService.processDeal(req.body)
    if (!result.success) return handleError(res, "Error processing deal", `❌ ${result.error}`)

    res.status(200).json({ message: "Negócio do Ploomes processado com sucesso" })
  } catch (error) {
    handleError(res, "Internal Server Error", `❌ Erro inesperado (Ploomes): ${error}`);
  }
}

export default { processPloomesWebhook }