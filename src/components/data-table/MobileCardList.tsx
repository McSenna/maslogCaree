import { View } from "react-native";

import CardSkeletons from "./CardSkeletons";
import { cardStyles } from "./cardStyles";
import MobileCard from "./MobileCard";
import { TablePlacementContext } from "./TablePlacement";
import type { DataTableProps } from "./types";

type MobileCardListProps<T> = Pick<
  DataTableProps<T>,
  | "columns"
  | "data"
  | "rowKey"
  | "caption"
  | "renderMobileCard"
  | "onRowPress"
  | "rowPressMode"
  | "rowLabel"
  | "rowHint"
  | "isRowSelected"
> & { plain: boolean; loading: boolean };

/** Phones: each record as a stacked card. Buttons inside grow to full-width 44px targets. */
const MobileCardList = <T,>({
  columns,
  data,
  rowKey,
  caption,
  renderMobileCard,
  onRowPress,
  rowPressMode,
  rowLabel,
  rowHint,
  isRowSelected,
  plain,
  loading,
}: MobileCardListProps<T>) => {
  if (loading) return <CardSkeletons caption={caption} plain={plain} />;

  return (
    <TablePlacementContext.Provider value="card">
      <View role="list" accessibilityLabel={caption} style={plain ? null : cardStyles.list}>
        {data.map((row, index) => (
          <MobileCard
            key={rowKey(row)}
            columns={columns}
            renderMobileCard={renderMobileCard}
            rowPressMode={rowPressMode}
            rowHint={rowHint}
            row={row}
            index={index}
            plain={plain}
            first={index === 0}
            selected={isRowSelected?.(row) ?? false}
            label={rowLabel?.(row)}
            onPress={onRowPress ? () => onRowPress(row) : undefined}
          />
        ))}
      </View>
    </TablePlacementContext.Provider>
  );
};

export default MobileCardList;
