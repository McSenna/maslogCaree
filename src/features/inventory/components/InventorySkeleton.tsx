import { View } from "react-native";
import MobileCardSkeleton from "./skeleton/MobileCardSkeleton";
import TableRowSkeleton from "./skeleton/TableRowSkeleton";

export { DetailsSkeleton } from "./skeleton/DetailsSkeleton";

type InventorySkeletonProps = {
  count?: number;
  isMobile?: boolean;
  dense?: boolean;
};

const InventorySkeleton = ({
  count = 8,
  isMobile = false,
  dense = false,
}: InventorySkeletonProps) => {
  if (isMobile) {
    return (
      <View className="w-full gap-2.5">
        {Array.from({ length: count }).map((_, index) => (
          <MobileCardSkeleton key={index} dense={dense} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <TableRowSkeleton key={index} isLast={index === count - 1} />
      ))}
    </View>
  );
};

export default InventorySkeleton;
