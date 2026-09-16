import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { CONTROL_HEIGHT, RADIUS, useUsersPalette } from "../usersTheme";

const AddUserButton = ({ onPress, fullWidth = false }: { onPress: () => void; fullWidth?: boolean }) => {
  const palette = useUsersPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add user"
      className="flex-row items-center justify-center gap-2 px-5 active:opacity-85"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: palette.primary,
        alignSelf: fullWidth ? "stretch" : "auto",
      }}
    >
      <Feather name="plus" size={17} color="#FFFFFF" />
      <Text className="text-[14px] font-semibold text-white">Add User</Text>
    </Pressable>
  );
};

export default AddUserButton;
