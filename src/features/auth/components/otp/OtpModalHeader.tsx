import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = { email: string; onClose: () => void };

const OtpModalHeader = ({ email, onClose }: Props) => {
  return (
    <View className="bg-mc-primary px-5 pt-5 pb-5 overflow-hidden">
      <View
        className="absolute -right-10 -top-10 rounded-full bg-white/10"
        style={{ width: 140, height: 140 }}
      />
      <View
        className="absolute right-6 bottom-0 rounded-full bg-white/[0.07]"
        style={{ width: 70, height: 70 }}
      />
      <View className="flex-row justify-end mb-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close verification"
          onPress={onClose}
          className="h-8 w-8 items-center justify-center rounded-full bg-white/20"
        >
          <Feather name="x" size={16} color="#fff" />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-3 mb-1.5">
        <View className="rounded-[10px] bg-white/20 p-2">
          <Feather name="shield" size={20} color="#fff" />
        </View>
        <View>
          <Text className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
            Email Verification
          </Text>
          <Text className="text-[18px] font-extrabold leading-tight text-white tracking-tight">
            Enter verification code
          </Text>
        </View>
      </View>
      <Text className="text-[10.5px] text-white/70 leading-relaxed">
        We sent a 6-digit code to{" "}
        <Text className="font-semibold text-white/90">{email}</Text>.{"\n"}
        Enter it below to activate your account.
      </Text>
    </View>
  );
};

export default OtpModalHeader;
