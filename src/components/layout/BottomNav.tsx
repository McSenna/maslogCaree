import {
  BottomNavigation,
  type BottomNavEntry,
} from "@/components/navigation/bottomNav";

const PUBLIC_NAV_ITEMS: BottomNavEntry[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About", href: "/about", icon: "info" },
  { label: "Announcements", href: "/announcements", icon: "bell" },
];

const BottomNav = () => {
  return <BottomNavigation items={PUBLIC_NAV_ITEMS} replace />;
};

export default BottomNav;
