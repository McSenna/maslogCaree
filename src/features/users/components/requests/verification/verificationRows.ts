import { formatDate } from "@/utils/dateFormatter";

import { NOT_PROVIDED, type DetailRow } from "../../details/userDetailRows";
import type { UserRequestDetail } from "../../../services/userRequestsService";

export const buildResidentRows = (request: UserRequestDetail): DetailRow[] => {
  const resident = request.resident;
  const legalName =
    [resident.firstName, resident.middleName, resident.surname, resident.suffix]
      .filter(Boolean)
      .join(" ") || resident.fullname;

  return [
    { icon: "user", label: "Full Legal Name", value: legalName || NOT_PROVIDED },
    {
      icon: "gift",
      label: "Date of Birth",
      value: resident.dateOfBirth ? formatDate(resident.dateOfBirth) : NOT_PROVIDED,
    },
    { icon: "users", label: "Sex", value: resident.gender || NOT_PROVIDED },
    { icon: "phone", label: "Contact Number", value: resident.phone || NOT_PROVIDED },
    { icon: "mail", label: "Email Address", value: resident.email || NOT_PROVIDED },
    { icon: "map-pin", label: "Complete Address", value: resident.address || NOT_PROVIDED },
  ];
};
