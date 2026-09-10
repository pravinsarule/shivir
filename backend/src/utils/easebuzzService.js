import crypto from "crypto";
import { config } from "../config/index.js";

const initiateFields = ["key", "txnid", "amount", "productinfo", "firstname", "email", "udf1", "udf2", "udf3", "udf4", "udf5", "udf6", "udf7", "udf8", "udf9", "udf10"];
const responseFields = ["udf10", "udf9", "udf8", "udf7", "udf6", "udf5", "udf4", "udf3", "udf2", "udf1", "email", "firstname", "productinfo", "amount", "txnid", "key"];

function sha512(value) {
  return crypto.createHash("sha512").update(value).digest("hex");
}

export function isEasebuzzConfigured() {
  return Boolean(config.easebuzzMerchantKey && config.easebuzzSalt);
}

export async function createEasebuzzPaymentLink(payment) {
  if (!isEasebuzzConfigured()) throw new Error("Easebuzz credentials are not configured. Add EASEBUZZ_MERCHANT_KEY and EASEBUZZ_SALT to .env.");

  const fields = {
    key: config.easebuzzMerchantKey,
    txnid: payment.transactionId,
    amount: Number(payment.amount).toFixed(2),
    firstname: payment.name,
    email: payment.email,
    phone: payment.mobile,
    productinfo: "Shibir Entry Card",
    surl: payment.successUrl,
    furl: payment.failureUrl,
    udf1: String(payment.paymentLinkId),
    udf2: String(payment.contactId),
    udf3: "",
    udf4: "",
    udf5: "",
    udf6: "",
    udf7: "",
    udf8: "",
    udf9: "",
    udf10: "",
  };
  fields.hash = sha512(`${initiateFields.map((field) => fields[field] || "").join("|")}|${config.easebuzzSalt}`);

  const endpoint = config.easebuzzEnv === "prod"
    ? "https://pay.easebuzz.in/payment/initiateLink"
    : "https://testpay.easebuzz.in/payment/initiateLink";
  const payload = new URLSearchParams(Object.fromEntries(Object.entries(fields).filter(([key, value]) => !key.startsWith("udf") || value || key === "udf1" || key === "udf2")));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || Number(result.status) !== 1 || !result.data) throw new Error(result.data || "Easebuzz could not create the payment link.");
  const baseUrl = config.easebuzzEnv === "prod" ? "https://pay.easebuzz.in" : "https://testpay.easebuzz.in";
  return `${baseUrl}/pay/${result.data}`;
}

export function verifyEasebuzzResponse(payload) {
  if (!payload?.hash || !payload?.txnid || !payload?.status) return false;
  const reverseHash = sha512(`${config.easebuzzSalt}|${payload.status}|${responseFields.map((field) => payload[field] || "").join("|")}`);
  return crypto.timingSafeEqual(Buffer.from(reverseHash), Buffer.from(String(payload.hash).toLowerCase()));
}
