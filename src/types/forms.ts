import { logWebhook } from "../controller/webhookController.js";
import { LeadProps } from "./leads.js";

type WebhookField = {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
};

type WebhookData = {
  form: {
    id: string;
    name: string;
  };
  fields: Record<string, WebhookField>;
  meta: {
    date: { title: string; value: string };
    time: { title: string; value: string };
    page_url: { title: string; value: string };
    user_agent: { title: string; value: string };
    remote_ip: { title: string; value: string };
    credit: { title: string; value: string };
  };
};

export const mapFormData = (form_id: string, data: WebhookData): LeadProps => {
  if (form_id == "form_br") {
    return mapFormDataToBrazil(data.fields)
  }
  return mapFormDataToUSA(data.fields)

}

export const mapFormDataToBrazil = (fields: Record<string, WebhookField>): LeadProps => {

  console.log(`Fields no forms.ts: ${fields}\n\n`)

  return {
    company: fields["company"].value,
    name: fields["name"].value,
    business_email: fields["business_email"].value,
    phone_number: fields["telephone_number"].value,
    objective: fields["objective"].value,
    solution: fields["solution"].value || "",
    comments: fields["comment"].value,
    from_form: "Contato - Brasil"
  }
};

export const mapFormDataToUSA = (fields: Record<string, WebhookField>): LeadProps => ({
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
});