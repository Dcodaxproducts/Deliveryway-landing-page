import {
  LayoutGrid,
  Store,
  List,
  ShoppingBag,
  Monitor,
  Truck,
  UserCog,
  Gift,
  User,
  Printer,
  BarChart3,
  Bell,
} from "lucide-react";
import { PiUsersThree } from "react-icons/pi";
import type { MarketingIcon, TranslatedTextKey } from "@/types/marketing";

export type SidebarSection = "main" | "account";

export interface MenuItem {
  title: string;
  titleKey: TranslatedTextKey;
  href: string;
  icon: MarketingIcon;
  section: SidebarSection;
}

export const menuItems: MenuItem[] = [
  // MAIN
  {
    title: "Dashboard",
    titleKey: "navigation.sidebar.dashboard",
    href: "/",
    icon: LayoutGrid,
    section: "main",
  },
  {
    title: "Restaurant Management",
    titleKey: "navigation.sidebar.restaurantManagement",
    href: "/branches",
    icon: Store,
    section: "main",
  },
  {
    title: "Menu Management",
    titleKey: "navigation.sidebar.menuManagement",
    href: "/menu",
    icon: List,
    section: "main",
  },
  {
    title: "Order Management",
    titleKey: "navigation.sidebar.orderManagement",
    href: "/orders",
    icon: ShoppingBag,
    section: "main",
  },
  {
    title: "POS Management",
    titleKey: "navigation.sidebar.posManagement",
    href: "/pos",
    icon: Monitor,
    section: "main",
  },
  {
    title: "Customer Management",
    titleKey: "navigation.sidebar.customerManagement",
    href: "/customer-settings",
    icon: PiUsersThree,
    section: "main",
  },
  {
    title: "Deliveryman",
    titleKey: "navigation.sidebar.deliveryman",
    href: "/deliveryman",
    icon: Truck,
    section: "main",
  },
  {
    title: "Employees",
    titleKey: "navigation.sidebar.employees",
    href: "/employees-settings",
    icon: UserCog,
    section: "main",
  },
  {
    title: "Promotion Management",
    titleKey: "navigation.sidebar.promotionManagement",
    href: "/promotion-management",
    icon: Gift,
    section: "main",
  },

  // ACCOUNT SETTINGS
  {
    title: "Profile",
    titleKey: "navigation.sidebar.profile",
    href: "/profile",
    icon: User,
    section: "account",
  },
  {
    title: "Auto-Printing / POS",
    titleKey: "navigation.sidebar.autoPrintingPos",
    href: "/auto-printing",
    icon: Printer,
    section: "account",
  },
  {
    title: "Reports & Payouts",
    titleKey: "navigation.sidebar.reportsPayouts",
    href: "/reports",
    icon: BarChart3,
    section: "account",
  },
  {
    title: "Notification Settings",
    titleKey: "navigation.sidebar.notificationSettings",
    href: "/notification-settings",
    icon: Bell,
    section: "account",
  },
];
