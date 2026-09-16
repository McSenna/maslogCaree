import type { ResidentRecord } from "../services/residentService";

export const NOT_PROVIDED = "Not provided";

export const residentAddress = (resident: ResidentRecord): string => {
  const parts = resident.addressDetails;
  if (parts) {
    const line = [
      parts.houseNumberOrPurok,
      parts.street,
      parts.barangay ? `Barangay ${parts.barangay}` : "",
      parts.cityMunicipality,
      parts.province,
    ]
      .map((part) => (part ?? "").trim())
      .filter(Boolean)
      .join(", ");
    if (line) return line;
  }

  return resident.address?.trim() || NOT_PROVIDED;
};

export const formatContactNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return phone.trim() || NOT_PROVIDED;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
};
