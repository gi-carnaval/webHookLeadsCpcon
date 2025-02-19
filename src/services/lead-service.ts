import { pb } from "../config/pocketbase.js";
import { LeadProps } from "../types/leads.js";

const { SUPER_USER_EMAIL, SUPER_USER_PASSWORD } = process.env;

const authenticateAdmin = async (email: string, password: string) => {
  try {
    const authentication = await pb.collection("users").authWithPassword(email, password);
    return { success: true, data: authentication };

  } catch (error) {
    return { success: false, error: "Credenciais inválidas." };
  }
};

const createLead = async (leadData: LeadProps) => {
  const {
    name,
    phone_number,
    company,
    business_email,
    job_title,
    objective,
    solution,
    comments,
    region,
    from_form,
    responsible_region
  } = leadData;

  const data = {
    name,
    phone_number,
    company,
    business_email,
    job_title,
    region,
    objective,
    solution,
    comments,
    "contact_status": "pending",
    from_form,
    responsible_region
  };

  if (!SUPER_USER_EMAIL || !SUPER_USER_PASSWORD) {
    return { success: false, error: "Credenciais não configuradas." };
  }

  try {
    const { success, error } = await authenticateAdmin(SUPER_USER_EMAIL, SUPER_USER_PASSWORD);
    if (!success) {
      return { success: false, lead: null, error };
    }

    const lead = await pb.collection("leads").create(data);
    return { success: true, data: lead, error: null };

  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? `Erro ao cadastrar lead: ${error.message}` : "Erro desconhecido ao cadastrar lead." };
  }
};

export default { createLead };
