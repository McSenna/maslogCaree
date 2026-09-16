import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { REG_COLORS, REG_RADIUS } from "../../registrationTheme";

const SelectOptionsSheet = <T extends string>({
  label,
  value,
  options,
  open,
  isSheet,
  onSelect,
  onClose,
}: {
  label: string;
  value: string;
  options: readonly { value: T; label: string }[];
  open: boolean;
  isSheet: boolean;
  onSelect: (value: T) => void;
  onClose: () => void;
}) => (
  <Modal visible={open} transparent animationType={isSheet ? "slide" : "fade"} onRequestClose={onClose}>
    <Pressable
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel={`Close ${label} options`}
      style={{
        flex: 1,
        backgroundColor: REG_COLORS.overlay,
        justifyContent: isSheet ? "flex-end" : "center",
        alignItems: "center",
        padding: isSheet ? 0 : 24,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: isSheet ? undefined : 380,
          backgroundColor: REG_COLORS.surface,
          borderTopLeftRadius: REG_RADIUS.sheet,
          borderTopRightRadius: REG_RADIUS.sheet,
          borderBottomLeftRadius: isSheet ? 0 : REG_RADIUS.sheet,
          borderBottomRightRadius: isSheet ? 0 : REG_RADIUS.sheet,
          paddingVertical: 10,
          paddingBottom: isSheet ? 28 : 10,
        }}
      >
        <Text
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontSize: 13,
            fontWeight: "700",
            color: REG_COLORS.muted,
          }}
        >
          {label}
        </Text>

        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: isSelected }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 48,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 15.5,
                  fontWeight: isSelected ? "600" : "400",
                  color: isSelected ? REG_COLORS.primary : REG_COLORS.text,
                }}
              >
                {option.label}
              </Text>
              {isSelected ? <Feather name="check" size={18} color={REG_COLORS.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  </Modal>
);

export default SelectOptionsSheet;
