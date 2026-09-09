import api from "@/services/api";
import {
  CLIENT_PLATFORM,
  type ClientPlatform,
  type PlatformAccessSummary,
} from "@/config/platformAccess";
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
  phone?: string;
  avatarUrl?: string | null;
  /** Which clients this account may sign in from, as computed by the server. */
  platformAccess?: PlatformAccessSummary;
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
    phone: user.phone,
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
  /**
   * Null when the account was created but this client may not hold a session
   * for it — a resident completing registration on the web. The account is
   * real; the session is simply not issued here.
   */
  token: string | null;
  user: AuthUser;
  code?: string;
  platform?: ClientPlatform;
}

interface LoginResponse {
  success: true;
  message: string;
  token: string;
  user: AuthUser;
  platform?: ClientPlatform;
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

  return { message: data.message, email: data.email };
}

export async function resendOtp(
  email: string
): Promise<{ message: string }> {
  const data = await postJson<ResendOtpResponse>("/send-otp", {
    email: email.trim().toLowerCase(),
  });

  return { message: data.message };
}

export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ message: string; token: string | null; user: AuthUser; code?: string }> {
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
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const data = await postJson<LoginResponse>("/login", {
    email: email.trim().toLowerCase(),
    password,
    clientPlatform: CLIENT_PLATFORM,
  });

  if (data.token) {
    setStoredUser(toStoredUser(data.user, data.token));
  }

  return { token: data.token, user: data.user };
}

/**
 * The platform a token was minted for, read from its payload.
 *
 * Used only to notice that a stored session does not belong on this client —
 * a mobile token carried over to the web build, say — so the app can drop it
 * instead of making requests the server will reject. The signed claim is
 * verified on the server; this read is unverified by definition and is never
 * treated as permission.
 */
export function getTokenPlatform(token: string): ClientPlatform | null {
  const payload = decodeJwtPayload(token);
  const platform = typeof payload?.platform === "string" ? payload.platform : null;
  return platform === "web" || platform === "mobile" ? platform : null;
}

export function logout(): boolean {
  try {
    clearStoredUser();
    return true;
  } catch (error) {
    // Storage failures are non-fatal here: the caller clears in-memory state
    // regardless, so the user is signed out of this session either way.
    console.warn("Failed to clear stored session", error);
    return false;
  }
}

interface JwtPayload {
  exp?: number;
  platform?: string;
  role?: string;
  sessionId?: string;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (b64.length % 4)) % 4;
    const padded = b64 + "=".repeat(pad);
    const atobFn = typeof globalThis.atob === "function" ? globalThis.atob.bind(globalThis) : null;
    if (!atobFn) return null;
    return JSON.parse(atobFn(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  if (!token || token.split(".").length !== 3) return false;
  const exp = decodeJwtPayload(token)?.exp;
  if (exp == null) return false;
  return Date.now() < exp * 1000;
}