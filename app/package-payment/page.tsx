"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Clock3, CreditCard, FileText, Mail } from "lucide-react";
import { toast } from "sonner";

import { StorePublished } from "@/components/register/StorePublished";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/constants";

type StoredSubscription = {
  emailVerified?: boolean;
  formData?: PublishedFormSummary;
  registration?: {
    branchId?: unknown;
    branchAdminCredentials?: {
      email?: unknown;
      password?: unknown;
    };
    email?: unknown;
    ownerId?: unknown;
    restaurant?: {
      id?: unknown;
      restaurantId?: unknown;
    };
    restaurantId?: unknown;
    tenantId?: unknown;
    user?: {
      email?: unknown;
      firstName?: unknown;
      lastName?: unknown;
    };
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

type PublishedFormSummary = {
  branch?: {
    name?: string;
  };
  restaurant?: {
    name?: string;
  };
  tenant?: {
    name?: string;
  };
  user?: {
    email?: string;
    password?: string;
  };
};

type PaymentSession = {
  clientSecret: string;
  paymentIntentId?: string;
  provider?: string;
  publishableKey: string;
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

const getPaymentSession = (value: unknown): PaymentSession | null => {
  const record = normalizeResponse(value);
  const data = normalizeResponse(record.data);
  const transaction = normalizeResponse(data.transaction);
  const providerData = normalizeResponse(transaction.providerData);
  const paymentSession = normalizeResponse(
    record.paymentSession || data.paymentSession || providerData
  );
  const clientSecret = getString(paymentSession.clientSecret);
  const publishableKey = getString(paymentSession.publishableKey);

  if (!clientSecret || !publishableKey) return null;

  return {
    clientSecret,
    paymentIntentId: getString(paymentSession.paymentIntentId),
    provider: getString(paymentSession.provider),
    publishableKey,
  };
};

const buildPublishedFormData = (
  storedData: StoredSubscription
): PublishedFormSummary => {
  return {
    branch: {
      name: storedData.formData?.branch?.name,
    },
    restaurant: {
      name: storedData.formData?.restaurant?.name,
    },
    tenant: {
      name: storedData.formData?.tenant?.name,
    },
    user: {
      email:
        storedData.formData?.user?.email ||
        getString(storedData.registration?.email) ||
        getString(storedData.registration?.user?.email),
    },
  };
};

export default function PackagePaymentPage() {
  const [storedData, setStoredData] = useState<StoredSubscription>({});
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(
    null
  );
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextStoredData = parseStoredSubscription(
        sessionStorage.getItem("deliverywayPackageSubscription")
      );
      setStoredData(nextStoredData);
      setToken(localStorage.getItem("tenantSignupToken") || "");
      setVerified(nextStoredData.emailVerified === true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!verified || !paymentConfirmed) return;
    localStorage.removeItem("tenantSignupToken");
    setToken("");
  }, [paymentConfirmed, verified]);

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
  const canVerifyOtp = Boolean(token) && cleanedOtp.length === 6;
  const subscriptionId = getString(storedData.subscription?.id);
  const ownerEmail =
    storedData.formData?.user?.email ||
    getString(storedData.registration?.email) ||
    getString(storedData.registration?.user?.email);
  const restaurantId =
    getString(storedData.registration?.restaurantId) ||
    getString(storedData.registration?.restaurant?.id) ||
    getString(storedData.registration?.restaurant?.restaurantId);
  const paymentPublishableKey = paymentSession?.publishableKey || "";
  const stripePromise = useMemo(
    () => (paymentPublishableKey ? loadStripe(paymentPublishableKey) : null),
    [paymentPublishableKey]
  );

  const createSubscriptionPaymentAttempt = async () => {
    if (!subscriptionId) {
      toast.error("Subscription ID is missing. Please register again.");
      return;
    }

    if (!token) {
      toast.error("Signup session is missing. Please register again.");
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/payments/subscriptions/${subscriptionId}/attempts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currency: getString(plan?.currency) || undefined,
            note: "Initial plan payment",
          }),
        }
      );
      const payload: unknown = await response.json();
      const responseData = normalizeResponse(payload);

      if (!response.ok) {
        throw new Error(
          getString(
            responseData.message,
            "Unable to start subscription payment"
          )
        );
      }

      const nextPaymentSession = getPaymentSession(payload);

      if (!nextPaymentSession) {
        throw new Error("Stripe payment session was not returned.");
      }

      setPaymentSession(nextPaymentSession);
      toast.success("Secure payment form is ready.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start subscription payment"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!token) {
      toast.error("Signup token is missing. Please register again.");
      return;
    }

    if (cleanedOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP sent to your email.");
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

      const nextStoredData = {
        ...storedData,
        emailVerified: true,
      };
      sessionStorage.setItem(
        "deliverywayPackageSubscription",
        JSON.stringify(nextStoredData)
      );
      setStoredData(nextStoredData);
      setVerified(true);
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

  const resendVerificationOtp = async () => {
    if (!ownerEmail) {
      toast.error("Owner email was not found. Please complete registration again.");
      return;
    }

    setResendOtpLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: ownerEmail,
          ...(restaurantId ? { restaurantId } : {}),
          purpose: "VERIFICATION",
        }),
      });
      const payload: unknown = await response.json();
      const responseData = normalizeResponse(payload);

      if (!response.ok) {
        throw new Error(getString(responseData.message, "Unable to resend OTP."));
      }

      toast.success(getString(responseData.message, "If account exists, OTP has been sent"));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to resend OTP.");
    } finally {
      setResendOtpLoading(false);
    }
  };

  const publishedFormData = useMemo(
    () => buildPublishedFormData(storedData),
    [storedData]
  );
  const publishedData = storedData.registration || null;

  if (verified) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-3xl border border-green-100 bg-green-50 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-green-700"
                  size={22}
                />
                <div>
                  <p className="text-base font-semibold text-green-950">
                    Email verified successfully
                  </p>
                  <p className="mt-1 text-sm leading-6 text-green-800">
                    Your workspace is created and your email is verified. If
                    your package payment is still pending, complete the secure
                    payment step below so the team can continue approval.
                  </p>
                </div>
              </div>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-xl border-green-200 bg-white px-5 text-green-800 hover:bg-green-100 sm:w-auto"
                >
                  Contact support
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SubscriptionPaymentSection
              canStartPayment={Boolean(token && subscriptionId)}
              formattedAmount={formattedAmount}
              loading={paymentLoading}
              onStartPayment={createSubscriptionPaymentAttempt}
              paymentConfirmed={paymentConfirmed}
              paymentSession={paymentSession}
              setPaymentConfirmed={setPaymentConfirmed}
              stripePromise={stripePromise}
            />
          </div>
        </section>

        <StorePublished
          formData={publishedFormData}
          publishedData={publishedData}
          variant="pendingApproval"
        />
      </main>
    );
  }

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
                Your workspace has been created. This package requires invoice
                or manual payment before final activation. Please verify your
                email now so your account can continue through review.
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
                  Secure package payment
                </h2>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Pay this package online with Stripe. After payment is
                  confirmed, Stripe notifies the platform and your subscription
                  status is updated automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <SubscriptionPaymentSection
              canStartPayment={Boolean(token && subscriptionId)}
              formattedAmount={formattedAmount}
              loading={paymentLoading}
              onStartPayment={createSubscriptionPaymentAttempt}
              paymentConfirmed={paymentConfirmed}
              paymentSession={paymentSession}
              setPaymentConfirmed={setPaymentConfirmed}
              stripePromise={stripePromise}
            />
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
                    completed alongside your package payment.
                  </p>
                  {ownerEmail ? (
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      OTP sent to {ownerEmail}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-md">
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
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
                  disabled={!canVerifyOtp || otpLoading || resendOtpLoading || verified}
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

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={resendVerificationOtp}
                disabled={resendOtpLoading || otpLoading || verified || !ownerEmail}
                className="h-10 rounded-xl px-4"
              >
                {resendOtpLoading ? "Sending OTP..." : "Resend OTP"}
              </Button>
            </div>

            {!token && !verified ? (
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                We could not find the email verification session in this
                browser. If you already verified your email, you can continue
                with the payment support step. Otherwise, please restart
                registration to receive a fresh OTP.
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
            <Clock3 className="mt-0.5 shrink-0 text-green-700" size={20} />
            <p className="text-sm leading-6 text-green-800">
              Your restaurant profile, branch, owner account, and package
              subscription have been created. After email verification, payment
              confirmation and account approval will continue.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

type SubscriptionPaymentSectionProps = {
  canStartPayment: boolean;
  formattedAmount: string;
  loading: boolean;
  onStartPayment: () => void;
  paymentConfirmed: boolean;
  paymentSession: PaymentSession | null;
  setPaymentConfirmed: (confirmed: boolean) => void;
  stripePromise: ReturnType<typeof loadStripe> | null;
};

function SubscriptionPaymentSection({
  canStartPayment,
  formattedAmount,
  loading,
  onStartPayment,
  paymentConfirmed,
  paymentSession,
  setPaymentConfirmed,
  stripePromise,
}: SubscriptionPaymentSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            Pay package online
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Complete the selected package payment securely. Amount due:{" "}
            <span className="font-semibold text-slate-950">
              {formattedAmount}
            </span>
            .
          </p>
        </div>

        <Button
          type="button"
          onClick={onStartPayment}
          disabled={!canStartPayment || loading || Boolean(paymentSession)}
          className="h-11 shrink-0 rounded-xl px-5"
        >
          {loading
            ? "Preparing..."
            : paymentSession
              ? "Payment form ready"
              : "Start secure payment"}
        </Button>
      </div>

      {!canStartPayment ? (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          We could not find the active signup session for this browser. Please
          complete registration again if you need to start a new online payment.
        </p>
      ) : null}

      {paymentSession && stripePromise ? (
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: paymentSession.clientSecret }}
          >
            <SubscriptionPaymentForm
              paymentConfirmed={paymentConfirmed}
              setPaymentConfirmed={setPaymentConfirmed}
            />
          </Elements>
        </div>
      ) : null}
    </div>
  );
}

function SubscriptionPaymentForm({
  paymentConfirmed,
  setPaymentConfirmed,
}: {
  paymentConfirmed: boolean;
  setPaymentConfirmed: (confirmed: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [confirming, setConfirming] = useState(false);

  const submitPayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe payment form is still loading.");
      return;
    }

    setConfirming(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        throw new Error(error.message || "Payment could not be confirmed.");
      }

      if (
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "processing"
      ) {
        setPaymentConfirmed(true);
        toast.success(
          paymentIntent.status === "succeeded"
            ? "Payment confirmed successfully."
            : "Payment is processing. We will update the subscription shortly."
        );
        return;
      }

      toast.info("Payment confirmation is pending. Please check again shortly.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Payment confirmation failed"
      );
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      {paymentConfirmed ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Payment confirmed. Your subscription will update automatically after
          Stripe webhook confirmation.
        </div>
      ) : (
        <>
          <PaymentElement />
          <Button
            type="button"
            onClick={submitPayment}
            disabled={!stripe || !elements || confirming}
            className="h-11 rounded-xl px-5"
          >
            {confirming ? "Confirming..." : "Confirm package payment"}
          </Button>
        </>
      )}
    </div>
  );
}
