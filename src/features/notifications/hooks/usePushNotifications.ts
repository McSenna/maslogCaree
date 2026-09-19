import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { bootstrapPushNotifications, type PushBootstrapResult } from "../services/pushBootstrap";
import { clearPushTokenRegistration } from "../services/pushTokenRegistry";
import { attachNotificationListeners } from "../services/notificationListener.service";
import {
  checkColdStartNotification,
  processNotificationResponse,
} from "../handlers/notificationResponseHandler";
import { getPushCapability } from "../utils/notificationEnvironment";
import type { PushNotificationState, PushSetupStatus } from "../types/pushNotification.types";

type SessionOutcome = { userId: string; result: PushBootstrapResult };

const pending = (status: PushSetupStatus): Omit<PushNotificationState, "capability"> => ({
  status,
  expoPushToken: null,
  permission: null,
  error: null,
});

/**
 * Orchestrates push setup for the signed-in session. Never throws: an unsupported
 * environment or a failed registration degrades to a status the UI can read while
 * the rest of MaslogCare keeps working.
 */
export const usePushNotifications = (): PushNotificationState => {
  const { user } = useAuth();
  const router = useRouter();
  const [outcome, setOutcome] = useState<SessionOutcome | null>(null);

  const userId = user ? String(user.id) : null;
  const role = user?.role ?? null;

  const runBootstrap = useCallback(async (id: string, isActive: () => boolean) => {
    const result = await bootstrapPushNotifications(id);
    if (isActive()) setOutcome({ userId: id, result });
  }, []);

  useEffect(() => {
    if (!userId) {
      clearPushTokenRegistration();
      return;
    }

    let active = true;
    void (async () => {
      const result = await bootstrapPushNotifications(userId);
      if (active) setOutcome({ userId, result });
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !role || !getPushCapability().supportsRemotePush) return;

    const detach = attachNotificationListeners({
      onResponse: (response) => processNotificationResponse(response, role, router),
      onPushTokenChanged: () => {
        clearPushTokenRegistration();
        void runBootstrap(userId, () => true);
      },
    });

    void checkColdStartNotification(role, router);

    return detach;
  }, [userId, role, router, runBootstrap]);

  return useMemo<PushNotificationState>(() => {
    const capability = getPushCapability();
    if (!userId) return { capability, ...pending("idle") };
    if (outcome?.userId !== userId) return { capability, ...pending("initializing") };
    return { capability, ...outcome.result };
  }, [userId, outcome]);
};
