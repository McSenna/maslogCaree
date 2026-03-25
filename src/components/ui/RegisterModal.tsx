
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { registerResident } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import OtpVerificationModal from "./OtpVerificationModal";

const MC_PRIMARY = "#2A7DE1";

export type RegisterModalProps = {
  visible: boolean;
  onClose: () => void;
  onLoginPress: () => void;
  onRegistrationComplete?: () => void;
};

export default function RegisterModal({
  visible,
  onClose,
  onLoginPress,
  onRegistrationComplete,
}: RegisterModalProps) {
  const { logout } = useAuth();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!fullname.trim()) next.fullname = "Full name is required";
    else if (fullname.trim().length < 2) next.fullname = "Full name must be at least 2 characters";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Please enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";
    else if (!/[A-Za-z]/.test(password)) next.password = "Password must contain at least one letter";
    else if (!/\d/.test(password)) next.password = "Password must contain at least one number";
    if (!dateOfBirth.trim()) next.dateOfBirth = "Date of birth is required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) next.dateOfBirth = "Use YYYY-MM-DD";
    if (!address.trim()) next.address = "Address is required";
    else if (address.trim().length < 5) next.address = "Address must be at least 5 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (!validate() || isLoading) return;
    setIsLoading(true);
    setErrors({});
    try {
      const result = await registerResident({
        fullname: fullname.trim(),
        email: email.trim(),
        password,
        gender,
        dateOfBirth: dateOfBirth.trim(),
        address: address.trim(),
      });
      setRegisteredEmail(result.email);
      setShowOtpModal(true);
      Alert.alert("Success", result.message);
    } catch (error: any) {
      const message: string =
        error?.message ||
        error?.response?.data?.message ||
        (Array.isArray(error?.response?.data?.errors)
          ? error.response.data.errors.join(", ")
          : "Registration failed. Please check your information and try again.");
      Alert.alert("Registration Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = () => {
    setShowOtpModal(false);
    setFullname("");
    setEmail("");
    setPassword("");
    setGender("male");
    setDateOfBirth("");
    setAddress("");
    setErrors({});
    setRegisteredEmail("");
    onClose();
    Alert.alert("Registration Complete", "Your account has been created and verified successfully!");
    onRegistrationComplete?.();
  };

  const handleClose = () => {
    if (showOtpModal) return;
    setFullname("");
    setEmail("");
    setPassword("");
    setGender("male");
    setDateOfBirth("");
    setAddress("");
    setErrors({});
    setFocusedField(null);
    onClose();
  };

  const fieldStyle = (name: string) => ({
    borderColor: errors[name] ? "#EF4444" : focusedField === name ? MC_PRIMARY : "#E2E8F0",
    backgroundColor: focusedField === name ? "#EEF2FF" : "#fff",
  });

  const clearError = (name: string) => {
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
        >
          <Pressable className="absolute inset-0" onPress={handleClose} />
          <View
            className="w-full max-w-md rounded-2xl bg-white overflow-hidden self-center max-h-[90%]"
            style={{
              shadowColor: "#0f172a",
              shadowOpacity: 0.2,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 12,
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* Header */}
              <View className="bg-mc-primary px-5 pt-5 pb-5 overflow-hidden">
                <View
                  className="absolute -right-10 -top-10 rounded-full bg-white/10"
                  style={{ width: 140, height: 140 }}
                />
                <View
                  className="absolute right-6 bottom-0 rounded-full bg-white/[0.07]"
                  style={{ width: 70, height: 70 }}
                />
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-[10px] bg-white/20 p-2">
                      <Feather name="user-plus" size={20} color="#fff" />
                    </View>
                    <View>
                      <Text className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                        Maslog Care
                      </Text>
                      <Text className="text-[18px] font-extrabold leading-tight text-white tracking-tight">
                        Create your account
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={handleClose}
                    className="h-8 w-8 items-center justify-center rounded-full bg-white/20"
                    accessibilityRole="button"
                    accessibilityLabel="Close registration"
                  >
                    <Feather name="x" size={16} color="#fff" />
                  </Pressable>
                </View>
                <Text className="text-[10.5px] text-white/70 leading-relaxed">
                  Register as a Barangay Maslog resident to access appointments and health records.
                </Text>
              </View>

              {/* Form */}
              <View className="px-5 pt-5 gap-3.5">
                {/* Full Name */}
                <View>
                  <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Full Name *
                  </Text>
                  <View
                    className="flex-row items-center rounded-xl border-2 px-3"
                    style={{ ...fieldStyle("fullname"), height: 46 }}
                  >
                    <Feather
                      name="user"
                      size={16}
                      color={focusedField === "fullname" ? MC_PRIMARY : "#94A3B8"}
                    />
                    <TextInput
                      value={fullname}
                      onChangeText={(t) => { setFullname(t); clearError("fullname"); }}
                      placeholder="Enter your full name"
                      placeholderTextColor="#94A3B8"
                      onFocus={() => setFocusedField("fullname")}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 pl-3 text-sm text-slate-800"
                      editable={!isLoading}
                    />
                  </View>
                  {errors.fullname ? (
                    <Text className="mt-1 text-[11px] text-red-500">{errors.fullname}</Text>
                  ) : null}
                </View>

                {/* Email */}
                <View>
                  <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Email *
                  </Text>
                  <View
                    className="flex-row items-center rounded-xl border-2 px-3"
                    style={{ ...fieldStyle("email"), height: 46 }}
                  >
                    <Feather
                      name="mail"
                      size={16}
                      color={focusedField === "email" ? MC_PRIMARY : "#94A3B8"}
                    />
                    <TextInput
                      value={email}
                      onChangeText={(t) => { setEmail(t); clearError("email"); }}
                      placeholder="name@example.com"
                      placeholderTextColor="#94A3B8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 pl-3 text-sm text-slate-800"
                      editable={!isLoading}
                    />
                  </View>
                  {errors.email ? (
                    <Text className="mt-1 text-[11px] text-red-500">{errors.email}</Text>
                  ) : null}
                </View>

                {/* Password */}
                <View>
                  <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Password *
                  </Text>
                  <View
                    className="flex-row items-center rounded-xl border-2 px-3"
                    style={{ ...fieldStyle("password"), height: 46 }}
                  >
                    <Feather
                      name="lock"
                      size={16}
                      color={focusedField === "password" ? MC_PRIMARY : "#94A3B8"}
                    />
                    <TextInput
                      value={password}
                      onChangeText={(t) => { setPassword(t); clearError("password"); }}
                      placeholder="Min 8 chars, letter + number"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 pl-3 text-sm text-slate-800"
                      editable={!isLoading}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={12}
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                    >
                      <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#64748B" />
                    </Pressable>
                  </View>
                  {errors.password ? (
                    <Text className="mt-1 text-[11px] text-red-500">{errors.password}</Text>
                  ) : null}
                </View>

                {/* Gender */}
                <View>
                  <Text className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Gender *
                  </Text>
                  <View className="flex-row gap-2">
                    {(["male", "female", "other"] as const).map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setGender(g)}
                        className="flex-1 items-center rounded-xl border-2 py-2.5"
                        style={{
                          borderColor: gender === g ? MC_PRIMARY : "#E2E8F0",
                          backgroundColor: gender === g ? "#EEF2FF" : "#fff",
                        }}
                      >
                        <Text
                          className="capitalize text-[11px]"
                          style={{
                            fontWeight: gender === g ? "700" : "500",
                            color: gender === g ? MC_PRIMARY : "#64748B",
                          }}
                        >
                          {g}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Date of Birth */}
                <View>
                  <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Date of Birth *
                  </Text>
                  <View
                    className="flex-row items-center rounded-xl border-2 px-3"
                    style={{ ...fieldStyle("dateOfBirth"), height: 46 }}
                  >
                    <Feather
                      name="calendar"
                      size={16}
                      color={focusedField === "dateOfBirth" ? MC_PRIMARY : "#94A3B8"}
                    />
                    <TextInput
                      value={dateOfBirth}
                      onChangeText={(t) => { setDateOfBirth(t); clearError("dateOfBirth"); }}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94A3B8"
                      onFocus={() => setFocusedField("dateOfBirth")}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 pl-3 text-sm text-slate-800"
                      editable={!isLoading}
                    />
                  </View>
                  {errors.dateOfBirth ? (
                    <Text className="mt-1 text-[11px] text-red-500">{errors.dateOfBirth}</Text>
                  ) : null}
                </View>

                {/* Address */}
                <View>
                  <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Address *
                  </Text>
                  <View
                    className="flex-row items-start rounded-xl border-2 px-3 pt-3"
                    style={{ ...fieldStyle("address"), minHeight: 76 }}
                  >
                    <Feather
                      name="map-pin"
                      size={16}
                      color={focusedField === "address" ? MC_PRIMARY : "#94A3B8"}
                      style={{ marginTop: 2 }}
                    />
                    <TextInput
                      value={address}
                      onChangeText={(t) => { setAddress(t); clearError("address"); }}
                      placeholder="House / street / barangay"
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={3}
                      onFocus={() => setFocusedField("address")}
                      onBlur={() => setFocusedField(null)}
                      className="flex-1 pl-3 text-sm text-slate-800 pb-3"
                      editable={!isLoading}
                    />
                  </View>
                  {errors.address ? (
                    <Text className="mt-1 text-[11px] text-red-500">{errors.address}</Text>
                  ) : null}
                </View>

                <Pressable
                  onPress={handleRegister}
                  disabled={isLoading}
                  className="rounded-xl bg-mc-primary items-center justify-center w-full mt-1"
                  style={({ pressed }) => ({
                    height: 50,
                    opacity: pressed || isLoading ? 0.85 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    shadowColor: MC_PRIMARY,
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  })}
                >
                  <View className="flex-row items-center gap-2">
                    <Feather name="check-circle" size={16} color="#fff" />
                    <Text className="text-[14px] font-bold text-white">
                      {isLoading ? "Creating account…" : "Register"}
                    </Text>
                  </View>
                </Pressable>

                <Text className="text-center text-[9.5px] text-slate-400 leading-relaxed">
                  By registering, you agree to MaslogCare{" "}
                  <Text className="text-mc-primary font-semibold">Terms of Service</Text> and{" "}
                  <Text className="text-mc-primary font-semibold">Privacy Policy</Text>.
                </Text>

                <View className="flex-row items-center justify-center gap-1.5 pt-1">
                  <Text className="text-[12px] text-slate-500">Already have an account?</Text>
                  <Pressable onPress={onLoginPress} hitSlop={8}>
                    <Text className="text-[12px] font-bold text-mc-primary">Login</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <OtpVerificationModal
        visible={showOtpModal}
        email={registeredEmail}
        onClose={handleOtpComplete}
      />
    </>
  );
}
