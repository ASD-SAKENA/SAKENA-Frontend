import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  fundWallet,
  getBuildingLedger,
  getBuildingWalletBalance,
  getMyWalletBalance,
  getWallet,
  recordBuildingTransaction,
  recordPayment,
  settleServiceRequest,
} from "./wallet";

vi.mock("@/services/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedGet = vi.mocked(http.get);
const mockedPost = vi.mocked(http.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getWallet", () => {
  it("combines the real wallet balance with derived payment stats", async () => {
    mockedGet.mockImplementation((url: string) => {
      if (url === "/payments") {
        return Promise.resolve({
          data: [
            {
              id: "p1",
              title: "شارژ فروردین",
              amount: 500000,
              paidAt: "2026-02-01T00:00:00Z",
            },
            {
              id: "p2",
              title: "شارژ اردیبهشت",
              amount: 300000,
              paidAt: "2026-03-01T00:00:00Z",
            },
          ],
        });
      }
      if (url === "/wallets/me") {
        return Promise.resolve({ data: { balance: 750000 } });
      }
      throw new Error(`unexpected url ${url}`);
    });

    const wallet = await getWallet();

    expect(wallet.balance).toBe(750000);
    expect(wallet.transactions).toHaveLength(2);
    expect(wallet.transactions[0]).toMatchObject({
      id: "p1",
      negative: true,
      amount: "−۵۰۰,۰۰۰",
    });
    expect(wallet.stats[0].value).toBe("۸۰۰,۰۰۰"); // 500000 + 300000
    expect(wallet.stats[1].value).toBe("۲");
  });
});

describe("recordPayment", () => {
  it("posts the payload and returns the new id", async () => {
    mockedPost.mockResolvedValue({ data: { id: "p1" } });
    const result = await recordPayment({ title: "شارژ", amount: 100000 });
    expect(http.post).toHaveBeenCalledWith("/payments", {
      title: "شارژ",
      amount: 100000,
    });
    expect(result).toEqual({ id: "p1" });
  });
});

describe("getMyWalletBalance", () => {
  it("reads the balance from /wallets/me", async () => {
    mockedGet.mockResolvedValue({ data: { balance: 42000 } });
    expect(await getMyWalletBalance()).toBe(42000);
    expect(http.get).toHaveBeenCalledWith("/wallets/me");
  });
});

describe("fundWallet", () => {
  it("posts the top-up amount and returns the new balance", async () => {
    mockedPost.mockResolvedValue({ data: { balance: 550000 } });
    const balance = await fundWallet(500000);
    expect(http.post).toHaveBeenCalledWith("/wallets/me/top-ups", {
      amount: 500000,
    });
    expect(balance).toBe(550000);
  });
});

describe("settleServiceRequest", () => {
  it("posts to the settle endpoint for the given request", async () => {
    mockedPost.mockResolvedValue({ data: {} });
    await settleServiceRequest("req-1");
    expect(http.post).toHaveBeenCalledWith("/wallets/settle/req-1");
  });
});

describe("getBuildingWalletBalance", () => {
  it("reads the building account balance", async () => {
    mockedGet.mockResolvedValue({ data: { balance: 1200000 } });
    expect(await getBuildingWalletBalance()).toBe(1200000);
    expect(http.get).toHaveBeenCalledWith("/wallets/building");
  });
});

describe("getBuildingLedger", () => {
  it("returns the raw transaction list", async () => {
    mockedGet.mockResolvedValue({ data: [{ id: "t1" }] });
    const ledger = await getBuildingLedger();
    expect(ledger).toEqual([{ id: "t1" }]);
    expect(http.get).toHaveBeenCalledWith("/wallets/building/transactions");
  });
});

describe("recordBuildingTransaction", () => {
  it("posts the transaction payload", async () => {
    mockedPost.mockResolvedValue({ data: {} });
    const payload = {
      direction: "CREDIT" as const,
      category: "ADJUSTMENT" as const,
      amount: 10000,
      description: "اصلاح",
    };
    await recordBuildingTransaction(payload);
    expect(http.post).toHaveBeenCalledWith(
      "/wallets/building/transactions",
      payload,
    );
  });
});
