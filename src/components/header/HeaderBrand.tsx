import { Pressable, Text, View } from "react-native";
import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import { getHeaderPalette, HEADER_FONT } from "./headerTokens";

type HeaderBrandProps = {
  compact: boolean;
  isDark: boolean;
  onPress?: () => void;
};

const TAGLINE = "Healthy Communities, Brighter Tomorrow";
const TAGLINE_COMPACT = "Healthy Community, Brighter Tomorrow";

/** Logo + wordmark + tagline, pinned to the left edge of the header. */
const HeaderBrand = ({ compact, isDark, onPress }: HeaderBrandProps) => {
  const palette = getHeaderPalette(isDark);

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: compact ? 9 : 12,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      <MaslogCareLogo size={compact ? 30 : 36} color={palette.brand} />

      <View style={{ flexShrink: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: HEADER_FONT,
            fontSize: compact ? 15.5 : 19,
            lineHeight: compact ? 19 : 23,
            fontWeight: "700",
            letterSpacing: -0.2,
            color: palette.brand,
          }}
        >
          MaslogCare
        </Text>

        <Text
          numberOfLines={1}
          style={{
            fontFamily: HEADER_FONT,
            fontSize: compact ? 9.5 : 11.5,
            lineHeight: compact ? 13 : 15,
            fontWeight: "400",
            color: palette.muted,
          }}
        >
          {compact ? TAGLINE_COMPACT : TAGLINE}
        </Text>
      </View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="MaslogCare home"
      onPress={onPress}
      style={({ pressed }) => ({
        flexShrink: 1,
        minWidth: 0,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {content}
    </Pressable>
  );
};

export default HeaderBrand;
