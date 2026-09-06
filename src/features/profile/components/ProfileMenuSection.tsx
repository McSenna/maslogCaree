import { Text, View } from "react-native";
import ProfileMenuItem, { ProfileMenuItemProps } from "./ProfileMenuItem";


export type ProfileMenuSectionItem = Omit<ProfileMenuItemProps, "showBorder">;

type ProfileMenuSectionProps = {
  title: string;
  items: ProfileMenuSectionItem[];
};


export default function ProfileMenuSection({
  title,
  items,
}: ProfileMenuSectionProps) {
  return (
    <View className="gap-1.5">
      <Text className="px-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </Text>

      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {items.map((item, index) => (
          <ProfileMenuItem
            key={item.label}
            {...item}
            showBorder={index < items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}