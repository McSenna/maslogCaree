import type { ClientPlatform, PlatformAccessSummary } from "@/config/platformAccess";
import type { StoredUser } from "@/utils/storage";

export interface AuthUser {
  _id: string;
  fullname: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  suffix?: string;
  civilStatus?: string;
  addressDetails?: ResidentAddress | null;
  email: string;
  role: "admin" | "doctor" | "midwife" | "bhw" | "resident";
  verified: boolean;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  avatarUrl?: string | null;
  platformAccess?: PlatformAccessSummary;
}

export const toStoredUser = (user: AuthUser, token: string): StoredUser => {
  const dob =
    typeof user.dateOfBirth === "string"
      ? user.dateOfBirth
      : user.dateOfBirth != null
        ? String(user.dateOfBirth)
        : undefined;
  return {
    id: user._id,
    name: user.fullname,
    email: user.email,
    role: user.role,
    token,
    avatarUrl: user.avatarUrl ?? undefined,
    dateOfBirth: dob,
    gender: user.gender,
    address: user.address,
    phone: user.phone,
    verified: user.verified,
  };
};

export interface ResidentAddress {
  houseNumberOrPurok?: string;
  street?: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
}

export interface RegisterPayload {
  firstName: string;
  middleName?: string;
  surname: string;
  suffix?: string;
  dateOfBirth: string;
  sex: string;
  civilStatus?: string;
  contactNumber: string;
  email: string;
  password: string;
  address: ResidentAddress;
  profilePhoto?: string | null;
  idType: string;
  idNumber: string;
  idDocument: string;
  idFileName?: string;
  emailVerificationToken: string;
}

export interface RegisterResponse {
  success: true;
  message: string;
  email: string;
  status?: string;
}

export interface VerifyOtpResponse {
  success: true;
  message: string;
  token: string | null;
  user: AuthUser;
  code?: string;
  platform?: ClientPlatform;
}

export interface LoginResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
  platform?: ClientPlatform;
}

export interface ResendOtpResponse {
  success: true;
  message: string;
}
