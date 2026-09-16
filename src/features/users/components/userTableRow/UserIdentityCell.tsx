import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminUser } from "@/features/users/services/userService";
import { useUsersPalette } from "../usersTheme";

const UserIdentityCell = ({ user, onSelect }: { user: AdminUser; onSelect: () => void }) => {
  const palette = useUsersPalette();
  const [nameHovered, setNameHovered] = useState(false);

  return (
    <View className="flex-row items-center gap-2.5">
      <UserAvatar
        size={40}
        imageUrl={user.profilePhoto}
        accessibilityLabel={`${user.fullname} profile photo`}
        fallbackBackgroundColor={palette.primary}
      />
      <Pressable
        onPress={onSelect}
        onPointerEnter={() => setNameHovered(true)}
        onPointerLeave={() => setNameHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${user.fullname}`}
        className="min-w-0 flex-1"
      >
        <Text
          className="text-[14px] font-bold"
          numberOfLines={1}
          style={{
            color: nameHovered ? palette.primary : palette.heading,
            textDecorationLine: nameHovered ? "underline" : "none",
          }}
        >
          {user.fullname}
        </Text>
      </Pressable>
    </View>
  );
};

export default UserIdentityCell;
