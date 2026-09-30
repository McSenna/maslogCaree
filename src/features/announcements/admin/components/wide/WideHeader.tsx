import { Download, Plus } from "lucide-react-native";
import { Text, View } from "react-native";

import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import AudiencePicker from "../ui/AudiencePicker";
import { PrimaryButton, SecondaryButton } from "../ui/Buttons";
import SearchField from "../ui/SearchField";
import StatusTabs from "../ui/StatusTabs";
import { COLUMN, type TableMode } from "./tableColumns";

type WideHeaderProps = {
  screen: AnnouncementsScreenState;
  mode: TableMode;
  onExport: () => void;
};

const HeaderCell = ({ label, className = "" }: { label: string; className?: string }) => (
  <Text className={`font-ps-semibold text-12 text-text2 ${className}`}>{label}</Text>
);

const ColumnHeadings = ({ mode }: { mode: TableMode }) => (
  <View className="mt-5 min-h-10 flex-row items-center gap-6 rounded-t-panel border border-line bg-head px-4 py-2">
    <HeaderCell label="Title" className="min-w-0 flex-1" />
    <HeaderCell label="Audience" className={COLUMN.audience} />
    <HeaderCell label="Status" className={COLUMN.status} />
    {mode === "full" ? <HeaderCell label="Posted" className={COLUMN.posted} /> : null}
    {mode === "full" ? <HeaderCell label="Expires" className={COLUMN.expires} /> : null}
    <HeaderCell label="Actions" className={`${COLUMN.actions} text-right`} />
  </View>
);

/** Page title, actions, the tab and filter toolbar, and the table's column headings. */
const WideHeader = ({ screen, mode, onExport }: WideHeaderProps) => {
  const { view, filters, counts } = screen;
  const showControls = view === "list" || view === "noResults";
  const showHeadings = showControls || view === "loading";

  return (
    <View>
      <View className="flex-row flex-wrap items-start justify-between gap-4">
        <View className="min-w-0 shrink gap-1">
          <Text accessibilityRole="header" className="font-ps-bold text-24 tracking-[-0.2px] text-ink">
            Announcements
          </Text>
          <Text className="font-ps text-14 text-text2">Notices shown to patients and health staff in the app.</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <SecondaryButton compact label="Export CSV" icon={Download} onPress={onExport} disabled={view !== "list"} />
          <PrimaryButton compact label="New announcement" icon={Plus} onPress={screen.openCreate} />
        </View>
      </View>

      {showControls ? (
        // wrap-reverse: when the row is too narrow, the filters move above the
        // tabs, so the tab underline still sits on the toolbar's bottom rule.
        <View className="mt-5 flex-row flex-wrap-reverse items-end justify-between gap-x-6 border-b border-line">
          <StatusTabs wide value={filters.status} counts={counts} onChange={screen.setStatus} />
          <View className="min-w-0 max-w-full shrink flex-row gap-2 pb-2 pt-1">
            <SearchField wide value={filters.query} onChange={screen.setQuery} />
            <AudiencePicker wide value={filters.audience} onChange={screen.setAudience} />
          </View>
        </View>
      ) : null}

      {showHeadings ? (
        <ColumnHeadings mode={mode} />
      ) : (
        // Empty and error states still sit in the table frame, without headings to label nothing.
        <View className="mt-5 rounded-t-panel border-x border-t border-line bg-canvas pt-1" />
      )}
    </View>
  );
};

export default WideHeader;
