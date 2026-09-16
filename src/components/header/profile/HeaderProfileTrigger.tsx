import { Feather } from "@expo/vector-icons";
import type { RefObject } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import UserAvatar from "@/components/ui/UserAvatar";
import type { CurrentUser } from "@/contexts/AuthContext";

import { HEADER_FONT, getHeaderPalette } from "../headerTokens";

type Props = {
  anchorRef: RefObject<View | null>;
  user: CurrentUser | null;
  identityLabel: string;
  roleLabel: string;
  compact: boolean;
  isDark: boolean;
  showIdentity: boolean;
  showDetails: boolean;
  open: boolean;
  rotate: Animated.AnimatedInterpolation<string | number>;
  onPress: () => void;
};

const HeaderProfileTrigger = ({
  anchorRef,
  user,
  identityLabel,
  roleLabel,
  compact,
  isDark,
  showIdentity,
  showDetails,
  open,
  rotate,
  onPress,
}: Props) => {
  const palette = getHeaderPalette(isDark);
  const avatarSize = compact ? 32 : 40;

  return (
    <Pressable
      ref={anchorRef}
      accessibilityRole="button"
      accessibilityLabel={user ? `Open profile menu for ${user.name}` : "Open profile"}
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: compact ? 0 : 10,
        borderRadius: 999,
        paddingLeft: 0,
        paddingRight: showDetails ? 4 : 0,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          borderWidth: 1,
          borderColor: palette.avatarRing,
          overflow: "hidden",
        }}
      >
        <UserAvatar
          size={avatarSize - 2}
          imageUrl={user?.avatarUrl ?? null}
          accessibilityLabel="Profile photo"
          fallbackBackgroundColor={palette.avatarFallbackBg}
          fallbackIconColor={palette.avatarFallbackIcon}
        />
      </View>

      {showIdentity && (
        <View style={{ maxWidth: 180, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: HEADER_FONT,
              fontSize: 14.5,
              lineHeight: 18,
              fontWeight: "600",
              color: palette.title,
            }}
          >
            {identityLabel}
          </Text>

          {showDetails && !!roleLabel && (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: HEADER_FONT,
                fontSize: 12,
                lineHeight: 15,
                fontWeight: "400",
                color: palette.muted,
                marginTop: 1,
              }}
            >
              {roleLabel}
            </Text>
          )}
        </View>
      )}

      {showIdentity && (
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Feather name="chevron-down" size={18} color={palette.muted} />
        </Animated.View>
      )}
    </Pressable>
  );
};

export default HeaderProfileTrigger;
