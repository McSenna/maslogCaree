import { useCallback, useState } from "react";
import { fetchConsultationCategories, type ConsultationCategory } from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useBookingServices = () => {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const list = await fetchConsultationCategories();
      setCategories(list.filter((category) => category.residentBookable !== false));
    } catch (error: unknown) {
      setCategories([]);
      setServicesError(getApiErrorMessage(error, "Unable to load services. Please try again."));
    } finally {
      setServicesLoading(false);
    }
  }, []);

  return { categories, servicesLoading, servicesError, loadServices };
};
