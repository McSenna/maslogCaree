import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone?: "info" | "success" | "warning";
};

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: NotificationItem[];
};

const toneColor = {
  info: "#38BDF8",
  success: "#34D399",
  warning: "#FBBF24",
} as const;

export default function NotificationPanel({
  visible,
  onClose,
  title = "Notifications",
  items,
}: NotificationPanelProps) {
  const { classes, resolvedTheme } = useTheme();
  const cardBg =
    resolvedTheme === "dark" ? "bg-slate-900" : "bg-white";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className={`flex-1 justify-end ${classes.overlay}`}
        onPress={onClose}
      >
        <View
          className={`max-h-[70%] rounded-t-3xl border p-4 shadow-2xl md:mx-auto md:max-w-lg md:self-center ${classes.border} ${cardBg}`}
          onStartShouldSetResponder={() => true}
        >
          <View className="mb-3 flex-row items-center justify-between">
            <Text className={`text-lg font-bold ${classes.textPrimary}`}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close notifications"
              onPress={onClose}
              className="rounded-full p-2 active:opacity-70"
            >
              <Feather name="x" size={22} color={resolvedTheme === "dark" ? "#e2e8f0" : "#0f172a"} />
            </Pressable>
          </View>

          <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
            <View className="gap-3 pb-4">
              {items.length === 0 ? (
                <Text className={`py-8 text-center ${classes.textMuted}`}>
                  You&apos;re all caught up.
                </Text>
              ) : (
                items.map((n) => (
                  <View
                    key={n.id}
                    className={["flex-row gap-3 p-3", classes.card].join(" ")}
                  >
                    <View
                      className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          (toneColor[n.tone ?? "info"] ?? toneColor.info) + "22",
                      }}
                    >
                      <Feather
                        name={n.tone === "success" ? "check-circle" : n.tone === "warning" ? "alert-triangle" : "bell"}
                        size={18}
                        color={toneColor[n.tone ?? "info"]}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-sm font-bold ${classes.textPrimary}`}>
                        {n.title}
                      </Text>
                      <Text className={`mt-0.5 text-xs leading-relaxed ${classes.textMuted}`}>
                        {n.body}
                      </Text>
                      <Text className={`mt-2 text-[10px] font-semibold uppercase tracking-wider ${classes.textMuted}`}>
                        {n.time}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
