import type { CSSProperties } from "react";

import { TYPE } from "@/theme/typography";
import { WEB_FONT_STACK } from "@/theme/webFonts";

import { FIELD_LABEL_WIDTH, type ResidentFieldListProps } from "./residentFieldList.types";

const LIST: CSSProperties = { margin: 0, padding: 0, fontFamily: WEB_FONT_STACK };
const ROW: CSSProperties = { display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0" };
const TERM: CSSProperties = {
  flex: `0 0 ${FIELD_LABEL_WIDTH}px`,
  margin: 0,
  fontSize: TYPE.caption.fontSize,
  lineHeight: `${TYPE.caption.lineHeight}px`,
  fontWeight: Number(TYPE.caption.fontWeight),
};
const DEFINITION: CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  margin: 0,
  fontSize: TYPE.body.fontSize,
  lineHeight: `${TYPE.body.lineHeight}px`,
  overflowWrap: "anywhere",
};

/** A real description list, so screen readers announce each label with its value. */
const ResidentFieldList = ({ fields, colors }: ResidentFieldListProps) => (
  <dl style={LIST}>
    {fields.map((field, index) => (
      <div key={field.key} style={{ ...ROW, borderTop: index === 0 ? undefined : `1px solid ${colors.divider}` }}>
        <dt style={{ ...TERM, color: colors.muted }}>{field.label}</dt>
        <dd
          style={{
            ...DEFINITION,
            color: field.recorded ? colors.heading : colors.muted,
            fontStyle: field.recorded ? "normal" : "italic",
          }}
        >
          {field.value}
        </dd>
      </div>
    ))}
  </dl>
);

export default ResidentFieldList;
