import { Feather } from "@expo/vector-icons";
import { Image, View } from "react-native";

export type ProfileAvatarProps = {
  size?: number;
  imageUrl?: string | null;
  verified?: boolean;
};

export default function ProfileAvatar({
  size = 72,
  imageUrl,
  verified = false,
}: ProfileAvatarProps) {
  const radius = size / 2;

  return (
    <View className="relative">
      <View
        className="items-center justify-center rounded-full bg-sky-100"
        style={{ width: size, height: size }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: size, height: size, borderRadius: radius }}
          />
        ) : (
          <Feather name="user" size={size * 0.45} color="#0EA5E9" />
        )}
      </View>
      {verified && (
        <View className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5">
          <Feather name="check" size={12} color="#fff" />
        </View>
      )}
    </View>
  );
}

