import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildAppUser, useAuthStore } from "@/stores/auth.store";

import { JoinScreen } from "./join-screen";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const push = vi.fn();
let tokenValue: string | null = "tok-1";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => tokenValue }),
}));

const mutate = vi.fn();
let previewState: {
  data: unknown;
  isPending: boolean;
  isError: boolean;
} = {
  data: undefined,
  isPending: true,
  isError: false,
};
vi.mock("@/queries/invitations", () => ({
  useInvitationPreviewQuery: () => previewState,
  useAcceptInvitationMutation: () => ({ mutate, isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  tokenValue = "tok-1";
  previewState = { data: undefined, isPending: true, isError: false };
  useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
});

describe("JoinScreen", () => {
  it("shows an invalid-link message without a token", () => {
    tokenValue = null;
    render(<JoinScreen />);
    expect(screen.getByText("این لینک دعوت معتبر نیست")).toBeInTheDocument();
  });

  it("shows an invalid-link message on a preview error", () => {
    previewState = { data: undefined, isPending: false, isError: true };
    render(<JoinScreen />);
    expect(screen.getByText("این لینک دعوت معتبر نیست")).toBeInTheDocument();
  });

  it("shows a loading state while the preview is pending", () => {
    render(<JoinScreen />);
    expect(screen.getByText("در حال بررسی دعوت‌نامه…")).toBeInTheDocument();
  });

  it("shows the invitation details once loaded", () => {
    previewState = {
      isPending: false,
      isError: false,
      data: {
        buildingName: "برج نیلوفر",
        role: "RESIDENT",
        unitNumber: "12",
        channel: "EMAIL",
        recipientHint: "r***@example.com",
        expiresAt: "2026-04-01T00:00:00Z",
      },
    };
    render(<JoinScreen />);
    expect(screen.getByText("دعوت به «برج نیلوفر»")).toBeInTheDocument();
  });

  it("prompts sign-in when not authenticated", () => {
    previewState = {
      isPending: false,
      isError: false,
      data: {
        buildingName: "برج",
        role: "RESIDENT",
        unitNumber: null,
        channel: "LINK",
        recipientHint: null,
        expiresAt: "2026-04-01T00:00:00Z",
      },
    };
    render(<JoinScreen />);
    expect(
      screen.getByRole("button", { name: "ورود یا ثبت‌نام برای پیوستن" }),
    ).toBeInTheDocument();
  });

  it("accepts the invitation and redirects when authenticated", async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: buildAppUser("resident", "Ali"),
    });
    previewState = {
      isPending: false,
      isError: false,
      data: {
        buildingName: "برج",
        role: "RESIDENT",
        unitNumber: null,
        channel: "LINK",
        recipientHint: null,
        expiresAt: "2026-04-01T00:00:00Z",
      },
    };
    mutate.mockImplementation((_token, { onSuccess }) => onSuccess());
    const user = userEvent.setup();
    render(<JoinScreen />);

    await user.click(
      screen.getByRole("button", { name: "پذیرش دعوت و پیوستن" }),
    );

    expect(mutate).toHaveBeenCalledWith("tok-1", expect.any(Object));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("refuses to assign a unit to a manager account", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: buildAppUser("manager", "Moeein"),
    });
    previewState = {
      isPending: false,
      isError: false,
      data: {
        buildingName: "برج",
        role: "RESIDENT",
        unitNumber: "12",
        channel: "LINK",
        recipientHint: null,
        expiresAt: "2026-04-01T00:00:00Z",
      },
    };
    render(<JoinScreen />);

    expect(
      screen.getByText("با این حساب نمی‌توانید واحد بگیرید"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "پذیرش دعوت و پیوستن" }),
    ).not.toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("still lets a manager accept an invitation that assigns no unit", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: buildAppUser("manager", "Moeein"),
    });
    previewState = {
      isPending: false,
      isError: false,
      data: {
        buildingName: "برج",
        role: "STAFF",
        unitNumber: null,
        channel: "LINK",
        recipientHint: null,
        expiresAt: "2026-04-01T00:00:00Z",
      },
    };
    render(<JoinScreen />);

    expect(
      screen.getByRole("button", { name: "پذیرش دعوت و پیوستن" }),
    ).toBeInTheDocument();
  });
});
