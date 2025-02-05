import { Request, Response } from "express";
import whatsappService from "../services/whatsappService";
import leadService from "../services/leadService";
import { LeadProps } from "../types/leads";
import { mapFormData } from "../types/forms";
import notificationService from "../services/notificationService";

const RECEIVERS_NUMBERS = ['+5514981668995', '+5514997108384']

const processWebhook = async (req: Request, res: Response) => {
  const { form_id } = req.query

  if (!form_id) {
    res.status(404).send("Form id not provided")
    return;
  }

  const parsedFormId = form_id.toString()

  const formData: LeadProps = mapFormData(parsedFormId, req.body)

  const lead = await leadService.createLead(formData)

  if (!lead.success) {
    res.status(400).json({ error: lead.error });
    return;
  }

  const whatsappMessage = notificationService.formatLeadMessage(formData, parsedFormId)

  const sendMessages = async () => {
    const { success, error } = await whatsappService.sendBulkNotification(RECEIVERS_NUMBERS, whatsappMessage)

    if (!success) {
      res.status(400).json({ error });
    }
    res.status(200).json({ message: "Mensagens enviadas com sucesso." })
  }

  sendMessages()
}

export default { processWebhook }