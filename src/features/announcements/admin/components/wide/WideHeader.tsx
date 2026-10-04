import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { CardTop } from "@/components/dashboard/kit/TableCard";
import { HeadingCell, TableHeadings } from "@/components/dashboard/kit/TableHeadings";
import SearchField from "@/components/ui/SearchField";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import AudiencePicker from "../ui/AudiencePicker";
import StatusTabs from "../ui/StatusTabs";
import { COLUMN, TOOLBAR_ONE_ROW_WIDTH, type TableMode } from "./tableColumns";

type WideHeaderProps = {
  screen: AnnouncementsScreenState;
  mode: TableMode;
  width: number;
  onExport: () => void;
};

export const ANNOUNCEMENTS_TITLE = "Announcements";
export const ANNOUNCEMENTS_SUBTITLE = "Notices shown to patients and health staff in the app.";

const SEARCH_WIDTH = { width: 280 };
const SEARCH_FILL = { flex: 1, minWidth: 220 };

const ColumnHeadings = ({ mode }: { mode: TableMode }) => (
  <TableHeadings>
    <HeadingCell label="Title" className={COLUMN.title} />
    <HeadingCell label="Audience" className={COLUMN.audience} />
    <HeadingCell label="Status" className={COLUMN.status} />
    {mode === "full" ? <HeadingCell label="Posted" className={COLUMN.posted} /> : null}
    {mode === "full" ? <HeadingCell label="Expires" className={COLUMN.expires} /> : null}
    <HeadingCell label="Actions" className={`${COLUMN.actions} text-right`} />
  </TableHeadings>
);

/** The dashboard's page header and toolbar, then the top of the table card. */
const WideHeader = ({ screen, mode, width, onExport }: WideHeaderProps) => {
  const palette = useAdminSurfacePalette();
  const { view, filters, counts } = screen;
  const showControls = view === "list" || view === "noResults";
  const oneRow = width >= TOOLBAR_ONE_ROW_WIDTH;

  return (
    <View className="gap-4">
      <DashboardHeader
        palette={palette}
        compact={false}
        title={ANNOUNCEMENTS_TITLE}
        subtitle={ANNOUNCEMENTS_SUBTITLE}
        primaryAction={{ key: "new", label: "New announcement", icon: "edit-2", onPress: screen.openCreate }}
        secondaryActions={view === "list" ? [{ key: "export", label: "Export CSV", icon: "download", onPress: onExport }] : []}
      />

      {showControls ? (
        <View className={oneRow ? "flex-row items-center justify-between gap-4" : "gap-3"}>
          <StatusTabs value={filters.status} counts={counts} onChange={screen.setStatus} />
          <View className={`flex-row gap-2 ${oneRow ? "" : "w-full"}`}>
            <SearchField
              value={filters.query}
              onChangeText={screen.setQuery}
              placeholder="Search title or message"
              accessibilityLabel="Search announcements"
              style={oneRow ? SEARCH_WIDTH : SEARCH_FILL}
            />
            <AudiencePicker fixed value={filters.audience} onChange={screen.setAudience} />
          </View>
        </View>
      ) : null}

      {/* Empty and error states still sit in the table card, without headings that label nothing. */}
      <CardTop>{view === "list" || view === "loading" ? <ColumnHeadings mode={mode} /> : null}</CardTop>
    </View>
  );
};

export default WideHeader;
