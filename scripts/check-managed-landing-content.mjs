import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const provider = read("src/components/providers/LandingSettingsProvider.tsx");
const components = [
  "Hero.tsx",
  "SectionFour.tsx",
  "SectionSix.tsx",
  "SectionSeven.tsx",
  "SectionNine.tsx",
].map((file) => read(`src/components/pages/Home/components/${file}`));
const renderedHome = components.join("\n");

assert.match(provider, /home:\s*LandingHomeSettings/);
assert.match(provider, /cache:\s*"no-store"/);
for (const section of [
  "hero",
  "featuredRestaurants",
  "growth",
  "orderManagement",
  "appDownload",
]) {
  assert.match(provider, new RegExp(`DEFAULT_SETTINGS\.home\.${section}`));
  assert.match(renderedHome, new RegExp(`home\.${section}`));
}

assert.match(provider, /pages:\s*{/);
assert.match(provider, /faqs:\s*Array.isArray/);
assert.doesNotMatch(renderedHome, /restaurants\/featured/);
console.log("managed landing content contract: ok");
