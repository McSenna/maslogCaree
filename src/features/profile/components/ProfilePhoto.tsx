import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

type ProfilePhotoProps = {
  size: number;
  imageUrl?: string | null;
  initials: string;
  name: string;
  shape?: "circle" | "rounded";
  onChangePhoto?: () => void;
  changingPhoto?: boolean;
};

const BADGE_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });

const ProfilePhoto = ({
  size,
  imageUrl,
  initials,
  name,
  shape = "circle",
  onChangePhoto,
  changingPhoto = false,
}: ProfilePhotoProps) => {
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);
  const badgeState = useInteractionState({ disabled: changingPhoto });

  const uri = imageUrl?.trim() ? imageUrl.trim() : null;
  const showFallback = !uri || failed;
  const radius = shape === "circle" ? size / 2 : Math.round(size * 0.22);
  const ring = size >= 120 ? 4 : 3;
  const badge = Math.min(40, Math.max(32, Math.round(size * 0.26)));
  const badgeActive = badgeState.hovered || badgeState.pressed;

  return (
    <View style={{ width: size, height: size }}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`${name}'s profile photo`}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          borderWidth: ring,
          borderColor: colors.surface,
        }}
      >
        {showFallback ? (
          initials ? (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: Math.round(size * 0.34),
                fontWeight: "700",
                letterSpacing: 0.5,
                color: colors.onPrimary,
              }}
            >
              {initials}
            </Text>
          ) : (
            <Feather name="user" size={Math.round(size * 0.42)} color={colors.onPrimary} />
          )
        ) : (
          <Image
            source={{ uri }}
            onError={() => setFailed(true)}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </View>

      {onChangePhoto ? (
        <Pressable
          {...badgeState.handlers}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          accessibilityState={{ disabled: changingPhoto, busy: changingPhoto }}
          onPress={onChangePhoto}
          disabled={changingPhoto}
          hitSlop={8}
          style={{
            position: "absolute",
            right: shape === "circle" ? Math.round(size * 0.02) : -4,
            bottom: shape === "circle" ? Math.round(size * 0.02) : -4,
            width: badge,
            height: badge,
            borderRadius: badge / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: badgeActive ? colors.borderStrong : colors.surfaceMuted,
            borderWidth: 3,
            borderColor: colors.surface,
            opacity: changingPhoto ? 0.6 : 1,
            outlineWidth: badgeState.focused ? 3 : 0,
            outlineColor: colors.focusRing,
            outlineStyle: "solid",
            outlineOffset: 1,
            ...BADGE_WEB,
          }}
        >
          {changingPhoto ? (
            <ActivityIndicator size="small" color={colors.heading} />
          ) : (
            <Feather name="camera" size={Math.round(badge * 0.45)} color={colors.heading} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
};

export default ProfilePhoto;
