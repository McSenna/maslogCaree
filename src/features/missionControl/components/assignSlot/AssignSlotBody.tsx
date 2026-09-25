import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import OptionRow from "@/components/forms/OptionRow";
import TextField from "@/components/forms/TextField";
import { Skeleton } from "@/components/ui/Skeleton";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ConsultationCategory } from "@/services/appointments";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

import { formatSlotLabel } from "../../utils/slotLabels";

export type AssignSlotBodyProps = {
  categories: ConsultationCategory[];
  categoryKey: string;
  onCategoryChange: (categoryKey: string) => void;
  duration: string;
  onDurationChange: (duration: string) => void;
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  loadingSlots: boolean;
  onLoadSlots: () => void;
};

const allowsCustomDuration = (categories: ConsultationCategory[], categoryKey: string): boolean => {
  const category = categories.find((entry) => entry.key === categoryKey);
  return category?.durationMinutesMin != null || categoryKey === "general_checkup" || categoryKey === "consultation";
};

const SectionLabel = ({ children }: { children: string }) => {
  const colors = useThemeColors();
  return <Text style={[TYPE.label, { color: colors.body }]}>{children}</Text>;
};

const AssignSlotBody = (props: AssignSlotBodyProps) => {
  const colors = useThemeColors();
  const { categories, categoryKey, slots, selectedSlot, loadingSlots } = props;

  return (
    <View style={{ gap: SPACING.lg }}>
      <View style={{ gap: SPACING.sm }} accessibilityRole="radiogroup">
        <SectionLabel>Category for slot</SectionLabel>
        {categories.map((category) => (
          <OptionRow
            key={category.key}
            label={category.label}
            selected={categoryKey === category.key}
            onPress={() => props.onCategoryChange(category.key)}
          />
        ))}
      </View>

      {allowsCustomDuration(categories, categoryKey) ? (
        <TextField
          label="Duration (minutes)"
          helper="Must be within the category's allowed range."
          value={props.duration}
          onChangeText={props.onDurationChange}
          keyboardType="number-pad"
          placeholder="e.g. 20"
        />
      ) : null}

      <Button
        variant="secondary"
        icon="refresh-cw"
        label={slots.length ? "Refresh available slots" : "Load available slots"}
        loadingLabel="Loading slots…"
        loading={loadingSlots}
        fullWidth
        onPress={props.onLoadSlots}
      />

      <View style={{ gap: SPACING.sm }} accessibilityRole="radiogroup">
        <SectionLabel>Start time</SectionLabel>
        {loadingSlots && !slots.length ? (
          [0, 1, 2].map((key) => <Skeleton key={key} className="h-11 w-full rounded-xl" />)
        ) : slots.length === 0 ? (
          <Text style={[TYPE.body, { color: colors.muted }]}>Load the available slots to pick a start time.</Text>
        ) : (
          slots.map((slot) => (
            <OptionRow
              key={slot}
              label={formatSlotLabel(slot)}
              selected={selectedSlot === slot}
              onPress={() => props.onSelectSlot(slot)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default AssignSlotBody;
