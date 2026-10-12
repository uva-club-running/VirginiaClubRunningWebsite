export interface ContentDocument {
  id: string;
  [field: string]: unknown;
}

export interface Meet extends ContentDocument {
  name?: string;
  date?: string;
  location?: string;
  results?: string;
  year?: string | number;
}

export interface Event extends ContentDocument {
  name?: string;
  type?: string;
}

export interface RecordDocument extends ContentDocument {
  name?: string;
  eventId?: string;
  category?: string;
  time?: string;
  dateAdded?: string;
  year?: string | number;
  semester?: string;
  place?: string | number;
}

export interface GroupedRecord extends RecordDocument {
  event: string;
  type: string;
}

export interface PhilanthropyEvent extends ContentDocument {
  name?: string;
  date?: string;
  partner_org?: string;
  description?: string;
  link?: string;
  flyer_link?: string;
}
