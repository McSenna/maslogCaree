import { ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "../usersTheme";
import type { UserRequestsController } from "../../hooks/useUserRequests";
import UserRequestsEmptyState from "./UserRequestsEmptyState";
import UserRequestsFilters from "./UserRequestsFilters";
import UserRequestsSkeleton from "./UserRequestsSkeleton";
import UserRequestsTable from "./UserRequestsTable";
import { REQUESTS_PAGE_SIZE, REQUESTS_TABLE_MIN_WIDTH } from "./userRequestsColumns";

type UserRequestsTableCardProps = {
  requests: UserRequestsController;
  showStatusFilter?: boolean;
  tableAreaWidth: number;
  onTableAreaWidth: (width: number) => void;
};

const UserRequestsTableCard = ({
  requests,
  showStatusFilter = true,
  tableAreaWidth,
  onTableAreaWidth,
}: UserRequestsTableCardProps) => {
  const palette = useUsersPalette();

  const hasActiveFilters =
    requests.search.trim().length > 0 ||
    requests.idType !== "" ||
    requests.datePreset !== "all";

  const isEmpty = requests.requests.length === 0;

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
        <UserRequestsFilters
          search={requests.search}
          onSearchChange={requests.setSearch}
          status={requests.status}
          onStatusChange={requests.setStatus}
          showStatusFilter={showStatusFilter}
          idType={requests.idType}
          onIdTypeChange={requests.setIdType}
          datePreset={requests.datePreset}
          onDatePresetChange={requests.setDatePreset}
          isDesktop
          resultCount={requests.total}
        />
      </View>

      {requests.loading ? (
        <UserRequestsSkeleton count={6} />
      ) : requests.error || isEmpty ? (
        <UserRequestsEmptyState
          error={requests.error}
          hasActiveFilters={hasActiveFilters}
          status={requests.status}
          onRetry={requests.fetchRequests}
        />
      ) : (
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== tableAreaWidth) onTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(tableAreaWidth, REQUESTS_TABLE_MIN_WIDTH) }}>
              <UserRequestsTable
                requests={requests.requests}
                onReview={requests.openReview}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!requests.loading && !requests.error && requests.total > 0 ? (
        <View
          className="w-full p-4"
          style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
        >
          <Pagination
            page={requests.page}
            totalPages={requests.totalPages}
            total={requests.total}
            pageSize={REQUESTS_PAGE_SIZE}
            isDesktop
            onPageChange={requests.setPage}
            noun="requests"
          />
        </View>
      ) : null}
    </View>
  );
};

export default UserRequestsTableCard;
