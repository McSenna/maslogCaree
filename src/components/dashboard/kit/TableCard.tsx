import type { ReactNode } from "react";
import { View } from "react-native";

import { DASHBOARD_RADIUS } from "@/design/adminDashboardTheme";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

const TOP_RADIUS = { borderTopLeftRadius: DASHBOARD_RADIUS.card, borderTopRightRadius: DASHBOARD_RADIUS.card };
const BOTTOM_RADIUS = { borderBottomLeftRadius: DASHBOARD_RADIUS.card, borderBottomRightRadius: DASHBOARD_RADIUS.card };

/**
 * A panel card drawn in pieces, for tables whose rows are FlatList items: the
 * top (heading band), the sides (each row), and the bottom (footer). Same
 * surface, border and 16px radius as PanelCard. The pieces cannot share one
 * shadow, so the border alone draws the edge.
 */
const usePieceStyle = () => {
  const palette = useAdminSurfacePalette();
  return { backgroundColor: palette.cardBg, borderColor: palette.cardBorder };
};

export const CardTop = ({ children }: { children?: ReactNode }) => {
  const surface = usePieceStyle();
  return (
    <View className="border-x border-t px-3 pt-3" style={[surface, TOP_RADIUS]}>
      {children}
    </View>
  );
};

export const CardSide = ({ children }: { children: ReactNode }) => (
  <View className="border-x px-3" style={usePieceStyle()}>
    {children}
  </View>
);

export const CardBottom = ({ children }: { children?: ReactNode }) => {
  const surface = usePieceStyle();
  return (
    <View className="border-x border-b px-3 pb-3" style={[surface, BOTTOM_RADIUS]}>
      {children}
    </View>
  );
};
