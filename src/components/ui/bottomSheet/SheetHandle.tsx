import { View } from "react-native";

type SheetHandleProps = {
  color: string;
};

const SheetHandle = ({ color }: SheetHandleProps) => (
  <View className="w-full items-center pb-1 pt-2.5">
    <View
      accessible
      accessibilityLabel="Drag down to close"
      style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: color }}
    />
  </View>
);

export default SheetHandle;
