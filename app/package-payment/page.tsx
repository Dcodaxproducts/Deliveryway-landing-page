"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, FileText, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/constants";

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

const normalizeResponse = (value: unknown) => {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

export default function PackagePaymentPage() {
  const [storedData, setStoredData] = useState<StoredSubscription>({});
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setStoredData(
        parseStoredSubscription(
          sessionStorage.getItem("deliverywayPackageSubscription")
        )
      );
      setToken(localStorage.getItem("tenantSignupToken") || "");
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
  const cleanedOtp = useMemo(() => otp.replace(/\D/g, "").slice(0, 6), [otp]);
  const canVerifyOtp = Boolean(token) && cleanedOtp.length >= 4;

  const verifyEmail = async () => {
    if (!token) {
      toast.error("Signup token is missing. Please register again.");
      return;
    }

    if (cleanedOtp.length < 4) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/verify-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: cleanedOtp }),
      });
      const payload: unknown = await response.json();
      const responseData = normalizeResponse(payload);

      if (!response.ok) {
        throw new Error(
          getString(responseData.message, "OTP verification failed")
        );
      }

      localStorage.removeItem("tenantSignupToken");
      setVerified(true);
      setToken("");
      setOtp("");
      toast.success("Email verified successfully.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "OTP verification failed"
      );
    } finally {
      setOtpLoading(false);
    }
  };

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
                Your restaurant workspace has been created
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                This package currently requires invoice or manual payment.
                Online card payment for subscriptions is not connected yet.
                Next step: verify your email so the account can continue
                through approval.
              </p>
            </div>
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
                  Invoice or manual payment required
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

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                  <Mail size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-950">
                    Verify your email now
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Enter the OTP sent to the owner email. Verification can be
                    completed before subscription payment is collected.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-md">
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter OTP"
                  value={cleanedOtp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && canVerifyOtp && !otpLoading) {
                      verifyEmail();
                    }
                  }}
                  disabled={verified}
                  className="h-11 text-center font-semibold tracking-[0.3em]"
                />
                <Button
                  type="button"
                  onClick={verifyEmail}
                  disabled={!canVerifyOtp || otpLoading || verified}
                  className="h-11 shrink-0 rounded-xl px-5"
                >
                  {verified
                    ? "Verified"
                    : otpLoading
                      ? "Verifying..."
                      : "Verify email now"}
                </Button>
              </div>
            </div>

            {!token && !verified ? (
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Signup token was not found in this browser. Please complete
                registration again to receive a fresh OTP session.
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl px-5 sm:w-auto"
              >
                Contact support / invoice payment
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
            <CheckCircle2 className="mt-0.5 shrink-0 text-green-700" size={20} />
            <p className="text-sm leading-6 text-green-800">
              Your restaurant, branch, owner, and subscription records are
              created. After email verification, superadmin approval and payment
              handling can continue separately.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
