import { useRef } from "react";
import { Text, View, type TextInput } from "react-native";

import TextField from "@/components/forms/TextField";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { ANNOUNCEMENT_LIMITS } from "../../announcementRules";
import type { CreateAnnouncementForm } from "../../hooks/useCreateAnnouncementForm";
import AnnouncementDateTimeFields from "./AnnouncementDateTimeFields";

type AnnouncementFormProps = {
  form: CreateAnnouncementForm;
  compact: boolean;
};

const FormSection = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 12 }}>
      <Text
        accessibilityRole="header"
        style={{
          fontSize: 11.5,
          fontWeight: "700",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: palette.muted,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};

const AnnouncementForm = ({ form, compact }: AnnouncementFormProps) => {
  const palette = useResidentDialogPalette();
  const messageRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const { values, errors, submitting, setField } = form;
  const L = ANNOUNCEMENT_LIMITS;

  return (
    <View style={{ gap: compact ? 20 : 24 }}>
      <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.body }}>
        Every active MaslogCare account gets this in their notifications, and it stays on the
        announcements page.
      </Text>

      <FormSection label="What">
        <TextField
          label="Title"
          required
          value={values.title}
          onChangeText={(text) => setField("title", text)}
          placeholder="e.g. Free vaccination drive"
          maxLength={L.titleMax}
          autoCapitalize="sentences"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => messageRef.current?.focus()}
          disabled={submitting}
          error={errors.title}
        />
        <TextField
          inputRef={messageRef}
          label="Message"
          required
          multiline
          value={values.message}
          onChangeText={(text) => setField("message", text)}
          placeholder="What should residents know or bring?"
          maxLength={L.messageMax}
          autoCapitalize="sentences"
          disabled={submitting}
          error={errors.message}
          helper={`${values.message.length} / ${L.messageMax}`}
        />
      </FormSection>

      <FormSection label="When">
        <AnnouncementDateTimeFields
          date={values.date}
          time={values.time}
          onChangeDate={(value) => setField("date", value)}
          onChangeTime={(value) => setField("time", value)}
          dateError={errors.date}
          timeError={errors.time}
          disabled={submitting}
          stacked={compact}
        />
      </FormSection>

      <FormSection label="Where">
        <TextField
          inputRef={locationRef}
          label="Location or venue"
          required
          leftIcon="map-pin"
          value={values.location}
          onChangeText={(text) => setField("location", text)}
          placeholder="e.g. Barangay Maslog Health Center"
          maxLength={L.locationMax}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => void form.submit()}
          disabled={submitting}
          error={errors.location}
        />
      </FormSection>
    </View>
  );
};

export default AnnouncementForm;
