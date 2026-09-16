import type { DetailRow } from "@/features/users/components/details/userDetailRows";
import { formatDate } from "@/utils/dateFormatter";
import type { ResidentRecord } from "../../services/residentService";
import { NOT_PROVIDED, formatContactNumber, residentAddress } from "../residentDisplay";

export const buildContactRows = (resident: ResidentRecord): DetailRow[] => [
  { icon: "mail", label: "Email Address", value: resident.email || NOT_PROVIDED },
  { icon: "phone", label: "Contact Number", value: formatContactNumber(resident.phone) },
];

export const buildAddressRows = (resident: ResidentRecord): DetailRow[] => {
  const parts = resident.addressDetails;

  if (!parts?.barangay && !parts?.cityMunicipality) {
    return [{ icon: "map-pin", label: "Complete Address", value: residentAddress(resident) }];
  }

  return [
    {
      icon: "home",
      label: "House No. / Purok / Sitio",
      value: parts.houseNumberOrPurok?.trim() || NOT_PROVIDED,
    },
    { icon: "navigation", label: "Street", value: parts.street?.trim() || NOT_PROVIDED },
    { icon: "map-pin", label: "Barangay", value: parts.barangay?.trim() || NOT_PROVIDED },
    { icon: "map", label: "City / Municipality", value: parts.cityMunicipality?.trim() || NOT_PROVIDED },
    { icon: "map", label: "Province", value: parts.province?.trim() || NOT_PROVIDED },
  ];
};

export const buildAccountRows = (resident: ResidentRecord): DetailRow[] => [
  { icon: "hash", label: "Resident ID", value: resident.reference },
  { icon: "calendar", label: "Date Registered", value: formatDate(resident.createdAt) },
];
