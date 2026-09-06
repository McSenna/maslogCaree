import type { NavItem } from "@/components/navigation/SidebarNavigation";

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout" },
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "System Logs", href: "/admin/system-logs", icon: "shield" },
  { label: "Reports", href: "/admin/reports", icon: "bar-chart-2" },
];

export const doctorNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "layout" },
  { label: "Mission & Queue", href: "/doctor/mission", icon: "calendar" },
  { label: "Patients", href: "/doctor/patients", icon: "users" },
];

export const midwifeNavItems: NavItem[] = [
  { label: "Dashboard", href: "/midwife/dashboard", icon: "layout" },
  { label: "Patients", href: "/midwife/patients", icon: "users" },
];

export const bhwNavItems: NavItem[] = [
  { label: "Dashboard", href: "/bhw/dashboard", icon: "layout" },
  { label: "Residents", href: "/bhw/residents", icon: "users" },
  { label: "Community Visits", href: "/bhw/visits", icon: "map-pin" },
  { label: "Reports", href: "/bhw/reports", icon: "bar-chart-2" },
];

export const residentNavItems: NavItem[] = [
  { label: "Home", href: "/resident/dashboard", icon: "home" },
  { label: "Appointments", href: "/resident/appointments", icon: "calendar" },
  { label: "Medical Records", href: "/resident/records", icon: "file-text" },
];

export const adminBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout" },
  { label: "Mission", href: "/admin/mission", icon: "calendar" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Logs", href: "/admin/system-logs", icon: "shield" },
];

export const doctorBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "layout" },
  { label: "Mission", href: "/doctor/mission", icon: "calendar" },
  { label: "Patients", href: "/doctor/patients", icon: "users" },
];

export const midwifeBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/midwife/dashboard", icon: "layout" },
  { label: "Patients", href: "/midwife/patients", icon: "users" },
];

export const bhwBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/bhw/dashboard", icon: "layout" },
  { label: "Residents", href: "/bhw/residents", icon: "users" },
  { label: "Visits", href: "/bhw/visits", icon: "map-pin" },
];

export const residentBottomNavItems: NavItem[] = [
  { label: "Home", href: "/resident/dashboard", icon: "home" },
  { label: "Appointments", href: "/resident/appointments", icon: "calendar" },
  { label: "Records", href: "/resident/records", icon: "file-text" },
];
