import type { AuthUser } from "@/services/auth";

export type UpdateProfilePayload = Partial<{
  fullname: string;
  phone: string;
  address: string;
  profilePhoto: string;
}>;

export type ProfileResponse = {
  success: true;
  message?: string;
  user: AuthUser;
};
