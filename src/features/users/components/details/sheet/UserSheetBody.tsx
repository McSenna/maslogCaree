import { ScrollView, Text, View } from "react-native";

import { describePlatformAccess } from "@/config/platformAccess";
import type { AdminUser } from "@/features/users/services/userService";

import RoleBadge from "../../RoleBadge";
import SheetSection from "../SheetSection";
import UserDetailsError from "../UserDetailsError";
import { PlatformAccessRows } from "../UserPlatformAccessCard";
import UserProfileSummary from "../UserProfileSummary";
import UserSheetSkeleton from "../UserSheetSkeleton";
import { ROLE_PERMISSIONS, useUserDetailsPalette } from "../detailsTheme";
import { InfoRows, buildAccountRows, buildPersonalRows } from "../userDetailRows";

type Props = {
  user: AdminUser | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const UserSheetBody = ({ user, loading, error, onRetry }: Props) => {
  const palette = useUserDetailsPalette();
  const access = user ? user.platformAccess ?? describePlatformAccess(user.role) : null;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      {error && !user ? (
        <UserDetailsError onRetry={onRetry} message={error} />
      ) : !user || loading ? (
        <UserSheetSkeleton />
      ) : (
        <View className="w-full gap-5 pb-1 pt-3">
          <UserProfileSummary user={user} />

          <SheetSection title="Personal Information">
            <InfoRows rows={buildPersonalRows(user)} compact />
          </SheetSection>

          <SheetSection title="Role & Permissions">
            <View className="gap-2 pt-1">
              <RoleBadge role={user.role} />
              <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }}>
                {ROLE_PERMISSIONS[user.role]}
              </Text>
            </View>
          </SheetSection>

          <SheetSection title="Platform Access">
            <PlatformAccessRows user={user} />
            {access && !access.web ? (
              <Text className="pb-1 pt-1 text-[12.5px]" style={{ color: palette.subtle }}>
                This account can only sign in through the MaslogCare mobile application.
              </Text>
            ) : null}
          </SheetSection>

          <SheetSection title="Account Information" quiet>
            <InfoRows rows={buildAccountRows(user)} compact />
          </SheetSection>
        </View>
      )}
    </ScrollView>
  );
};

export default UserSheetBody;
