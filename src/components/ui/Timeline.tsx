import { Text, View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDateTime } from "@/utils/dateFormatter";

const DOT = 8;
const RAIL = 1.5;
const RAIL_OFFSET = DOT / 2 - RAIL / 2;

export type TimelineStep = {
  key: string;
  label: string;
  at: string | null;
  tone?: "done" | "declined";
};

const Timeline = ({
  title,
  steps,
  palette,
  undatedText = "Not recorded",
}: {
  title: string;
  steps: TimelineStep[];
  palette: QueuePalette;
  undatedText?: string;
}) => {
  if (!steps.length) return null;

  return (
    <View className="w-full gap-2">
      <Text
        className="text-[11.5px] font-bold uppercase"
        style={{ color: palette.subtle, letterSpacing: 0.6 }}
      >
        {title}
      </Text>

      <View className="w-full" accessible accessibilityRole="list">
        {steps.map((step, index) => {
          const last = index === steps.length - 1;
          const { date, time } = formatDateTime(step.at);
          const declined = step.tone === "declined";

          const dotColor = declined
            ? palette.statuses.declined.dot
            : last
              ? palette.statuses.completed.dot
              : palette.panelBg;

          return (
            <View key={step.key} className="w-full flex-row gap-3">
              <View className="items-center" style={{ width: DOT }}>
                <View
                  style={{
                    width: DOT,
                    height: DOT,
                    borderRadius: DOT / 2,
                    backgroundColor: dotColor,
                    borderWidth: last || declined ? 0 : RAIL,
                    borderColor: palette.divider,
                  }}
                />
                {last ? null : (
                  <View
                    className="flex-1"
                    style={{
                      width: RAIL,
                      marginLeft: RAIL_OFFSET,
                      marginRight: RAIL_OFFSET,
                      backgroundColor: palette.divider,
                    }}
                  />
                )}
              </View>

              <View className={last ? "min-w-0 flex-1 gap-0.5" : "min-w-0 flex-1 gap-0.5 pb-3.5"}>
                <Text
                  className="text-[12.5px] font-medium"
                  style={{
                    color: declined
                      ? palette.statuses.declined.fg
                      : last
                        ? palette.heading
                        : palette.body,
                  }}
                >
                  {step.label}
                </Text>
                <Text className="text-[11.5px]" style={{ color: palette.subtle }}>
                  {step.at ? (time ? `${date} • ${time}` : date) : undatedText}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Timeline;
