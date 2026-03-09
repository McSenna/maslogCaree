import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import InfoCard from "../../components/ui/InfoCard";
import { PageSubtitle, PageTitle } from "../../components/ui/Typography";

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6">
        <View>
          <PageTitle>Profile</PageTitle>
          <PageSubtitle>
            Your account information and preferences.
          </PageSubtitle>
        </View>

        <View className="gap-3">
          <InfoCard
            title={user?.name ?? "Admin User"}
            description={`Role: Admin · ${user?.email || "admin@test.com"}`}
            icon={<Feather name="user" size={18} color="#2D5BFF" />}
          />
          <InfoCard
            title="Account Settings"
            description="Update your password and notification preferences."
            icon={<Feather name="settings" size={18} color="#2D5BFF" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
