import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, Text, View } from "react-native";

import { LANDING_COLORS } from "@/config/landingAssets";

type LearnMoreHeaderProps = {
  titleId: string;
  onClose: () => void;
  paddingHorizontal: number;
  compact?: boolean;
};

const LearnMoreHeader = ({
  titleId,
  onClose,
  paddingHorizontal,
  compact = false,
}: LearnMoreHeaderProps) => {
  const [active, setActive] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal,
        paddingTop: compact ? 4 : 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: LANDING_COLORS.border,
        backgroundColor: LANDING_COLORS.white,
      }}
    >
      <Text
        nativeID={titleId}
        accessibilityRole="header"
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: compact ? 16.5 : 17.5,
          fontWeight: "800",
          letterSpacing: -0.3,
          color: LANDING_COLORS.navy,
        }}
      >
        About MaslogCare
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close about MaslogCare"
        focusable
        onPress={onClose}
        onHoverIn={() => setActive(true)}
        onHoverOut={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active ? LANDING_COLORS.softBlue : "transparent",
          ...Platform.select({
            web: { cursor: "pointer", transition: "background-color 180ms ease" } as object,
          }),
        }}
      >
        <Feather
          name="x"
          size={20}
          color={active ? LANDING_COLORS.primaryBlue : LANDING_COLORS.mutedText}
        />
      </Pressable>
    </View>
  );
};

export default LearnMoreHeader;
