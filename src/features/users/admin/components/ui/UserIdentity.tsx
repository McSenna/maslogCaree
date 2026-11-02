import { Text, View } from "react-native";

import { useCellSelfAlign } from "@/components/data-table";
import UserAvatar from "@/components/ui/UserAvatar";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { initialsOf } from "../../userAdminModel";

type UserIdentityProps = {
  name: string;
  avatarUrl: string | null;
  /** The line under the name, for a column this width folds in. Left off when there is none. */
  detail?: string;
  /** Replaces the plain name, e.g. with a button that opens the profile. */
  nameSlot?: React.ReactNode;
  large?: boolean;
  /** Table rows keep the name and detail to one line each, with an ellipsis. */
  singleLine?: boolean;
};

/** Avatar, name and detail line, as in the dashboard's user tables. */
const UserIdentity = ({ name, avatarUrl, detail, nameSlot, large, singleLine = false }: UserIdentityProps) => {
  const palette = useAdminSurfacePalette();
  const justifyContent = useCellSelfAlign();
  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-3 self-stretch" style={{ justifyContent }}>
      <UserAvatar
        size={large ? 40 : 32}
        imageUrl={avatarUrl}
        initials={initialsOf(name)}
        accessibilityLabel=""
        fallbackBackgroundColor={palette.bannerBg}
        fallbackIconColor={palette.primary}
      />
      <View className="min-w-0 shrink">
        {nameSlot ?? (
          <Text numberOfLines={singleLine ? 1 : 2} className="font-semibold text-ink" style={{ fontSize: large ? 17 : 15.5 }}>
            {name}
          </Text>
        )}
        {detail ? (
          <Text numberOfLines={singleLine ? 1 : 2} className="text-text2" style={{ fontSize: 14 }}>
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default UserIdentity;
