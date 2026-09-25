import { useRouter, type Href } from "expo-router";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { getHeaderPalette } from "./headerTokens";

type MobileNotificationsLinkProps = {
  href: string;
  isDark: boolean;
};

const noop = () => undefined;

const MobileNotificationsLink = ({ href, isDark }: MobileNotificationsLinkProps) => {
  const router = useRouter();
  const palette = getHeaderPalette(isDark);
  const { unreadCount } = useNotificationsContext();

  return (
    <NotificationBell
      unreadCount={unreadCount}
      onPress={() => router.push(href as Href)}
      onMeasure={noop}
      indicator="count"
      iconSize={21}
      hitSize={40}
      color={palette.icon}
      ringColor={palette.background}
    />
  );
};

export default MobileNotificationsLink;
