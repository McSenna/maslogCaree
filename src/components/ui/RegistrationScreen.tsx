import React, { useState, useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { registerResident } from "@/services/auth";
import OtpVerificationModal from "./OtpVerificationModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const DAYS  = Array.from({ length: 31 },  (_, i) => i + 1);

const GENDER_OPTIONS = [
  { value: "male",   label: "Male"   },
  { value: "female", label: "Female" },
  { value: "other",  label: "Other"  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type RegistrationScreenProps = {
  onRegistrationSuccess?: () => void;
  onBackPress?: () => void;
};

type DatePickerModalProps = {
  visible:   boolean;
  value:     string; // "YYYY-MM-DD"
  onConfirm: (date: string) => void;
  onClose:   () => void;
};

// ─── Date Picker Modal ────────────────────────────────────────────────────────

const DatePickerModal = ({ visible, value, onConfirm, onClose }: DatePickerModalProps) => {
  const parsed    = value ? value.split("-") : [];
  const initYear  = parsed[0] ? parseInt(parsed[0]) : CURRENT_YEAR - 25;
  const initMonth = parsed[1] ? parseInt(parsed[1]) - 1 : 0;
  const initDay   = parsed[2] ? parseInt(parsed[2]) : 1;

  const [selYear,  setSelYear]  = useState(initYear);
  const [selMonth, setSelMonth] = useState(initMonth);
  const [selDay,   setSelDay]   = useState(initDay);

  const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();

  const handleConfirm = () => {
    const day   = String(Math.min(selDay, daysInMonth)).padStart(2, "0");
    const month = String(selMonth + 1).padStart(2, "0");
    onConfirm(`${selYear}-${month}-${day}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,23,42,0.5)" }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View className="bg-white rounded-t-3xl overflow-hidden">
          {/* Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-9 h-1 rounded-full bg-slate-200" />
          </View>

          {/* Toolbar */}
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100">
            <Pressable onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-[13px] font-semibold text-slate-400">Cancel</Text>
            </Pressable>
            <Text className="text-[13px] font-bold text-slate-800">Date of Birth</Text>
            <Pressable onPress={handleConfirm} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-[13px] font-bold text-mc-primary">Done</Text>
            </Pressable>
          </View>

          {/* Selected date preview */}
          <View className="items-center py-3 bg-slate-50 border-b border-slate-100">
            <Text className="text-[15px] font-extrabold text-slate-800 tracking-tight">
              {MONTHS[selMonth]}{" "}
              {String(Math.min(selDay, daysInMonth)).padStart(2, "0")},{" "}
              {selYear}
            </Text>
          </View>

          {/* Column pickers */}
          <View className="flex-row px-4 pt-2 pb-8 gap-2" style={{ height: 230 }}>
            {/* Month */}
            <View className="flex-[3]">
              <Text className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center mb-1.5">
                Month
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setSelMonth(i)}
                    className="py-2 px-1.5 rounded-lg mb-0.5"
                    style={{ backgroundColor: selMonth === i ? "#EEF2FF" : "transparent" }}
                  >
                    <Text
                      className="text-center text-[12.5px]"
                      style={{
                        fontWeight: selMonth === i ? "700" : "400",
                        color: selMonth === i ? "#3B5BDB" : "#475569",
                      }}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Divider */}
            <View className="w-px bg-slate-100 self-stretch my-1" />

            {/* Day */}
            <View className="flex-[1.4]">
              <Text className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center mb-1.5">
                Day
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {DAYS.slice(0, daysInMonth).map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setSelDay(d)}
                    className="py-2 rounded-lg mb-0.5"
                    style={{ backgroundColor: selDay === d ? "#EEF2FF" : "transparent" }}
                  >
                    <Text
                      className="text-center text-[12.5px]"
                      style={{
                        fontWeight: selDay === d ? "700" : "400",
                        color: selDay === d ? "#3B5BDB" : "#475569",
                      }}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Divider */}
            <View className="w-px bg-slate-100 self-stretch my-1" />

            {/* Year */}
            <View className="flex-[1.8]">
              <Text className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center mb-1.5">
                Year
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {YEARS.map((y) => (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setSelYear(y)}
                    className="py-2 rounded-lg mb-0.5"
                    style={{ backgroundColor: selYear === y ? "#EEF2FF" : "transparent" }}
                  >
                    <Text
                      className="text-center text-[12.5px]"
                      style={{
                        fontWeight: selYear === y ? "700" : "400",
                        color: selYear === y ? "#3B5BDB" : "#475569",
                      }}
                    >
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const RegistrationScreen = ({
  onRegistrationSuccess,
  onBackPress,
}: RegistrationScreenProps) => {
  const [fullname,        setFullname]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [gender,          setGender]          = useState("male");
  const [dateOfBirth,     setDateOfBirth]     = useState("");
  const [address,         setAddress]         = useState("");
  const [profileImage,    setProfileImage]    = useState<string | null>(null);
  const [showPassword,    setShowPassword]    = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [showOtpModal,    setShowOtpModal]    = useState(false);
  const [showDatePicker,  setShowDatePicker]  = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [errors,          setErrors]          = useState<Record<string, string>>({});
  const [focusedField,    setFocusedField]    = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  // ── Image Picker ─────────────────────────────────────────────────────────

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        clearError("profileImage");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        clearError("profileImage");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose a photo for your profile',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]
    );
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const fieldBorderColor = (name: string) =>
    errors[name] ? "#EF4444" : focusedField === name ? "#3B5BDB" : "#E2E8F0";

  const fieldBg = (name: string) =>
    focusedField === name ? "#EEF2FF" : "#fff";

  const formatDisplayDate = (raw: string) => {
    if (!raw) return "";
    const [y, m, d] = raw.split("-");
    if (!y || !m || !d) return raw;
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullname.trim())                e.fullname    = "Full name is required";
    else if (fullname.trim().length < 2) e.fullname    = "At least 2 characters";
    if (!email.trim())                   e.email       = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email";
    if (!password)                       e.password    = "Password is required";
    else if (password.length < 8)        e.password    = "At least 8 characters";
    else if (!/[A-Za-z]/.test(password)) e.password    = "Must contain a letter";
    else if (!/\d/.test(password))       e.password    = "Must contain a number";
    if (!gender)                         e.gender      = "Select a gender";
    if (!dateOfBirth.trim())             e.dateOfBirth = "Date of birth is required";
    if (!address.trim())                 e.address     = "Address is required";
    else if (address.trim().length < 5)  e.address     = "At least 5 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleRegister = async () => {
    if (!validateForm() || isLoading) return;
    try {
      setIsLoading(true);
      const registrationData: any = {
        fullname: fullname.trim(),
        email: email.trim(),
        password,
        gender: gender.toLowerCase(),
        dateOfBirth: dateOfBirth.trim(),
        address: address.trim(),
      };
      if (profileImage) {
        registrationData.profileImage = profileImage;
      }
      const result = await registerResident(registrationData);
      setRegisteredEmail(result.email);
      setShowOtpModal(true);
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerificationSuccess = () => {
    setShowOtpModal(false);
    Alert.alert("Registration Complete", "Your account has been created and verified!");
    onRegistrationSuccess?.();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1">
        {/* ── Sticky Header ────────────────────────────────────────────────────── */}
        <View className="bg-mc-primary z-10" style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
        }}>
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

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === "ios" ? 160 : 140,
            paddingTop: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* ── Form ──────────────────────────────────────────────────────── */}
          <View className="px-4 gap-4">

            {/* Profile Photo */}
            <View className="items-center mb-2">
              <Text className="mb-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Profile Photo (Optional)
              </Text>
              <Pressable onPress={showImagePickerOptions} className="items-center justify-center">
                {profileImage ? (
                  <View className="relative">
                    <Image
                      source={{ uri: profileImage }}
                      className="w-24 h-24 rounded-full border-2 border-mc-primary"
                    />
                    <View className="absolute -bottom-1 -right-1 bg-mc-primary rounded-full p-2 border-2 border-white">
                      <Feather name="camera" size={14} color="#fff" />
                    </View>
                  </View>
                ) : (
                  <View className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 items-center justify-center">
                    <Feather name="camera" size={28} color="#94A3B8" />
                    <Text className="text-[9px] text-slate-400 mt-1">Add Photo</Text>
                  </View>
                )}
              </Pressable>
              {!!errors.profileImage && (
                <View className="flex-row items-center gap-1 mt-2">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.profileImage}</Text>
                </View>
              )}
            </View>

            {/* Full Name */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Full Name *
              </Text>
              <View
                className="flex-row items-center rounded-xl border px-3"
                style={{ borderColor: fieldBorderColor("fullname"), backgroundColor: fieldBg("fullname"), height: 46 }}
              >
                <Feather name="user" size={14} color={focusedField === "fullname" ? "#3B5BDB" : "#94A3B8"} />
                <TextInput
                  value={fullname}
                  onChangeText={(t) => { setFullname(t); clearError("fullname"); }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#CBD5E1"
                  onFocus={() => {
                    setFocusedField("fullname");
                    scrollViewRef.current?.scrollTo({ y: 150, animated: true });
                  }}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 pl-2.5 text-sm text-slate-800"
                />
              </View>
              {!!errors.fullname && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.fullname}</Text>
                </View>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Email *
              </Text>
              <View
                className="flex-row items-center rounded-xl border px-3"
                style={{ borderColor: fieldBorderColor("email"), backgroundColor: fieldBg("email"), height: 46 }}
              >
                <Feather name="mail" size={14} color={focusedField === "email" ? "#3B5BDB" : "#94A3B8"} />
                <TextInput
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError("email"); }}
                  placeholder="name@example.com"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => {
                    setFocusedField("email");
                    scrollViewRef.current?.scrollTo({ y: 250, animated: true });
                  }}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 pl-2.5 text-sm text-slate-800"
                />
              </View>
              {!!errors.email && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.email}</Text>
                </View>
              )}
            </View>

            {/* Password */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Password *
              </Text>
              <View
                className="flex-row items-center rounded-xl border px-3"
                style={{ borderColor: fieldBorderColor("password"), backgroundColor: fieldBg("password"), height: 46 }}
              >
                <Feather name="lock" size={14} color={focusedField === "password" ? "#3B5BDB" : "#94A3B8"} />
                <TextInput
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearError("password"); }}
                  placeholder="Min 8 chars, letter + number"
                  placeholderTextColor="#CBD5E1"
                  secureTextEntry={!showPassword}
                  onFocus={() => {
                    setFocusedField("password");
                    scrollViewRef.current?.scrollTo({ y: 350, animated: true });
                  }}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 pl-2.5 text-sm text-slate-800"
                />
                <Pressable
                  onPress={() => setShowPassword((p) => !p)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="ml-1"
                >
                  <Feather name={showPassword ? "eye" : "eye-off"} size={14} color="#94A3B8" />
                </Pressable>
              </View>
              {!!errors.password && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.password}</Text>
                </View>
              )}
            </View>

            {/* Gender */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Gender *
              </Text>
              <View
                className="flex-row rounded-xl border border-slate-200 bg-slate-100/70 p-1"
                style={{ height: 44 }}
              >
                {GENDER_OPTIONS.map(({ value, label }) => {
                  const isSelected = gender === value;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => { setGender(value); clearError("gender"); }}
                      className="flex-1 items-center justify-center rounded-[9px]"
                      style={{
                        backgroundColor: isSelected ? "#fff" : "transparent",
                        shadowColor: isSelected ? "#000" : "transparent",
                        shadowOpacity: isSelected ? 0.08 : 0,
                        shadowRadius: isSelected ? 4 : 0,
                        shadowOffset: { width: 0, height: 1 },
                        elevation: isSelected ? 2 : 0,
                      }}
                    >
                      <Text
                        className="text-[12px]"
                        style={{
                          fontWeight: isSelected ? "700" : "500",
                          color: isSelected ? "#3B5BDB" : "#94A3B8",
                        }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {!!errors.gender && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.gender}</Text>
                </View>
              )}
            </View>

            {/* Date of Birth */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Date of Birth *
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center rounded-xl border px-3"
                style={{
                  borderColor: errors.dateOfBirth ? "#EF4444" : dateOfBirth ? "#3B5BDB" : "#E2E8F0",
                  backgroundColor: dateOfBirth ? "#EEF2FF" : "#fff",
                  height: 46,
                }}
              >
                <Feather name="calendar" size={14} color={dateOfBirth ? "#3B5BDB" : "#94A3B8"} />
                <Text
                  className="flex-1 pl-2.5 text-sm"
                  style={{ color: dateOfBirth ? "#1E293B" : "#CBD5E1" }}
                >
                  {dateOfBirth ? formatDisplayDate(dateOfBirth) : "Select your date of birth"}
                </Text>
                <Feather name="chevron-down" size={14} color={dateOfBirth ? "#3B5BDB" : "#94A3B8"} />
              </Pressable>
              {!!errors.dateOfBirth && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.dateOfBirth}</Text>
                </View>
              )}
            </View>

            {/* Address */}
            <View>
              <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Address *
              </Text>
              <View
                className="flex-row items-start rounded-xl border px-3 pt-3"
                style={{
                  borderColor: fieldBorderColor("address"),
                  backgroundColor: fieldBg("address"),
                  minHeight: 80,
                }}
              >
                <Feather
                  name="map-pin"
                  size={14}
                  color={focusedField === "address" ? "#3B5BDB" : "#94A3B8"}
                  style={{ marginTop: 1 }}
                />
                <TextInput
                  value={address}
                  onChangeText={(t) => { setAddress(t); clearError("address"); }}
                  placeholder="House / street / barangay"
                  placeholderTextColor="#CBD5E1"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  onFocus={() => {
                    setFocusedField("address");
                    scrollViewRef.current?.scrollTo({ y: 750, animated: true });
                  }}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 pl-2.5 text-sm text-slate-800 pb-3"
                />
              </View>
              {!!errors.address && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Feather name="alert-circle" size={11} color="#EF4444" />
                  <Text className="text-[10px] text-red-500">{errors.address}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* ── Bigger Footer Button ── */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#F1F5F9",
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: Platform.OS === "ios" ? 34 : 24,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <Pressable
            onPress={handleRegister}
            disabled={isLoading}
            style={({ pressed }) => ({
              width: '100%',
              height: 60, // Increased from 52 to 60
              borderRadius: 16, // Slightly larger border radius
              overflow: "hidden",
              opacity: isLoading ? 0.85 : pressed ? 0.95 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={["#3B5BDB", "#5B3BDB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10, // Slightly increased gap
                borderRadius: 16,
              }}
            >
              {isLoading ? (
                <Feather name="loader" size={20} color="#fff" /> // Increased icon size
              ) : (
                <Feather name="user-plus" size={20} color="#fff" /> // Increased icon size
              )}
              <Text
                style={{
                  fontSize: 16, // Increased from 15 to 16
                  fontWeight: "600",
                  color: "#fff",
                  letterSpacing: 0.3,
                }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </LinearGradient>
          </Pressable>

          <Text
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "#94A3B8",
              lineHeight: 16,
              marginTop: 14, // Slightly increased margin
            }}
          >
            By registering, you agree to our{" "}
            <Text style={{ color: "#3B5BDB", fontWeight: "500" }}>Terms</Text>
            {" and "}
            <Text style={{ color: "#3B5BDB", fontWeight: "500" }}>Privacy Policy</Text>
          </Text>
        </View>
      </View>

      {/* ── Date Picker sheet ── */}
      <DatePickerModal
        visible={showDatePicker}
        value={dateOfBirth}
        onConfirm={(date) => {
          setDateOfBirth(date);
          clearError("dateOfBirth");
        }}
        onClose={() => setShowDatePicker(false)}
      />

      {/* ── OTP Verification ── */}
      <OtpVerificationModal
        visible={showOtpModal}
        email={registeredEmail}
        onClose={() => {
          setShowOtpModal(false);
          setFullname(""); setEmail(""); setPassword("");
          setGender("male"); setDateOfBirth(""); setAddress("");
          setProfileImage(null);
          setErrors({});
          handleOtpVerificationSuccess();
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;