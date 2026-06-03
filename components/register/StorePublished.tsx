"use client";

import { useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  QrCode as QrCodeIcon,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  formData: any;
  publishedData: any;
}

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

const getValue = (value: any, fallback = "Not available") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
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

function IdRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800 break-all">
        {getValue(value)}
      </span>
    </div>
  );
}

export default function StorePublished({ formData, publishedData }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const baseUrl = useMemo(() => {
    return normalizeBaseUrl(
      process.env.NEXT_PUBLIC_ADMIN_URL ||
        "https://saas-restaurant-admin-dashboard.vercel.app"
    );
  }, []);

  const restaurantId =
    publishedData?.restaurantId ||
    publishedData?.restaurant?.id ||
    publishedData?.restaurant?.restaurantId ||
    "";

  const loginUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (formData?.user?.email) {
      params.set("email", String(formData.user.email).trim().toLowerCase());
    }

    if (restaurantId) {
      params.set("restaurantId", String(restaurantId));
    }

    return `${baseUrl}/login${params.toString() ? `?${params.toString()}` : ""}`;
  }, [baseUrl, formData?.user?.email, restaurantId]);

  const restaurantName = getValue(formData?.restaurant?.name, "Your Restaurant");
  const branchName = getValue(formData?.branch?.name, "Main Branch");
  const ownerEmail = getValue(formData?.user?.email);
  const tenantName = getValue(formData?.tenant?.name, "Business Account");

  const openDashboard = () => {
    window.open(loginUrl, "_blank", "noopener,noreferrer");
  };

  const copyDashboardLink = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(loginUrl);
      toast.success("Dashboard link copied");
    } catch {
      toast.error("Unable to copy dashboard link");
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

      toast.success("QR code downloaded");
    } catch {
      toast.error("Unable to download QR code");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[80vh] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* SUCCESS HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <CheckCircle2 size={18} className="text-green-300" />
                Store setup completed successfully
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Your store is now live
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Your business account, restaurant profile, branch setup, and
                dashboard access are ready. Use the secure login link or scan
                the QR code to access the admin dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                onClick={openDashboard}
                className="h-12 rounded-xl bg-white px-6 text-gray-950 hover:bg-gray-100"
              >
                Open Dashboard
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
                {copying ? "Copying..." : "Copy Link"}
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
                    Business Summary
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Review the details created during onboarding.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                  Active
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Store size={20} />}
                  label="Restaurant"
                  value={restaurantName}
                />

                <InfoCard
                  icon={<Building2 size={20} />}
                  label="Tenant"
                  value={tenantName}
                />

                <InfoCard
                  icon={<MapPin size={20} />}
                  label="Branch"
                  value={branchName}
                />

                <InfoCard
                  icon={<Mail size={20} />}
                  label="Owner Email"
                  value={ownerEmail}
                />
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
                    Dashboard Access
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    The owner can sign in using the registered email address.
                    The dashboard link includes the restaurant context for a
                    smoother login experience.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Login URL
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
                      Open
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
                    System References
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Internal IDs generated by the platform after successful
                    onboarding.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <IdRow label="Owner ID" value={publishedData?.ownerId} />
                <IdRow label="Tenant ID" value={publishedData?.tenantId} />
                <IdRow label="Restaurant ID" value={restaurantId} />
                <IdRow label="Branch ID" value={publishedData?.branchId} />
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
                Quick Login QR
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Scan this QR code to open the admin dashboard login page
                directly.
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
                    Linked Email
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
                  Visit Dashboard
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
                  {downloading ? "Downloading..." : "Download QR Code"}
                </Button>
              </div>

              <p className="mt-5 text-xs leading-5 text-gray-400">
                Share this QR only with authorized business users. Anyone with
                the link can open the login page, but authentication is still
                required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}