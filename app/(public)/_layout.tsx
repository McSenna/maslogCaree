import { Slot } from "expo-router";
import MainLayout from "../../components/layout/MainLayout";

export default function PublicLayout() {
  return (
    <MainLayout>
      <Slot />
    </MainLayout>
  );
}
