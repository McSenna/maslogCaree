import { Text, View } from "react-native";
import ProfileAvatar from "./ProfileAvatar";

export type ResidentProfileData = {
  fullname: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  verified: boolean;
  role: string;
  avatarUrl?: string | null;
};

type ProfileHeaderProps = {
  user: ResidentProfileData;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View className="rounded-3xl bg-mc-primary px-5 py-6 shadow-lg shadow-mc-primary/25">
      <View className="flex-row items-center gap-4">
        <ProfileAvatar imageUrl={user.avatarUrl ?? null} verified={user.verified} />

        <View className="flex-1">
          <Text className="text-base font-semibold text-white" numberOfLines={1}>
            {user.fullname}
          </Text>
          <Text className="mt-0.5 text-xs text-white/80" numberOfLines={1}>
            {user.email}
          </Text>

          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-white/10 px-2 py-0.5">
              <Text className="text-[11px] font-semibold uppercase tracking-wide text-white">
                {user.role}
              </Text>
            </View>
            {user.verified && (
              <View className="rounded-full bg-emerald-100/90 px-2.5 py-0.5">
                <Text className="text-[11px] font-semibold text-emerald-700">
                  Verified Resident
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

