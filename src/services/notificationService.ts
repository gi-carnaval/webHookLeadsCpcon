import { LeadProps } from "../types/leads.js";

const formatLeadMessage = (lead: LeadProps, formId: string, leadId: string): { formName: string, message: string } => {
  const formName = formId == "form_br" ? "Contato Brasil" : "Contact USA"
  // const message = (lead.name && `*Nome:* ${lead.name}`)
  //   + (lead.business_email && `\n*E-mail:* ${lead.business_email}`)
  //   + (lead.phone_number && `\n*Telefone:* ${lead.phone_number}`)
  //   + (lead.objective && `\n*Objetivo:* ${lead.objective}`)
  //   + (lead.solution && `\n*Objetivo (Outro):* ${lead.solution}`)
  //   + (lead.comments && `\n*Pergunta:* ${lead.comments}`)

  const message = `🔗Link: https://leads-manager.grupocpcon.com/dashboard/lead/${leadId}`

  return {
    formName,
    message
  }
}

export default { formatLeadMessage }