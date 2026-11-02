import { Pressable, Text } from "react-native";

type NameButtonProps = { name: string; onPress: () => void; phone?: boolean; singleLine?: boolean };

/** The user's name, which opens their profile. Web hover turns it brand and underlines it. */
const NameButton = ({ name, onPress, phone, singleLine = false }: NameButtonProps) => {
  return (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityHint="Opens the profile"
    hitSlop={{ top: 8, bottom: 8 }}
    className="max-w-full self-start web:cursor-pointer"
  >
    {({ hovered, pressed }) => (
      <Text
        numberOfLines={singleLine ? 1 : 2}
        className={`font-semibold ${hovered || pressed ? "text-brand underline" : "text-ink"}`}
        style={{ fontSize: phone ? 17 : 15.5 }}
      >
        {name}
      </Text>
    )}
  </Pressable>
  );
};

export default NameButton;
