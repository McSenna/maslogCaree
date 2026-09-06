import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type RegisterModalProps = {
  visible?: boolean;
  onClose?: () => void;
  onSubmit?: (payload: Record<string, unknown>) => void;
  mode?: "resident" | "provider";
};

const RegisterModal = ({
  visible = false,
  onClose,
  onSubmit,
  mode = "resident",
}: RegisterModalProps) => {
  if (!visible) return null;

  const actionLabel = mode === "provider" ? "Create account" : "Register";

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center bg-black/50 p-4" onPress={onClose}>
        <Pressable onPress={() => undefined} className="rounded-3xl bg-white p-5 shadow-lg">
          <Text className="text-2xl font-bold text-slate-900">{actionLabel}</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-600">
            Complete your account details to continue with MaslogCare.
          </Text>

          <ScrollView className="mt-4 max-h-[60%]" showsVerticalScrollIndicator={false}>
            <View className="gap-3">
              <View className="rounded-xl bg-slate-50 p-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account
                </Text>
                <Text className="mt-1 text-sm text-slate-700">Name: Resident / Provider</Text>
                <Text className="text-sm text-slate-700">Email: available after backend sync</Text>
              </View>

              <View className="rounded-xl border border-slate-200 p-3">
                <Text className="text-sm font-semibold text-slate-800">Quick start</Text>
                <Text className="mt-1 text-sm text-slate-600">
                  This modal is a safe fallback while the registration flow is finalized.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="mt-5 flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center rounded-xl border border-slate-300 py-3"
            >
              <Text className="font-medium text-slate-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onSubmit?.({ mode, step: "complete" });
                onClose?.();
              }}
              className="flex-1 items-center rounded-xl bg-mc-primary py-3"
            >
              <Text className="font-semibold text-white">Continue</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RegisterModal;