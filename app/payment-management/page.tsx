"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Banknote,
  CreditCard,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/constants";

type PaymentMethod =
  | "COD"
  | "CARD_ON_DELIVERY"
  | "STRIPE"
  | "PAYPAL"
  | "EASYPAISA"
  | "JAZZCASH"
  | "BANK_TRANSFER"
  | "WALLET";

type StoredRegistration = {
  registration?: {
    restaurant?: {
      id?: unknown;
      restaurantId?: unknown;
    };
    restaurantId?: unknown;
  };
};

type StripeAccountForm = {
  accountId: string;
  dashboardUrl: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  onboardingComplete: boolean;
  note: string;
};

type PaymentSettingsForm = {
  allowedPaymentMethods: PaymentMethod[];
  walletEnabled: boolean;
  note: string;
};

type ManagementSummary = {
  activePlatformPaymentMethods: PaymentMethod[];
  allowedPaymentMethods: PaymentMethod[];
  estimatedAvailableBalance: number | null;
  currency: string;
  recentLedger: Record<string, unknown>[];
  stripeAccount: Record<string, unknown>;
  walletExposure: Record<string, unknown>;
};

const PAYMENT_METHOD_OPTIONS: Array<{ label: string; value: PaymentMethod }> = [
  { label: "Cash on delivery", value: "COD" },
  { label: "Card on delivery", value: "CARD_ON_DELIVERY" },
  { label: "Stripe", value: "STRIPE" },
  { label: "PayPal", value: "PAYPAL" },
  { label: "Easypaisa", value: "EASYPAISA" },
  { label: "JazzCash", value: "JAZZCASH" },
  { label: "Bank transfer", value: "BANK_TRANSFER" },
  { label: "Wallet", value: "WALLET" },
];

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = ["COD", "STRIPE", "WALLET"];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const getRecord = (value: unknown) => {
  return isRecord(value) ? value : {};
};

const getString = (value: unknown, fallback = "") => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

const getBoolean = (value: unknown, fallback = false) => {
  return typeof value === "boolean" ? value : fallback;
};

const getNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizePaymentMethod = (value: unknown): PaymentMethod | null => {
  const normalized = getString(value).trim().toUpperCase();
  const option = PAYMENT_METHOD_OPTIONS.find((method) => method.value === normalized);
  return option?.value || null;
};

const normalizePaymentMethods = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .map(normalizePaymentMethod)
    .filter((method): method is PaymentMethod => Boolean(method));
};

const unwrapData = (payload: unknown) => {
  const response = getRecord(payload);
  return response.data ?? payload;
};

const getAuthHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const parseStoredRegistration = () => {
  try {
    const parsed: unknown = JSON.parse(
      sessionStorage.getItem("deliverywayPackageSubscription") || "{}"
    );
    return getRecord(parsed) as StoredRegistration;
  } catch {
    return {};
  }
};

const getStoredRestaurantId = () => {
  const storedData = parseStoredRegistration();
  return getString(
    storedData.registration?.restaurantId ||
      storedData.registration?.restaurant?.id ||
      storedData.registration?.restaurant?.restaurantId
  );
};

const getStoredToken = () => {
  return (
    sessionStorage.getItem("deliverywayPaymentManagementToken") ||
    localStorage.getItem("tenantSignupToken") ||
    ""
  );
};

const formatMoney = (amount: number | null, currency: string) => {
  if (amount === null) return "Not available";

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "PKR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

const pickFirstRecord = (...values: unknown[]) => {
  for (const value of values) {
    if (isRecord(value)) return value;
  }

  return {};
};

const pickFirstArray = (...values: unknown[]) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }

  return [];
};

const normalizeManagementSummary = (
  managementPayload: unknown,
  stripePayload?: unknown
): ManagementSummary => {
  const data = getRecord(unwrapData(managementPayload));
  const restaurant = getRecord(data.restaurant);
  const settings = getRecord(restaurant.settings);
  const payments = getRecord(settings.payments);
  const methods = getRecord(payments.methods);
  const stripeData = getRecord(unwrapData(stripePayload));
  const stripeAccount = pickFirstRecord(
    stripeData,
    data.stripeAccount,
    data.stripe,
    data.restaurantStripeAccount,
    getRecord(data.payout).stripeAccount
  );
  const configuredMethods = pickFirstRecord(
    data.restaurantPaymentMethods,
    data.configuredPaymentMethods,
    data.paymentMethods,
    data.methods,
    methods
  );
  const walletExposure = pickFirstRecord(
    data.customerWalletExposure,
    data.walletExposure,
    data.wallet
  );
  const estimatedAvailableBalance = getNumber(
    data.estimatedAvailableBalance ??
      data.availableBalance ??
      data.estimatedBalance ??
      getRecord(data.balance).estimatedAvailableBalance
  );
  const activePlatformPaymentMethods = normalizePaymentMethods(
    pickFirstArray(
      data.activePlatformPaymentMethods,
      data.platformPaymentMethods,
      data.activePaymentMethods
    )
  );
  const allowedPaymentMethods = normalizePaymentMethods(
    configuredMethods.allowedPaymentMethods ??
      configuredMethods.allowedMethods ??
      configuredMethods.methods
  );
  const recentLedger = pickFirstArray(
    data.recentLedger,
    data.ledger,
    data.recentTransactions,
    data.transactions
  ).filter(isRecord);

  return {
    activePlatformPaymentMethods,
    allowedPaymentMethods,
    currency: getString(data.currency || getRecord(data.balance).currency, "PKR"),
    estimatedAvailableBalance,
    recentLedger,
    stripeAccount,
    walletExposure,
  };
};

export default function PaymentManagementPage() {
  const [restaurantId, setRestaurantId] = useState(() => {
    if (typeof window === "undefined") return "";

    const params = new URLSearchParams(window.location.search);
    return params.get("restaurantId") || getStoredRestaurantId();
  });
  const [token] = useState(() => {
    if (typeof window === "undefined") return "";
    return getStoredToken();
  });
  const [summary, setSummary] = useState<ManagementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [methodsSaving, setMethodsSaving] = useState(false);
  const [stripeSaving, setStripeSaving] = useState(false);
  const [methodsForm, setMethodsForm] = useState<PaymentSettingsForm>({
    allowedPaymentMethods: DEFAULT_PAYMENT_METHODS,
    walletEnabled: true,
    note: "",
  });
  const [stripeForm, setStripeForm] = useState<StripeAccountForm>({
    accountId: "",
    dashboardUrl: "",
    chargesEnabled: false,
    payoutsEnabled: false,
    onboardingComplete: false,
    note: "",
  });

  const canLoad = Boolean(restaurantId && token);

  const applySummaryToForms = useCallback((nextSummary: ManagementSummary) => {
    const stripeAccount = nextSummary.stripeAccount;
    const nextMethods =
      nextSummary.allowedPaymentMethods.length > 0
        ? nextSummary.allowedPaymentMethods
        : DEFAULT_PAYMENT_METHODS;

    setMethodsForm((current) => ({
      ...current,
      allowedPaymentMethods: nextMethods,
      walletEnabled: nextMethods.includes("WALLET"),
    }));
    setStripeForm((current) => ({
      ...current,
      accountId: getString(stripeAccount.accountId || stripeAccount.id),
      dashboardUrl: getString(stripeAccount.dashboardUrl),
      chargesEnabled: getBoolean(stripeAccount.chargesEnabled),
      payoutsEnabled: getBoolean(stripeAccount.payoutsEnabled),
      onboardingComplete: getBoolean(stripeAccount.onboardingComplete),
    }));
  }, []);

  const loadSummary = useCallback(async () => {
    if (!canLoad) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [managementResponse, stripeResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/v1/payments/restaurants/${restaurantId}/management`, {
          headers: getAuthHeaders(token),
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/v1/payments/stripe/restaurants/${restaurantId}/account`, {
          headers: getAuthHeaders(token),
          cache: "no-store",
        }),
      ]);
      const managementPayload: unknown = await managementResponse.json();
      const stripePayload: unknown = stripeResponse.ok
        ? await stripeResponse.json()
        : undefined;

      if (!managementResponse.ok) {
        const response = getRecord(managementPayload);
        throw new Error(
          getString(response.message, "Payment management could not be loaded")
        );
      }

      const nextSummary = normalizeManagementSummary(
        managementPayload,
        stripePayload
      );
      setSummary(nextSummary);
      applySummaryToForms(nextSummary);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment management could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  }, [applySummaryToForms, canLoad, restaurantId, token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadSummary();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadSummary]);

  const allowedMethodsLabel = useMemo(() => {
    const methods = summary?.allowedPaymentMethods || [];
    return methods.length > 0 ? methods.join(", ") : "Not configured yet";
  }, [summary?.allowedPaymentMethods]);

  const activeMethodsLabel = useMemo(() => {
    const methods = summary?.activePlatformPaymentMethods || [];
    return methods.length > 0 ? methods.join(", ") : "Not available";
  }, [summary?.activePlatformPaymentMethods]);

  const toggleMethod = (method: PaymentMethod, checked: boolean) => {
    setMethodsForm((current) => {
      const methods = checked
        ? Array.from(new Set([...current.allowedPaymentMethods, method]))
        : current.allowedPaymentMethods.filter((value) => value !== method);

      return {
        ...current,
        allowedPaymentMethods: methods,
        walletEnabled: method === "WALLET" ? checked : current.walletEnabled,
      };
    });
  };

  const saveMethods = async () => {
    if (!restaurantId || !token) {
      toast.error("Restaurant session is missing. Please open this page from setup.");
      return;
    }

    if (methodsForm.allowedPaymentMethods.length === 0) {
      toast.error("Select at least one payment method.");
      return;
    }

    setMethodsSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/payments/restaurants/${restaurantId}/methods`,
        {
          method: "PATCH",
          headers: getAuthHeaders(token),
          body: JSON.stringify(methodsForm),
        }
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getString(
            getRecord(payload).message,
            "Payment methods could not be updated"
          )
        );
      }

      toast.success("Payment methods updated.");
      await loadSummary();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment methods could not be updated"
      );
    } finally {
      setMethodsSaving(false);
    }
  };

  const saveStripeAccount = async () => {
    if (!restaurantId || !token) {
      toast.error("Restaurant session is missing. Please open this page from setup.");
      return;
    }

    if (!stripeForm.accountId.trim()) {
      toast.error("Stripe account ID is required.");
      return;
    }

    setStripeSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/payments/stripe/restaurants/${restaurantId}/account`,
        {
          method: "PATCH",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            accountId: stripeForm.accountId.trim(),
            dashboardUrl: stripeForm.dashboardUrl.trim() || undefined,
            chargesEnabled: stripeForm.chargesEnabled,
            payoutsEnabled: stripeForm.payoutsEnabled,
            onboardingComplete: stripeForm.onboardingComplete,
            note: stripeForm.note.trim() || undefined,
          }),
        }
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getString(
            getRecord(payload).message,
            "Stripe account settings could not be updated"
          )
        );
      }

      toast.success("Stripe account settings updated.");
      await loadSummary();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Stripe account settings could not be updated"
      );
    } finally {
      setStripeSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="bg-red-50 px-3 py-1 text-red-700 hover:bg-red-50">
              Restaurant payment setup
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Payment management
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Review platform payment availability, update the restaurant
              accepted payment methods, and save Stripe account details for
              future payouts. Transfers are controlled by superadmin.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={restaurantId}
              onChange={(event) => setRestaurantId(event.target.value.trim())}
              placeholder="Restaurant ID"
              className="h-11 min-w-0 rounded-xl bg-white sm:w-[320px]"
            />
            <Button
              type="button"
              variant="outline"
              onClick={loadSummary}
              disabled={!canLoad || loading}
              className="h-11 rounded-xl px-5"
            >
              {loading ? (
                <Loader2 className="mr-2 animate-spin" size={17} />
              ) : (
                <RefreshCw className="mr-2" size={17} />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {!token ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 shrink-0 text-amber-700" size={20} />
              <p className="text-sm leading-6 text-amber-900">
                Payment management needs the business-owner setup session. Open
                this page from the post-registration payment/setup screen, or
                continue from the restaurant admin dashboard after login.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <SummaryCard
            icon={<CreditCard size={20} />}
            label="Platform methods"
            value={activeMethodsLabel}
          />
          <SummaryCard
            icon={<ShieldCheck size={20} />}
            label="Restaurant methods"
            value={allowedMethodsLabel}
          />
          <SummaryCard
            icon={<Banknote size={20} />}
            label="Estimated available"
            value={formatMoney(
              summary?.estimatedAvailableBalance ?? null,
              summary?.currency || "PKR"
            )}
          />
          <SummaryCard
            icon={<Wallet size={20} />}
            label="Wallet exposure"
            value={getString(
              summary?.walletExposure.balance ??
                summary?.walletExposure.totalExposure ??
                summary?.walletExposure.amount,
              "Not available"
            )}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Accepted payment methods
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  These settings are saved under the restaurant payment-method
                  configuration while keeping Stripe account details intact.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHOD_OPTIONS.map((method) => {
                const checked = methodsForm.allowedPaymentMethods.includes(method.value);

                return (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => toggleMethod(method.value, value === true)}
                    />
                    {method.label}
                  </label>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Customer wallet payments
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Enables wallet usage when WALLET is also selected above.
                </p>
              </div>
              <Switch
                checked={methodsForm.walletEnabled}
                onCheckedChange={(checked) =>
                  setMethodsForm((current) => ({ ...current, walletEnabled: checked }))
                }
              />
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor="payment-method-note">Internal note</Label>
              <Textarea
                id="payment-method-note"
                value={methodsForm.note}
                onChange={(event) =>
                  setMethodsForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
                placeholder="Allow cash, Stripe, and wallet"
                className="min-h-24 rounded-2xl bg-white"
              />
            </div>

            <Button
              type="button"
              onClick={saveMethods}
              disabled={!canLoad || methodsSaving}
              className="mt-5 h-11 rounded-xl px-5"
            >
              {methodsSaving ? (
                <Loader2 className="mr-2 animate-spin" size={17} />
              ) : (
                <Save className="mr-2" size={17} />
              )}
              Save payment methods
            </Button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Stripe account settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Save the restaurant connected Stripe account details. The
              account must already exist; automated Stripe onboarding is not
              part of the current flow.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="stripe-account-id">Stripe account ID</Label>
                <Input
                  id="stripe-account-id"
                  value={stripeForm.accountId}
                  onChange={(event) =>
                    setStripeForm((current) => ({
                      ...current,
                      accountId: event.target.value,
                    }))
                  }
                  placeholder="acct_xxx"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="stripe-dashboard-url">Dashboard URL</Label>
                <Input
                  id="stripe-dashboard-url"
                  value={stripeForm.dashboardUrl}
                  onChange={(event) =>
                    setStripeForm((current) => ({
                      ...current,
                      dashboardUrl: event.target.value,
                    }))
                  }
                  placeholder="https://dashboard.stripe.com/..."
                  className="h-11 rounded-xl"
                />
              </div>

              <ToggleRow
                checked={stripeForm.chargesEnabled}
                label="Charges enabled"
                onChange={(checked) =>
                  setStripeForm((current) => ({
                    ...current,
                    chargesEnabled: checked,
                  }))
                }
              />
              <ToggleRow
                checked={stripeForm.payoutsEnabled}
                label="Payouts enabled"
                onChange={(checked) =>
                  setStripeForm((current) => ({
                    ...current,
                    payoutsEnabled: checked,
                  }))
                }
              />
              <ToggleRow
                checked={stripeForm.onboardingComplete}
                label="Onboarding complete"
                onChange={(checked) =>
                  setStripeForm((current) => ({
                    ...current,
                    onboardingComplete: checked,
                  }))
                }
              />
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor="stripe-note">Stripe account note</Label>
              <Textarea
                id="stripe-note"
                value={stripeForm.note}
                onChange={(event) =>
                  setStripeForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
                placeholder="Connected account verified manually"
                className="min-h-24 rounded-2xl bg-white"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              Superadmin sends actual transfers after payout review. This page
              only saves the restaurant account details and payment setup.
            </div>

            <Button
              type="button"
              onClick={saveStripeAccount}
              disabled={!canLoad || stripeSaving}
              className="mt-5 h-11 rounded-xl px-5"
            >
              {stripeSaving ? (
                <Loader2 className="mr-2 animate-spin" size={17} />
              ) : (
                <Save className="mr-2" size={17} />
              )}
              Save Stripe account
            </Button>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Recent payment ledger
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Latest payment activity returned by the restaurant management
                summary.
              </p>
            </div>
            <Link href="/contact">
              <Button variant="outline" className="h-11 rounded-xl px-5">
                Contact support
              </Button>
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={18} />
                Loading payment management...
              </div>
            ) : summary?.recentLedger.length ? (
              <div className="divide-y divide-slate-100">
                {summary.recentLedger.slice(0, 8).map((entry, index) => (
                  <div
                    key={`${getString(entry.id, "ledger")}-${index}`}
                    className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[1fr_auto_auto]"
                  >
                    <span className="font-medium text-slate-900">
                      {getString(entry.description || entry.type || entry.status, "Payment activity")}
                    </span>
                    <span className="text-slate-500">
                      {getString(entry.status || entry.paymentStatus, "Pending")}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(
                        getNumber(entry.amount || entry.totalAmount || entry.netAmount),
                        getString(entry.currency, summary.currency)
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No recent payment activity was returned yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
        {icon}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-950">
        {value}
      </p>
    </div>
  );
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
