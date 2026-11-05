import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useInteractionState } from "@/hooks/useInteractionState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

type ProfilePhotoProps = {
  size: number;
  radius: number;
  imageUrl?: string | null;
  initials: string;
  name: string;
  onChangePhoto?: () => void;
  changingPhoto?: boolean;
};

const BADGE_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color") });
const BADGE_SIZE = 36;
const BADGE_ICON = 17;
const BADGE_HIT_SLOP = 8;
const BADGE_OVERHANG = -6;

const ProfilePhoto = ({
  size,
  radius,
  imageUrl,
  initials,
  name,
  onChangePhoto,
  changingPhoto = false,
}: ProfilePhotoProps) => {
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);
  const badgeState = useInteractionState({ disabled: changingPhoto });

  const uri = imageUrl?.trim() ? imageUrl.trim() : null;
  const showFallback = !uri || failed;
  const badgeActive = badgeState.hovered || badgeState.pressed;

  return (
    <View style={{ width: size, height: size }}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={showFallback ? `${name}, no photo added` : `${name}'s profile photo`}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {showFallback ? (
          initials ? (
            <Text
              allowFontScaling={false}
              style={{
                fontSize: Math.round(size * 0.34) + 2,
                fontWeight: "700",
                letterSpacing: 0.5,
                color: colors.body,
              }}
            >
              {initials}
            </Text>
          ) : (
            <Feather name="user" size={Math.round(size * 0.42)} color={colors.muted} />
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
          accessibilityLabel={changingPhoto ? "Saving profile photo" : "Change profile photo"}
          aria-busy={changingPhoto}
          // Stays focusable while saving, so keyboard users keep their place.
          onPress={changingPhoto ? undefined : onChangePhoto}
          hitSlop={BADGE_HIT_SLOP}
          style={{
            position: "absolute",
            right: BADGE_OVERHANG,
            bottom: BADGE_OVERHANG,
            width: BADGE_SIZE,
            height: BADGE_SIZE,
            borderRadius: BADGE_SIZE / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: badgeActive ? colors.surfaceHover : colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
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
            <Feather name="camera" size={BADGE_ICON} color={colors.heading} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
};

export default ProfilePhoto;
