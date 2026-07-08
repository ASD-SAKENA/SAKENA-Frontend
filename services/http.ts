// eslint-disable-next-line no-restricted-imports
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { toast } from "sonner";

import { GLOBAL_CONFIG } from "@/app/config";

import { useAuthStore } from "@/stores/auth.store";

import { getQueryClient } from "@/lib/query-client";

export { isAxiosError };

declare module "axios" {
  // Per-request opt-out from the global error toast (e.g. an expected 404).
  export interface AxiosRequestConfig {
    suppressToast?: boolean;
  }
}

/** Backend validation payloads, e.g. `{ error, details: { field: ["msg"] } }`. */
export type ApiErrorResponseBody = {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
  details?: Record<string, string | string[]>;
};

function collectFieldErrorMessages(
  data: ApiErrorResponseBody | undefined,
): string[] {
  if (!data) return [];
  const out: string[] = [];
  for (const key of ["details", "errors"] as const) {
    const block = data[key];
    if (!block || typeof block !== "object") continue;
    for (const value of Object.values(block)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "string" && item.trim()) out.push(item.trim());
        }
      } else if (typeof value === "string" && value.trim()) {
        out.push(value.trim());
      }
    }
  }
  return out;
}

/** Prefer the backend's `message`, then a string `error`, else the fallback. */
function resolveErrorMessage(
  data: ApiErrorResponseBody | undefined,
  fallback: string,
): string {
  if (data?.message) return data.message;
  if (typeof data?.error === "string" && data.error) return data.error;
  return fallback;
}

/** Shows field-level API errors in a toast; returns true if any were shown. */
function toastValidationDetails(data: ApiErrorResponseBody | undefined) {
  const fieldMsgs = collectFieldErrorMessages(data);
  if (fieldMsgs.length === 0) return false;

  const headline =
    typeof data?.error === "string" && data.error.trim()
      ? data.error.trim()
      : undefined;

  if (fieldMsgs.length === 1) {
    if (headline && headline !== fieldMsgs[0]) {
      toast.error(headline, { description: fieldMsgs[0] });
    } else {
      toast.error(fieldMsgs[0]);
    }
    return true;
  }

  toast.error(headline ?? "درخواست نامعتبر است", {
    description: fieldMsgs.join("\n"),
  });
  return true;
}

const http = axios.create({
  baseURL: GLOBAL_CONFIG.NEXT_PUBLIC_API_BASE,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let suppressAuthErrorToasts = false;

export function setSuppressAuthErrorToasts(value: boolean) {
  suppressAuthErrorToasts = value;
}

// ─── Request Interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // The backend is stateless JWT — attach the persisted token on the client.
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponseBody>) => {
    // Requests canceled via an AbortSignal (e.g. TanStack Query unmounting or
    // refetching) are not real failures — never surface them as a toast.
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // Callers can opt a request out of the global error toast (e.g. an
    // expected 404 when no resource exists yet) — still reject so they handle it.
    if (error.config?.suppressToast) {
      return Promise.reject(error);
    }

    if (!error.response) {
      toast.error("خطا در ارتباط با سرور");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        if (!toastValidationDetails(data)) {
          toast.error(resolveErrorMessage(data, "درخواست نامعتبر"));
        }
        break;
      case 401:
        if (typeof window !== "undefined") {
          const isLogoutRequest = error.config?.url?.includes("/auth/logout/");
          if (!suppressAuthErrorToasts && !isLogoutRequest) {
            toast.error("ورود ناموفق بود. لطفا دوباره تلاش کنید.");
          }
          getQueryClient().clear();
          const isAuthRequest = error.config?.url?.includes("/auth/");
          if (!isAuthRequest) {
            // Session expired mid-app: drop the stale token and re-login.
            useAuthStore.getState().logout();
            if (!window.location.pathname.includes("/login")) {
              window.location.replace("/login");
            }
          }
        }
        break;
      case 403:
        toast.error("شما دسترسی به این بخش ندارید");
        break;
      case 404:
        toast.error("موردی یافت نشد");
        break;
      case 422:
        if (!toastValidationDetails(data)) {
          toast.error(
            resolveErrorMessage(data, "اطلاعات وارد شده نامعتبر است"),
          );
        }
        break;
      case 429:
        toast.error("تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید");
        break;
      case 500:
      default:
        toast.error("خطای سرور. لطفاً دوباره تلاش کنید");
        break;
    }

    return Promise.reject(error);
  },
);

export default http;
