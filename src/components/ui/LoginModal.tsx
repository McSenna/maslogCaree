import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/data/mockUsers";

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
};

const LoginModal = ({ visible, onClose, onOpenRegister }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success && result.role) {
      onClose();
      router.replace(getDashboardPath(result.role) as any);
    } else {
      Alert.alert("Login Failed", result.error ?? "Invalid credentials. Please try again.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
      >
        <View
          className="w-full max-w-md rounded-3xl bg-white overflow-hidden"
          style={{
            shadowColor: "#3B5BDB",
            shadowOpacity: 0.25,
            shadowRadius: 40,
            shadowOffset: { width: 0, height: 16 },
          }}
        >
          {/* ── Header ── */}
          <View className="bg-mc-primary px-5 pt-5 pb-5 overflow-hidden">
            {/* Decorative circles */}
            <View
              className="absolute -right-10 -top-10 rounded-full bg-white/[0.07]"
              style={{ width: 140, height: 140 }}
            />
            <View
              className="absolute right-8 bottom-0 rounded-full bg-white/[0.05]"
              style={{ width: 70, height: 70 }}
            />

            {/* Close */}
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

            {/* Title row */}
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

          {/* ── Body ── */}
          <View className="px-5 py-5 gap-3.5">
            {/* Email */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Email
              </Text>
              <View
                className="flex-row items-center rounded-xl border px-3"
                style={{
                  borderColor: focusedField === "email" ? "#3B5BDB" : "#E2E8F0",
                  backgroundColor: focusedField === "email" ? "#EEF2FF" : "#F8FAFC",
                  height: 46,
                }}
              >
                <Feather
                  name="user"
                  size={14}
                  color={focusedField === "email" ? "#3B5BDB" : "#94A3B8"}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Password
              </Text>
              <View
                className="flex-row items-center rounded-xl border px-3"
                style={{
                  borderColor: focusedField === "password" ? "#3B5BDB" : "#E2E8F0",
                  backgroundColor: focusedField === "password" ? "#EEF2FF" : "#F8FAFC",
                  height: 46,
                }}
              >
                <Feather
                  name="lock"
                  size={14}
                  color={focusedField === "password" ? "#3B5BDB" : "#94A3B8"}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  onPress={() => setShowPassword((p) => !p)}
                  className="ml-1 h-8 w-8 items-center justify-center"
                >
                  <Feather name={showPassword ? "eye-off" : "eye"} size={14} color="#94A3B8" />
                </Pressable>
              </View>
            </View>

            {/* Links row */}
            <View className="flex-row items-center justify-between -mt-1">
              <Pressable>
                <Text className="text-[10px] font-semibold text-slate-400">Forgot Password?</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onClose();
                  onOpenRegister?.();
                }}
              >
                <Text className="text-[10px] font-bold text-mc-primary">Register Now →</Text>
              </Pressable>
            </View>

            {/* Submit */}
            <Pressable
              className="rounded-xl bg-mc-primary items-center justify-center"
              style={({ pressed }) => ({
                height: 48,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed || isSubmitting ? 0.72 : 1,
                shadowColor: "#3B5BDB",
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 5 },
              })}
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              <View className="flex-row items-center gap-2">
                <Feather name="log-in" size={30} color="#fff" />
                <Text className="text-[20px] font-bold text-white">
                  {isSubmitting ? "Logging In..." : "Login"}
                </Text>
              </View>
            </Pressable>

            {/* Footer note */}
            <View className="flex-row items-center justify-center gap-1.5">
              <Feather name="lock" size={9} color="#CBD5E1" />
              <Text className="text-[9px] text-slate-400">
                Secure login for Barangay Maslog residents
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default LoginModal;