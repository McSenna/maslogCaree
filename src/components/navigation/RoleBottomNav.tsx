import { BottomNavigation, type BottomNavEntry } from "./bottomNav";
import type { NavItem } from "./SidebarNavigation";

type RoleBottomNavProps = {
  items: NavItem[];
  badges?: Record<string, number>;
};

const RoleBottomNav = ({ items, badges }: RoleBottomNavProps) => {
  const entries: BottomNavEntry[] = items.map((item) => ({
    ...item,
    badgeCount: badges?.[item.href],
  }));

  return <BottomNavigation items={entries} />;
};

export default RoleBottomNav;
