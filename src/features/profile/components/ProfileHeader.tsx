import { Text, View } from "react-native";
import ProfileAvatar from "./ProfileAvatar";
import ProfileBanner from "./ProfileBanner";
import ProfileExpBar from "./ProfileExpBar";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProfileHeaderData = {
  fullname: string;
  email: string;
  bio?: string;
  role: string;
  verified?: boolean;
  avatarUrl?: string | null;
  expProgress?: number;
  expLevel?: number;
};

type ProfileHeaderProps = {
  user: ProfileHeaderData;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
      {/* Sky banner */}
      <ProfileBanner height={80} />

      {/* Avatar — sits just below banner */}
      <View className="px-4 pt-3">
        <ProfileAvatar
          size={58}
          imageUrl={user.avatarUrl}
          verified={user.verified}
        />
      </View>

      {/* Name, bio, exp */}
      <View className="gap-2 px-4 pb-4 pt-2">
        <View>
          <Text className="text-lg font-semibold text-slate-900" numberOfLines={1}>
            {user.fullname}
          </Text>
          <Text className="text-xs text-slate-500" numberOfLines={2}>
            {user.bio ?? user.email}
          </Text>
        </View>

        <ProfileExpBar
          progress={user.expProgress ?? 62}
          level={user.expLevel ?? 7}
        />
      </View>
    </View>
  );
}