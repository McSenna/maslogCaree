import { ScrollView, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/features/profile/components";
import ProfileMenuItem from "@/features/profile/components";
import { ProfileInfoItem } from "@/features/profile/components";

export default function ResidentProfileScreen() {
  const { user } = useAuth();

  const safeUser = {
    fullname: user?.fullname ?? user?.name ?? "Resident User",
    email: user?.email ?? "resident@test.com",
    gender: user?.gender ?? "Not specified",
    dateOfBirth: user?.dateOfBirth ?? "",
    address: user?.address ?? "No address on file",
    verified: Boolean(user?.verified),
    role: user?.role ?? "Resident",
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6 gap-6">
        <ProfileHeader user={safeUser} />

        <View className="rounded-3xl bg-white p-4 shadow-md shadow-slate-200">
          <View className="gap-3">
            <ProfileInfoItem label="Full Name" value={safeUser.fullname} />
            <ProfileInfoItem label="Email" value={safeUser.email} />
            <ProfileInfoItem label="Gender" value={safeUser.gender} />
            {safeUser.dateOfBirth ? (
              <ProfileInfoItem label="Date of Birth" value={safeUser.dateOfBirth} />
            ) : null}
            <ProfileInfoItem label="Address" value={safeUser.address} />
            <ProfileInfoItem label="Role" value={safeUser.role} />
          </View>
        </View>

        <ProfileMenuItem />
      </View>
    </ScrollView>
  );
}

