import { Phone, Mail } from "lucide-react";
import type { ContactInfoConfig, TranslatedTextKey } from "@/types/marketing";

interface ContactStatConfig {
  value: string;
  label: string;
  labelKey: TranslatedTextKey;
}

// Stats
export const statsData: ContactStatConfig[] = [
  { value: "10k+", label: "Active Restaurants", labelKey: "contact.stats.activeRestaurants.label" },
  { value: "24/7", label: "Live Assistance", labelKey: "contact.stats.liveAssistance.label" },
  { value: "150+", label: "Experts Globally", labelKey: "contact.stats.expertsGlobally.label" },
  { value: "<30m", label: "Avg Response Time", labelKey: "contact.stats.avgResponseTime.label" },
];

// Contact Info
export const contactInfo: ContactInfoConfig[] = [
  {
    icon: <Phone className="w-6 h-6 text-red-600" />,
    title: "Support Phone",
    titleKey: "contact.info.supportPhone.title",
    value: "+1 (888) 123-4567",
    note: "Available 24/7 for Professional & Enterprise plans",
    noteKey: "contact.info.supportPhone.note",
  },
  {
    icon: <Mail className="w-6 h-6 text-red-600" />,
    title: "Sales Email",
    titleKey: "contact.info.salesEmail.title",
    value: "sales@gusto-software.com",
    note: "Response time within 2 business hours",
    noteKey: "contact.info.salesEmail.note",
  },
];

interface OfficeLocationConfig {
  city: string;
  cityKey: TranslatedTextKey;
  address: string;
}

// Office Locations
export const officeLocations: OfficeLocationConfig[] = [
  {
    city: "New York",
    cityKey: "contact.officeLocations.newYork.city",
    address: "450 Lexington Ave, New York, NY 10017",
  },
  {
    city: "London",
    cityKey: "contact.officeLocations.london.city",
    address: "12-16 Hatton Garden, London EC1N 8LE, UK",
  },
];
