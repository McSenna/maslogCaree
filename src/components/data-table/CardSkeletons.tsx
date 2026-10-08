import { View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import { useThemeColors } from "@/hooks/useThemeColors";

import { cardStyles } from "./cardStyles";
import { SKELETON_ROWS } from "./tableTokens";

/** Phone placeholders in the shape of the cards they stand in for. */
const CardSkeletons = ({ caption, plain }: { caption: string; plain: boolean }) => {
  const colors = useThemeColors();
  const card = plain
    ? cardStyles.plain
    : [cardStyles.card, { borderColor: colors.border, backgroundColor: colors.surface }];

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Loading ${caption.toLowerCase()}`}
      style={plain ? null : cardStyles.list}
    >
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <View key={index} className="gap-2" style={card}>
          <Skeleton className="h-3.5 w-[55%]" />
          <Skeleton className="h-3 w-[35%]" />
          <Skeleton className="h-3 w-[75%]" />
        </View>
      ))}
    </View>
  );
};

export default CardSkeletons;
