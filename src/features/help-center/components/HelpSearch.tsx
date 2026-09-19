import SearchField from "@/components/ui/SearchField";
import { SUPPORT_PLACEHOLDERS } from "../constants/support.constants";

type HelpSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const HelpSearch = ({ value, onChange }: HelpSearchProps) => (
  <SearchField
    value={value}
    onChangeText={onChange}
    placeholder={SUPPORT_PLACEHOLDERS.search}
    accessibilityLabel="Search the MaslogCare Help Center"
    style={{ width: "100%" }}
  />
);

export default HelpSearch;
