const NODE_ENV = process.env.NODE_ENV || "development";

export const GLOBAL_CONFIG = {
  NODE_ENV,
  NEXT_PUBLIC_API_BASE:
    process.env.NEXT_PUBLIC_API_BASE ||
    (NODE_ENV === "development"
      ? "http://localhost:8080/api/v1"
      : "https://api.sakena.ir/api/v1"),
  NEXT_PUBLIC_CURRENT_URL:
    process.env.NEXT_PUBLIC_CURRENT_URL ||
    (NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sakena.app"),
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || "",
};

export const LOCALE = "fa-IR";
