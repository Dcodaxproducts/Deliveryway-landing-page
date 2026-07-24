"use client";

import { useLocale } from "next-intl";

import {
  type LandingPagePages,
  useLandingSettings,
} from "@/components/providers/LandingSettingsProvider";
import { localizeLandingPage } from "@/lib/landing-content";

export function ManagedContentPage({
  pageKey,
}: {
  pageKey: keyof LandingPagePages;
}) {
  const locale = useLocale();
  const settings = useLandingSettings();
  const page = localizeLandingPage(settings.pages[pageKey], locale);
  const hasHero = Boolean(page.eyebrow || page.heading || page.subheading);

  if (!hasHero && !page.content) return null;

  return (
    <main>
      {hasHero ? (
        <section className="bg-[linear-gradient(135deg,#d6151c_0%,#be1118_62%,#8f0d13_100%)] px-6 py-20 text-center text-white lg:py-28">
          <div className="mx-auto max-w-4xl">
            {page.eyebrow ? (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
                {page.eyebrow}
              </p>
            ) : null}
            {page.heading ? (
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {page.heading}
              </h1>
            ) : null}
            {page.subheading ? (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {page.subheading}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {page.content ? (
        <section className="bg-[#F8FAFC] px-5 py-14 sm:px-8 lg:py-20">
          <article
            className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white px-6 py-8 text-slate-700 shadow-sm sm:px-10 sm:py-12 [&_a]:font-semibold [&_a]:text-red-600 [&_blockquote]:border-l-4 [&_blockquote]:border-red-500 [&_blockquote]:pl-4 [&_h1]:mb-5 [&_h1]:mt-8 [&_h1]:text-4xl [&_h1]:font-black [&_h1]:text-slate-950 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-950 [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_p]:leading-8 [&_strong]:text-slate-950 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </section>
      ) : null}
    </main>
  );
}
