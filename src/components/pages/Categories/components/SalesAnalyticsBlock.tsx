"use client";

import { salesAnalyticsChart, salesAnalyticsFeatures, salesAnalyticsStats } from "@/constants/categories";
import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function SalesAnalyticsBlock() {
  const t = useTranslations();

  // Sample data for the chart
  const chartData = [
    { day: "Mon", value: 18 },
    { day: "Tue", value: 32 },
    { day: "Wed", value: 48 },
    { day: "Thu", value: 16 },
    { day: "Fri", value: 28 },
    { day: "Sat", value: 40 },
    { day: "Sun", value: 52 },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-16 self-stretch">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Badge */}
        <div className="px-3 py-1 bg-red-600/10 rounded-full inline-flex items-center w-fit">
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider">
            {t("categories.salesAnalytics.badge")}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-neutral-900 leading-10">
          {t("categories.salesAnalytics.title")}
        </h2>

        {/* Description */}
        <p className="text-lg text-stone-700 leading-7 whitespace-pre-line">
          {t("categories.salesAnalytics.description")}
        </p>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          {salesAnalyticsStats.map((stat) => (
            <div
              key={stat.labelKey}
              className="flex-1 p-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-rose-100 flex flex-col gap-1 w-fit"
            >
              <div className="text-red-600 text-2xl font-bold font-sans leading-8">
                {stat.value}
              </div>
              <div className="text-stone-700 text-xs font-bold uppercase font-sans">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="flex flex-col gap-4">
          {salesAnalyticsFeatures.map((feature) => (
            <div key={feature.id} className="flex items-start gap-3">
              <div className="p-1 bg-red-600/10 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2 bg-red-600 rounded-full" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-neutral-900">{t(feature.titleKey)}</span>
                <span className="text-sm text-stone-700">{t(feature.descKey)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="mt-4 px-6 py-3 bg-neutral-900 text-white font-bold rounded-lg w-fit">
          {t("categories.salesAnalytics.button")}
        </button>
      </div>

      {/* Right Chart */}
      <div className="flex-1 p-6 relative bg-neutral-900 rounded-xl shadow-2xl flex flex-col justify-end gap-4 overflow-hidden">
        {/* Chart Title */}
        <div className="absolute top-6 left-6">
          <div className="text-white text-xl font-bold font-sans leading-7">
            {t(salesAnalyticsChart.titleKey)}
          </div>
          <div className="text-neutral-50/60 text-sm font-normal font-sans leading-5">
            {t(salesAnalyticsChart.subtitleKey)}
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64 mt-16">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: "white", fontSize: 10, fontFamily: "Work Sans" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
              <Bar dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
