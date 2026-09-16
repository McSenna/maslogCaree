import type { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import type { MedicalRecord } from "@/services/medicalRecords";

export type ProfileIconName = keyof typeof Feather.glyphMap;

export type ProfileTabKey = "overview" | "appointments" | "records" | "activity";

export type ProfileStat = {
  key: string;
  label: string;
  shortLabel: string;
  value: number;
};

export type ActivityTone = "info" | "success" | "warning";

export type ProfileActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: ProfileIconName;
  tone: ActivityTone;
};

export type ProfileInsights = {
  stats: ProfileStat[];
  appointments: AppointmentRecord[];
  records: MedicalRecord[];
  activity: ProfileActivityItem[];
};

export type ProfileInsightsState = ProfileInsights & {
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export type ProfileInfoGroup = {
  key: string;
  title: string;
  icon: ProfileIconName;
  items: {
    key: string;
    label: string;
    value: string;
    icon: ProfileIconName;
    provided: boolean;
  }[];
};
