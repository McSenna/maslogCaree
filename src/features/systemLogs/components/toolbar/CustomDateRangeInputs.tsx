import { TextInput, View } from "react-native";

import { CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type Props = {
  customFrom: string;
  customTo: string;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
};

const CustomDateRangeInputs = ({
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: Props) => {
  const palette = useAdminSurfacePalette();

  const fields = [
    {
      value: customFrom,
      onChange: onCustomFromChange,
      placeholder: "From (YYYY-MM-DD)",
      label: "Custom range start date",
    },
    {
      value: customTo,
      onChange: onCustomToChange,
      placeholder: "To (YYYY-MM-DD)",
      label: "Custom range end date",
    },
  ];

  return (
    <View className="w-full flex-row flex-wrap gap-3">
      {fields.map((field) => (
        <TextInput
          key={field.label}
          value={field.value}
          onChangeText={field.onChange}
          placeholder={field.placeholder}
          placeholderTextColor={palette.subtle}
          accessibilityLabel={field.label}
          autoCapitalize="none"
          autoCorrect={false}
          className="min-w-0 flex-1 border px-3.5 text-[14px]"
          style={
            {
              height: CONTROL_HEIGHT,
              borderRadius: RADIUS.control,
              backgroundColor: palette.cardBg,
              borderColor: palette.cardBorder,
              color: palette.body,
              outlineStyle: "none",
            } as never
          }
        />
      ))}
    </View>
  );
};

export default CustomDateRangeInputs;
