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
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardPath } from "../../data/mockUsers";

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
};

export default function LoginModal({ visible, onClose, onOpenRegister }: LoginModalProps) {
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
      >
        <View className="w-full max-w-md rounded-3xl bg-white overflow-hidden shadow-2xl"
          style={{ shadowColor: "#2D5BFF", shadowOpacity: 0.2, shadowRadius: 32, shadowOffset: { width: 0, height: 12 } }}
        >
          <View className="bg-mc-primary px-6 pt-6 pb-7">
            <View
              className="absolute -right-8 -top-8 rounded-full bg-white/5"
              style={{ width: 120, height: 120 }}
            />
            <View
              className="absolute right-12 bottom-0 rounded-full bg-white/5"
              style={{ width: 60, height: 60 }}
            />

            <View className="flex-row justify-end mb-4">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close login"
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-white/20"
              >
                <Feather name="x" size={15} color="#fff" />
              </Pressable>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="rounded-2xl bg-white/20 p-2.5">
                <Feather name="activity" size={22} color="#fff" />
              </View>
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  MASLOG CARE
                </Text>
                <Text className="text-xl font-extrabold text-white leading-tight">
                  Welcome Back
                </Text>
              </View>
            </View>
            <Text className="mt-2 text-sm text-white/60">
              Sign in to access your health services.
            </Text>
          </View>

          <View className="px-6 py-6 gap-4">
            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Username
              </Text>
              <View
                className="flex-row items-center rounded-2xl border px-3.5"
                style={{
                  borderColor: focusedField === "email" ? "#2D5BFF" : "#E2E8F0",
                  backgroundColor: focusedField === "email" ? "#EFF6FF" : "#F8FAFC",
                }}
              >
                <Feather
                  name="user"
                  size={15}
                  color={focusedField === "email" ? "#2D5BFF" : "#94A3B8"}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your username"
                  autoCapitalize="none"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
              </View>
            </View>

            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Password
              </Text>
              <View
                className="flex-row items-center rounded-2xl border px-3.5"
                style={{
                  borderColor: focusedField === "password" ? "#2D5BFF" : "#E2E8F0",
                  backgroundColor: focusedField === "password" ? "#EFF6FF" : "#F8FAFC",
                }}
              >
                <Feather
                  name="lock"
                  size={15}
                  color={focusedField === "password" ? "#2D5BFF" : "#94A3B8"}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="ml-1 h-8 w-8 items-center justify-center"
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={15}
                    color="#94A3B8"
                  />
                </Pressable>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Pressable>
                <Text className="text-xs font-semibold text-slate-400">
                  Forgot Password?
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onClose();
                  onOpenRegister?.();
                }}
              >
                <Text className="text-xs font-bold text-mc-primary">
                  Register Now →
                </Text>
              </Pressable>
            </View>

            <Pressable
              className="mt-1 rounded-2xl bg-mc-primary py-3.5 shadow-md"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed || isSubmitting ? 0.7 : 1,
                shadowColor: "#2D5BFF",
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              })}
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Feather name="log-in" size={16} color="#fff" />
                <Text className="text-sm font-bold text-white">
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </Pressable>

            <View className="flex-row items-center justify-center gap-1.5 pt-1">
              <Feather name="lock" size={10} color="#CBD5E1" />
              <Text className="text-[10px] text-slate-400">
                Secure login for Barangay Maslog residents
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}