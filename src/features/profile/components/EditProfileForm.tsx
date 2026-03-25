import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import ProfileAvatar from "./ProfileAvatar";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EditProfileValues = {
  fullname: string;
  nickname?: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  avatarUrl?: string | null;
};

type EditProfileFormProps = {
  initialValues: EditProfileValues;
  onDiscard?: () => void;
  onSave?: (values: EditProfileValues) => Promise<void> | void;
};

// ─── Field sub-component ──────────────────────────────────────────────────────

type FieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
};

function Field({
  label,
  value,
  onChangeText,
  editable = true,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
}: FieldProps) {
  return (
    <View>
      <Text className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </Text>
      <View className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          className={`py-3 text-sm text-slate-800 ${multiline ? "min-h-[48px]" : ""}`}
          placeholderTextColor="#CBD5E1"
        />
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EditProfileForm({
  initialValues,
  onDiscard,
  onSave,
}: EditProfileFormProps) {
  const [values, setValues] = useState<EditProfileValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (field: keyof EditProfileValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarPress = () => {
    Alert.alert(
      "Change Profile Photo",
      "Profile photo upload is not yet connected. Integrate image picker / upload here."
    );
  };

  const handleSave = async () => {
    if (!onSave) return;

    if (!values.fullname.trim()) {
      Alert.alert("Full Name Required", "Please enter your full name.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(values);
    } catch (error: any) {
      const message =
        error?.message ??
        "Unable to save your profile right now. Please try again.";
      Alert.alert("Save Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View className="gap-5">
      {/* Avatar picker */}
      <View className="items-center">
        <Pressable
          onPress={handleAvatarPress}
          className="rounded-full bg-slate-50 p-1.5 shadow-sm shadow-slate-200"
        >
          <ProfileAvatar size={84} imageUrl={values.avatarUrl ?? null} />
          <View className="absolute bottom-1 right-1 rounded-full bg-mc-primary p-1.5">
            <Feather name="camera" size={14} color="#fff" />
          </View>
        </Pressable>
        <Text className="mt-2 text-xs text-slate-500">
          Tap to change your profile photo
        </Text>
      </View>

      {/* Form fields */}
      <View className="gap-4">
        <Field
          label="Full Name"
          value={values.fullname}
          onChangeText={(t) => handleChange("fullname", t)}
          autoCapitalize="words"
        />
        <Field
          label="Nickname"
          value={values.nickname ?? ""}
          onChangeText={(t) => handleChange("nickname", t)}
          autoCapitalize="words"
        />
        <Field
          label="Email"
          value={values.email}
          editable={false}
          keyboardType="email-address"
        />
        <Field
          label="Phone"
          value={values.phone ?? ""}
          onChangeText={(t) => handleChange("phone", t)}
          keyboardType="phone-pad"
        />
        <Field
          label="Address"
          value={values.address ?? ""}
          onChangeText={(t) => handleChange("address", t)}
          multiline
        />
        <Field
          label="Occupation"
          value={values.occupation ?? ""}
          onChangeText={(t) => handleChange("occupation", t)}
        />
      </View>

      {/* Action buttons */}
      <View className="mt-2 flex-row gap-3">
        <Pressable
          onPress={onDiscard}
          className="flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white py-3"
        >
          <Text className="text-sm font-semibold text-slate-700">Discard</Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={isSubmitting}
          className="flex-1 items-center justify-center rounded-2xl bg-mc-primary py-3 shadow-md shadow-mc-primary/30"
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed || isSubmitting ? 0.8 : 1,
          })}
        >
          <Text className="text-sm font-semibold text-white">
            {isSubmitting ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}