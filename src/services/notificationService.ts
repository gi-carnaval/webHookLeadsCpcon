import { LeadProps } from "../types/leads.js";
import { FormatLeadMessageProps } from "../types/notification.js";

const formTitles = {
  form_br: 'Contato Brasil',
  form_usa: 'Contact USA',
  form_ploomes: 'Ploomes'
} as const;

type FormId = keyof typeof formTitles;
type FormTitle = (typeof formTitles)[FormId]

function getFormTitle(formId: FormId): FormTitle {
  return formTitles[formId]
}

const formatLeadMessage = (lead: LeadProps, formId: string, leadId: string): FormatLeadMessageProps => {
  const formName = getFormTitle(formId as FormId)

  const fields = {
    name: lead.name || 'Não informado',
    email: lead.business_email || 'Não informado',
    phone: lead.phone_number || 'Não informado',
    objective: lead.objective || 'Não informado',
    comments: lead.comments || 'Não informado',
    link: `https://leads-manager.grupocpcon.com/dashboard/lead/${leadId}`
  }

  return {
    formName,
    fields
  }
}

export default { formatLeadMessage }