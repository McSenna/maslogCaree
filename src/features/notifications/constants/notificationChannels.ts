import { Platform } from "react-native";
import { loadNotificationsModule } from "../services/notificationModule";
import { logPushEvent } from "../utils/pushLogger";

export const NOTIFICATION_CHANNELS = {
  DEFAULT: "maslogcare-default",
  APPOINTMENTS: "maslogcare-appointments",
  REMINDERS: "maslogcare-reminders",
  MEDICAL: "maslogcare-medical",
  ACCOUNT: "maslogcare-account",
} as const;

export type NotificationChannelId =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS];

type ChannelDefinition = {
  id: NotificationChannelId;
  name: string;
  description: string;
};

const CHANNELS: ChannelDefinition[] = [
  {
    id: NOTIFICATION_CHANNELS.DEFAULT,
    name: "General Notifications",
    description: "Important updates and announcements from MaslogCare",
  },
  {
    id: NOTIFICATION_CHANNELS.APPOINTMENTS,
    name: "Appointment Updates",
    description: "Approvals, changes, and cancellations for consultations",
  },
  {
    id: NOTIFICATION_CHANNELS.REMINDERS,
    name: "Appointment Reminders",
    description: "Upcoming consultation notices and preparation alerts",
  },
  {
    id: NOTIFICATION_CHANNELS.MEDICAL,
    name: "Medical Records",
    description: "Notifications regarding updated medical summaries",
  },
  {
    id: NOTIFICATION_CHANNELS.ACCOUNT,
    name: "Account & Profile",
    description: "Account approval, status updates, and security notices",
  },
];

let channelsPromise: Promise<void> | null = null;

const createChannels = async (): Promise<void> => {
  const notifications = await loadNotificationsModule();
  if (!notifications) return;

  for (const channel of CHANNELS) {
    await notifications.setNotificationChannelAsync(channel.id, {
      name: channel.name,
      description: channel.description,
      importance: notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0284C7",
      sound: "default",
      enableLights: true,
      enableVibrate: true,
      showBadge: false,
    });
  }
};

/** Idempotent: channels are created once per app session, never per render. */
export const configureNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== "android") return;

  if (!channelsPromise) {
    channelsPromise = createChannels().catch((error: unknown) => {
      channelsPromise = null;
      logPushEvent("failed to configure notification channels", error);
    });
  }

  return channelsPromise;
};
