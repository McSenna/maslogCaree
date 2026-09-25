import { Children, useState, type ReactNode } from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { gridColumnsFor, snapColumns, type BreakpointValues } from "@/theme/breakpoints";
import { SPACING } from "@/theme/spacing";

type ResponsiveGridProps = {
  children: ReactNode;
  minColumnWidth?: number;
  maxColumns?: number;
  gap?: number;
  initialColumns?: BreakpointValues<number>;
  columnOptions?: readonly number[];
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_INITIAL: BreakpointValues<number> = { mobile: 1, tablet: 2, desktop: 3, wide: 4 };

const ResponsiveGrid = ({
  children,
  minColumnWidth = 240,
  maxColumns = 4,
  gap = SPACING.lg,
  initialColumns = DEFAULT_INITIAL,
  columnOptions,
  style,
}: ResponsiveGridProps) => {
  const { select } = useResponsive();
  const [width, setWidth] = useState<number | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setWidth((current) => (current === next ? current : next));
  };

  const fitted =
    width === null
      ? Math.min(maxColumns, select(initialColumns))
      : gridColumnsFor(width, minColumnWidth, maxColumns, gap);
  const columns = columnOptions ? snapColumns(fitted, columnOptions) : fitted;

  const items = Children.toArray(children);
  const basis = `${100 / columns}%` as const;

  return (
    <View onLayout={onLayout} style={[{ width: "100%", minWidth: 0 }, style]}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -gap / 2, rowGap: gap }}>
        {items.map((child, index) => (
          <View key={index} style={{ width: basis, paddingHorizontal: gap / 2, minWidth: 0 }}>
            {child}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ResponsiveGrid;
