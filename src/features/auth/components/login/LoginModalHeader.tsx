import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const LoginModalHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <View className="bg-mc-primary px-5 pt-5 pb-5 overflow-hidden">
      <View
        className="absolute -right-10 -top-10 rounded-full bg-white/[0.07]"
        style={{ width: 140, height: 140 }}
      />
      <View
        className="absolute right-8 bottom-0 rounded-full bg-white/[0.05]"
        style={{ width: 70, height: 70 }}
      />

      <View className="flex-row justify-end mb-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close login"
          onPress={onClose}
          className="h-7 w-7 items-center justify-center rounded-full bg-white/[0.15]"
        >
          <Feather name="x" size={13} color="#fff" />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-3 mb-1.5">
        <View className="rounded-[10px] bg-white/[0.15] p-2">
          <Feather name="activity" size={20} color="#fff" />
        </View>
        <View>
          <Text className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
            Maslog Care
          </Text>
          <Text className="text-[18px] font-extrabold leading-tight text-white tracking-tight">
            Welcome Back
          </Text>
        </View>
      </View>
      <Text className="text-[10.5px] text-white/65 leading-relaxed">
        Sign in to access your digital barangay health services.
      </Text>
    </View>
  );
};

export default LoginModalHeader;
