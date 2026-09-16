import { Pressable, Text, View } from "react-native";

const FormActions = ({
  isSubmitting,
  onDiscard,
  onSave,
}: {
  isSubmitting: boolean;
  onDiscard?: () => void;
  onSave: () => void;
}) => (
  <View className="mt-2 flex-row gap-3">
    <Pressable
      onPress={onDiscard}
      className="flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white py-3"
    >
      <Text className="text-sm font-semibold text-slate-700">Discard</Text>
    </Pressable>

    <Pressable
      onPress={onSave}
      disabled={isSubmitting}
      className="flex-1 items-center justify-center rounded-2xl bg-mc-primary py-3 shadow-md shadow-mc-primary/30"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed || isSubmitting ? 0.8 : 1,
      })}
    >
      <Text className="text-sm font-semibold text-white">{isSubmitting ? "Saving..." : "Save"}</Text>
    </Pressable>
  </View>
);

export default FormActions;
