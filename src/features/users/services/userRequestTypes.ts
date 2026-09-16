export interface UserRequestResident {
  fullname: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  suffix?: string;
  email: string;
  phone: string;
  address: string;
  addressDetails?: {
    houseNumberOrPurok?: string;
    street?: string;
    barangay?: string;
    cityMunicipality?: string;
    province?: string;
  } | null;
  gender: string;
  civilStatus?: string;
  dateOfBirth: string | null;
  avatarUrl?: string | null;
  status?: string;
  accountStatus?: string;
  registrationDate?: string;
}

export interface UserRequestSummary {
  _id: string;
  userId: string | null;
  resident: UserRequestResident;
  idType: string;
  idTypeName: string;
  maskedIdNumber: string;
  idMimeType: string;
  idFileSize: number;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason: string;
  rejectionRemarks: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  registeredAt: string;
}

export interface UserRequestDetail {
  _id: string;
  userId: string | null;
  resident: UserRequestResident;
  verification: {
    idType: string;
    idTypeName: string;
    idNumber: string;
    maskedIdNumber: string;
    idFileName: string;
    idMimeType: string;
    idFileSize: number;
    verificationStatus: "pending" | "approved" | "rejected";
    rejectionReason: string;
    rejectionRemarks: string;
    verifiedBy: string | null;
    verifiedAt: string | null;
    submittedAt: string;
    documentUrl: string;
  };
}

export interface UserRequestsCounts {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface GetUserRequestsParams {
  status?: "pending" | "approved" | "rejected" | "all";
  search?: string;
  idType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface GetUserRequestsResponse {
  success: boolean;
  requests: UserRequestSummary[];
  counts: UserRequestsCounts;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetUserRequestDetailResponse {
  success: boolean;
  request: UserRequestDetail;
}

export interface IdTypeOption {
  id: string;
  label: string;
  maskPattern?: string;
}

export interface GetIdTypesResponse {
  success: boolean;
  idTypes: IdTypeOption[];
  rejectionReasons: string[];
}
