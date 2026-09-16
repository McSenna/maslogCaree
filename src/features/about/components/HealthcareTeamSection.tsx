import { ActivityIndicator, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { OrganizationMember } from "@/types/organization";
import { HC } from "../constants/aboutTheme";
import AboutSectionHeader from "./AboutSectionHeader";
import OrganizationChart from "./OrganizationChart";

type HealthcareTeamSectionProps = {
  members: OrganizationMember[];
  loading: boolean;
  error: string | null;
  isTablet: boolean;
};

const HealthcareTeamSection = ({
  members,
  loading,
  error,
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
          <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
            <ActivityIndicator size="large" color={HC.teal} />
            <Text style={{ color: HC.slateLight, fontSize: 14 }}>Loading team data...</Text>
          </View>
        ) : error ? (
          <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#FEF2F2",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="alert-circle" size={28} color="#EF4444" />
            </View>
            <Text style={{ color: "#EF4444", fontSize: 14, textAlign: "center" }}>{error}</Text>
          </View>
        ) : (
          <OrganizationChart members={members} isTablet={isTablet} />
        )}
      </View>
    </View>
  );
};

export default HealthcareTeamSection;
