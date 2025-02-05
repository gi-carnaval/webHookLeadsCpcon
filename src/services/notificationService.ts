import { LeadProps } from "../types/leads";

const formatLeadMessage = (lead: LeadProps, formId: string): string => {
  const formName = formId == "form_br" ? "Contato Brasil" : "Contact USA"
  return (
    `🚨 *Novo lead recebido no formulário ${formName}* 🚨\n\n`
    + (lead.name && `*Nome:* ${lead.name}\n`)
    + (lead.business_email && `*E-mail:* ${lead.business_email}\n`)
    + (lead.phone_number && `*Telefone:* ${lead.phone_number}\n`)
    + (lead.objective && `*Objetivo:* ${lead.objective}\n`)
    + (lead.solution && `*Objetivo (Outro):* ${lead.solution}\n`)
    + (lead.comments && `*Pergunta:* ${lead.comments}\n\n`)
    + `📌 Entre em contato com o lead o mais rápido possível!`
  )
}

export default { formatLeadMessage }