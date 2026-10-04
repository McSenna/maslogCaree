import SearchField from "@/components/ui/SearchField";

import type { MasterListState } from "../hooks/useMasterList";

type Props = { list: MasterListState; phone?: boolean };

/** Search for the master list; nothing here touches accounts. */
const MasterListToolbar = ({ list, phone = false }: Props) => (
  <SearchField
    value={list.queryInput}
    onChangeText={list.setQuery}
    placeholder="Search name or record ID"
    accessibilityLabel="Search the master list"
    style={phone ? undefined : { width: 300 }}
  />
);

export default MasterListToolbar;
