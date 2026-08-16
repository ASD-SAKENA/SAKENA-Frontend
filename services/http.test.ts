import MockAdapter from "axios-mock-adapter";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import http, { setSuppressAuthErrorToasts } from "./http";

import { getQueryClient } from "@/lib/query-client";

import { useAuthStore } from "@/stores/auth.store";

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(http);
  useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
  setSuppressAuthErrorToasts(false);
  vi.clearAllMocks();
});

afterEach(() => {
  mock.restore();
});

describe("request interceptor", () => {
  it("attaches the stored token as a Bearer header", async () => {
    useAuthStore.setState({ token: "jwt-token" });
    mock.onGet("/me").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer jwt-token");
      return [200, {}];
    });

    await http.get("/me");
  });

  it("does not attach a header when there is no token", async () => {
    mock.onGet("/me").reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined();
      return [200, {}];
    });

    await http.get("/me");
  });

  it("does not overwrite an explicitly set Authorization header", async () => {
    useAuthStore.setState({ token: "jwt-token" });
    mock.onGet("/me").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer explicit");
      return [200, {}];
    });

    await http.get("/me", { headers: { Authorization: "Bearer explicit" } });
  });
});

describe("response interceptor - error status handling", () => {
  it("shows a single field error message for a 400 with details", async () => {
    mock.onPost("/x").reply(400, { details: { amount: ["مبلغ نامعتبر است"] } });

    await expect(http.post("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("مبلغ نامعتبر است");
  });

  it("joins multiple field error messages for a 400", async () => {
    mock.onPost("/x").reply(400, {
      details: { a: ["خطای اول"], b: ["خطای دوم"] },
    });

    await expect(http.post("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      "درخواست نامعتبر است",
      expect.objectContaining({ description: "خطای اول\nخطای دوم" }),
    );
  });

  it("falls back to a generic message for a 400 with no details", async () => {
    mock.onPost("/x").reply(400, {});

    await expect(http.post("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("درخواست نامعتبر");
  });

  it("prefers the backend message over the fallback for a 409", async () => {
    mock.onPost("/x").reply(409, { message: "قبلاً ثبت شده است" });

    await expect(http.post("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("قبلاً ثبت شده است");
  });

  it("shows the not-found message for a 404", async () => {
    mock.onGet("/x").reply(404);

    await expect(http.get("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("موردی یافت نشد");
  });

  it("shows the forbidden message for a 403", async () => {
    mock.onGet("/x").reply(403);

    await expect(http.get("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("شما دسترسی به این بخش ندارید");
  });

  it("shows the rate-limit message for a 429", async () => {
    mock.onGet("/x").reply(429);

    await expect(http.get("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید",
    );
  });

  it("shows a generic server error message for a 500", async () => {
    mock.onGet("/x").reply(500);

    await expect(http.get("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("خطای سرور. لطفاً دوباره تلاش کنید");
  });

  it("shows a connectivity message when there is no response at all", async () => {
    mock.onGet("/x").networkError();

    await expect(http.get("/x")).rejects.toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith("خطا در ارتباط با سرور");
  });

  it("respects suppressToast and shows no toast", async () => {
    mock.onGet("/x").reply(400, {});

    await expect(
      http.get("/x", { suppressToast: true }),
    ).rejects.toBeTruthy();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("does not toast a canceled request", async () => {
    const controller = new AbortController();
    mock.onGet("/x").reply(() => {
      controller.abort();
      return [200, {}];
    });

    await expect(
      http.get("/x", { signal: controller.signal }),
    ).rejects.toBeTruthy();
    expect(toast.error).not.toHaveBeenCalled();
  });
});

describe("response interceptor - 401 session handling", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { ...window.location, pathname: "/dashboard", replace: vi.fn() },
      writable: true,
      configurable: true,
    });
  });

  it("logs out, clears the query cache, and redirects to /login", async () => {
    useAuthStore.setState({ isAuthenticated: true, token: "stale" });
    const clearSpy = vi.spyOn(getQueryClient(), "clear");
    mock.onGet("/profile").reply(401);

    await expect(http.get("/profile")).rejects.toBeTruthy();

    expect(clearSpy).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(window.location.replace).toHaveBeenCalledWith("/login");
    expect(toast.error).toHaveBeenCalledWith(
      "ورود ناموفق بود. لطفا دوباره تلاش کنید.",
    );
  });

  it("does not log out for a 401 on an /auth/ endpoint (e.g. a bad login attempt)", async () => {
    useAuthStore.setState({ isAuthenticated: true, token: "stale" });
    mock.onPost("/auth/login").reply(401);

    await expect(http.post("/auth/login")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it("does not redirect again when already on /login", async () => {
    Object.defineProperty(window, "location", {
      value: { ...window.location, pathname: "/login", replace: vi.fn() },
      writable: true,
      configurable: true,
    });
    useAuthStore.setState({ isAuthenticated: true, token: "stale" });
    mock.onGet("/profile").reply(401);

    await expect(http.get("/profile")).rejects.toBeTruthy();

    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it("suppresses the 401 toast when setSuppressAuthErrorToasts(true) is set", async () => {
    setSuppressAuthErrorToasts(true);
    mock.onGet("/profile").reply(401);

    await expect(http.get("/profile")).rejects.toBeTruthy();

    expect(toast.error).not.toHaveBeenCalled();
  });
});
