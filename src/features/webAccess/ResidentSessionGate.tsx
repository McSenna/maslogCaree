import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import api from "@/services/api";
import PageLoader from "@/components/feedback/PageLoader";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useAuth } from "@/contexts/AuthContext";
import { resumeSocket } from "@/lib/socket";
import {
  isResidentWebBlocked,
  setResidentWebBlocked,
  subscribeResidentWebBlock,
} from "@/services/residentWebBlock";
import { TYPE } from "@/theme/typography";

/** Gate screens inside the navigator so recovery navigation stays mounted. */
const ResidentSessionGate = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<"loading" | "allowed" | "error">(
    "loading",
  );
  const [retry, setRetry] = useState(0);
  const blocked = useSyncExternalStore(
    subscribeResidentWebBlock,
    isResidentWebBlocked,
    () => false,
  );
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const palette = useAdminSurfacePalette();
  useEffect(() => {
    let active = true;
    api
      .get("/session/access")
      .then(() => {
        if (!active) return;
        setResidentWebBlocked(false);
        setState("allowed");
        resumeSocket();
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [retry]);
  // Support keeps its existing account and ticket-ownership authorization.
  if (blocked && pathname === "/resident/support-requests")
    return <>{children}</>;
  if (state === "allowed" && !blocked) return <>{children}</>;
  if (state === "loading" && !blocked) return <PageLoader showLabel={false} />;
  return (
    <View className="flex-1 items-center justify-center gap-4 p-4" style={{ backgroundColor: palette.pageBg }}>
      <Text
        accessibilityRole="header"
        style={[TYPE.headline, { color: palette.heading }]}
      >
        {blocked
          ? "Web access disabled"
          : "Access could not be verified"}
      </Text>
      <Text
        accessibilityLiveRegion="polite"
        style={[TYPE.body, { color: palette.body }]}
      >
        {blocked
          ? "Your web access has been disabled. Please contact the administrator. The mobile app is not affected."
          : "Protected services are unavailable until your access can be checked. Retry or contact the health center."}
      </Text>
      <DashboardButton
        palette={palette}
        label="Check access again"
        loading={state === "loading"}
        onPress={() => {
          setState("loading");
          setRetry((value) => value + 1);
        }}
      />
      {blocked ? (
        <DashboardButton
          palette={palette}
          label="Contact support"
          onPress={() => router.push("/resident/support-requests")}
        />
      ) : null}
      <DashboardButton palette={palette} label="Sign out" onPress={logout} />
    </View>
  );
};
export default ResidentSessionGate;
