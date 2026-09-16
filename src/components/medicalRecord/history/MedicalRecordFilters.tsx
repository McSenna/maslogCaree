import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { DATE_RANGES, RECORD_FILTERS, type DateRangeKey } from "./recordPresenter";

const CONTROL_HEIGHT = 44;

export type FilterState = {
  query: string;
  service: string;
  range: DateRangeKey;
};

const MedicalRecordFilters = ({
  value,
  onChange,
  palette,
  resultCount,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  palette: QueuePalette;
  resultCount: number;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full gap-3">
      <View
        className="w-full min-w-0 flex-row items-center gap-2.5 px-3.5"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          backgroundColor: palette.panelBg,
          borderColor: focused ? palette.primary : palette.panelBorder,
        }}
      >
        <Feather name="search" size={16} color={palette.subtle} />
        <TextInput
          className="min-w-0 flex-1 text-[14px]"
          style={{ color: palette.body, outlineStyle: "none" } as never}
          value={value.query}
          onChangeText={(query) => onChange({ ...value, query })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search by service, provider or date"
          placeholderTextColor={palette.subtle}
          accessibilityLabel="Search medical records"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {value.query ? (
          <Pressable
            onPress={() => onChange({ ...value, query: "" })}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={10}
          >
            <Feather name="x-circle" size={15} color={palette.subtle} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
      >
        {RECORD_FILTERS.map((filter) => {
          const active = value.service === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => onChange({ ...value, service: filter.key })}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Show ${filter.label}`}
              className="items-center justify-center px-3.5 active:opacity-80"
              style={{
                height: 36,
                minWidth: 44,
                borderRadius: QUEUE_RADIUS.pill,
                borderWidth: 1,
                backgroundColor: active ? palette.primarySoft : palette.panelBg,
                borderColor: active ? palette.primary : palette.panelBorder,
              }}
            >
              <Text
                className="text-[12.5px] font-semibold"
                style={{ color: active ? palette.primary : palette.muted }}
              >
                {filter.shortLabel}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="w-full flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-[12px]" style={{ color: palette.muted }}>
          {resultCount === 1 ? "1 record" : `${resultCount} records`}
        </Text>

        <View className="flex-row items-center gap-1.5">
          {DATE_RANGES.map((range) => {
            const active = value.range === range.key;
            return (
              <Pressable
                key={range.key}
                onPress={() => onChange({ ...value, range: range.key })}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={range.label}
                hitSlop={8}
                className="px-2.5 py-1.5 active:opacity-80"
                style={{
                  borderRadius: QUEUE_RADIUS.pill,
                  backgroundColor: active ? palette.primarySoft : "transparent",
                }}
              >
                <Text
                  className="text-[11.5px] font-semibold"
                  style={{ color: active ? palette.primary : palette.subtle }}
                >
                  {range.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default MedicalRecordFilters;
