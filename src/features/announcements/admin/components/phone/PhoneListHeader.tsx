import { Download, Plus } from "lucide-react-native";
import { Text, View } from "react-native";

import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import AudiencePicker from "../ui/AudiencePicker";
import { IconButton, PrimaryButton } from "../ui/Buttons";
import SearchField from "../ui/SearchField";
import StatusTabs from "../ui/StatusTabs";

type PhoneListHeaderProps = {
  screen: AnnouncementsScreenState;
  onExport: () => void;
};

/** Title, actions, tabs and filters: the list's header, so they scroll with the rows. */
const PhoneListHeader = ({ screen, onExport }: PhoneListHeaderProps) => {
  const { view, filters, counts } = screen;
  const showControls = view === "list" || view === "noResults";

  return (
    <View>
      <View className="flex-row flex-wrap items-center justify-between gap-3 px-4 pt-5">
        <Text accessibilityRole="header" className="font-ps-bold text-22 tracking-[-0.2px] text-ink">
          Announcements
        </Text>
        <View className="flex-row items-center gap-1.5">
          <IconButton
            label="Export CSV"
            icon={Download}
            bordered
            color="ink"
            onPress={onExport}
            disabled={view !== "list"}
            accessibilityHint="Shares the announcements shown as a spreadsheet file"
          />
          <PrimaryButton
            label="New"
            icon={Plus}
            onPress={screen.openCreate}
            accessibilityHint="Opens the form to write an announcement"
          />
        </View>
      </View>

      {showControls ? (
        <>
          <StatusTabs value={filters.status} counts={counts} onChange={screen.setStatus} />
          <View className="flex-row gap-2 px-4 py-3">
            <SearchField value={filters.query} onChange={screen.setQuery} />
            <AudiencePicker value={filters.audience} onChange={screen.setAudience} />
          </View>
        </>
      ) : (
        <View className="h-4" />
      )}
    </View>
  );
};

export default PhoneListHeader;
