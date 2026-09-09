import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, type LayoutChangeEvent } from "react-native";
import {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_TYPE,
} from "../config/profileTheme";
import type { ProfileData } from "../utils/profileData";
import EditProfileButton from "./EditProfileButton";
import ProfileHeroDecor from "./ProfileHeroDecor";
import ProfilePhoto from "./ProfilePhoto";
import RoleBadge from "./RoleBadge";

type ProfileHeroProps = {
  profile: ProfileData;
  /** "wide" is the web modal hero; "compact" is the mobile screen hero. */
  variant: "wide" | "compact";
  onEditProfile?: () => void;
  onChangePhoto?: () => void;
};

/** Portrait size per variant — 96 keeps the mobile card balanced (§2). */
const PHOTO_SIZE = { wide: 128, compact: 96 } as const;

function ContactItem({
  icon,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 7, minWidth: 0 }}>
      <Feather name={icon} size={15} color={PROFILE_COLORS.primary} />
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={{
          fontSize: PROFILE_TYPE.label,
          fontWeight: "500",
          color: PROFILE_COLORS.body,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * The profile hero card: photo, name, role badge, identifier and — on the web
 * modal — the contact line.
 *
 * The two variants share this component so the platforms cannot drift, but they
 * arrange differently. The mobile hero is identity only: editing is reached
 * from the Personal Information card's Edit control and from the camera badge
 * on the portrait, so a third entry point here only crowded a ~315px card.
 */
const ProfileHero = ({
  profile,
  variant,
  onEditProfile,
  onChangePhoto,
}: ProfileHeroProps) => {
  const isWide = variant === "wide";
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  };

  const photo = (
    <ProfilePhoto
      size={PHOTO_SIZE[variant]}
      imageUrl={profile.avatarUrl}
      initials={profile.initials}
      name={profile.name}
      shape={isWide ? "rounded" : "circle"}
      onChangePhoto={onChangePhoto}
    />
  );

  const surface = {
    borderRadius: PROFILE_RADIUS.hero,
    backgroundColor: "#F1F7FE",
    borderWidth: 1,
    borderColor: "#DCEAFB",
    overflow: "hidden",
  } as const;

  // ── Mobile ──────────────────────────────────────────────────────────
  if (!isWide) {
    return (
      <View onLayout={handleLayout} style={surface}>
        {size.width > 0 ? (
          // Half width, anchored right: the leaf and hills stay clear of the
          // identity column instead of sitting behind the name.
          <ProfileHeroDecor width={size.width * 0.5} height={size.height} />
        ) : null}

        <View style={{ padding: 18, gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            {photo}

            <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: PROFILE_COLORS.subtle,
                }}
              >
                {profile.role.title}
              </Text>

              <Text
                numberOfLines={2}
                maxFontSizeMultiplier={1.2}
                accessibilityRole="header"
                style={{
                  fontSize: PROFILE_TYPE.nameCompact,
                  lineHeight: 27,
                  fontWeight: "800",
                  letterSpacing: -0.4,
                  color: PROFILE_COLORS.navy,
                }}
              >
                {profile.name}
              </Text>

              <RoleBadge label={profile.role.label} style={profile.role.badge} compact />

              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
                style={{
                  fontSize: 13.5,
                  fontWeight: "500",
                  color: PROFILE_COLORS.muted,
                }}
              >
                {profile.displayId}
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={2}
            maxFontSizeMultiplier={1.2}
            style={{
              fontSize: PROFILE_TYPE.meta,
              lineHeight: 18,
              fontStyle: "italic",
              color: PROFILE_COLORS.muted,
            }}
          >
            “{profile.role.tagline}”
          </Text>
        </View>
      </View>
    );
  }

  // ── Web modal ───────────────────────────────────────────────────────
  return (
    <View onLayout={handleLayout} style={surface}>
      {size.width > 0 ? (
        <ProfileHeroDecor width={size.width} height={size.height} />
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 22,
          padding: 22,
        }}
      >
        {photo}

        <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
              <Text
                numberOfLines={2}
                maxFontSizeMultiplier={1.2}
                accessibilityRole="header"
                style={{
                  fontSize: PROFILE_TYPE.name,
                  fontWeight: "800",
                  letterSpacing: -0.5,
                  color: PROFILE_COLORS.navy,
                }}
              >
                {profile.name}
              </Text>

              <RoleBadge label={profile.role.label} style={profile.role.badge} />

              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
                style={{
                  fontSize: PROFILE_TYPE.label,
                  fontWeight: "500",
                  color: PROFILE_COLORS.muted,
                }}
              >
                {`${profile.role.idLabel}: ${profile.displayId}`}
              </Text>
            </View>

            <EditProfileButton onPress={onEditProfile} />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 18,
              marginTop: 4,
            }}
          >
            {profile.address ? <ContactItem icon="map-pin" value={profile.address} /> : null}
            {profile.phone ? <ContactItem icon="phone" value={profile.phone} /> : null}
            {profile.email ? <ContactItem icon="mail" value={profile.email} /> : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileHero;
