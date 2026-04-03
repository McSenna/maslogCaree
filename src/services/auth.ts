import api from "@/services/api";
import { setStoredUser, clearStoredUser, type StoredUser } from "@/utils/storage";

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  role: "admin" | "doctor" | "midwife" | "bhw" | "resident";
  verified: boolean;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  /** Base64 data URI (data:image/...;base64,...) */
  avatarUrl?: string | null;
}

function toStoredUser(user: AuthUser, token: string): StoredUser {
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
    verified: user.verified,
  };
}

export interface RegisterPayload {
  fullname: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  address: string;
  profilePhoto?: string | null;
}

interface RegisterResponse {
  success: true;
  message: string;
  email: string;
}

interface VerifyOtpResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

interface LoginResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
}

interface ResendOtpResponse {
  success: true;
  message: string;
}

async function postJson<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const response = await api.post<T>(path, body);
  return response.data;
}

export async function registerResident(
  payload: RegisterPayload
): Promise<{ message: string; email: string }> {
  const dateOfBirth = payload.dateOfBirth.trim().slice(0, 10);

  const data = await postJson<RegisterResponse>("/register", {
    fullname: payload.fullname.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    gender: payload.gender.trim().toLowerCase(),
    dateOfBirth,
    address: payload.address.trim(),
    profilePhoto: payload.profilePhoto ?? undefined,
  });

  if (!data.success) {
    throw new Error((data as any).message || "Registration failed");
  }

  return { message: data.message, email: data.email };
}

export async function resendOtp(
  email: string
): Promise<{ message: string }> {
  const data = await postJson<ResendOtpResponse>("/send-otp", {
    email: email.trim().toLowerCase(),
  });

  if (!data.success) {
    throw new Error((data as any).message || "Failed to resend OTP");
  }

  return { message: data.message };
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ message: string; token: string; user: AuthUser }> {
  const data = await postJson<VerifyOtpResponse>("/verify-otp", {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
  });

  if (!data.success) {
    throw new Error((data as any).message || "OTP verification failed");
  }

  if (data.token) {
    setStoredUser(toStoredUser(data.user, data.token));
  }

  return { message: data.message, token: data.token, user: data.user };
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const data = await postJson<LoginResponse>("/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  if (!data.success) {
    throw new Error((data as any).message || "Login failed");
  }

  if (data.token) {
    setStoredUser(toStoredUser(data.user, data.token));
  }

  return { token: data.token, user: data.user };
}

export function logout(): boolean {
  try {
    clearStoredUser();
    return true;
  } catch (error) {
    console.error("❌ Logout error:", error);
    return false;
  }
}

function decodeJwtExp(token: string): number | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (b64.length % 4)) % 4;
    const padded = b64 + "=".repeat(pad);
    const atobFn = typeof globalThis.atob === "function" ? globalThis.atob.bind(globalThis) : null;
    if (!atobFn) return null;
    const json = atobFn(padded);
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  if (!token || token.split(".").length !== 3) return false;
  const exp = decodeJwtExp(token);
  if (exp == null) return false;
  return Date.now() < exp * 1000;
}