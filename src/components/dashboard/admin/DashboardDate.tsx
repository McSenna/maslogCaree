import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

/** Today's date, right-aligned above the dashboard content (e.g. "Wednesday, September 23, 2026"). */
const DashboardDate = ({ palette }: { palette: AdminDashboardPalette }) => {
  const today = new Date().toLocaleDateString(undefined, DATE_OPTS);

  return (
    <View className="items-end">
      <Text className="text-right text-[13px] font-semibold" style={{ color: palette.body }}>
        {today}
      </Text>
    </View>
  );
};

export default DashboardDate;
