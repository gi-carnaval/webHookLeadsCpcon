import { api } from "../api/client.js";
import { getCompleteDeal } from "../api/ploomes-api.js";
import { LeadProps } from "../types/leads.js";
import { DealProps, LeadFromPloomesAPIProps, OtherPropertiesProps } from "../types/ploomes.js";

const OTHER_PROPERTIES_PLOOMES_FIELD_MAP: Record<number, { key: keyof OtherPropertiesProps; name: keyof LeadProps }> = {
  40081902: { key: "ObjectValueName", name: "objective" }, // Objetivo
  40081907: { key: "BigStringValue", name: "solution" },  // Solution
  40072130: { key: "BigStringValue", name: "comments" },  // Comentários
  40072131: { key: "ObjectValueName", name: "from_form" },  // Origem
}

const processDeal = async (data: DealProps) => {
  const dealId = data.New.Id
  const completeDeal = await getCompleteDeal(dealId)

  if (!completeDeal.success || !completeDeal.data) {
    return { success: false, lead: null, error: completeDeal.error }
  }

  const leadFromPloomes = mapLeadFromDeal(completeDeal.data)
  return { success: true, lead: leadFromPloomes, error: null }
}

const mapLeadFromDeal = (dealArray: LeadFromPloomesAPIProps): LeadProps | null => {
  const deal = dealArray.value.at(0);
  if (!deal) return null

  const otherPropertiesFormatted = deal.OtherProperties
    .map((property) => getOtherPropertyById(property))
    .filter(Boolean) as Partial<LeadProps>[]

  const leadProperties = Object.assign({}, ...otherPropertiesFormatted)

  return {
    name: deal.PersonName,
    phone_number: deal.Person.Phones[0].PhoneNumber || "",
    company: deal.Title,
    business_email: deal.Person.Email,
    objective: leadProperties.objective || "",
    solution: leadProperties.solution || "",
    comments: leadProperties.comments || "",
    from_form: "Ploomes",
    responsible_region: "br"
  };
}

const getOtherPropertyById = (
  property: OtherPropertiesProps
): Partial<LeadProps> | null => {
  const field = OTHER_PROPERTIES_PLOOMES_FIELD_MAP[property.FieldId];

  if (!field || !property[field.key]) {
    return null;
  }

  return { [field.name]: property[field.key] };
};

export default { processDeal }