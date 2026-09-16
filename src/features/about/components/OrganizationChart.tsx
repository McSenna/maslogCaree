import { Text, View } from "react-native";
import type { OrganizationMember } from "@/types/organization";
import { HC } from "../constants/aboutTheme";
import { healthWorkers, memberInRole } from "../utils/organizationChart";
import BhwGrid from "./BhwGrid";
import ConnectorLine from "./ConnectorLine";
import LeaderCard from "./LeaderCard";
import MedicalCross from "./MedicalCross";

type OrganizationChartProps = {
  members: OrganizationMember[];
  isTablet: boolean;
};

const OrganizationChart = ({ members, isTablet }: OrganizationChartProps) => {
  const workers = healthWorkers(members);

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ width: "100%", paddingHorizontal: isTablet ? 16 : 8 }}>
        <LeaderCard
          title="Barangay Captain"
          subtitle="Head of Barangay Governance"
          icon="shield"
          name={memberInRole(members, "barangay_captain")?.fullname}
          tier="top"
          isTablet={isTablet}
        />
      </View>

      <ConnectorLine height={28} />

      <View
        style={{ height: 1.5, backgroundColor: HC.tealMid, width: isTablet ? "55%" : "60%" }}
      />

      <View style={{ flexDirection: "row", width: "100%", gap: 8 }}>
        <LeaderCard
          title="Barangay Admin"
          subtitle="Operations & Coordination"
          icon="settings"
          name={memberInRole(members, "barangay_admin")?.fullname}
          tier="mid"
          isTablet={isTablet}
        />
        <LeaderCard
          title="Doctor"
          subtitle="Primary Healthcare Provider"
          icon="activity"
          name={memberInRole(members, "doctor")?.fullname}
          tier="mid"
          isTablet={isTablet}
        />
      </View>

      <ConnectorLine height={24} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          width: "100%",
          marginBottom: 14,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: HC.border }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            borderRadius: 50,
            paddingHorizontal: 14,
            paddingVertical: 6,
            backgroundColor: HC.teal,
          }}
        >
          <MedicalCross size={10} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: isTablet ? 9.5 : 8,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Health Workers ({workers.length})
          </Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: HC.border }} />
      </View>

      <BhwGrid members={workers} isTablet={isTablet} />
    </View>
  );
};

export default OrganizationChart;
