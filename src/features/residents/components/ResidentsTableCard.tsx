import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "@/features/users/components/usersTheme";
import type { BhwResidentsController } from "../hooks/useBhwResidentsScreen";
import ResidentsSkeletonList from "./ResidentsSkeletonList";
import ResidentsTable from "./ResidentsTable";
import { RESIDENT_PAGE_SIZE, RESIDENTS_TABLE_MIN_WIDTH } from "./residentsLayout";

type ResidentsTableCardProps = {
  controller: BhwResidentsController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

const ResidentsTableCard = ({ controller, toolbar, emptyState }: ResidentsTableCardProps) => {
  const palette = useUsersPalette();
  const { residents } = controller;

  return (
    <View
      className="w-full overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        className="w-full p-4"
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        {toolbar}
      </View>

      {residents.loading ? (
        <ResidentsSkeletonList count={RESIDENT_PAGE_SIZE} />
      ) : residents.error || residents.residents.length === 0 ? (
        emptyState
      ) : (
        <View
          className="w-full"
          style={{ opacity: residents.busy ? 0.55 : 1 }}
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== controller.tableAreaWidth) controller.setTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                width: Math.max(controller.tableAreaWidth, RESIDENTS_TABLE_MIN_WIDTH),
              }}
            >
              <ResidentsTable
                residents={residents.residents}
                selectedResidentId={controller.detailsResidentId}
                onSelectResident={(resident) => controller.openDetails(resident._id)}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!residents.loading && !residents.error && residents.total > 0 ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <Pagination
            page={residents.page}
            totalPages={residents.totalPages}
            total={residents.total}
            pageSize={residents.pageSize}
            isDesktop
            noun="residents"
            onPageChange={residents.setPage}
          />
        </View>
      ) : null}
    </View>
  );
};

export default ResidentsTableCard;
