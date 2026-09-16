import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

import { PROFILE_RADIUS } from "../config/profileTheme";
import type { ProfileData } from "../utils/profileData";
import ProfilePhoto from "./ProfilePhoto";
import CompactHero from "./hero/CompactHero";
import WideHero from "./hero/WideHero";

type ProfileHeroProps = {
  profile: ProfileData;
  variant: "wide" | "compact";
  onEditProfile?: () => void;
  onChangePhoto?: () => void;
  changingPhoto?: boolean;
};

const PHOTO_SIZE = { wide: 128, compact: 96 } as const;

const ProfileHero = ({
  profile,
  variant,
  onEditProfile,
  onChangePhoto,
  changingPhoto = false,
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
      changingPhoto={changingPhoto}
    />
  );

  const surface = {
    borderRadius: PROFILE_RADIUS.hero,
    backgroundColor: "#F1F7FE",
    borderWidth: 1,
    borderColor: "#DCEAFB",
    overflow: "hidden",
  } as const;

  if (!isWide) {
    return (
      <CompactHero profile={profile} photo={photo} size={size} onLayout={handleLayout} surface={surface} />
    );
  }

  return (
    <WideHero
      profile={profile}
      photo={photo}
      size={size}
      onLayout={handleLayout}
      surface={surface}
      onEditProfile={onEditProfile}
    />
  );
};

export default ProfileHero;
