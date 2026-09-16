import type { ReactNode } from "react";
import { View } from "react-native";
import { CARD, CARD_SHADOW, RESIDENT_COLORS } from "./residentTheme";

type DashboardCardProps = {
  children: ReactNode;
  padded?: boolean;
  className?: string;
};

const DashboardCard = ({ children, padded = true, className = "" }: DashboardCardProps) => (
  <View
    className={`w-full overflow-hidden border ${padded ? "p-4" : ""} ${className}`}
    style={{
      borderRadius: CARD.radius,
      backgroundColor: RESIDENT_COLORS.cardBg,
      borderColor: RESIDENT_COLORS.border,
      ...CARD_SHADOW,
    }}
  >
    {children}
  </View>
);

export default DashboardCard;
