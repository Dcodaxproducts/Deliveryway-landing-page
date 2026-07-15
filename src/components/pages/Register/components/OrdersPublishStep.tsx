"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingBag,
  Bike,
  UtensilsCrossed,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";

type OrdersPublishTab = "orders" | "publish";

const ORDER_TYPES = [
  {
    labelKey: "settings.orderTypes.takeaway.label",
    descriptionKey: "settings.orderTypes.takeaway.description",
    icon: <ShoppingBag className="text-primary" size={28} />,
    enabled: true,
  },
  {
    labelKey: "settings.orderTypes.delivery.label",
    descriptionKey: "settings.orderTypes.delivery.description",
    icon: <Bike className="text-primary" size={28} />,
  },
  {
    labelKey: "settings.orderTypes.dineIn.label",
    descriptionKey: "settings.orderTypes.dineIn.description",
    icon: <UtensilsCrossed className="text-primary" size={28} />,
  },
];

export function OrdersPublishStep() {
  const tCommon = useTranslations("common");
  const tRegister = useTranslations("register");
  const [activeTab, setActiveTab] = useState<OrdersPublishTab>("orders");

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl p-8">
      {/* ================= TABS ================= */}
      <div className="flex justify-center gap-12 mb-12 relative">
        {(["orders", "publish"] as OrdersPublishTab[]).map((tab) => (
          <TabButton
            key={tab}
            active={activeTab === tab}
            label={tRegister(`ordersPublish.tabs.${tab}`)}
            tab={tab}
            onSelect={setActiveTab}
          />
        ))}
      </div>

      {/* ================= ORDERS ================= */}
      {activeTab === "orders" && (
        <>
        <div className="px-20">
          {/* Order Types */}
          <h2 className="text-lg font-semibold mb-6">
            {tRegister("settings.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ORDER_TYPES.map((type) => (
              <OrderTypeCard
                key={type.labelKey}
                icon={type.icon}
                title={tRegister(type.labelKey)}
                description={tRegister(type.descriptionKey)}
                enabled={type.enabled}
              />
            ))}
          </div>

          {/* Order Processing */}
          <h2 className="text-lg font-semibold mt-12 mb-4">
            {tRegister("ordersPublish.orderProcessing")}
          </h2>

          <div className="flex items-center justify-between bg-[#F5F5F5] rounded-xl px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="text-white" size={14} />
              </span>
              <span className="font-medium">
                {tRegister("branch.delivery.automation.autoAcceptLabel")}
              </span>
            </div>

            <Switch />
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-12">
            <Button className="bg-primary hover:bg-red-800 px-16 py-3 rounded-[14px]">
              {tCommon("actions.saveContinue")}
            </Button>
          </div>
          </div>
        </>
      )}

      {/* ================= PUBLISH ================= */}
      {activeTab === "publish" && (
        <>
          <div className="max-w-xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">
              {tRegister("publish.storeUsername")}
            </h2>

            {/* Store Name */}
            <div className="mb-6">
              <Label className="mb-2 block">
                {tRegister("publish.nameLabel")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={tRegister("publish.uniqueUrl")}
                  className="border-[#BBBBBB]"
                />
                <span className="text-sm text-gray-600">
                  .food.com
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {tRegister("publish.chooseUniqueUsername")}
              </p>
            </div>

            {/* Suggestions */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">
                {tRegister("publish.suggestions")}
              </p>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <span>example</span>
                <span>example</span>
                <span>example</span>
                <span>example</span>
              </div>
            </div>

            {/* Preview URL */}
            <div className="bg-[#F8F8F8] rounded-xl p-4 mb-8">
              <p className="text-sm text-primary font-medium">
                {tRegister("publish.previewUrl")}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                https://food.com
              </p>
            </div>

            {/* Publish Button */}
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-red-800 px-20 py-3 rounded-[14px]">
                {tRegister("publish.publishStore")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= REUSABLE CARD ================= */

function TabButton({
  active,
  label,
  onSelect,
  tab,
}: {
  active: boolean;
  label: string;
  onSelect: (tab: OrdersPublishTab) => void;
  tab: OrdersPublishTab;
}) {
  const handleClick = useCallback(() => {
    onSelect(tab);
  }, [onSelect, tab]);

  return (
    <button
      onClick={handleClick}
      className={`text-sm font-medium pb-2 relative ${
        active ? "text-black" : "text-gray-600"
      }`}
    >
      {label}
      {active && (
        <span className="absolute left-[-14px] right-[-14px] -bottom-1 h-[2px] bg-primary rounded-full" />
      )}
    </button>
  );
}

function OrderTypeCard({
  icon,
  title,
  description,
  enabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="bg-[#F5F5F5] rounded-2xl py-10 px-12 flex flex-col items-center text-center">
      {icon}

      <h3 className="font-medium mt-4">{title}</h3>

      <p className="text-sm text-gray-600 mt-2 mb-6">
        {description}
      </p>

      <Switch defaultChecked={enabled} />
    </div>
  );
}
