import { useRouter, type Href } from "expo-router";
import { ScrollView, View } from "react-native";

import Button from "@/components/buttons/Button";
import PageHeader from "@/components/layout/PageHeader";
import { SERVICE_TYPES } from "@/config/appointmentServices";
import { useTheme } from "@/contexts/ThemeContext";
import ServiceCatalogItem from "@/features/resident/ServiceCatalogItem";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { AUTO_SCHEDULE_NOTE } from "@/features/appointments/constants/bookingCopy";
import AppointmentAlert from "@/features/appointments/components/AppointmentAlert";

// `?book=1` opens the booking form on the appointments screen.
const BOOK_HREF = "/resident/appointments?book=1" as Href;

const ResidentServicesRoute = () => {
  const router = useRouter();
  const { classes } = useTheme();
  const { isMobile } = useResponsive();
  const insets = useRoleScreenInsets();

  return (
    <ScrollView
      className={`flex-1 ${classes.scrollBg}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop }}
    >
      <View className="gap-6 pb-4">
        <PageHeader
          title="Health services"
          subtitle="What you can request from the Barangay Maslog health office."
          actions={
            <Button
              label="Book appointment"
              icon="plus"
              onPress={() => router.push(BOOK_HREF)}
              fullWidth={isMobile}
            />
          }
        />

        <AppointmentAlert tone="info" message={AUTO_SCHEDULE_NOTE} />

        <View className="gap-3">
          {SERVICE_TYPES.map((service) => (
            <ServiceCatalogItem key={service.id} service={service} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ResidentServicesRoute;
