import { LeadFromPloomesAPIProps } from "../types/ploomes.js";
import { api } from "./client.js";

export const getCompleteDeal = async (dealId: number) => {
  const filterDealId = `Id+eq+${dealId}`;
  const expandFields = "Contact,OtherProperties,Person($expand=Phones)";

  try {
    const result = await api
      .get(`Deals?$filter=${filterDealId}&$expand=${expandFields}`)
      .json<LeadFromPloomesAPIProps>()

    return { success: true, data: result, error: null }

  } catch (error) {
    return { success: false, data: null, error };
  }
}