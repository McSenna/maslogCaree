import { Pressable, Text, View } from "react-native";

const FormActions = ({
  isSubmitting,
  canSave = true,
  onDiscard,
  onSave,
}: {
  isSubmitting: boolean;
  canSave?: boolean;
  onDiscard?: () => void;
  onSave: () => void;
}) => {
  const saveDisabled = isSubmitting || !canSave;

  return (
    <View className="mt-2 flex-row gap-3">
      <Pressable
        onPress={onDiscard}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        className="flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white py-3"
        style={{ opacity: isSubmitting ? 0.6 : 1 }}
      >
        <Text className="text-sm font-semibold text-slate-700">Cancel</Text>
      </Pressable>

      <Pressable
        onPress={onSave}
        disabled={saveDisabled}
        accessibilityRole="button"
        accessibilityLabel="Save changes"
        className="flex-1 items-center justify-center rounded-2xl bg-mc-primary py-3 shadow-md shadow-mc-primary/30"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: saveDisabled ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Text className="text-sm font-semibold text-white">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>
    </View>
  );
};

export default FormActions;
