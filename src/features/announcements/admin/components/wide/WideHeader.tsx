import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import SearchField from "@/components/ui/SearchField";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import AudiencePicker from "../ui/AudiencePicker";
import StatusTabs from "../ui/StatusTabs";
import { TOOLBAR_ONE_ROW_WIDTH } from "./tableColumns";

type WideHeaderProps = {
  screen: AnnouncementsScreenState;
  width: number;
  onExport: () => void;
};

export const ANNOUNCEMENTS_TITLE = "Announcements";
export const ANNOUNCEMENTS_SUBTITLE = "Notices shown to patients and health staff in the app.";

const SEARCH_WIDTH = { width: 280 };
const SEARCH_FILL = { flex: 1, minWidth: 220 };

/** The dashboard's page header and the toolbar above the announcements table. */
const WideHeader = ({ screen, width, onExport }: WideHeaderProps) => {
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

    </View>
  );
};

export default WideHeader;
