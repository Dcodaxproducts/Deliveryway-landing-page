"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

type StoredSubscription = {
  registration?: {
    branchId?: unknown;
    restaurantId?: unknown;
    tenantId?: unknown;
  };
  subscription?: {
    id?: unknown;
    packagePlanId?: unknown;
    paymentRequiredNow?: unknown;
    paymentStatus?: unknown;
    plan?: {
      billingInterval?: unknown;
      billingModel?: unknown;
      currency?: unknown;
      name?: unknown;
      planPrice?: unknown;
      trialDays?: unknown;
    };
    status?: unknown;
  };
};

const getString = (value: unknown, fallback = "") => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

const parseStoredSubscription = (value: string | null): StoredSubscription => {
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as StoredSubscription)
      : {};
  } catch {
    return {};
  }
};

export default function PackagePaymentPage() {
  const [storedData, setStoredData] = useState<StoredSubscription>({});

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setStoredData(
        parseStoredSubscription(
          sessionStorage.getItem("deliverywayPackageSubscription")
        )
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const plan = storedData.subscription?.plan;
  const amount = Number(plan?.planPrice);
  const formattedAmount = useMemo(() => {
    if (!Number.isFinite(amount)) return getString(plan?.planPrice, "Pending");

    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: getString(plan?.currency, "PKR"),
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  }, [amount, plan?.currency, plan?.planPrice]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                <CreditCard size={18} />
                Package payment pending
              </div>
              <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                Your subscription is ready for invoice payment
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                DeliveryWays created the tenant subscription during onboarding.
                Online subscription payment is waiting on the dedicated backend
                payment endpoint, so use this screen as the invoice/manual
                payment handoff for now.
              </p>
            </div>

            <Link href="/register" className="shrink-0">
              <Button className="h-11 rounded-xl">
                Verify email later
                <ArrowRight size={17} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Plan
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {getString(plan?.name, "Selected package plan")}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {getString(plan?.billingModel, "PLAN")} ·{" "}
                {getString(plan?.billingInterval, "MONTHLY")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Amount
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {formattedAmount}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Payment status:{" "}
                {getString(storedData.subscription?.paymentStatus, "PENDING")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Subscription ID
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-950">
                {getString(storedData.subscription?.id, "Not available")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Tenant ID
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-950">
                {getString(storedData.registration?.tenantId, "Not available")}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <FileText className="mt-0.5 shrink-0 text-amber-700" size={20} />
              <div>
                <h2 className="text-sm font-semibold text-amber-950">
                  Stripe subscription payment is not connected here yet
                </h2>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Do not use the order payment endpoint for this subscription.
                  Once backend exposes a dedicated subscription payment attempt
                  endpoint, this page can create the Stripe session from the
                  subscription ID.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
            <CheckCircle2 className="mt-0.5 shrink-0 text-green-700" size={20} />
            <p className="text-sm leading-6 text-green-800">
              Your restaurant, branch, owner, and subscription records were
              created successfully. Keep this page open while the invoice or
              manual payment is handled.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
