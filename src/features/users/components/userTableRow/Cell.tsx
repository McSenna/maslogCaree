import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

const Cell = ({
  children,
  flex,
  width,
  align = "flex-start",
  style,
}: {
  children: ReactNode;
  flex?: number;
  width?: number;
  align?: "flex-start" | "center";
  style?: StyleProp<ViewStyle>;
}) => (
  <View
    className="justify-center px-3"
    style={[{ flex, width, minWidth: 0, alignItems: align === "center" ? "center" : undefined }, style]}
  >
    {children}
  </View>
);

export default Cell;
