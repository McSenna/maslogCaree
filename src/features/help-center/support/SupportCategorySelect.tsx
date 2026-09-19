import SelectMenu from "@/components/ui/SelectMenu";

import SupportFieldShell from "./SupportFieldShell";
import { SUPPORT_CATEGORIES } from "../constants/support.constants";
import { supportCategoryLabel } from "../utils/support.utils";
import type { SupportCategoryId } from "../types/support.types";

type SupportCategorySelectProps = {
  value: SupportCategoryId | "";
  onChange: (value: SupportCategoryId) => void;
  error?: string;
};

const options = SUPPORT_CATEGORIES.map((entry) => ({ value: entry.id, label: entry.label }));

const SupportCategorySelect = ({ value, onChange, error }: SupportCategorySelectProps) => (
  <SupportFieldShell label="Concern Category" required error={error}>
    <SelectMenu<SupportCategoryId>
      label="Concern category"
      value={(value || options[0].value) as SupportCategoryId}
      displayValue={value ? supportCategoryLabel(value) : "Select a concern category"}
      options={options}
      onChange={onChange}
      icon="shape-outline"
      height={44}
      style={{ width: "100%" }}
    />
  </SupportFieldShell>
);

export default SupportCategorySelect;
