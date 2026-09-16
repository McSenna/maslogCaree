import { View } from "react-native";
import { useInventoryPalette } from "../inventoryTheme";

const Bar = ({ width, height = 10 }: { width: number | `${number}%`; height?: number }) => {
  const palette = useInventoryPalette();
  return <View style={{ width, height, borderRadius: 6, backgroundColor: palette.skeleton }} />;
};

export default Bar;
