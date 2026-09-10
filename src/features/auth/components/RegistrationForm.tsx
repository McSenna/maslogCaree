import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import type { useRegistrationForm } from "../hooks/useRegistrationForm";
import DateOfBirthField from "./DateOfBirthField";
import GenderField from "./GenderField";
import ProfilePhotoField from "./ProfilePhotoField";
import RegistrationTextField from "./RegistrationTextField";

type RegistrationFormProps = {
  form: ReturnType<typeof useRegistrationForm>;
};

/** The sign-up fields, in the order they are asked for. */
export default function RegistrationForm({ form }: RegistrationFormProps) {
  const { values, errors, setField, focusedField, focusField, blurField } = form;

  return (
    <View className="px-4 gap-4">
      <ProfilePhotoField
        photo={form.photo.photo}
        onPress={form.photo.choosePhoto}
        error={errors.profileImage}
      />

      <RegistrationTextField
        label="Full Name *"
        icon="user"
        value={values.fullname}
        onChangeText={(text) => setField("fullname", text)}
        placeholder="Enter your full name"
        error={errors.fullname}
        focused={focusedField === "fullname"}
        onFocus={() => focusField("fullname")}
        onBlur={blurField}
      />

      <RegistrationTextField
        label="Email *"
        icon="mail"
        value={values.email}
        onChangeText={(text) => setField("email", text)}
        placeholder="name@example.com"
        error={errors.email}
        focused={focusedField === "email"}
        onFocus={() => focusField("email")}
        onBlur={blurField}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <RegistrationTextField
        label="Password *"
        icon="lock"
        value={values.password}
        onChangeText={(text) => setField("password", text)}
        placeholder="Min 8 chars, letter + number"
        error={errors.password}
        focused={focusedField === "password"}
        onFocus={() => focusField("password")}
        onBlur={blurField}
        secureTextEntry={!form.showPassword}
        trailing={
          <Pressable
            onPress={form.toggleShowPassword}
            accessibilityRole="button"
            accessibilityLabel={form.showPassword ? "Hide password" : "Show password"}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="ml-1"
          >
            <Feather name={form.showPassword ? "eye" : "eye-off"} size={14} color="#94A3B8" />
          </Pressable>
        }
      />

      <GenderField
        value={values.gender}
        onChange={(value) => setField("gender", value)}
        error={errors.gender}
      />

      <DateOfBirthField
        value={values.dateOfBirth}
        onPress={form.openDatePicker}
        error={errors.dateOfBirth}
      />

      <RegistrationTextField
        label="Address *"
        icon="map-pin"
        value={values.address}
        onChangeText={(text) => setField("address", text)}
        placeholder="House / street / barangay"
        error={errors.address}
        focused={focusedField === "address"}
        onFocus={() => focusField("address")}
        onBlur={blurField}
        multiline
      />
    </View>
  );
}
