import { LeadProps } from "./leads.js";

export type WebhookField = {
  id: string;
  type: string;
  title: string;
  value: string;
  raw_value: string;
  required: string;
};

export type WebhookData = {
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

export interface MapFormDataReturn {
  success: boolean;
  error: boolean;
  data: LeadProps | null;
}