import { useState } from "react";
import { Text, View, type NativeSyntheticEvent, type TextInputKeyPressEventData } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import SearchField from "@/components/ui/SearchField";

import { useIdentitySearch } from "../../hooks/useIdentitySearch";
import type { ResidentIdentity } from "../../types";
import ResidentDropdown from "./ResidentDropdown";

// The server returns at most this many matches (medicalIdentityLookup PICKER_LIMIT).
const RESULT_CAP = 10;

/** A search box whose matches drop down beneath it; picking one fills the Resident section. */
const ResidentPicker = ({ onPick }: { onPick: (identity: ResidentIdentity) => void }) => {
  const palette = useQueuePalette();
  const search = useIdentitySearch();
  const [activeIndex, setActiveIndex] = useState(-1);
  const open = !search.tooShort;

  const setQuery = (text: string) => {
    search.setQuery(text);
    setActiveIndex(-1);
  };

  // Web keyboards: arrows move through the matches, Enter picks the highlighted one.
  const onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const { key } = event.nativeEvent;
    const count = search.results.length;
    if (!open || count === 0) return;
    if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (key === "ArrowDown" ? (current + 1) % count : (current - 1 + count) % count));
    } else if (key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      onPick(search.results[activeIndex]);
    }
  };

  return (
    <View>
      <SearchField
        value={search.query}
        onChangeText={setQuery}
        onKeyPress={onKeyPress}
        open={open}
        placeholder="Name, master list ID or birth date"
        accessibilityLabel="Search the master list for the resident"
      />
      {open ? (
        <ResidentDropdown
          results={search.results}
          searching={search.searching}
          error={search.error}
          activeIndex={activeIndex}
          onHover={setActiveIndex}
          onPick={onPick}
          capped={search.results.length >= RESULT_CAP}
        />
      ) : (
        <Text className="pt-2 text-[12.5px] leading-[18px]" style={{ color: palette.muted }}>
          Type at least two letters of the name, the master list ID, or a birth date as YYYY-MM-DD.
        </Text>
      )}
    </View>
  );
};

export default ResidentPicker;
