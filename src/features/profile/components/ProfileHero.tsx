import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";

import { PROFILE_RADIUS } from "../config/profileTheme";
import type { ProfileData } from "../utils/profileData";
import ProfilePhoto from "./ProfilePhoto";
import CompactHero from "./hero/CompactHero";
import WideHero from "./hero/WideHero";
import { PALETTE } from "@/theme/palette";

type ProfileHeroProps = {
  profile: ProfileData;
  variant: "wide" | "compact";
  onChangePhoto?: () => void;
  changingPhoto?: boolean;
};

const PHOTO_SIZE = { wide: 128, compact: 96 } as const;

const ProfileHero = ({
  profile,
  variant,
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
    backgroundColor: PALETTE.slate[100],
    borderWidth: 1,
    borderColor: PALETTE.blue[100],
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
    />
  );
};

export default ProfileHero;
