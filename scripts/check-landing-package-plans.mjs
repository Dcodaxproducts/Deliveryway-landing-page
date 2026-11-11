import assert from "node:assert/strict";
import test from "node:test";

import { loadLandingPackagePlans } from "../src/lib/landing-package-plans.ts";

const plan = {
  id: "plan-1",
  name: "Growth",
  description: null,
  billingModel: "PLAN",
  billingInterval: "MONTHLY",
  planPrice: "49.00",
  commissionType: null,
  commissionPercentage: null,
  commissionFixedAmount: null,
  commissionCapAmount: null,
  vatPercentage: "19.00",
  payoutCycle: "MONTHLY",
  termsDocumentUrl: null,
  currency: "EUR",
  trialDays: 0,
  features: {},
  isActive: true,
  isDefault: false,
};

test("requests only selected landing plans without caching", async () => {
  let requestedUrl = "";
  let requestedInit;
  const result = await loadLandingPackagePlans(
    "https://api.example.test/api/",
    async (input, init) => {
      requestedUrl = String(input);
      requestedInit = init;
      return new Response(JSON.stringify({ data: [plan] }), { status: 200 });
    },
  );

  assert.match(requestedUrl, /landingOnly=true/);
  assert.equal(requestedInit?.cache, "no-store");
  assert.deepEqual(result, [plan]);
});

test("keeps an explicit empty public selection empty", async () => {
  const result = await loadLandingPackagePlans(
    "https://api.example.test/api",
    async () => new Response(JSON.stringify({ data: [] }), { status: 200 }),
  );

  assert.deepEqual(result, []);
});

test("fails closed instead of showing unselected fallback plans", async () => {
  const unavailable = await loadLandingPackagePlans(
    "https://api.example.test/api",
    async () => new Response(null, { status: 503 }),
  );
  const malformed = await loadLandingPackagePlans(
    "https://api.example.test/api",
    async () => new Response(JSON.stringify({ data: [{ id: "bad" }] })),
  );

  assert.deepEqual(unavailable, []);
  assert.deepEqual(malformed, []);
});
