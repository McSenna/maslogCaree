import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  formatRelativeTime,
  formatSystemLogActionLabel,
  formatSystemLogDateTime,
  type SystemLog,
} from "@/services/systemLogService";
import { useSystemLogsPalette } from "./systemLogsTheme";

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  children: React.ReactNode;
}) {
  const palette = useSystemLogsPalette();

  return (
    <View className="flex-row items-start gap-3 py-2.5">
      <View
        className="mt-0.5 h-7 w-7 items-center justify-center rounded-lg"
        style={{ backgroundColor: palette.iconWell }}
      >
        <Feather name={icon} size={13} color={palette.muted} />
      </View>
      <View className="flex-1">
        <Text className="text-[11px] font-medium uppercase tracking-wide" style={{ color: palette.muted }}>
          {label}
        </Text>
        <View className="mt-0.5">{children}</View>
      </View>
    </View>
  );
}

function RowText({
  children,
  muted = false,
  mono = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
  mono?: boolean;
}) {
  const palette = useSystemLogsPalette();
  return (
    <Text
      className={`font-medium ${mono ? "text-[13px]" : "text-sm"}`}
      style={{ color: muted ? palette.muted : palette.heading, ...(mono ? { fontFamily: "monospace" } : null) }}
    >
      {children}
    </Text>
  );
}

/**
 * The field list shared by the desktop Log Details panel and the mobile
 * bottom sheet — same information, same order, so the two surfaces never
 * drift apart.
 */
export default function LogDetailRows({ log }: { log: SystemLog }) {
  const relative = formatRelativeTime(log.createdAt);

  return (
    <View>
      <DetailRow icon="clock" label="Timestamp">
        <RowText>{formatSystemLogDateTime(log.createdAt)}</RowText>
        {relative ? <RowText muted>({relative})</RowText> : null}
      </DetailRow>

      <DetailRow icon="user" label="User">
        <RowText>{log.userName}</RowText>
        {log.userEmail ? <RowText muted>{log.userEmail}</RowText> : null}
      </DetailRow>


      <DetailRow icon="monitor" label="Device / Browser">
        <RowText>{log.device}</RowText>
        <RowText muted>{log.browser}</RowText>
      </DetailRow>


      <DetailRow icon="activity" label="Action">
        <RowText>{formatSystemLogActionLabel(log)}</RowText>
      </DetailRow>

      <DetailRow icon="file-text" label="Log Type">
        <RowText>{log.logType}</RowText>
      </DetailRow>

    </View>
  );
}
