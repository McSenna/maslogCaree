import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function AdminUsers() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>User Management</PageTitle>
          <PageSubtitle>
            Manage system users, roles, and permissions.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title="Admin Users"
            description="2 administrators with full system access."
            icon={<Feather name="shield" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Healthcare Staff"
            description="1 doctor, 10 barangay health workers."
            icon={<Feather name="users" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Residents"
            description="1,240 registered residents in the system."
            icon={<Feather name="user-check" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
