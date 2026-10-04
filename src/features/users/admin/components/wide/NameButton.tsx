import { Pressable, Text } from "react-native";

type NameButtonProps = { name: string; onPress: () => void; phone?: boolean };

/** The user's name, which opens their profile. Web hover turns it brand and underlines it. */
const NameButton = ({ name, onPress, phone }: NameButtonProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityHint="Opens the profile"
    hitSlop={{ top: 8, bottom: 8 }}
    className="max-w-full self-start web:cursor-pointer"
  >
    {({ hovered, pressed }) => (
      <Text
        numberOfLines={2}
        className={`font-semibold ${phone ? "text-15" : "text-[13.5px]"} ${hovered || pressed ? "text-brand underline" : "text-ink"}`}
      >
        {name}
      </Text>
    )}
  </Pressable>
);

export default NameButton;
