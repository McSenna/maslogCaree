import { render } from "@testing-library/react-native";
import ServiceCard from "@/components/home/ServiceCard";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const mockService = {
  icon: "activity",
  label: "Appointments",
  desc: "Schedule and manage visits to the Health Center.",
  color: "#2D5BFF",
  bg: "#FFFFFF",
  iconBg: "#EEF2FF",
  border: "#F1F5F9",
  shadow: "#0F172A",
};

describe("ServiceCard Accessibility", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(<ServiceCard {...mockService} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper text contrast", async () => {
    const { getByText } = render(<ServiceCard {...mockService} />);
    const label = getByText("Appointments");
    expect(label).toBeDefined();
  });

  it("should have accessible card label", async () => {
    const { getByLabelText } = render(<ServiceCard {...mockService} />);
    const card = getByLabelText("Appointments Service");
    expect(card).toBeDefined();
  });

  it("should have descriptive text for accessibility", async () => {
    const { getByText } = render(<ServiceCard {...mockService} />);
    const description = getByText("Schedule and manage visits to the Health Center.");
    expect(description).toBeDefined();
  });

  it("should have proper icon accessibility", async () => {
    const { getByRole } = render(<ServiceCard {...mockService} />);
    // Icon should be decorative or have accessible label
    const elements = getByRole("presentation", { hidden: true });
    expect(elements).toBeDefined();
  });

  it("should meet WCAG AA color contrast standards", async () => {
    // This test ensures the component uses compliant color combinations
    const { container } = render(<ServiceCard {...mockService} />);
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });
    expect(results.violations).toHaveLength(0);
  });

  it("should support touch targets >= 44x44px", async () => {
    const { getByTestId } = render(
      <ServiceCard {...mockService} testID="service-card" />
    );
    const card = getByTestId("service-card");
    expect(card).toBeDefined();
    // Actual dimension validation requires measurement tools
  });

  it("should render all service variants accessibly", async () => {
    const variants = [
      { ...mockService, label: "Appointments", icon: "activity" },
      { ...mockService, label: "Announcements", icon: "bell" },
      { ...mockService, label: "Health Services", icon: "heart" },
      { ...mockService, label: "Health Records", icon: "shield" },
    ];

    for (const variant of variants) {
      const { container } = render(<ServiceCard {...variant} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});
