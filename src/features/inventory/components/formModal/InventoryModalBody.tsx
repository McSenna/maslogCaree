import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

import { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";

import { RADIUS, useInventoryPalette } from "../inventoryTheme";

type Props = {
  isMobile: boolean;
  error?: string | null;
  children: ReactNode;
};

const InventoryModalBody = ({ isMobile, error, children }: Props) => {
  const palette = useInventoryPalette();

  return (
    <ScrollView
      style={SHEET_SCROLL_STYLE}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: isMobile ? 16 : 20, gap: 14 }}
    >
      {children}

      {error ? (
        <View
          className="flex-row items-start gap-2 border p-3"
          style={{
            borderRadius: RADIUS.control,
            backgroundColor: "#FEF2F2",
            borderColor: "#FECACA",
          }}
        >
          <Feather name="alert-circle" size={14} color={palette.danger} />
          <Text
            className="min-w-0 flex-1 text-[12.5px] font-medium"
            style={{ color: palette.danger }}
          >
            {error}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default InventoryModalBody;
