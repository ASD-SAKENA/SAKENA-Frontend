import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "@/services/http";

import {
  fundWallet,
  getBuildingLedger,
  getBuildingPayments,
  getBuildingWalletBalance,
  getMyWalletBalance,
  getPendingPayments,
  getWallet,
  recordBuildingTransaction,
  settleServiceRequest,
  submitInvoicePayment,
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
  it("builds the history from the wallet ledger, not just invoice payments", async () => {
    mockedGet.mockImplementation((url: string) => {
      if (url === "/wallets/me/transactions") {
        return Promise.resolve({
          data: [
            {
              id: "t1",
              direction: "DEBIT",
              category: "FACILITY_BOOKING",
              amount: 100000,
              description: "رزرو «استخر»",
              balanceAfter: 750000,
              occurredAt: "2026-03-02T00:00:00Z",
            },
            {
              id: "t2",
              direction: "CREDIT",
              category: "WALLET_FUNDING",
              amount: 850000,
              description: "Wallet funding",
              balanceAfter: 850000,
              occurredAt: "2026-03-01T00:00:00Z",
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
    // A booking debit is a ledger line, so it must reach the history — this
    // is exactly what reading from /payments used to drop.
    expect(wallet.transactions[0]).toMatchObject({
      id: "t1",
      desc: "رزرو «استخر»",
      type: "رزرو امکانات",
      negative: true,
      amount: "−۱۰۰,۰۰۰",
    });
    expect(wallet.transactions[1]).toMatchObject({
      id: "t2",
      negative: false,
      amount: "+۸۵۰,۰۰۰",
    });
    expect(wallet.stats[0].value).toBe("۱۰۰,۰۰۰"); // only the debit
    expect(wallet.stats[1].value).toBe("۲");
  });
});

describe("submitInvoicePayment", () => {
  it("posts multipart form data for an invoice payment", async () => {
    mockedPost.mockResolvedValue({
      data: {
        id: "p1",
        invoiceId: "inv-1",
        periodTitle: "شارژ",
        title: "شارژ",
        amount: 100000,
        transactionReference: "TRX-1",
        hasReceipt: false,
        status: "PENDING",
        paidAt: "2026-04-01T00:00:00Z",
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
      },
    });

    const result = await submitInvoicePayment({
      invoiceId: "inv-1",
      amount: 100000,
      transactionReference: "TRX-1",
    });

    expect(http.post).toHaveBeenCalledWith(
      "/payments",
      expect.any(FormData),
      expect.objectContaining({
        headers: { "Content-Type": undefined },
      }),
    );
    expect(result.id).toBe("p1");
    expect(result.status).toBe("PENDING");
  });
});

describe("getPendingPayments", () => {
  it("reads the manager review queue", async () => {
    mockedGet.mockResolvedValue({ data: [] });
    expect(await getPendingPayments()).toEqual([]);
    expect(http.get).toHaveBeenCalledWith("/payments/pending");
  });
});

describe("getBuildingPayments", () => {
  it("reads the building ledger with optional filters", async () => {
    mockedGet.mockResolvedValue({ data: [] });
    await getBuildingPayments({ status: "CONFIRMED", periodId: "p1" });
    expect(http.get).toHaveBeenCalledWith("/payments/building", {
      params: { status: "CONFIRMED", periodId: "p1" },
    });
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
  it("posts the top-up amount", async () => {
    mockedPost.mockResolvedValue({ data: { balance: 1500000 } });
    expect(await fundWallet(500000)).toBe(1500000);
    expect(http.post).toHaveBeenCalledWith("/wallets/me/top-ups", {
      amount: 500000,
    });
  });
});

describe("settleServiceRequest", () => {
  it("posts to the settle endpoint", async () => {
    mockedPost.mockResolvedValue({ data: null });
    await settleServiceRequest("req-1");
    expect(http.post).toHaveBeenCalledWith("/wallets/settle/req-1");
  });
});

describe("building wallet", () => {
  it("reads balance and ledger", async () => {
    mockedGet.mockImplementation((url: string) => {
      if (url === "/wallets/building") {
        return Promise.resolve({ data: { balance: 10 } });
      }
      if (url === "/wallets/building/transactions") {
        return Promise.resolve({ data: [] });
      }
      throw new Error(url);
    });
    expect(await getBuildingWalletBalance()).toBe(10);
    expect(await getBuildingLedger()).toEqual([]);
  });

  it("records a building transaction", async () => {
    mockedPost.mockResolvedValue({ data: null });
    await recordBuildingTransaction({
      direction: "DEBIT",
      category: "OPERATING_EXPENSE",
      amount: 1000,
      description: "آب",
    });
    expect(http.post).toHaveBeenCalledWith("/wallets/building/transactions", {
      direction: "DEBIT",
      category: "OPERATING_EXPENSE",
      amount: 1000,
      description: "آب",
    });
  });
});
