import { Text, View } from "react-native";

import UserAvatar from "@/components/ui/UserAvatar";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { initialsOf } from "../../userAdminModel";

type UserIdentityProps = {
  name: string;
  avatarUrl: string | null;
  /** The line under the name: the email, plus any columns this width folds in. */
  detail: string;
  /** Replaces the plain name, e.g. with a button that opens the profile. */
  nameSlot?: React.ReactNode;
  large?: boolean;
};

/** Avatar, name and detail line, as in the dashboard's user tables. */
const UserIdentity = ({ name, avatarUrl, detail, nameSlot, large }: UserIdentityProps) => {
  const palette = useAdminSurfacePalette();
  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-3">
      <UserAvatar
        size={large ? 40 : 32}
        imageUrl={avatarUrl}
        initials={initialsOf(name)}
        accessibilityLabel=""
        fallbackBackgroundColor={palette.bannerBg}
        fallbackIconColor={palette.primary}
      />
      <View className="min-w-0 flex-1">
        {nameSlot ?? (
          <Text numberOfLines={2} className={`font-semibold text-ink ${large ? "text-[15px]" : "text-[13.5px]"}`}>
            {name}
          </Text>
        )}
        <Text numberOfLines={1} className="text-[12px] font-normal text-text2">
          {detail}
        </Text>
      </View>
    </View>
  );
};

export default UserIdentity;
