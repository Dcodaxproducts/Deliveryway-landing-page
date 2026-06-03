"use client";

import { useTranslations } from "next-intl";

function getStatusKey(status: string): "active" | "inactive" | null {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "active") {
        return "active";
    }

    if (normalizedStatus === "inactive") {
        return "inactive";
    }

    return null;
}

export function StatusBadge({ status }: { status: string }) {
    const t = useTranslations("common.status");
    const statusKey = getStatusKey(status);

    return (
        <span className={`text-sm ${status === 'Active' ? 'text-green' : 'text-primary'}`}>
            {statusKey ? t(statusKey) : status}
        </span>
    );
}
