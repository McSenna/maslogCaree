import { useEffect } from "react";
import { Platform } from "react-native";
import { useNavigation } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useAuth } from "@/contexts/AuthContext";

const useClinicalNavigationGuard = (
  dirty: boolean,
  busy: boolean,
  transition: (action: () => void) => void,
) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  // Session expiry must still clear protected screens and their unsaved data.
  const guarded = Boolean(user) && (dirty || busy);
  usePreventRemove(guarded, ({ data }) => {
    transition(() => navigation.dispatch(data.action));
  });
  useEffect(() => {
    if (Platform.OS !== "web" || !guarded) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [guarded]);
};
export default useClinicalNavigationGuard;
