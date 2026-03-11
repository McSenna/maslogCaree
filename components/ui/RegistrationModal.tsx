import { useState } from "react";
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
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { registerResident } from "../../services/auth";

type RegistrationModalProps = {
  visible: boolean;
  onClose: () => void;
  onRegisteredEmail?: (email: string) => void;
};

type TabKey = "manual" | "scanner";
type GenderOption = "male" | "female" | "other";

const GENDER_OPTIONS: { label: string; value: GenderOption; icon: string }[] = [
  { label: "Male", value: "male", icon: "user" },
  { label: "Female", value: "female", icon: "user" },
  { label: "Other", value: "other", icon: "users" },
];

export default function RegistrationModal({
  visible,
  onClose,
  onRegisteredEmail,
}: RegistrationModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("manual");
  const [fullname, setFullname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<GenderOption | "">("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const displayDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const resetState = () => {
    setActiveTab("manual");
    setFullname("");
    setDateOfBirth(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setGender("");
    setAddress("");
    setIsSubmitting(false);
    setShowDatePicker(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateForm = () => {
    if (!fullname || !dateOfBirth || !email || !password || !confirmPassword || !gender || !address) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and confirm password must match.");
      return false;
    }
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[\]|:";'<>?,./]{8,}$/;
    if (!passwordPattern.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters and contain at least one letter and one number."
      );
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        fullname: fullname.trim(),
        dateOfBirth: formatDate(dateOfBirth),
        email: email.trim(),
        password,
        confirmPassword,
        gender: gender.trim(),
        address: address.trim(),
      };
      const result = await registerResident(payload);
      Alert.alert("Registration Successful", result.message);
      onRegisteredEmail?.(result.email);
      resetState();
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message || "Unable to register. Please try again.";
      Alert.alert("Registration Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockScan = () => {
    setFullname("Sample Resident");
    setDateOfBirth(new Date("2000-01-01"));
    Alert.alert(
      "Scan Simulated",
      "Name and date of birth have been filled. Connect your actual QR / ID scanner to populate real data."
    );
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
      >
        <View
          className="w-full max-w-xl rounded-3xl bg-white overflow-hidden shadow-2xl"
          style={{
            shadowColor: "#2A7DE1",
            shadowOpacity: 0.25,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          {/* ── Header ── */}
          <View className="bg-mc-primary px-6 pt-6 pb-4">
            <View
              className="absolute -right-10 -top-10 rounded-full bg-white/10"
              style={{ width: 140, height: 140 }}
            />
            <View
              className="absolute right-6 bottom-0 rounded-full bg-white/10"
              style={{ width: 70, height: 70 }}
            />

            <View className="flex-row justify-end mb-3">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close registration"
                onPress={handleClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-white/20"
              >
                <Feather name="x" size={15} color="#fff" />
              </Pressable>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="rounded-2xl bg-white/20 p-2.5">
                <Feather name="user-plus" size={22} color="#fff" />
              </View>
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  MASLOG CARE
                </Text>
                <Text className="text-xl font-extrabold text-white leading-tight">
                  Create Your Account
                </Text>
              </View>
            </View>
            <Text className="mt-2 text-xs text-white/70">
              Choose a registration method and complete your details to access MaslogCare.
            </Text>

            {/* Tab Switcher */}
            <View className="mt-4 flex-row rounded-full bg-white/10 p-1">
              <Pressable
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full px-3 py-1.5 ${
                  activeTab === "manual" ? "bg-white" : "bg-transparent"
                }`}
                onPress={() => setActiveTab("manual")}
              >
                <Feather
                  name="edit"
                  size={14}
                  color={activeTab === "manual" ? "#2A7DE1" : "rgba(255,255,255,0.8)"}
                />
                <Text
                  className={`text-[11px] font-bold ${
                    activeTab === "manual" ? "text-mc-primary" : "text-white/80"
                  }`}
                >
                  Manual Input
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full px-3 py-1.5 ${
                  activeTab === "scanner" ? "bg-white" : "bg-transparent"
                }`}
                onPress={() => setActiveTab("scanner")}
              >
                <Feather
                  name="maximize"
                  size={14}
                  color={activeTab === "scanner" ? "#2A7DE1" : "rgba(255,255,255,0.8)"}
                />
                <Text
                  className={`text-[11px] font-bold ${
                    activeTab === "scanner" ? "text-mc-primary" : "text-white/80"
                  }`}
                >
                  Scan ID / QR
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ── Form Body ── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, gap: 16 }}
          >
            {activeTab === "scanner" && (
              <View className="rounded-2xl border border-dashed border-mc-primary/40 bg-mc-primary/5 p-3">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-[12px] font-semibold text-slate-700 mb-1">
                      Scanner Registration
                    </Text>
                    <Text className="text-[11px] text-slate-500">
                      Connect a QR or ID scanner to your device. Scanned details will automatically
                      fill the name and date of birth fields.
                    </Text>
                  </View>
                  <Pressable onPress={handleMockScan} className="rounded-full bg-mc-primary px-3 py-2">
                    <View className="flex-row items-center gap-1.5">
                      <Feather name="camera" size={13} color="#fff" />
                      <Text className="text-[11px] font-bold text-white">Simulate Scan</Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Full Name */}
            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Full Name
              </Text>
              <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5">
                <Feather name="user" size={15} color="#94A3B8" />
                <TextInput
                  value={fullname}
                  onChangeText={setFullname}
                  placeholder="Enter your full name"
                  className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
              </View>
            </View>

            {/* Gender — Radio Buttons */}
            <View>
              <Text className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Gender
              </Text>
              <View className="flex-row justify-center gap-3">
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = gender === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setGender(option.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 8,
                        borderRadius: 16,
                        borderWidth: 1.5,
                        borderColor: isSelected ? "#2A7DE1" : "#E2E8F0",
                        backgroundColor: isSelected ? "#EFF6FF" : "#F8FAFC",
                        gap: 6,
                      }}
                    >
                      {/* Radio circle */}
                      <View
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          borderWidth: 2,
                          borderColor: isSelected ? "#2A7DE1" : "#CBD5E1",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {isSelected && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#2A7DE1",
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: isSelected ? "700" : "500",
                          color: isSelected ? "#2A7DE1" : "#64748B",
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Address */}
            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Address
              </Text>
              <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5">
                <Feather name="map-pin" size={15} color="#94A3B8" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="House / street / barangay"
                  className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
              </View>
            </View>

            {/* Date of Birth — Date Picker */}
            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Date of Birth
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Select date of birth"
              >
                <View
                  className="flex-row items-center rounded-2xl border bg-slate-50 px-3.5"
                  style={{
                    borderColor: showDatePicker ? "#2A7DE1" : "#E2E8F0",
                    borderWidth: showDatePicker ? 1.5 : 1,
                  }}
                >
                  <Feather name="calendar" size={15} color={dateOfBirth ? "#2A7DE1" : "#94A3B8"} />
                  <Text
                    className="flex-1 py-3 pl-2.5 text-sm"
                    style={{ color: dateOfBirth ? "#1E293B" : "#CBD5E1" }}
                  >
                    {dateOfBirth ? displayDate(dateOfBirth) : "Select your date of birth"}
                  </Text>
                  <Feather name="chevron-down" size={14} color="#94A3B8" />
                </View>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Email Address
              </Text>
              <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5">
                <Feather name="mail" size={15} color="#94A3B8" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                  placeholderTextColor="#CBD5E1"
                />
              </View>
            </View>

            {/* Password Row */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Password
                </Text>
                <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5">
                  <Feather name="lock" size={15} color="#94A3B8" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    secureTextEntry={!showPassword}
                    className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                    placeholderTextColor="#CBD5E1"
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Confirm Password
                </Text>
                <View className="flex-row items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5">
                  <Feather name="shield" size={15} color="#94A3B8" />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter password"
                    secureTextEntry={!showPassword}
                    className="flex-1 py-3 pl-2.5 text-sm text-slate-800"
                    placeholderTextColor="#CBD5E1"
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="ml-1 h-8 w-8 items-center justify-center"
                  >
                    <Feather name={showPassword ? "eye-off" : "eye"} size={15} color="#94A3B8" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Submit */}
            <Pressable
              className="mt-1 rounded-2xl bg-mc-primary py-3.5 shadow-md"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed || isSubmitting ? 0.7 : 1,
                shadowColor: "#2A7DE1",
                shadowOpacity: 0.35,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              })}
              disabled={isSubmitting}
              onPress={handleRegister}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Feather name="check-circle" size={16} color="#fff" />
                <Text className="text-sm font-bold text-white">
                  {isSubmitting ? "Creating Account..." : "Register & Send OTP"}
                </Text>
              </View>
            </Pressable>

            <View className="flex-row items-center justify-center gap-1.5 pb-2">
              <Feather name="lock" size={10} color="#CBD5E1" />
              <Text className="text-[10px] text-slate-400">
                Your information is securely stored in MaslogCare.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}