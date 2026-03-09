import { setStoredUser, clearStoredUser } from "../utils/storage";

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL?.trim();
const NORMALIZED_BASE = (RAW_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const API_URL = NORMALIZED_BASE.endsWith("/api")
  ? NORMALIZED_BASE
  : `${NORMALIZED_BASE}/api`;


export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  role: "admin" | "doctor" | "bhw" | "resident";
  verified: boolean;
}

export interface RegisterPayload {
  fullname: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  address: string;
}

interface ApiErrorBody {
  success: false;
  message: string;
  errors?: string[];
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
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      (data as ApiErrorBody)?.message ||
      `Request failed with status ${response.status}`;

    const err = new Error(message) as Error & { errors?: string[] };
    err.errors = (data as ApiErrorBody)?.errors;
    throw err;
  }

  return data as T;
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
    setStoredUser({
      id: data.user._id,
      name: data.user.fullname,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });
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
    setStoredUser({
      id: data.user._id,
      name: data.user.fullname,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });
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

export function isTokenValid(token: string): boolean {
  if (!token) return false;
  try {
    return token.split(".").length === 3;
  } catch {
    return false;
  }
}