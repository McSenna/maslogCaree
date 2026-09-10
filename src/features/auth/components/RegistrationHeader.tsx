import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type RegistrationHeaderProps = {
  /** Omitted when the form is not dismissible, which hides the close control. */
  onBackPress?: () => void;
};

/** The sticky brand bar above the sign-up form. */
export default function RegistrationHeader({ onBackPress }: RegistrationHeaderProps) {
  return (
    <View
      className="bg-mc-primary z-10"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", elevation: 5 }}
    >
      <View className="px-5 pt-12 pb-4 overflow-hidden">
        <View
          className="absolute -right-10 -top-10 rounded-full bg-white/[0.07]"
          style={{ width: 150, height: 150 }}
        />
        <View
          className="absolute right-6 bottom-0 rounded-full bg-white/[0.05]"
          style={{ width: 75, height: 75 }}
        />

        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-3">
            <View className="rounded-[10px] bg-white/[0.15] p-2">
              <Feather name="user-plus" size={20} color="#fff" />
            </View>
            <View>
              <Text className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
                Maslog Care
              </Text>
              <Text className="text-[18px] font-extrabold leading-tight text-white tracking-tight">
                Create account
              </Text>
            </View>
          </View>

          {onBackPress && (
            <Pressable
              onPress={onBackPress}
              accessibilityRole="button"
              accessibilityLabel="Close registration"
              className="h-8 w-8 items-center justify-center rounded-full bg-white/[0.15]"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={16} color="#fff" />
            </Pressable>
          )}
        </View>

        <Text className="text-[10.5px] text-white/65 leading-relaxed max-w-[90%]">
          Register as a Barangay Maslog resident
        </Text>
      </View>
    </View>
  );
}
