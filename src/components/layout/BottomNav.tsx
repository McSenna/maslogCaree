import {
  BottomNavigation,
  type BottomNavEntry,
} from "@/components/navigation/bottomNav";

/**
 * Public (signed-out) bottom navigation.
 *
 * Same three destinations as before — only their presentation changed.
 */
const PUBLIC_NAV_ITEMS: BottomNavEntry[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About", href: "/about", icon: "info" },
  { label: "Announcements", href: "/announcements", icon: "bell" },
];

export default function BottomNav() {
  // `replace` keeps the public tabs from stacking history entries, matching
  // the previous behaviour of this bar.
  return <BottomNavigation items={PUBLIC_NAV_ITEMS} replace />;
}
