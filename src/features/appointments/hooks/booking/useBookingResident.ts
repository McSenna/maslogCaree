import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatResidentReference } from "../../components/ResidentInfoCard";

/** The signed-in resident as the booking form shows them; the server takes the user from the session. */
export const useBookingResident = () => {
  const { user } = useAuth();
  return useMemo(
    () => ({
      name: user?.name || "Not set",
      residentId: formatResidentReference(user?.id),
      address: user?.address || "Not provided",
      phone: user?.phone || "Not provided",
      email: user?.email || "Not provided",
    }),
    [user]
  );
};
