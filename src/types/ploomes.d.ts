interface OtherPropertiesFields {
  ObjectValueName?: string;
  BigStringValue?: string;
}

export interface OtherPropertiesProps extends OtherPropertiesFields {
  FieldId: number;
}

export interface LeadFromPloomesAPIProps {
  value: {
    Title: string;
    PersonName: string;
    OtherProperties: OtherPropertiesProps[];
    Person: {
      Email: string;
      Phones: { PhoneNumber: string }[];
    };
  }[];
}

export interface DealProps {
  New: { Id: number };
}