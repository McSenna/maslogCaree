import { ScrollView, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import EditProfileForm, {
  type EditProfileValues,
} from "../components/profile/EditProfileForm";

export default function EditResidentProfileScreen() {
  const { user } = useAuth();

  const initialValues: EditProfileValues = {
    fullname: user?.name ?? "Resident User",
    nickname: "",
    email: user?.email ?? "resident@test.com",
    phone: "",
    address: "",
    occupation: "",
    avatarUrl: null,
  };

  const handleSave = async (values: EditProfileValues) => {
    // TODO: Connect to secure profile update API here.
    // Ensure no password is ever requested or handled on this screen.
    console.log("Profile values to save", values);
  };

  const handleDiscard = () => {
    // In a real navigation flow, this would go back to the previous screen.
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6">
        <EditProfileForm
          initialValues={initialValues}
          onDiscard={handleDiscard}
          onSave={handleSave}
        />
      </View>
    </ScrollView>
  );
}

