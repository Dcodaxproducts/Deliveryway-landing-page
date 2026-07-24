"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportSection from "./export";

export default function Filters({ type }: { type?: string }) {
  const t = useTranslations("common.filters");

  return (
    <div className="bg-white p-4 lg:p-[24px] rounded-[14px] lg:border-2 border-[#F3F4F6] space-y-[30px]">
      <div className="flex flex-col gap-[20px] md:flex-row md:items-end md:flex-wrap">
        <div className="flex-1 min-w-[280px] space-y-[6px]">
          <Label>{t("search")}</Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-10 border-[#BBBBBB] focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="w-full md:w-[200px] space-y-[6px]">
          <Label>{t("status")}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="disabled">{t("disabled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "restaurant" && (
          <div className="w-full md:w-[220px] space-y-[6px]">
            <Label>{t("businessModel")}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t("selectModel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commission">{t("commission")}</SelectItem>
                <SelectItem value="subscription">
                  {t("subscription")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {type !== "restaurant" && (
        <div>
          <ExportSection />
        </div>
      )}
    </div>
  );
}
