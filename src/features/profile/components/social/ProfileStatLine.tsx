import { Fragment } from "react";
import { Text } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TYPE } from "@/theme/typography";
import type { ProfileStat } from "../../types/profile.types";
import { formatCount } from "../../utils/profileHelpers";
import { HEADER_STAT_COUNT, statPhrase } from "../../utils/profileStats";
import Block from "../skeleton/Block";
import { useShimmer } from "../skeleton/useShimmer";

type ProfileStatLineProps = {
  roleLabel: string;
  stats: ProfileStat[];
  loading: boolean;
  unavailable: boolean;
};

/** Facebook-style summary under the name: role, then a few real counts. */
const ProfileStatLine = ({ roleLabel, stats, loading, unavailable }: ProfileStatLineProps) => {
  const colors = useThemeColors();
  const opacity = useShimmer();

  if (loading) {
    return <Block width={220} height={14} opacity={opacity} />;
  }

  const shown = unavailable ? [] : stats.slice(0, HEADER_STAT_COUNT);
  const label = [roleLabel, ...shown.map((stat) => `${stat.value} ${statPhrase(stat)}`)].join(", ");

  return (
    <Text
      accessibilityLabel={label}
      maxFontSizeMultiplier={1.3}
      style={{ ...TYPE.body, color: colors.muted }}
    >
      <Text style={{ fontWeight: TYPE.bodyStrong.fontWeight, color: colors.body }}>{roleLabel}</Text>
      {shown.map((stat) => (
        <Fragment key={stat.key}>
          {"  ·  "}
          <Text style={{ fontWeight: TYPE.bodyStrong.fontWeight, color: colors.heading }}>
            {formatCount(stat.value)}
          </Text>
          {`\u00A0${statPhrase(stat).replace(/ /g, "\u00A0")}`}
        </Fragment>
      ))}
      {unavailable ? "  ·  Appointment counts are unavailable right now" : null}
    </Text>
  );
};

export default ProfileStatLine;
