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
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { registerResident } from "../../services/auth";

type RegistrationModalProps = {
  visible: boolean;
  onClose: () => void;
  onRegisteredEmail?: (email: string) => void;
};

type TabKey = "manual" | "scanner";

const GENDER_OPTIONS = [
  { label: "Male",   value: "male",   icon: "user" as const },
  { label: "Female", value: "female", icon: "user" as const },
  { label: "Other",  value: "other",  icon: "users" as const },
];

export default function RegistrationModal({
  visible,
  onClose,
  onRegisteredEmail,
}: RegistrationModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("manual");
  const [fullname, setFullname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");       
  const [dobDate, setDobDate] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const formatDateDisplay = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setDobDate(selected);
      setDateOfBirth(formatDateDisplay(selected));
    }
  };

  const resetState = () => {
    setActiveTab("manual");
    setFullname("");
    setDateOfBirth("");
    setDobDate(new Date(2000, 0, 1));
    setShowDatePicker(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setGender("");
    setAddress("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateForm = (): boolean => {
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

    const dob = new Date(dateOfBirth.trim());
    if (Number.isNaN(dob.getTime())) {
      Alert.alert("Invalid Date of Birth", "Please select a valid date.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const result = await registerResident({
        fullname: fullname.trim(),
        dateOfBirth: dateOfBirth.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        gender: gender.trim(),
        address: address.trim(),
      });

      Alert.alert("Registration Successful", result.message);
      onRegisteredEmail?.(result.email);
      resetState();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to register. Please try again.";
      Alert.alert("Registration Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockScan = () => {
    setFullname("Sample Resident");
    const mockDate = new Date(2000, 0, 1);
    setDobDate(mockDate);
    setDateOfBirth(formatDateDisplay(mockDate));
    Alert.alert(
      "Scan Simulated",
      "Name and date of birth have been filled. Connect your actual QR / ID scanner to populate real data."
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
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

            {/* Tab switcher */}
            <View className="mt-4 flex-row rounded-full bg-white/10 p-1">
              <Pressable
                onPress={() => setActiveTab("manual")}
                className={`flex-1 rounded-full py-2 items-center ${
                  activeTab === "manual" ? "bg-white" : ""
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    activeTab === "manual" ? "text-mc-primary" : "text-white/80"
                  }`}
                >
                  Manual Entry
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab("scanner")}
                className={`flex-1 rounded-full py-2 items-center ${
                  activeTab === "scanner" ? "bg-white" : ""
                }`}
              >
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

          {/* ── Form ── */}
          <View className="px-6 py-5 gap-4">
            {activeTab === "scanner" && (
              <View className="mb-2 rounded-2xl border border-dashed border-mc-primary/40 bg-mc-primary/5 p-3">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-[12px] font-semibold text-slate-700 mb-1">
                      Scanner Registration
                    </Text>
                    <Text className="text-[11px] text-slate-500">
                      Connect a QR or ID scanner to your device. Scanned details will
                      automatically fill the name and date of birth fields.
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleMockScan}
                    className="rounded-full bg-mc-primary px-3 py-2"
                  >
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

            {/* ── Gender — Radio Buttons ── */}
            <View>
              <Text className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Gender
              </Text>
              <View className="flex-row gap-2">
                {GENDER_OPTIONS.map((opt) => {
                  const selected = gender === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => setGender(opt.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1, flex: 1 })}
                    >
                      <View
                        className={`flex-row items-center justify-center gap-1.5 rounded-2xl border py-2.5 px-2 ${
                          selected
                            ? "border-mc-primary bg-mc-primary/10"
                            : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        {/* Radio circle */}
                        <View
                          className={`h-4 w-4 rounded-full border-2 items-center justify-center ${
                            selected ? "border-mc-primary" : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <View className="h-2 w-2 rounded-full bg-mc-primary" />
                          )}
                        </View>
                        <Text
                          className={`text-[12px] font-semibold ${
                            selected ? "text-mc-primary" : "text-slate-500"
                          }`}
                        >
                          {opt.label}
                        </Text>
                      </View>
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

            {/* ── Date of Birth — Tappable Date Picker ── */}
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
                  className={`flex-row items-center rounded-2xl border px-3.5 bg-slate-50 ${
                    showDatePicker ? "border-mc-primary" : "border-slate-200"
                  }`}
                >
                  <Feather name="calendar" size={15} color={showDatePicker ? "#2A7DE1" : "#94A3B8"} />
                  <Text
                    className={`flex-1 py-3 pl-2.5 text-sm ${
                      dateOfBirth ? "text-slate-800" : "text-[#CBD5E1]"
                    }`}
                  >
                    {dateOfBirth || "Select your birthday"}
                  </Text>
                  <Feather name="chevron-down" size={14} color="#94A3B8" />
                </View>
              </Pressable>

              {/* iOS inline picker — shown below the row */}
              {showDatePicker && Platform.OS === "ios" && (
                <View className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <DateTimePicker
                    value={dobDate}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={onDateChange}
                    textColor="#1E293B"
                  />
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    className="mx-4 mb-3 rounded-xl bg-mc-primary py-2.5 items-center"
                  >
                    <Text className="text-sm font-bold text-white">Done</Text>
                  </Pressable>
                </View>
              )}

              {/* Android: native modal picker */}
              {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker
                  value={dobDate}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
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

            {/* Password + Confirm */}
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
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={15}
                      color="#94A3B8"
                    />
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

            <View className="flex-row items-center justify-center gap-1.5 pt-1">
              <Feather name="lock" size={10} color="#CBD5E1" />
              <Text className="text-[10px] text-slate-400">
                Your information is securely stored in MaslogCare.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}