import { Text, View } from "react-native";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminUser } from "@/features/users/services/userService";
import { useUsersPalette } from "../usersTheme";

const UserIdentityCell = ({ user }: { user: AdminUser; onSelect?: () => void }) => {
  const palette = useUsersPalette();

  return (
    <View className="flex-row items-center gap-2.5">
      <UserAvatar
        size={40}
        imageUrl={user.profilePhoto}
        accessibilityLabel={`${user.fullname} profile photo`}
        fallbackBackgroundColor={palette.primary}
      />
      <View className="min-w-0 flex-1">
        <Text
          className="text-[14px] font-bold"
          numberOfLines={1}
          style={{ color: palette.heading }}
        >
          {user.fullname}
        </Text>
      </View>
    </View>
  );
};

export default UserIdentityCell;
