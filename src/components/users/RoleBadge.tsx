import { Text, View } from "react-native";
import type { AdminUser } from "@/services/userService";

type Role = AdminUser["role"];

const ROLE_CONFIG: Record<
  Role,
  { label: string; bg: string; text: string; border: string }
> = {
  admin: {
    label: "Admin",
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  doctor: {
    label: "Doctor",
    bg: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  midwife: {
    label: "Midwife",
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  bhw: {
    label: "Barangay Health Worker",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  resident: {
    label: "Resident",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
};

type RoleBadgeProps = {
  role: Role;
  size?: "sm" | "md";
};

export default function RoleBadge({ role, size = "sm" }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role] ?? {
    label: role,
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  };

  const textSize = size === "md" ? "text-xs" : "text-[10px]";
  const padding = size === "md" ? "px-2.5 py-1" : "px-2 py-0.5";

  return (
    <View
      className={`rounded-full border ${config.bg} ${config.border} ${padding} self-start`}
    >
      <Text className={`${textSize} font-semibold ${config.text}`}>
        {config.label}
      </Text>
    </View>
  );
}
