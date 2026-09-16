import { Slot, usePathname } from "expo-router";
import MainLayout from "@/components/layout/MainLayout";

const PublicLayout = () => {
  const pathname = usePathname();

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
};

export default PublicLayout;
