import { usePathname } from "expo-router";
import { Slot } from "expo-router";
import MainLayout from "@/components/layout/MainLayout";

/**
 * Public routes layout.
 *
 * The landing page (index) renders its own full-screen layout
 * without the Header/BottomNav wrapper.
 *
 * Other public pages (/about, /announcements, /profile) keep
 * the standard MainLayout with Header and BottomNav.
 */
export default function PublicLayout() {
  const pathname = usePathname();

  // Landing page manages its own layout
  const isLandingPage =
    pathname === "/" || pathname === "/index" || pathname === "";

  if (isLandingPage) {
    return <Slot />;
  }

  return (
    <MainLayout>
      <Slot />
    </MainLayout>
  );
}
