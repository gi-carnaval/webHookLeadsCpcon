export interface LeadProps {
  name: string;
  phone_number: string;
  company: string;
  business_email: string;
  job_title?: string;
  region?: string;
  objective: string;
  solution: string | undefined;
  comments: string;
  from_form: string;
}