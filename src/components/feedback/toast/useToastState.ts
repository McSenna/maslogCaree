import { useEffect, useState } from "react";
import { dismissToast, subscribeToToastOffset, subscribeToToasts, type ToastMessage } from "./toastStore";

export const useToastState = () => {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => subscribeToToasts(setMessage), []);
  useEffect(() => subscribeToToastOffset(setBottomOffset), []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => dismissToast(message.id), message.durationMs);
    return () => clearTimeout(timer);
  }, [message]);

  return { message, bottomOffset };
};
