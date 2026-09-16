import type { ReactNode } from "react";
import { View } from "react-native";

const Cell = ({
  children,
  flex,
  width,
  align = "flex-start",
}: {
  children: ReactNode;
  flex?: number;
  width?: number;
  align?: "flex-start" | "center";
}) => (
  <View
    className="justify-center px-3"
    style={{ flex, width, minWidth: 0, alignItems: align === "center" ? "center" : undefined }}
  >
    {children}
  </View>
);

export default Cell;
