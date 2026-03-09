import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function AdminSettings() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>
            Configure system preferences and notifications.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="General Settings"
            description="Barangay name, health center details, and contact information."
            icon={<Feather name="settings" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Notifications"
            description="Configure announcement and appointment alerts."
            icon={<Feather name="bell" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Backup & Export"
            description="Export health records and backup system data."
            icon={<Feather name="database" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
