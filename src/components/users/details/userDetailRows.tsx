import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AdminUser } from "@/services/userService";
import { formatDate, formatDateTime } from "@/utils/dateFormatter";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

/**
 * A record the account does not carry.
 *
 * Written out rather than left blank or dashed: an administrator deciding
 * whether they can reach this person needs "we never collected it" to look
 * different from "the field failed to load".
 */
export const NOT_PROVIDED = "Not provided";

export type DetailRow = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
};

/** How to reach this person. */
export function buildPersonalRows(user: AdminUser): DetailRow[] {
  return [
    { icon: "mail", label: "Email Address", value: user.email || NOT_PROVIDED },
    { icon: "phone", label: "Contact Number", value: user.phone || NOT_PROVIDED },
    { icon: "map-pin", label: "Location / Department", value: user.address || NOT_PROVIDED },
  ];
}

/** When the account was last used, and when it started. */
export function buildAccountRows(user: AdminUser): DetailRow[] {
  const lastLogin = formatDateTime(user.lastLogin);

  return [
    {
      icon: "clock",
      label: "Last Login",
      value: user.lastLogin ? `${lastLogin.date} · ${lastLogin.time}` : "Never logged in",
    },
    { icon: "calendar", label: "Date Joined", value: formatDate(user.createdAt) },
  ];
}

/**
 * One labelled record, shared by the desktop card and the phone sheet.
 *
 * Both surfaces show the same five readings of the same account, so they read
 * from one component and one set of fallbacks — a phone showing "Not provided"
 * where the desktop shows a dash would be a bug nobody notices for months.
 */
export function InfoRow({
  row,
  divided,
  compact = false,
}: {
  row: DetailRow;
  /** Hairline under the row; the last row in a group drops it. */
  divided: boolean;
  compact?: boolean;
}) {
  const palette = useUserDetailsPalette();
  const well = compact ? 34 : 36;

  return (
    <View
      className={`flex-row items-center gap-3 ${compact ? "py-3" : "py-3.5"}`}
      style={divided ? { borderBottomWidth: 1, borderBottomColor: palette.divider } : undefined}
    >
      <View
        className="items-center justify-center"
        style={{
          height: well,
          width: well,
          borderRadius: DETAIL_RADIUS.well,
          backgroundColor: palette.infoWell,
        }}
      >
        <Feather name={row.icon} size={15} color={palette.infoIcon} />
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[12px]" style={{ color: palette.subtle }}>
          {row.label}
        </Text>
        <Text
          className="mt-0.5 text-[14px] font-semibold"
          numberOfLines={2}
          style={{ color: palette.heading }}
        >
          {row.value}
        </Text>
      </View>
    </View>
  );
}

/** Renders a group of rows, dropping the hairline after the last. */
export function InfoRows({ rows, compact = false }: { rows: DetailRow[]; compact?: boolean }) {
  return (
    <>
      {rows.map((row, index) => (
        <InfoRow
          key={row.label}
          row={row}
          divided={index < rows.length - 1}
          compact={compact}
        />
      ))}
    </>
  );
}
