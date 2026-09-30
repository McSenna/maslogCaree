import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { useAnnouncementTheme } from "../../useAnnouncementTheme";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  /** Wide layout: fixed 260px, 40px tall. Phones fill the row at 44px. */
  wide?: boolean;
};

const SearchField = ({ value, onChange, wide }: SearchFieldProps) => {
  const { palette } = useAnnouncementTheme();

  return (
    <View className={`justify-center ${wide ? "w-[260px] shrink" : "min-w-0 flex-1"}`}>
      <View pointerEvents="none" className="absolute left-3 z-10">
        <Search size={16} color={palette.placeholder} strokeWidth={1.9} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search"
        placeholderTextColor={palette.placeholder}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search announcements"
        className={`${wide ? "min-h-10 text-14" : "min-h-11 text-15"} rounded-control border border-field bg-canvas pl-9 pr-10 font-ps text-ink`}
      />
      {value ? (
        <Pressable
          onPress={() => onChange("")}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          className={`absolute right-0 items-center justify-center rounded-control active:bg-neutral web:cursor-pointer ${wide ? "h-10 w-10" : "h-11 w-11"}`}
        >
          <X size={16} color={palette.text2} strokeWidth={1.9} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SearchField;
