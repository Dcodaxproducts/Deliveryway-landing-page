import { Phone, Mail, MapPin } from "lucide-react";
import { ReactNode } from "react";

// Stats
export const statsData = [
  { value: "10k+", label: "Active Restaurants" },
  { value: "24/7", label: "Live Assistance" },
  { value: "150+", label: "Experts Globally" },
  { value: "<30m", label: "Avg Response Time" },
];

// Contact Info
export const contactInfo: { icon: ReactNode; title: string; value: string; note: string }[] = [
  {
    icon: <Phone className="w-6 h-6 text-red-600" />,
    title: "Support Phone",
    value: "+1 (888) 123-4567",
    note: "Available 24/7 for Professional & Enterprise plans",
  },
  {
    icon: <Mail className="w-6 h-6 text-red-600" />,
    title: "Sales Email",
    value: "sales@gusto-software.com",
    note: "Response time within 2 business hours",
  },
];

// Office Locations
export const officeLocations: { city: string; address: string }[] = [
  {
    city: "New York",
    address: "450 Lexington Ave, New York, NY 10017",
  },
  {
    city: "London",
    address: "12-16 Hatton Garden, London EC1N 8LE, UK",
  },
];
