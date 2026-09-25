import api from "@/services/api";
import { CLIENT_PLATFORM } from "@/config/platformAccess";
import { setStoredUser } from "@/utils/storage";

import {
  toStoredUser,
  type AuthUser,
  type LoginResponse,
  type RegisterPayload,
  type RegisterResponse,
  type ResendOtpResponse,
  type VerifyOtpResponse,
} from "./authTypes";

const postJson = async <T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> => {
  const response = await api.post<T>(path, body);
  return response.data;
};

export const registerResident = async (
  payload: RegisterPayload
): Promise<{ message: string; email: string; status?: string }> => {
  const data = await postJson<RegisterResponse>("/register", {
    firstName: payload.firstName.trim(),
    middleName: payload.middleName?.trim() || "",
    surname: payload.surname.trim(),
    suffix: payload.suffix?.trim() || "",
    dateOfBirth: payload.dateOfBirth.trim().slice(0, 10),
    sex: payload.sex.trim().toLowerCase(),
    civilStatus: payload.civilStatus?.trim().toLowerCase() || "",
    contactNumber: payload.contactNumber.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    address: {
      houseNumberOrPurok: payload.address.houseNumberOrPurok?.trim() || "",
      street: payload.address.street?.trim() || "",
      barangay: payload.address.barangay.trim(),
      cityMunicipality: payload.address.cityMunicipality.trim(),
      province: payload.address.province.trim(),
    },
    profilePhoto: payload.profilePhoto ?? undefined,
    idType: payload.idType.trim(),
    idNumber: payload.idNumber.trim(),
    idDocument: payload.idDocument,
    idFileName: payload.idFileName || "government_id",
    emailVerificationToken: payload.emailVerificationToken,
  });

  return { message: data.message, email: data.email, status: data.status };
};

export const resendOtp = async (
  email: string
): Promise<{ message: string }> => {
  const data = await postJson<ResendOtpResponse>("/send-otp", {
    email: email.trim().toLowerCase(),
  });

  return { message: data.message };
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ message: string; token: string | null; user: AuthUser; code?: string }> => {
  const data = await postJson<VerifyOtpResponse>("/verify-otp", {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
    clientPlatform: CLIENT_PLATFORM,
  });

  if (data.token) {
    setStoredUser(toStoredUser(data.user, data.token));
  }

  return {
    message: data.message,
    token: data.token,
    user: data.user,
    code: data.code,
  };
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> => {
  const data = await postJson<LoginResponse>("/login", {
    email: email.trim().toLowerCase(),
    password,
    clientPlatform: CLIENT_PLATFORM,
  });

  if (data.token) {
    setStoredUser(toStoredUser(data.user, data.token));
  }

  return { token: data.token, user: data.user };
};
