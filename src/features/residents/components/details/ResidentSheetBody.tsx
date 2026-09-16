import { Text, View } from "react-native";
import SheetSection from "@/features/users/components/details/SheetSection";
import UserDetailsError from "@/features/users/components/details/UserDetailsError";
import { InfoRows } from "@/features/users/components/details/userDetailRows";
import ResidentProfileSummary from "./ResidentProfileSummary";
import { buildAccountRows, buildAddressRows, buildContactRows } from "./residentDetailRows";
import type { ResidentDetailsProps } from "./ResidentDetailsPanel";

const ResidentSheetBody = ({
  resident,
  loading,
  error,
  onRetry,
  muted,
}: Pick<ResidentDetailsProps, "resident" | "loading" | "error" | "onRetry"> & { muted: string }) => {
  if (error && !resident) return <UserDetailsError onRetry={onRetry} message={error} />;

  if (!resident || loading) {
    return (
      <View className="w-full items-center py-16">
        <Text className="text-[14px]" style={{ color: muted }}>
          Loading resident details…
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full gap-5 pb-1 pt-3">
      <ResidentProfileSummary resident={resident} />

      <SheetSection title="Contact Information">
        <InfoRows rows={buildContactRows(resident)} compact />
      </SheetSection>

      <SheetSection title="Address">
        <InfoRows rows={buildAddressRows(resident)} compact />
      </SheetSection>

      <SheetSection title="Account Information" quiet>
        <InfoRows rows={buildAccountRows(resident)} compact />
      </SheetSection>
    </View>
  );
};

export default ResidentSheetBody;
