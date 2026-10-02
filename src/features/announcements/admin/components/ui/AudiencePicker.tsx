import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";

import type { AudienceFilter } from "../../adminAnnouncement.types";
import { AUDIENCE_FILTERS, AUDIENCE_FILTER_LABELS } from "../../adminAnnouncementModel";

const OPTIONS: SelectOption<AudienceFilter>[] = AUDIENCE_FILTERS.map((value) => ({ value, label: AUDIENCE_FILTER_LABELS[value] }));

const FIXED = { width: 170 };
const FILL = { flex: 1, minWidth: 140 };

type AudiencePickerProps = {
  value: AudienceFilter;
  onChange: (value: AudienceFilter) => void;
  /** Fixed width beside the search on wide toolbars; shares the row on phones. */
  fixed?: boolean;
};

/** The dashboard's dropdown, filtering by who an announcement is for. */
const AudiencePicker = ({ value, onChange, fixed }: AudiencePickerProps) => (
  <SelectMenu label="Audience" value={value} options={OPTIONS} onChange={onChange} height={CONTROL_HEIGHT} style={fixed ? FIXED : FILL} />
);

export default AudiencePicker;
