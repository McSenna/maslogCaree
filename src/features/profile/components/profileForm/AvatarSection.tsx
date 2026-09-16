import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import ProfileAvatar from "../ProfileAvatar";

const AvatarSection = ({ imageUrl, onPress }: { imageUrl: string | null; onPress: () => void }) => (
  <View className="items-center">
    <Pressable onPress={onPress} className="rounded-full bg-slate-50 p-1.5 shadow-sm shadow-slate-200">
      <ProfileAvatar size={84} imageUrl={imageUrl} />
      <View className="absolute bottom-1 right-1 rounded-full bg-mc-primary p-1.5">
        <Feather name="camera" size={14} color="#fff" />
      </View>
    </Pressable>
    <Text className="mt-2 text-xs text-slate-500">Tap to change your profile photo</Text>
  </View>
);

export default AvatarSection;
