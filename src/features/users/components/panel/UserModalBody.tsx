import { ScrollView, View } from "react-native";

import type { AdminUser } from "@/features/users/services/userService";

import UserDetailsError from "../details/UserDetailsError";
import UserDetailsSkeleton from "../details/UserDetailsSkeleton";
import UserInformationCard from "../details/UserInformationCard";
import UserPermissionsCard from "../details/UserPermissionsCard";
import UserPlatformAccessCard from "../details/UserPlatformAccessCard";
import UserProfileHero from "../details/UserProfileHero";

type Props = {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  compact: boolean;
};

export const UserModalBody = ({ user, loading, error, onRetry, compact }: Props) => {
  return (
    <ScrollView
      className="w-full"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 8 }}
    >
      {error && !user ? (
        <UserDetailsError onRetry={onRetry} message={error} />
      ) : !user || loading ? (
        <UserDetailsSkeleton compact={compact} />
      ) : (
        <View className="w-full gap-5">
          <UserProfileHero user={user} compact={compact} />

          <View className={`w-full gap-5 ${compact ? "flex-col" : "flex-row items-stretch"}`}>
            <View className="min-w-0 flex-1">
              <UserInformationCard user={user} />
            </View>
            <View className="min-w-0 flex-1 gap-5">
              <UserPermissionsCard user={user} />
              <UserPlatformAccessCard user={user} />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
