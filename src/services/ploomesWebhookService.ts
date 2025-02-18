import leadService from "./leadService.js";

const processDeal = async (data: any) => {
  console.log("Data aqui: ", data)
  const mappedData = {
    name: data.Title,
    email: data.CustomerEmail,
    phone: data.CustomerPhone,
    source: "Ploomes",
  };

  return { success: true, lead: data, error: null }

  // const lead = await leadService.createLead(mappedData)
}

export default { processDeal }