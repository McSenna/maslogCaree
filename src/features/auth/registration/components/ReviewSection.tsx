import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

export type ReviewEntry = { label: string; value: string };

type ReviewSectionProps = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  entries: ReviewEntry[];
  onEdit: () => void;
  editLabel: string;
};

const ReviewRow = ({ label, value }: ReviewEntry) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
    <Text style={{ width: 116, fontSize: 12.5, color: REG_COLORS.muted }}>{label}</Text>
    <Text style={{ flex: 1, fontSize: 13.5, fontWeight: "600", color: REG_COLORS.text }}>
      {value || "—"}
    </Text>
  </View>
);

const ReviewSection = ({ title, icon, entries, onEdit, editLabel }: ReviewSectionProps) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: REG_COLORS.border,
      borderRadius: REG_RADIUS.card,
      backgroundColor: REG_COLORS.surfaceMuted,
      padding: 16,
      gap: 12,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Feather name={icon} size={15} color={REG_COLORS.primary} />
      <Text style={{ flex: 1, fontSize: 13.5, fontWeight: "700", color: REG_COLORS.heading }}>
        {title}
      </Text>
      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={editLabel}
        hitSlop={10}
        style={{ flexDirection: "row", alignItems: "center", gap: 4, padding: 4 }}
      >
        <Feather name="edit-2" size={13} color={REG_COLORS.primary} />
        <Text style={{ fontSize: 13, fontWeight: "600", color: REG_COLORS.primary }}>Edit</Text>
      </Pressable>
    </View>

    <View style={{ gap: 9 }}>
      {entries.map((entry) => (
        <ReviewRow key={entry.label} {...entry} />
      ))}
    </View>
  </View>
);

export default ReviewSection;
