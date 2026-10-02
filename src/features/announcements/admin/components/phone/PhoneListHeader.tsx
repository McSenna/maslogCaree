import { View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { CardTop } from "@/components/dashboard/kit/TableCard";
import SearchField from "@/components/ui/SearchField";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import AudiencePicker from "../ui/AudiencePicker";
import StatusTabs from "../ui/StatusTabs";
import { ANNOUNCEMENTS_SUBTITLE, ANNOUNCEMENTS_TITLE } from "../wide/WideHeader";

type PhoneListHeaderProps = {
  screen: AnnouncementsScreenState;
  onExport: () => void;
};

const SEARCH_FILL = { flex: 1, minWidth: 220 };

/** The dashboard's compact header and controls: the list's header, so they scroll with the rows. */
const PhoneListHeader = ({ screen, onExport }: PhoneListHeaderProps) => {
  const palette = useAdminSurfacePalette();
  const { view, filters, counts } = screen;
  const showControls = view === "list" || view === "noResults";

  return (
    <View className="gap-3 pb-3 pt-4">
      <View className="px-4">
        <DashboardHeader
          palette={palette}
          compact
          title={ANNOUNCEMENTS_TITLE}
          subtitle={ANNOUNCEMENTS_SUBTITLE}
          primaryAction={{ key: "new", label: "New announcement", icon: "edit-2", onPress: screen.openCreate }}
          secondaryActions={
            view === "list"
              ? [{ key: "export", label: "Export CSV", icon: "download", onPress: onExport, showOnPhone: true, accessibilityHint: "Shares the announcements shown as a spreadsheet file" }]
              : []
          }
        />
      </View>

      {showControls ? (
        <>
          <StatusTabs scroll value={filters.status} counts={counts} onChange={screen.setStatus} />
          <View className="flex-row flex-wrap gap-2 px-4">
            <SearchField
              value={filters.query}
              onChangeText={screen.setQuery}
              placeholder="Search title or message"
              accessibilityLabel="Search announcements"
              style={SEARCH_FILL}
            />
            <AudiencePicker value={filters.audience} onChange={screen.setAudience} />
          </View>
        </>
      ) : null}

      <View className="mx-4">
        <CardTop />
      </View>
    </View>
  );
};

export default PhoneListHeader;
