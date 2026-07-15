import { readFile } from "node:fs/promises";

const REQUIRED_NAMESPACES = [
  "common",
  "navigation",
  "footer",
  "home",
  "about",
  "services",
  "categories",
  "pricing",
  "contact",
  "register",
  "forms",
  "validation",
  "errors",
];

const readJson = async (filePath) => {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content);
};

const collectKeys = (value, prefix = "") => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return collectKeys(nestedValue, path);
  });
};

const findMissingNamespaces = (messages) => {
  return REQUIRED_NAMESPACES.filter((namespace) => !(namespace in messages));
};

const reportMissingKeys = (label, keys) => {
  if (!keys.length) return;

  console.error(`Missing keys in ${label}:`);
  keys.forEach((key) => console.error(`- ${key}`));
};

const en = await readJson("src/messages/en.json");
const de = await readJson("src/messages/de.json");

const enMissingNamespaces = findMissingNamespaces(en);
const deMissingNamespaces = findMissingNamespaces(de);

if (enMissingNamespaces.length || deMissingNamespaces.length) {
  reportMissingKeys("English namespaces", enMissingNamespaces);
  reportMissingKeys("German namespaces", deMissingNamespaces);
  process.exit(1);
}

const enKeys = new Set(collectKeys(en));
const deKeys = new Set(collectKeys(de));
const missingInGerman = [...enKeys].filter((key) => !deKeys.has(key));
const missingInEnglish = [...deKeys].filter((key) => !enKeys.has(key));

if (missingInGerman.length || missingInEnglish.length) {
  reportMissingKeys("German messages", missingInGerman);
  reportMissingKeys("English messages", missingInEnglish);
  process.exit(1);
}

console.log(`i18n messages matched: ${enKeys.size} keys across en/de.`);
