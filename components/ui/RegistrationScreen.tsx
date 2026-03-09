import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { registerResident } from "../../services/auth";
import OtpVerificationModal from "./OtpVerificationModal";

type RegistrationScreenProps = {
  onRegistrationSuccess?: () => void;
  onBackPress?: () => void;
};

export default function RegistrationScreen({
  onRegistrationSuccess,
  onBackPress,
}: RegistrationScreenProps) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validate form fields locally
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Za-z]/.test(password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) {
      newErrors.dateOfBirth = "Please use format YYYY-MM-DD";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    } else if (address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle registration submission
   */
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await registerResident({
        fullname: fullname.trim(),
        email: email.trim(),
        password,
        gender: gender.toLowerCase(),
        dateOfBirth: dateOfBirth.trim(),
        address: address.trim(),
      });

      setRegisteredEmail(result.email);
      setShowOtpModal(true);
      Alert.alert("Success", result.message);
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(", ") ||
        "Registration failed. Please check your information and try again.";
      Alert.alert("Registration Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle OTP verification success
   */
  const handleOtpVerificationSuccess = () => {
    setShowOtpModal(false);
    Alert.alert(
      "Registration Complete",
      "Your account has been created and verified successfully!"
    );
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          {onBackPress && (
            <Pressable
              onPress={onBackPress}
              className="mr-3"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" size={24} color="#2A7DE1" />
            </Pressable>
          )}
          <Text className="text-2xl font-bold text-blue-600">Register</Text>
        </View>

        <Text className="text-gray-600 mb-6 text-sm">
          Create your MaslogCare account to get started
        </Text>

        {/* Full Name Field */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 border border-gray-200">
            <Feather name="user" size={18} color="#666" />
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullname}
              onChangeText={(text) => {
                setFullname(text);
                if (errors.fullname) {
                  setErrors({ ...errors, fullname: "" });
                }
              }}
              className="flex-1 ml-2 text-gray-800"
            />
          </View>
          {errors.fullname && (
            <Text className="text-red-500 text-xs mt-1">{errors.fullname}</Text>
          )}
        </View>

        {/* Email Field */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Email *
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 border border-gray-200">
            <Feather name="mail" size={18} color="#666" />
            <TextInput
              placeholder="your@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 ml-2 text-gray-800"
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
          )}
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Password *
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 border border-gray-200">
            <Feather name="lock" size={18} color="#666" />
            <TextInput
              placeholder="Min 8 chars, letter + number"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: "" });
                }
              }}
              secureTextEntry={!showPassword}
              className="flex-1 ml-2 text-gray-800"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={18}
                color="#2A7DE1"
              />
            </Pressable>
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
          )}
        </View>

        {/* Gender Field */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Gender *
          </Text>
          <View className="flex-row gap-3">
            {["male", "female", "other"].map((g) => (
              <Pressable
                key={g}
                onPress={() => setGender(g)}
                className={`flex-1 py-3 px-3 rounded-lg border-2 items-center ${
                  gender === g
                    ? "bg-blue-100 border-blue-600"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <Text
                  className={`font-medium capitalize ${
                    gender === g ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {g}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.gender && (
            <Text className="text-red-500 text-xs mt-1">{errors.gender}</Text>
          )}
        </View>

        {/* Date of Birth Field */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Date of Birth (YYYY-MM-DD) *
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 border border-gray-200">
            <Feather name="calendar" size={18} color="#666" />
            <TextInput
              placeholder="1990-01-15"
              placeholderTextColor="#999"
              value={dateOfBirth}
              onChangeText={(text) => {
                setDateOfBirth(text);
                if (errors.dateOfBirth) {
                  setErrors({ ...errors, dateOfBirth: "" });
                }
              }}
              className="flex-1 ml-2 text-gray-800"
            />
          </View>
          {errors.dateOfBirth && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.dateOfBirth}
            </Text>
          )}
        </View>

        {/* Address Field */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Address *
          </Text>
          <View className="flex-row items-start bg-gray-100 rounded-lg px-3 py-3 border border-gray-200">
            <Feather name="map-pin" size={18} color="#666" style={{ marginTop: 5 }} />
            <TextInput
              placeholder="Enter your address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (errors.address) {
                  setErrors({ ...errors, address: "" });
                }
              }}
              multiline={true}
              numberOfLines={3}
              className="flex-1 ml-2 text-gray-800"
            />
          </View>
          {errors.address && (
            <Text className="text-red-500 text-xs mt-1">{errors.address}</Text>
          )}
        </View>

        {/* Register Button */}
        <Pressable
          onPress={handleRegister}
          disabled={isLoading}
          className={`py-4 px-4 rounded-lg items-center mb-4 ${
            isLoading
              ? "bg-blue-300"
              : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Creating Account..." : "Create Account"}
          </Text>
        </Pressable>

        {/* Terms & Conditions */}
        <Text className="text-gray-500 text-xs text-center mb-8">
          By registering, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        visible={showOtpModal}
        email={registeredEmail}
        onClose={() => {
          setShowOtpModal(false);
          // Reset form after successful registration
          setFullname("");
          setEmail("");
          setPassword("");
          setGender("male");
          setDateOfBirth("");
          setAddress("");
          setErrors({});
          handleOtpVerificationSuccess();
        }}
      />
    </KeyboardAvoidingView>
  );
}
