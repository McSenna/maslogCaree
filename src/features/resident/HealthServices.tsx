import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import { CARD, RESIDENT_COLORS, TONES } from "@/components/resident/residentTheme";
import type { HealthService } from "@/types/residentDashboard";

type HealthServicesProps = {
  services: HealthService[];
  onViewAll: () => void;
  onServicePress: (service: HealthService) => void;
  stacked?: boolean;
};

const ServiceCard = ({
  service,
  onPress,
  stacked,
}: {
  service: HealthService;
  onPress: () => void;
  stacked: boolean;
}) => {
  const tone = TONES[service.tone];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${service.title}. ${service.description}`}
      android_ripple={{ color: `${tone.fg}18` }}
      className={
        stacked
          ? "w-full flex-row items-center gap-3 px-3.5 py-3 active:opacity-85"
          : "min-w-0 flex-1 items-center gap-2 px-3 py-4 active:opacity-85"
      }
      style={{
        minHeight: stacked ? 72 : 132,
        borderRadius: CARD.radiusSm,
        backgroundColor: tone.bg,
      }}
    >
      <View
        className={stacked ? "h-10 w-10 shrink-0 items-center justify-center" : "items-center justify-center"}
        style={
          stacked
            ? { backgroundColor: "#FFFFFF", borderRadius: 10 }
            : undefined
        }
      >
        <Ionicons name={service.icon} size={stacked ? 20 : 26} color={tone.fg} />
      </View>

      <View className={stacked ? "min-w-0 flex-1" : "w-full items-center gap-1"}>
        <Text
          className={`text-[13px] font-bold ${stacked ? "" : "text-center"}`}
          numberOfLines={2}
          style={{ color: RESIDENT_COLORS.heading }}
        >
          {service.title}
        </Text>
        <Text
          className={`text-[12px] ${stacked ? "mt-0.5" : "text-center"}`}
          numberOfLines={2}
          style={{ color: RESIDENT_COLORS.muted, lineHeight: 16 }}
        >
          {service.description}
        </Text>
      </View>
    </Pressable>
  );
};

const HealthServices = ({
  services,
  onViewAll,
  onServicePress,
  stacked = false,
}: HealthServicesProps) => (
  <DashboardCard>
    <SectionHeader title="Health Services" actionLabel="View All" onActionPress={onViewAll} />

    <View className={`mt-3.5 w-full ${stacked ? "gap-2.5" : "flex-row gap-2.5"}`}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          stacked={stacked}
          onPress={() => onServicePress(service)}
        />
      ))}
    </View>
  </DashboardCard>
);

export default HealthServices;
