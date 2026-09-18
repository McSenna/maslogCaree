import type { UserRole } from "@/data/mockUsers";
import type { AuthUser, RegisterPayload } from "@/services/auth";
import type { ClientPlatform } from "@/config/platformAccess";

export interface CurrentUser {
  id: string | number;
  name: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  suffix?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  phone?: string | null;
  verified?: boolean;
}

export interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: UserRole; error?: string; code?: string }>;
  register: (
    payload: RegisterPayload
  ) => Promise<{ success: boolean; email?: string; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  applyAuthUser: (userData: AuthUser, token: string) => CurrentUser;
  platform: ClientPlatform;
}
