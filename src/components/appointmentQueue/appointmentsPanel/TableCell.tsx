import type { ReactNode } from "react";
import { View } from "react-native";

const TableCell = ({
  children,
  flex,
  width,
}: {
  children: ReactNode;
  flex?: number;
  width?: number;
}) => {
  return (
    <View className="justify-center px-3" style={{ flex, width, minWidth: 0 }}>
      {children}
    </View>
  );
};

export default TableCell;
