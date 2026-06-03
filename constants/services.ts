
import { Calendar, CreditCard, Factory } from "lucide-react"; 
import type { ServiceConfig, TranslatedTextKey } from "@/types/marketing";

interface ServiceStatConfig {
  value: string;
  label: string;
  labelKey: TranslatedTextKey;
}

export const services: ServiceConfig[] = [
  {
    icon: Factory,
    title: "Inventory Management",
    titleKey: "services.items.inventoryManagement.title",
    description:
      "Real-time tracking of ingredients, waste monitoring, and automated reordering to keep your costs down and kitchen running smoothly.",
    descriptionKey: "services.items.inventoryManagement.description",
  },
  {
    icon: Calendar,
    title: "Staff Scheduling",
    titleKey: "services.items.staffScheduling.title",
    description:
      "Easily manage shifts, monitor labor costs, and streamline employee communication with our intuitive drag-and-drop scheduling tool.",
    descriptionKey: "services.items.staffScheduling.description",
  },
  {
    icon: CreditCard,
    title: "POS Integration",
    titleKey: "services.items.posIntegration.title",
    description:
      "Connect your existing hardware seamlessly. Sync orders, payments, and kitchen displays in real-time for zero friction service.",
    descriptionKey: "services.items.posIntegration.description",
  },
];


export const stats: ServiceStatConfig[] = [
  { value: "500+", label: "Locations Supported", labelKey: "services.stats.locationsSupported.label" },
  { value: "99%", label: "Customer Satisfaction", labelKey: "services.stats.customerSatisfaction.label" },
];
