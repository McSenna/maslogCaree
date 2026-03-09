import type { NavItem } from "../components/navigation/SidebarNavigation";

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout" },
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "Reports", href: "/admin/reports", icon: "bar-chart-2" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  { label: "Profile", href: "/admin/profile", icon: "user" },
];

export const doctorNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "layout" },
  { label: "Patients", href: "/doctor/patients", icon: "users" },
  { label: "Consultations", href: "/doctor/consultations", icon: "message-circle" },
  { label: "Prescriptions", href: "/doctor/prescriptions", icon: "file-text" },
  { label: "Profile", href: "/doctor/profile", icon: "user" },
];

export const bhwNavItems: NavItem[] = [
  { label: "Dashboard", href: "/bhw/dashboard", icon: "layout" },
  { label: "Residents", href: "/bhw/residents", icon: "users" },
  { label: "Community Visits", href: "/bhw/visits", icon: "map-pin" },
  { label: "Reports", href: "/bhw/reports", icon: "bar-chart-2" },
  { label: "Profile", href: "/bhw/profile", icon: "user" },
];

export const residentNavItems: NavItem[] = [
  { label: "Home", href: "/resident/dashboard", icon: "home" },
  { label: "Appointments", href: "/resident/appointments", icon: "calendar" },
  { label: "Medical Records", href: "/resident/records", icon: "file-text" },
  { label: "Profile", href: "/resident/profile", icon: "user" },
];

export const adminBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Reports", href: "/admin/reports", icon: "bar-chart-2" },
  { label: "Profile", href: "/admin/profile", icon: "user" },
];

export const doctorBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "layout" },
  { label: "Patients", href: "/doctor/patients", icon: "users" },
  { label: "Consultations", href: "/doctor/consultations", icon: "message-circle" },
  { label: "Profile", href: "/doctor/profile", icon: "user" },
];

export const bhwBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/bhw/dashboard", icon: "layout" },
  { label: "Residents", href: "/bhw/residents", icon: "users" },
  { label: "Visits", href: "/bhw/visits", icon: "map-pin" },
  { label: "Profile", href: "/bhw/profile", icon: "user" },
];

export const residentBottomNavItems: NavItem[] = [
  { label: "Home", href: "/resident/dashboard", icon: "home" },
  { label: "Appointments", href: "/resident/appointments", icon: "calendar" },
  { label: "Records", href: "/resident/records", icon: "file-text" },
  { label: "Profile", href: "/resident/profile", icon: "user" },
];
