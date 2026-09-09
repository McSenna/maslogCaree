import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { PROFILE_COLORS } from "../config/profileTheme";

type ProfilePhotoProps = {
  size: number;
  imageUrl?: string | null;
  initials: string;
  name: string;
  /** Circular by default; a soft-cornered square matches the web hero. */
  shape?: "circle" | "rounded";
  /** Shows the camera affordance when photo updates are available. */
  onChangePhoto?: () => void;
};

/**
 * Profile photo with an initials fallback.
 *
 * A failed load falls back to the same initials as a missing URL, so a broken
 * image can never reach the screen (§46).
 */
const ProfilePhoto = ({
  size,
  imageUrl,
  initials,
  name,
  shape = "circle",
  onChangePhoto,
}: ProfilePhotoProps) => {
  const [failed, setFailed] = useState(false);

  const uri = imageUrl?.trim() ? imageUrl.trim() : null;
  const showFallback = !uri || failed;
  const radius = shape === "circle" ? size / 2 : Math.round(size * 0.22);
  // 32–38px: big enough to hit, small enough not to eat the portrait.
  const badge = Math.min(38, Math.max(32, Math.round(size * 0.3)));

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
          backgroundColor: PROFILE_COLORS.primarySoft,
          borderWidth: 3,
          borderColor: PROFILE_COLORS.surface,
          boxShadow: "0px 4px 14px rgba(37, 99, 235, 0.14)",
          elevation: 4,
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
                color: PROFILE_COLORS.primary,
              }}
            >
              {initials}
            </Text>
          ) : (
            <Feather
              name="user"
              size={Math.round(size * 0.42)}
              color={PROFILE_COLORS.primary}
            />
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
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          onPress={onChangePhoto}
          hitSlop={8}
          className="absolute items-center justify-center active:opacity-85"
          style={{
            right: -2,
            bottom: -2,
            width: badge,
            height: badge,
            borderRadius: badge / 2,
            backgroundColor: PROFILE_COLORS.primary,
            borderWidth: 3,
            borderColor: PROFILE_COLORS.surface,
          }}
        >
          <Feather name="camera" size={Math.round(badge * 0.45)} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </View>
  );
};

export default ProfilePhoto;
