import api from "@/services/api";

export interface AdminUser {
  _id: string;
  fullname: string;
  email: string;
  profilePhoto?: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  address: string;
  verified: boolean;
  role: "admin" | "doctor" | "midwife" | "bhw" | "resident";
  createdAt: string;
  updatedAt: string;
}

interface GetAllUsersResponse {
  success: boolean;
  count: number;
  users: AdminUser[];
}

export const getAllUsers = async (): Promise<{ count: number; users: AdminUser[] }> => {
  const { data } = await api.get<GetAllUsersResponse>("/users");
  return {
    count: data.count ?? 0,
    users: data.users ?? [],
  };
};
