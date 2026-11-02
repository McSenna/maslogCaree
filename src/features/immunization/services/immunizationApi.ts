import api from "@/services/api";
import type {
  Administration,
  Baby,
  Checklist,
  Correction,
  Mother,
  PatientDose,
} from "../types";

const post = async <T>(path: string, body: object): Promise<T> => {
  const response = await api.post<T>(`/immunization${path}`, body);
  return response.data;
};
const searchMothers = (query: string) =>
  post<{ mothers: Mother[] }>("/mothers/search", { query });
const searchBabies = (motherMasterResidentId?: string) =>
  post<{ babies: Baby[] }>("/babies/search", { motherMasterResidentId });
const checklist = (babyId: string, motherMasterResidentId?: string) =>
  post<Checklist>("/checklist", { babyId, motherMasterResidentId });
const createBaby = (body: {
  motherMasterResidentId: string;
  name?: string;
  dateOfBirth: string;
  birthRecordId?: string;
  requestKey: string;
}) => post<{ baby: Baby }>("/babies", body);
const renameBaby = (body: {
  motherMasterResidentId: string;
  babyId: string;
  name: string;
}) => post<{ baby: Baby }>("/babies/rename", body);
const administer = (body: PatientDose & Administration & { expectedRevision?: number | null }) =>
  post<{ success: true }>("/administrations", body);
const saveDraft = (body: PatientDose & Administration & { expectedRevision: number | null }) =>
  post<{ success: true }>("/drafts", body);
const correct = (body: Correction) =>
  post<{ success: true }>("/corrections", body);
const followUp = (
  body: PatientDose & { followUpOn: string; reason: string; deferred: boolean },
) => post<{ success: true }>("/follow-up", body);
const completeVisit = (body: {
  motherMasterResidentId: string;
  babyId: string;
  appointmentId: string;
}) => post<{ success: true }>("/visits/complete", body);
const preferences = (enabled: boolean) =>
  post<{ success: true }>("/preferences", { enabled });

export const immunizationApi = {
  searchMothers,
  searchBabies,
  checklist,
  createBaby,
  renameBaby,
  administer,
  saveDraft,
  correct,
  followUp,
  preferences,
  completeVisit,
};
