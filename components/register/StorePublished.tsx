"use client";

import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  Mail,
  MapPin,
  QrCode as QrCodeIcon,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface Props {
  formData: OnboardingPublishedFormData;
  publishedData: PublishedResponseData | null;
}

type OnboardingPublishedFormData = {
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

type PublishedResponseData = {
  branchAdminCredentials?: {
    email?: unknown;
    password?: unknown;
  };
  branchId?: unknown;
  email?: unknown;
  ownerId?: unknown;
  restaurant?: {
    id?: unknown;
    restaurantId?: unknown;
  };
  restaurantId?: unknown;
  tenantId?: unknown;
};

const normalizeBaseUrl = (url: string) => {
  return url.replace(/\/+$/, "");
};

const sanitizeFileName = (value?: string) => {
  return String(value || "restaurant")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getOptionalString = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
};

const getValue = (value: unknown, fallback: string) => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <div className="mt-1 text-sm font-semibold text-gray-900 break-words">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

function IdRow({
  fallback,
  label,
  value,
}: {
  fallback: string;
  label: string;
  value: unknown;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800 break-all">
        {getValue(value, fallback)}
      </span>
    </div>
  );
}

function CredentialRow({
  label,
  value,
  hidden = false,
}: {
  hidden?: boolean;
  label: string;
  value: string;
}) {
  const [visible, setVisible] = useState(!hidden);
  const displayValue = hidden && !visible ? "••••••••••" : value;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-gray-900">
          {displayValue}
        </p>
      </div>

      {hidden ? (
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-primary/40 hover:text-primary"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      ) : null}
    </div>
  );
}

export function StorePublished({ formData, publishedData }: Props) {
  const tRegister = useTranslations("register");
  const qrRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const baseUrl = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_ADMIN_URL ||
      "https://saas-restaurant-admin-dashboard.vercel.app"
  );

  const restaurantId = getOptionalString(
    publishedData?.restaurantId ||
      publishedData?.restaurant?.id ||
      publishedData?.restaurant?.restaurantId
  );

  const loginUrl = (() => {
    const params = new URLSearchParams();

    if (formData?.user?.email) {
      params.set("email", String(formData.user.email).trim().toLowerCase());
    }

    if (restaurantId) {
      params.set("restaurantId", String(restaurantId));
    }

    return `${baseUrl}/login${params.toString() ? `?${params.toString()}` : ""}`;
  })();

  const notAvailable = tRegister("published.fallbacks.notAvailable");
  const restaurantName = getValue(
    formData?.restaurant?.name,
    tRegister("published.fallbacks.yourRestaurant")
  );
  const branchName = getValue(
    formData?.branch?.name,
    tRegister("published.fallbacks.mainBranch")
  );
  const ownerEmail = getValue(formData?.user?.email, notAvailable);
  const ownerPassword = getValue(formData?.user?.password, notAvailable);
  const branchAdminEmail = getOptionalString(
    publishedData?.branchAdminCredentials?.email
  );
  const branchAdminPassword = getOptionalString(
    publishedData?.branchAdminCredentials?.password
  );
  const tenantName = getValue(
    formData?.tenant?.name,
    tRegister("published.fallbacks.businessAccount")
  );

  const openDashboard = () => {
    window.open(loginUrl, "_blank", "noopener,noreferrer");
  };

  const copyDashboardLink = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(loginUrl);
      toast.success(tRegister("published.toasts.dashboardLinkCopied"));
    } catch {
      toast.error(tRegister("published.toasts.dashboardLinkCopyFailed"));
    } finally {
      setCopying(false);
    }
  };

  const downloadQR = async () => {
    if (!qrRef.current) return;

    try {
      setDownloading(true);

      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `${sanitizeFileName(formData?.restaurant?.name)}-dashboard-qr.png`;
      link.href = dataUrl;
      link.click();

      toast.success(tRegister("published.toasts.qrDownloaded"));
    } catch {
      toast.error(tRegister("published.toasts.qrDownloadFailed"));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[80vh] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* SUCCESS HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#c1000a_0%,#d61f2a_46%,#f59e0b_130%)] px-6 py-8 text-white shadow-xl shadow-primary/20 sm:px-10 sm:py-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,1,0.18),rgba(3,4,1,0)_55%)]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <CheckCircle2 size={18} className="text-green-300" />
                {tRegister("published.successBadge")}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {tRegister("published.title")}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                {tRegister("published.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                onClick={openDashboard}
                className="h-12 rounded-xl bg-white px-6 text-gray-950 hover:bg-gray-100"
              >
                {tRegister("published.actions.openDashboard")}
                <ArrowRight size={18} className="ml-2" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={copyDashboardLink}
                disabled={copying}
                className="h-12 rounded-xl border-white/20 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
              >
                <Copy size={17} className="mr-2" />
                {copying
                  ? tRegister("published.actions.copying")
                  : tRegister("published.actions.copyLink")}
              </Button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* STORE SUMMARY */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tRegister("published.summary.title")}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {tRegister("published.summary.description")}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                  {tRegister("published.summary.active")}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Store size={20} />}
                  label={tRegister("published.labels.restaurant")}
                  value={restaurantName}
                />

                <InfoCard
                  icon={<Building2 size={20} />}
                  label={tRegister("published.labels.tenant")}
                  value={tenantName}
                />

                <InfoCard
                  icon={<MapPin size={20} />}
                  label={tRegister("published.labels.branch")}
                  value={branchName}
                />

                <InfoCard
                  icon={<Mail size={20} />}
                  label={tRegister("published.labels.ownerEmail")}
                  value={ownerEmail}
                />
              </div>
            </div>

            {/* CREDENTIALS */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tRegister("published.credentials.title")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {tRegister("published.credentials.description")}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <CredentialRow
                  label={tRegister("published.credentials.ownerEmail")}
                  value={ownerEmail}
                />
                <CredentialRow
                  hidden
                  label={tRegister("published.credentials.ownerPassword")}
                  value={ownerPassword}
                />

                {branchAdminEmail || branchAdminPassword ? (
                  <>
                    <CredentialRow
                      label={tRegister("published.credentials.branchAdminEmail")}
                      value={branchAdminEmail || notAvailable}
                    />
                    <CredentialRow
                      hidden
                      label={tRegister(
                        "published.credentials.branchAdminPassword"
                      )}
                      value={branchAdminPassword || notAvailable}
                    />
                  </>
                ) : null}
              </div>
            </div>

            {/* ACCESS DETAILS */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tRegister("published.dashboardAccess.title")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {tRegister("published.dashboardAccess.description")}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {tRegister("published.dashboardAccess.loginUrl")}
                </p>

                <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center">
                  {/* <p className="min-w-0 flex-1 break-all text-sm font-medium text-gray-800">
                    {loginUrl}
                  </p> */}

                  <div className="flex shrink-0 gap-2">
                    {/* <Button
                      type="button"
                      variant="outline"
                      onClick={copyDashboardLink}
                      className="rounded-xl"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </Button> */}

                    <Button
                      type="button"
                      onClick={openDashboard}
                      className="rounded-xl p-2"
                    >
                      {tRegister("published.actions.open")}
                      <ExternalLink size={16}  />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SYSTEM IDS */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tRegister("published.systemReferences.title")}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {tRegister("published.systemReferences.description")}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <IdRow
                  fallback={notAvailable}
                  label={tRegister("published.labels.ownerId")}
                  value={publishedData?.ownerId}
                />
                <IdRow
                  fallback={notAvailable}
                  label={tRegister("published.labels.tenantId")}
                  value={publishedData?.tenantId}
                />
                <IdRow
                  fallback={notAvailable}
                  label={tRegister("published.labels.restaurantId")}
                  value={restaurantId}
                />
                <IdRow
                  fallback={notAvailable}
                  label={tRegister("published.labels.branchId")}
                  value={publishedData?.branchId}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE QR PANEL */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <QrCodeIcon size={26} />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {tRegister("published.qr.title")}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {tRegister("published.qr.description")}
              </p>

              <div className="mt-6 rounded-3xl bg-gray-50 p-5">
                <div
                  ref={qrRef}
                  className="mx-auto w-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
                >
                  <QRCode value={loginUrl} size={180} />
                </div>

                <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-left">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {tRegister("published.qr.linkedEmail")}
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                    {ownerEmail}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  onClick={openDashboard}
                  className="h-12 rounded-xl"
                >
                  {tRegister("published.actions.visitDashboard")}
                  <ExternalLink size={17} className="ml-2" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={downloadQR}
                  disabled={downloading}
                  className="h-12 rounded-xl"
                >
                  <Download size={17} className="mr-2" />
                  {downloading
                    ? tRegister("published.actions.downloading")
                    : tRegister("published.actions.downloadQr")}
                </Button>
              </div>

              <p className="mt-5 text-xs leading-5 text-gray-400">
                {tRegister("published.qr.securityNote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
