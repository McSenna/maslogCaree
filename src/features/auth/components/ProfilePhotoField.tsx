import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import FieldError from "./FieldError";

type ProfilePhotoFieldProps = {
  /** A base64 data URI, or null before one is chosen. */
  photo: string | null;
  onPress: () => void;
  error?: string;
};

/** Optional avatar, shown as the circle it will become. */
export default function ProfilePhotoField({ photo, onPress, error }: ProfilePhotoFieldProps) {
  return (
    <View className="items-center mb-2">
      <Text className="mb-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
        Profile Photo (Optional)
      </Text>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Add a profile photo"
        className="items-center justify-center"
      >
        {photo ? (
          <View className="relative">
            <Image
              source={{ uri: photo }}
              className="w-24 h-24 rounded-full border-2 border-mc-primary"
            />
            <View className="absolute -bottom-1 -right-1 bg-mc-primary rounded-full p-2 border-2 border-white">
              <Feather name="camera" size={14} color="#fff" />
            </View>
          </View>
        ) : (
          <View className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 items-center justify-center">
            <Feather name="camera" size={28} color="#94A3B8" />
            <Text className="text-[9px] text-slate-400 mt-1">Add Photo</Text>
          </View>
        )}
      </Pressable>

      <FieldError message={error} className="mt-2" />
    </View>
  );
}
