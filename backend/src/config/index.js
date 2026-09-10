import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "shibir_jwt_secret_key_12345",
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:root@localhost:5432/shibir_db",
  databaseSsl: process.env.DATABASE_SSL === "true" || process.env.PGSSLMODE === "require",
  easebuzzMerchantKey: process.env.EASEBUZZ_MERCHANT_KEY || "",
  easebuzzSalt: process.env.EASEBUZZ_SALT || "",
  easebuzzEnv: process.env.EASEBUZZ_ENV === "prod" ? "prod" : "test",
  publicApiUrl: (process.env.PUBLIC_API_URL || "").replace(/\/$/, ""),
  paymentsEnabled: process.env.PAYMENTS_ENABLED === "true",
};
