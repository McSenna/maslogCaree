import { Feather } from "@expo/vector-icons";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from "react-native";

import PlatformAccessModal from "@/features/auth/components/PlatformAccessModal";
import ForgotPasswordFlow from "@/features/auth/forgotPassword/ForgotPasswordFlow";

import LoginField from "./login/LoginField";
import LoginModalHeader from "./login/LoginModalHeader";
import { useLoginForm } from "./login/useLoginForm";

type LoginModalProps = {
  visible: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
};

const LoginModal = ({ visible, onClose, onOpenRegister }: LoginModalProps) => {
  const form = useLoginForm(onClose);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
      >
        <View
          className="w-full max-w-md rounded-3xl bg-white overflow-hidden"
          style={{ boxShadow: "0px 16px 40px rgba(59,91,219,0.25)" }}
        >
          <LoginModalHeader onClose={onClose} />

          <View className="px-5 py-5 gap-3.5">
            <LoginField
              label="Email"
              icon="user"
              focused={form.focusedField === "email"}
              value={form.email}
              onChangeText={form.setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => form.setFocusedField("email")}
              onBlur={() => form.setFocusedField(null)}
            />

            <LoginField
              label="Password"
              icon="lock"
              focused={form.focusedField === "password"}
              value={form.password}
              onChangeText={form.setPassword}
              placeholder="Enter your password"
              secureTextEntry={!form.showPassword}
              onFocus={() => form.setFocusedField("password")}
              onBlur={() => form.setFocusedField(null)}
              trailing={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={form.showPassword ? "Hide password" : "Show password"}
                  onPress={form.toggleShowPassword}
                  className="ml-1 h-8 w-8 items-center justify-center"
                >
                  <Feather
                    name={form.showPassword ? "eye-off" : "eye"}
                    size={14}
                    color="#94A3B8"
                  />
                </Pressable>
              }
            />

            <View className="flex-row items-center justify-between -mt-1">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                onPress={form.openForgotPassword}
                hitSlop={8}
              >
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

            <Pressable
              className="rounded-xl bg-mc-primary items-center justify-center"
              style={({ pressed }) => ({
                height: 48,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed || form.isSubmitting ? 0.72 : 1,
                boxShadow: "0px 5px 12px rgba(59,91,219,0.35)",
              })}
              disabled={form.isSubmitting}
              onPress={form.handleSubmit}
            >
              <View className="flex-row items-center gap-2">
                <Feather name="log-in" size={30} color="#fff" />
                <Text className="text-[20px] font-bold text-white">
                  {form.isSubmitting ? "Logging In..." : "Login"}
                </Text>
              </View>
            </Pressable>

            <View className="flex-row items-center justify-center gap-1.5">
              <Feather name="lock" size={9} color="#CBD5E1" />
              <Text className="text-[9px] text-slate-400">
                Secure login for Barangay Maslog residents
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <PlatformAccessModal
        visible={form.showPlatformNotice}
        onClose={form.dismissPlatformNotice}
      />

      <ForgotPasswordFlow
        visible={form.showForgotPassword}
        onClose={form.closeForgotPassword}
        initialEmail={form.email}
      />
    </Modal>
  );
};

export default LoginModal;
