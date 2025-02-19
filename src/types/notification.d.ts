export interface MessageProps {
  name: string,
  email: string,
  phone: string,
  objective: string,
  comments: string,
  link: string,
}

export interface FormatLeadMessageProps {
  formName: string,
  fields: MessageProps
}