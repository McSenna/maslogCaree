import { BottomNavigation, type BottomNavEntry } from "./bottomNav";
import type { NavItem } from "./SidebarNavigation";

type RoleBottomNavProps = {
  items: NavItem[];
  /** Optional unread counts keyed by item href (e.g. { "/resident/records": 3 }). */
  badges?: Record<string, number>;
};

/**
 * Bottom navigation for the authenticated role workspaces.
 *
 * Routes stay owned by `roleNavConfig`; this only feeds them to the shared bar.
 */
const RoleBottomNav = ({ items, badges }: RoleBottomNavProps) => {
  const entries: BottomNavEntry[] = items.map((item) => ({
    ...item,
    badgeCount: badges?.[item.href],
  }));

  return <BottomNavigation items={entries} />;
};

export default RoleBottomNav;
