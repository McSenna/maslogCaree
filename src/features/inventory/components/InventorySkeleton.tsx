import { View } from "react-native";
import MobileCardSkeleton from "./skeleton/MobileCardSkeleton";

export { DetailsSkeleton } from "./skeleton/DetailsSkeleton";

type InventorySkeletonProps = {
  count?: number;
  dense?: boolean;
};

/** Phone placeholders shaped like item cards; the desktop table draws its own skeleton rows. */
const InventorySkeleton = ({ count = 8, dense = false }: InventorySkeletonProps) => (
  <View className="w-full gap-2.5">
    {Array.from({ length: count }).map((_, index) => (
      <MobileCardSkeleton key={index} dense={dense} />
    ))}
  </View>
);

export default InventorySkeleton;
