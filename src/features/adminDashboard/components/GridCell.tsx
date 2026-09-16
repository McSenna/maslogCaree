import type { ReactNode } from "react";
import { View } from "react-native";

const GridCell = ({
  flex = 1,
  children,
}: {
  flex?: number;
  children: ReactNode;
}) => {
  return <View style={{ flex, minWidth: 0 }}>{children}</View>;
};

export default GridCell;
