import { MapFormDataReturn, WebhookData, WebhookField } from "../types/forms.js";
import { logWebhook } from "../utils/logger.js";

const processLead = async (formId: string, data: WebhookData) => {
  const formFormatted = mapFormData(formId, data)
  if (!formFormatted.success || !formFormatted.data) {
    return { success: false, error: "Erro ao mapear dados do formulário" };
  }

  return { success: true, lead: formFormatted.data }
}

export const mapFormData = (form_id: string, data: WebhookData): MapFormDataReturn => {
  if (form_id == "form_br") {
    return mapFormDataToBrazil(data.fields)
  }
  return mapFormDataToUSA(data.fields)
}

export const mapFormDataToBrazil = (fields: Record<string, WebhookField>): MapFormDataReturn => {
  logWebhook(`Fields no Br forms.ts: ${JSON.stringify(fields)}\n\n`);
  try {
    return {
      data: {
        company: fields["company"].value,
        name: fields["name"].value,
        business_email: fields["business_email"].value,
        phone_number: fields["telephone_number"].value,
        objective: fields["objective"].value,
        solution: fields["solution"].value || "",
        comments: fields["comment"].value,
        from_form: "Contato - Brasil",
        responsible_region: "br"
      },
      error: false,
      success: true
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: true
    }
  }
};

export const mapFormDataToUSA = (fields: Record<string, WebhookField>): MapFormDataReturn => {
  logWebhook(`Fields no USA forms.ts: ${JSON.stringify(fields)}\n\n`);

  try {
    return {
      data: {
        company: fields["company"].value,
        name: fields["name"].value,
        business_email: fields["business_email"].value,
        phone_number: fields["telephone_number"].value,
        objective: fields["objective"].value,
        solution: fields["solution"].value,
        comments: fields["comment"].value,
        job_title: fields["job_title"].value,
        region: fields["region"].value,
        from_form: "Contact - USA",
        responsible_region: "usa"
      },
      success: true,
      error: false
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: true
    }
  }
};

export default { processLead }