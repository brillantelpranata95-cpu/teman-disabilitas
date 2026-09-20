/**
 * Deploy Firestore Rules via REST API (tanpa firebase-tools).
 *
 * Alasan: firebase-tools melakukan pre-check "ensureApiEnabled" yang butuh
 * permission serviceusage.services.get — service account deploy (roles/firebasehosting.admin)
 * tidak selalu punya izin tersebut, sehingga `firebase deploy --only firestore:rules` gagal 403.
 * Script ini langsung: (1) buat ruleset baru, (2) release ke cloud.firestore — hanya butuh
 * permission firebaserules.* yang sudah dimiliki service account.
 *
 * Pemakaian (CI): node scripts/deploy-rules.mjs
 *   Env: GOOGLE_APPLICATION_CREDENTIALS=/path/sa.json  (atau FIREBASE_SA_JSON)
 */
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

const PROJECT = process.env.FIREBASE_PROJECT || "teman-disabilitas";
const SA_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SA_JSON = process.env.FIREBASE_SA_JSON; // alternatif: JSON mentah via env

const RULES_FILE = new URL("../firestore.rules", import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, "$1"); // Windows path fix: /C:/ -> C:/

function b64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function loadServiceAccount() {
  if (SA_JSON) return JSON.parse(SA_JSON);
  if (SA_PATH) return JSON.parse(readFileSync(SA_PATH, "utf8"));
  throw new Error("Set GOOGLE_APPLICATION_CREDENTIALS atau FIREBASE_SA_JSON");
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const signer = createSign("RSA-SHA256");
  signer.update(`${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`);
  const signature = signer.sign(sa.private_key);
  const jwt = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}.${b64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Token exchange gagal: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function api(url, access, body, method = "POST") {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const sa = loadServiceAccount();
  console.log(`[rules] autentikasi sebagai ${sa.client_email}`);
  const access = await getAccessToken(sa);

  const rules = readFileSync(RULES_FILE, "utf8");
  console.log(`[rules] file: ${RULES_FILE} (${rules.length} bytes)`);

  // 1) buat ruleset baru
  const ruleset = await api(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/rulesets`,
    access,
    { source: { files: [{ name: "firestore.rules", content: rules }] } }
  );
  console.log(`[rules] ruleset dibuat: ${ruleset.name}`);

  // 2) release ke database cloud.firestore
  const release = await api(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT}/releases/cloud.firestore`,
    access,
    { release: { name: `projects/${PROJECT}/releases/cloud.firestore`, rulesetName: ruleset.name } },
    "PATCH"
  );
  console.log(`[rules] release diperbarui: ${release.name} -> ${release.rulesetName}`);
  console.log("[rules] SUKSES — Firestore Rules live");
}

main().catch((err) => {
  console.error("[rules] GAGAL:", err.message);
  process.exit(1);
});
