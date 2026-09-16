import type { NavItem } from "@/components/navigation/SidebarNavigation";

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout" },
  { label: "User Management", href: "/admin/users", icon: "users" },
  { label: "Inventory", href: "/admin/inventory", icon: "box" },
  { label: "System Logs", href: "/admin/system-logs", icon: "shield" },
];

export const doctorNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "layout" },
  { label: "Appointment & Queue", href: "/doctor/mission", icon: "calendar" },
  { label: "Inventory", href: "/doctor/inventory", icon: "box" },
];

export const midwifeNavItems: NavItem[] = [
  { label: "Dashboard", href: "/midwife/dashboard", icon: "layout" },
  { label: "Appointments & Queue", href: "/midwife/mission", icon: "calendar" },
  { label: "Inventory", href: "/midwife/inventory", icon: "box" },
];

export const bhwNavItems: NavItem[] = [
  { label: "Dashboard", href: "/bhw/dashboard", icon: "layout" },
  { label: "Appointments & Queue", href: "/bhw/mission", icon: "calendar" },
  { label: "Residents", href: "/bhw/residents", icon: "users" },
  { label: "Inventory", href: "/bhw/inventory", icon: "box" },
];

export const residentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/resident/dashboard", icon: "home" },
  { label: "My Appointments", href: "/resident/appointments", icon: "calendar" },
  { label: "Medical Records", href: "/resident/medical-records", icon: "file-text" },
  { label: "Announcements", href: "/resident/announcements", icon: "bell" },
  { label: "My Profile", href: "/resident/profile", icon: "user" },
];

export const adminBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Inventory", href: "/admin/inventory", icon: "box" },
  { label: "Logs", href: "/admin/system-logs", icon: "shield" },
  { label: "Profile", href: "/admin/profile", icon: "user" },
];

export const doctorBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "layout" },
  { label: "Queue", href: "/doctor/mission", icon: "calendar" },
  { label: "Inventory", href: "/doctor/inventory", icon: "box" },
  { label: "Notifications", href: "/doctor/notifications", icon: "bell" },
  { label: "Profile", href: "/doctor/profile", icon: "user" },
];

export const midwifeBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/midwife/dashboard", icon: "layout" },
  { label: "Queue", href: "/midwife/mission", icon: "calendar" },
  { label: "Patients", href: "/midwife/patients", icon: "users" },
  { label: "Inventory", href: "/midwife/inventory", icon: "box" },
  { label: "Notifications", href: "/midwife/notifications", icon: "bell" },
  { label: "Profile", href: "/midwife/profile", icon: "user" },
];

export const bhwBottomNavItems: NavItem[] = [
  { label: "Dashboard", href: "/bhw/dashboard", icon: "layout" },
  { label: "Queue", href: "/bhw/mission", icon: "calendar" },
  { label: "Residents", href: "/bhw/residents", icon: "users" },
  { label: "Inventory", href: "/bhw/inventory", icon: "box" },
  { label: "Notifications", href: "/bhw/notifications", icon: "bell" },
  { label: "Profile", href: "/bhw/profile", icon: "user" },
];

export const residentBottomNavItems: NavItem[] = [
  { label: "Home", href: "/resident/dashboard", icon: "home" },
  { label: "Appointments", href: "/resident/appointments", icon: "calendar" },
    { label: "Medical Records", href: "/resident/medical-records", icon: "file-text" },
  { label: "Notifications", href: "/resident/notifications", icon: "bell" },
  { label: "Profile", href: "/resident/profile", icon: "user" },
];
