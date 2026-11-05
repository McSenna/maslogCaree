import { useId, useRef } from "react";
import { Text, View, type TextInput } from "react-native";

import TextField from "@/components/forms/TextField";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { PAGE_PADDING } from "@/theme/breakpoints";
import { TYPE } from "@/theme/typography";

import { ANNOUNCEMENT_LIMITS } from "../../announcementRules";
import type { AnnouncementFormState } from "../../hooks/useAnnouncementForm";
import AudienceSchedulePanel from "./AudienceSchedulePanel";

type AnnouncementFormProps = {
  form: AnnouncementFormState;
  compact: boolean;
  /** The dialog's widest size, which sets how much room each column gets. */
  maxWidth: number;
};

const DETAILS_FLEX = { flex: 5, minWidth: 0 };
const DETAILS_SHARE = 5 / 9;
const PANEL_PADDING_WIDE = 24;
const PANEL_PADDING_COMPACT = 20;
const DATE_TIME_MIN_WIDTH = 330;
const MESSAGE_HEIGHT_WIDE = 220;
const MESSAGE_HEIGHT_COMPACT = 140;

/** Announcement details on the left, audience and schedule beside them; one column on phones. */
const AnnouncementForm = ({ form, compact, maxWidth }: AnnouncementFormProps) => {
  const palette = useResidentDialogPalette();
  const { width } = useResponsive();
  const id = useId();
  const messageRef = useRef<TextInput | null>(null);
  const locationRef = useRef<TextInput | null>(null);
  const { values, errors, submitting, setField, blurField, fieldRef } = form;
  const L = ANNOUNCEMENT_LIMITS;

  const dialogWidth = Math.min(maxWidth, width - PAGE_PADDING.mobile * 2);
  const panelWidth = compact ? width - PANEL_PADDING_COMPACT * 2 : dialogWidth * (1 - DETAILS_SHARE) - PANEL_PADDING_WIDE * 2;

  const titleField = fieldRef("title");
  const messageField = fieldRef("message");
  const locationField = fieldRef("location");

  return (
    <View className={compact ? "" : "flex-row"}>
      <View className={`gap-4 ${compact ? "p-5" : "p-6"}`} style={compact ? null : DETAILS_FLEX}>
        <Text accessibilityRole="header" style={[TYPE.bodyStrong, { color: palette.heading }]}>
          Announcement details
        </Text>
        <TextField
          inputId={`${id}-title`}
          inputRef={titleField}
          initialFocus
          label="Title"
          required
          value={values.title}
          onChangeText={(text) => setField("title", text)}
          onBlur={() => blurField("title")}
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
          inputId={`${id}-message`}
          inputRef={(node) => {
            messageRef.current = node;
            messageField(node);
          }}
          label="Message"
          required
          multiline
          inputMinHeight={compact ? MESSAGE_HEIGHT_COMPACT : MESSAGE_HEIGHT_WIDE}
          value={values.message}
          onChangeText={(text) => setField("message", text)}
          onBlur={() => blurField("message")}
          placeholder="What should residents know or bring?"
          maxLength={L.messageMax}
          autoCapitalize="sentences"
          disabled={submitting}
          error={errors.message}
          counter={`${values.message.length} / ${L.messageMax}`}
        />
        <TextField
          inputId={`${id}-location`}
          inputRef={(node) => {
            locationRef.current = node;
            locationField(node);
          }}
          label="Location or venue"
          required
          leftIcon="map-pin"
          value={values.location}
          onChangeText={(text) => setField("location", text)}
          onBlur={() => blurField("location")}
          placeholder="e.g. Barangay Maslog Health Center"
          maxLength={L.locationMax}
          autoCapitalize="words"
          returnKeyType="done"
          disabled={submitting}
          error={errors.location}
        />
      </View>

      <AudienceSchedulePanel form={form} compact={compact} stackDateTime={panelWidth < DATE_TIME_MIN_WIDTH} />
    </View>
  );
};

export default AnnouncementForm;
