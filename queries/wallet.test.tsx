import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as WalletApi from "@/api/wallet";
import { billingKeys } from "@/api/billing";
import { requestKeys } from "@/api/requests";
import { walletKeys } from "@/api/wallet";
import {
  fundWallet,
  getMyWalletBalance,
  getWallet,
  settleServiceRequest,
  submitInvoicePayment,
} from "@/api/wallet";

import { createTestQueryClient, createWrapper } from "./test-utils";
import {
  useFundWalletMutation,
  useMyWalletQuery,
  useSettleRequestMutation,
  useSubmitInvoicePaymentMutation,
  useWalletQuery,
} from "./wallet";

vi.mock("@/api/wallet", async () => {
  const actual = await vi.importActual<typeof WalletApi>("@/api/wallet");
  return {
    ...actual,
    getWallet: vi.fn(),
    getMyWalletBalance: vi.fn(),
    fundWallet: vi.fn(),
    submitInvoicePayment: vi.fn(),
    settleServiceRequest: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useWalletQuery / useMyWalletQuery", () => {
  it("fetch through their respective api functions", async () => {
    vi.mocked(getWallet).mockResolvedValue({
      balance: 0,
      stats: [],
      transactions: [],
    });
    vi.mocked(getMyWalletBalance).mockResolvedValue(1000);

    const { result: wallet } = renderHook(() => useWalletQuery(), {
      wrapper: createWrapper(),
    });
    const { result: myWallet } = renderHook(() => useMyWalletQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(wallet.current.isSuccess).toBe(true));
    await waitFor(() => expect(myWallet.current.isSuccess).toBe(true));
    expect(myWallet.current.data).toBe(1000);
  });
});

describe("useFundWalletMutation", () => {
  it("invalidates the wallet query on success", async () => {
    vi.mocked(fundWallet).mockResolvedValue(1500000);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useFundWalletMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate(500000);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(vi.mocked(fundWallet).mock.calls[0]?.[0]).toBe(500000);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: walletKeys.all });
  });
});

describe("useSubmitInvoicePaymentMutation", () => {
  it("invalidates wallet and invoice queries on success", async () => {
    vi.mocked(submitInvoicePayment).mockResolvedValue({
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
    });
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSubmitInvoicePaymentMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate({
      invoiceId: "inv-1",
      amount: 100000,
      transactionReference: "TRX-1",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: walletKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: billingKeys.myInvoices,
    });
  });
});

describe("useSettleRequestMutation", () => {
  it("invalidates requests, wallet and billing queries on success", async () => {
    vi.mocked(settleServiceRequest).mockResolvedValue(undefined);
    const client = createTestQueryClient();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSettleRequestMutation(), {
      wrapper: createWrapper(client),
    });
    result.current.mutate("req-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: requestKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: walletKeys.all });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: billingKeys.all });
  });
});
