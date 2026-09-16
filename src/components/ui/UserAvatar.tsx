import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, type ImageStyle, type StyleProp, Text, View } from "react-native";

export type UserAvatarProps = {
  size?: number;
  imageUrl?: string | null;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
  fallbackBackgroundColor?: string;
  fallbackIconColor?: string;
  initials?: string;
};

export const initialsFrom = (name: string | null | undefined): string => {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
};

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return null;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const UserAvatar = ({
  size = 36,
  imageUrl,
  accessibilityLabel = "User avatar",
  style,
  fallbackBackgroundColor,
  fallbackIconColor = "rgba(255,255,255,0.95)",
  initials,
}: UserAvatarProps) => {
  const uri = useMemo(() => normalizeImageUrl(imageUrl), [imageUrl]);
  const [hasError, setHasError] = useState(false);
  const radius = size / 2;

  const showFallback = !uri || hasError;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className="items-center justify-center overflow-hidden rounded-full bg-white/15"
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        fallbackBackgroundColor ? { backgroundColor: fallbackBackgroundColor } : null,
      ]}
    >
      {showFallback ? (
        initials ? (
          <Text
            allowFontScaling={false}
            style={{ color: fallbackIconColor, fontSize: size * 0.36, fontWeight: "700" }}
          >
            {initials}
          </Text>
        ) : (
          <Feather name="user" size={size * 0.48} color={fallbackIconColor} />
        )
      ) : (
        <Image
          source={{ uri }}
          onError={() => setHasError(true)}
          resizeMode="cover"
          style={[
            {
              width: size,
              height: size,
              borderRadius: radius,
            },
            style,
          ]}
        />
      )}
    </View>
  );
};

export default UserAvatar;
