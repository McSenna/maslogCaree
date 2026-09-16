import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { authInputStyles } from "./authInputStyles";

const PasswordToggle = ({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={visible ? "Hide password" : "Show password"}
    onPress={onToggle}
    style={authInputStyles.eyeButton}
    hitSlop={8}
  >
    <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={20} color="#64748B" />
  </Pressable>
);

export default PasswordToggle;
