import { logWebhook } from "../controller/webhookController.js";
import { MapFormDataReturn, WebhookData, WebhookField } from "../types/forms.js";

export const mapFormData = (form_id: string, data: WebhookData): MapFormDataReturn => {
  if (form_id == "form_br") {
    return mapFormDataToBrazil(data.fields)
  }
  return mapFormDataToUSA(data.fields)
}

export const mapFormDataToBrazil = (fields: Record<string, WebhookField>): MapFormDataReturn => {

  console.log("Fields no Br forms.ts: ", fields, "\n\n")
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
        from_form: "Contato - Brasil"
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
  console.log("Fields no USA forms.ts: ", fields, "\n\n")
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
        from_form: "Contact - USA"
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