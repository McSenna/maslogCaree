import { ChevronDown } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { AudienceFilter } from "../../adminAnnouncement.types";
import { AUDIENCE_FILTER_LABELS } from "../../adminAnnouncementModel";
import { useAnnouncementTheme } from "../../useAnnouncementTheme";
import AudienceOptions, { type MenuAnchor } from "./AudienceOptions";

type AudiencePickerProps = {
  value: AudienceFilter;
  onChange: (value: AudienceFilter) => void;
  /** Wide layout opens a menu under the field; phones get a bottom sheet. */
  wide?: boolean;
};

const AudiencePicker = ({ value, onChange, wide }: AudiencePickerProps) => {
  const { palette } = useAnnouncementTheme();
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);

  const open = () => {
    const trigger = triggerRef.current;
    if (!wide || !trigger) {
      setAnchor({ x: 0, y: 0, width: 0 });
      return;
    }
    trigger.measureInWindow((x, y, width, height) => setAnchor({ x, y: y + height + 4, width }));
  };

  const choose = (next: AudienceFilter) => {
    setAnchor(null);
    onChange(next);
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Audience"
        accessibilityValue={{ text: AUDIENCE_FILTER_LABELS[value] }}
        accessibilityState={{ expanded: Boolean(anchor) }}
        className={`${wide ? "min-h-10 w-40" : "min-h-11 min-w-32"} flex-row items-center gap-2 rounded-control border border-field bg-canvas pl-3 pr-2.5 active:bg-neutral web:cursor-pointer`}
      >
        <Text numberOfLines={1} className={`font-ps text-ink ${wide ? "flex-1 text-14" : "shrink text-15"}`}>
          {AUDIENCE_FILTER_LABELS[value]}
        </Text>
        <ChevronDown size={14} color={palette.text2} strokeWidth={2} />
      </Pressable>

      <AudienceOptions
        anchor={anchor}
        wide={wide}
        value={value}
        onChoose={choose}
        onClose={() => setAnchor(null)}
      />
    </>
  );
};

export default AudiencePicker;
