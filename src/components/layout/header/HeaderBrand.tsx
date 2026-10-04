import { Text, View } from "react-native";

import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import { PALETTE, withAlpha } from "@/theme/palette";

type Props = { isMobile: boolean; logoSize: number };

const HeaderBrand = ({ isMobile, logoSize }: Props) => {
  return (
    <View className="flex-row items-center" style={{ flexShrink: 0, gap: 12 }}>
      <View
        style={{
          width: logoSize,
          height: logoSize,
          borderRadius: logoSize / 2,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: `0px 3px 8px ${withAlpha(PALETTE.ink, 0.18)}`,
          elevation: 6,
          borderWidth: 2,
          borderColor: withAlpha(PALETTE.white, 0.3),
        }}
      >
        <MaslogCareLogo size={Math.round(logoSize * 0.82)} />
      </View>

      <View>
        <Text
          style={{
            color: PALETTE.white,
            fontWeight: "600",
            fontSize: isMobile ? 15 : 18,
            letterSpacing: 0.3,
            lineHeight: isMobile ? 22 : 24,
          }}
        >
          MaslogCare
        </Text>
        <Text
          style={{
            color: withAlpha(PALETTE.white, 0.50),
            fontSize: 9,
            fontWeight: "600",
            letterSpacing: 1.8,
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          Barangay 61 Maslog
        </Text>
      </View>
    </View>
  );
};

export default HeaderBrand;
