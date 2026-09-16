import { SERVICE_TYPES } from "@/config/appointmentServices";
import type { ConsultationCategory } from "@/services/appointments";
import { formatRoleLabel } from "@/utils/roleLabel";
import type { SelectOption } from "../../components/FormSelectField";

const withHandler = (description?: string, queueRole?: string): string | undefined => {
  const handler = formatRoleLabel(queueRole);
  if (!handler) return description;
  return description ? `${description} · Handled by ${handler}` : `Handled by ${handler}`;
};

export const buildServiceOptions = (categories: ConsultationCategory[]): SelectOption[] =>
  categories.length
    ? categories.map((category) => ({
        id: category.key,
        label: category.label,
        helper: withHandler(category.description, category.queueRole),
      }))
    : SERVICE_TYPES.map((service) => ({
        id: service.id,
        label: service.label,
        helper: withHandler(service.description, service.queueRole),
      }));
