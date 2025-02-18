import { WebhookData } from "../types/forms.js";
import { mapFormData } from "./formService.js";
import leadService from "./leadService.js";

const processLead = async (formId: string, data: WebhookData) => {
  const formFormatted = mapFormData(formId, data)
  if (!formFormatted.success || !formFormatted.data) {
    return { success: false, error: "Erro ao mapear dados do formulário" };
  }

  const lead = await leadService.createLead(formFormatted.data)
  if (!lead.success) {
    return { success: false, error: "Erro ao criar lead" }
  }

  return { success: true, lead: lead.data }
}

export default { processLead }