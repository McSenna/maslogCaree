import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import ServiceCard, { type ServiceCardItem } from "@/components/home/ServiceCard";

const meta = {
  title: "Components/ServiceCard",
  component: ServiceCard,
  decorators: [
    (Story: any) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#F8FAFC" }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Service card component displaying healthcare service options with icon, title, and description. Used in a grid layout.",
      },
    },
  },
} satisfies Meta<typeof ServiceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultService: ServiceCardItem = {
  icon: "activity",
  label: "Appointments",
  desc: "Schedule and manage visits to the Health Center.",
  color: "#2D5BFF",
  bg: "#FFFFFF",
  iconBg: "#EEF2FF",
  border: "#F1F5F9",
  shadow: "#0F172A",
};

/**
 * Default ServiceCard: Appointments
 */
export const Default: Story = {
  args: defaultService,
};

/**
 * ServiceCard variant: Announcements
 */
export const Announcements: Story = {
  args: {
    ...defaultService,
    icon: "bell",
    label: "Announcements",
    desc: "Medical missions, vaccinations & health programs.",
    color: "#D97706",
    iconBg: "#FFFBEB",
  },
};

/**
 * ServiceCard variant: Health Services
 */
export const HealthServices: Story = {
  args: {
    ...defaultService,
    icon: "heart",
    label: "Health Services",
    desc: "Checkups, vaccinations & consultations.",
    color: "#C00707",
    iconBg: "#FF00001A",
  },
};

/**
 * ServiceCard variant: Health Records
 */
export const HealthRecords: Story = {
  args: {
    ...defaultService,
    icon: "shield",
    label: "Health Records",
    desc: "View and manage your digital health history.",
    color: "#EA580C",
    iconBg: "#FFF7ED",
  },
};

/**
 * Mobile viewport (narrow width)
 */
export const Mobile: Story = {
  args: defaultService,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/**
 * Tablet viewport (wider, 2 columns)
 */
export const Tablet: Story = {
  args: defaultService,
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

/**
 * All services in a grid (for layout testing)
 */
export const AllServices: Story = {
  render: () => (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 16 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {[
          {
            icon: "activity",
            label: "Appointments",
            desc: "Schedule and manage visits to the Health Center.",
            color: "#2D5BFF",
            bg: "#FFFFFF",
            iconBg: "#EEF2FF",
            border: "#F1F5F9",
            shadow: "#0F172A",
          },
          {
            icon: "bell",
            label: "Announcements",
            desc: "Medical missions, vaccinations & health programs.",
            color: "#D97706",
            bg: "#FFFFFF",
            iconBg: "#FFFBEB",
            border: "#F1F5F9",
            shadow: "#0F172A",
          },
          {
            icon: "heart",
            label: "Health Services",
            desc: "Checkups, vaccinations & consultations.",
            color: "#C00707",
            bg: "#FFFFFF",
            iconBg: "#FF00001A",
            border: "#F1F5F9",
            shadow: "#0F172A",
          },
          {
            icon: "shield",
            label: "Health Records",
            desc: "View and manage your digital health history.",
            color: "#EA580C",
            bg: "#FFFFFF",
            iconBg: "#FFF7ED",
            border: "#F1F5F9",
            shadow: "#0F172A",
          },
        ].map((service, idx) => (
          <View key={idx} style={{ width: "48%" }}>
            <ServiceCard {...service} />
          </View>
        ))}
      </View>
    </View>
  ),
};

/**
 * Accessibility: High contrast and proper focus states
 */
export const Accessible: Story = {
  args: defaultService,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "link-name",
            enabled: true,
          },
        ],
      },
    },
  },
};
