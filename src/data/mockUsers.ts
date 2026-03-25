export type UserRole = "admin" | "doctor" | "bhw" | "resident";

export interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: "Admin",
    email: "admin@maslog.gov.ph",
    password: "123456",
    role: "admin",
  },
  {
    id: 2,
    name: "Doctor",
    email: "doctor@maslog.gov.ph",
    password: "123456",
    role: "doctor",
  },
  {
    id: 3,
    name: "BHW",
    email: "bhw@maslog.gov.ph",
    password: "123456",
    role: "bhw",
  },
  {
    id: 4,
    name: "Resident",
    email: "resident@maslog.gov.ph",
    password: "123456",
    role: "resident",
  },
];

export const getDashboardPath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    bhw: "/bhw/dashboard",
    resident: "/resident/dashboard",
  };
  return paths[role];
};

/** Profile screen path per role (for header profile icon and nav links). */
export const getProfilePath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    admin: "/admin/profile",
    doctor: "/doctor/profile",
    bhw: "/bhw/profile",
    resident: "/resident/profile",
  };
  return paths[role];
};
