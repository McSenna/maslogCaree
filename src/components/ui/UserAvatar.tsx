import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, type ImageStyle, type StyleProp, View } from "react-native";

export type UserAvatarProps = {
  size?: number;
  imageUrl?: string | null;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
};

function normalizeImageUrl(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function UserAvatar({
  size = 36,
  imageUrl,
  accessibilityLabel = "User avatar",
  style,
}: UserAvatarProps) {
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
      ]}
    >
      {showFallback ? (
        <Feather name="user" size={size * 0.48} color="rgba(255,255,255,0.95)" />
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
}

