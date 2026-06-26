import "server-only";

import { GLOBAL_CONFIG } from "./config";

export const SERVER_CONFIG = {
  API_BASE: process.env.INTERNAL_API_BASE || GLOBAL_CONFIG.NEXT_PUBLIC_API_BASE,
} as const;
