export type EngagementStatus = "COUNCIL" | "ENGAGED" | "AWARE" | "POTENTIAL" | "LOW_POTENTIAL" | "OPPOSED";

export type Church = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  denomination: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  website: string | null;
  phone: string | null;
  status: EngagementStatus | null;
  latitude: number | null;
  longitude: number | null;
  pastorName: string | null;
  pastorEmail: string | null;
  pastorCell: string | null;
  associatePastorName: string | null;
  associatePastorEmail: string | null;
  associatePastorCell: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  notes: string | null;
};

export type ChurchFormData = Omit<Church, "id" | "createdAt" | "updatedAt">;
