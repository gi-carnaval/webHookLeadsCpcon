import { LeadProps } from "./leads.js";

export const mapFormData = (form_id: string, data: Record<string, string>): LeadProps => {
  if (form_id == "form_br") {
    return mapFormDataToBrazil(data)
  }
  return mapFormDataToUSA(data)

}

export const mapFormDataToBrazil = (data: Record<string, string>): LeadProps => ({
  company: data["empresa"],
  name: data['Nome do Contato'],
  business_email: data["email"],
  phone_number: data["telefone"],
  objective: data["objetivo"],
  solution: data["objetivo (Outro)"],
  comments: data["pergunta"],
  from_form: "Contato - Brasil"
});

export const mapFormDataToUSA = (data: Record<string, string>): LeadProps => {
  return (
    {
      company: data["Company"],
      name: data['Name'],
      business_email: data["Business_Email"],
      phone_number: data['Telephone_Number'],
      objective: data["Solutions"],
      solution: data["Select"],
      comments: data["Comments"],
      job_title: data["Job_Title"],
      region: data["Region"],
      from_form: "Contact - USA"
    });
}