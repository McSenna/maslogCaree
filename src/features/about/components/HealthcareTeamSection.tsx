import { Text, View } from "react-native";
import ErrorState from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OrganizationMember } from "@/types/organization";
import { HC } from "../constants/aboutTheme";
import AboutSectionHeader from "./AboutSectionHeader";
import OrganizationChart from "./OrganizationChart";

type HealthcareTeamSectionProps = {
  members: OrganizationMember[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  isTablet: boolean;
};

const HealthcareTeamSection = ({
  members,
  loading,
  error,
  onRetry,
  isTablet,
}: HealthcareTeamSectionProps) => {
  return (
    <View>
      <AboutSectionHeader eyebrow="Our People" title="Healthcare Team" isTablet={isTablet} />
      <Text
        style={{
          color: HC.slateLight,
          fontSize: isTablet ? 12 : 11,
          marginTop: -8,
          marginBottom: 16,
        }}
      >
        {"Organizational structure of Barangay Maslog's health team"}
      </Text>

      <View
        style={{ borderRadius: 20, paddingVertical: 8, paddingHorizontal: isTablet ? 8 : 4 }}
      >
        {loading ? (
          <View style={{ alignItems: "center", gap: 12, paddingVertical: 24 }} accessibilityLabel="Loading healthcare team">
            <Skeleton className="h-24 w-full max-w-[224px] rounded-2xl" />
            <View style={{ flexDirection: "row", gap: 12, width: "100%", maxWidth: 344 }}>
              <Skeleton className="h-20 flex-1 rounded-2xl" />
              <Skeleton className="h-20 flex-1 rounded-2xl" />
            </View>
          </View>
        ) : error ? (
          <ErrorState title="Unable to load the healthcare team" message={error} onRetry={onRetry} compact />
        ) : (
          <OrganizationChart members={members} isTablet={isTablet} />
        )}
      </View>
    </View>
  );
};

export default HealthcareTeamSection;
