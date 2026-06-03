"use client";

import { Edit2, Eye, Image as ImageIcon, MessageCircleMore, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

export function ActionButtons(
    {
        type
    }: {
        type?: "default" | "branch"
    }
) {
    const t = useTranslations("common.actions");

    return (
        <div className="flex justify-end items-center px-[10px] py-[10px] border border-[#E6E7EC] rounded-sm w-fit ml-auto divide-x divide-[#E6E7EC]">
            <button className="pr-[11px] text-gray-400" aria-label={type === "branch" ? t("view") : t("edit")} type="button">
                {
                    type === 'branch' ?
                        <Eye size={20} /> :
                        <Edit2 size={20} />
                }
            </button>
            <button className="px-[11px] text-gray-400" aria-label={type === "branch" ? t("image") : t("view")} type="button">
                {
                    type === 'branch' ?
                        <ImageIcon size={20} /> :
                        <Eye size={20} />
                }
            </button>
            <button className="px-[11px] text-gray-400" aria-label={type === "branch" ? t("message") : t("image")} type="button">
                {
                    type === "branch" ?
                        <MessageCircleMore size={20} /> :
                        <ImageIcon size={20} />
                }
            </button>
            <button className="pl-[11px] text-gray-400" aria-label={t("more")} type="button">
                <MoreVertical size={20} />
            </button>
        </div>
    );
}
